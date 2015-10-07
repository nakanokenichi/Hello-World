<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/Utils.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/DivisionManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/UserManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/Result.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/ProspectManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/CompanyManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/CustomerManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/BusinessDiscussionManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/ActivityHistoryManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/RecentViewManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/OrganItemManager.php';

Utils::startSession();

$domain     = Utils::getDomain();
$ssl_domain = Utils::getSslDomain();

$user_mgr   = new UserManager();
$user       = $user_mgr->getUser(); //ユーザー情報取得
$result     = new Result();

if (!$user_mgr->isLogin()){
  //ログインしていない場合はエラーとする
  $result->setError(true);
  $result->setMessage('ログインしていません');
  Utils::printJson($result);
  exit();
}

$post_data    = Utils::getPostData($_SERVER, $_POST);

$organ_id     = $user['organ_id'];

$user_id      = $user['user_id'];

$prospect_id  = $post_data['prospect_id'];

$prospect_mgr = new ProspectManager();

$prospect     = $prospect_mgr->get($organ_id, $prospect_id);

if (Utils::isEmpty($prospect)){
  $message = '見込客情報が存在しません';
  Utils::log($message);

  $result->setError(true);
  $result->setMessage($message);

  Utils::printJson($result);
  exit();
}

$sales_staff      = null;

if (isset($prospect['sales_staff'])){
  $sales_staff = $prospect['sales_staff'];
}

$sales_staff_name = null;
if (isset($prospect['sales_staff_name'])){
  $sales_staff_name = $prospect['sales_staff_name'];
}

$company_id   = null;
$company_name = null;
if (isset($prospect['company_name'])){
  $company_name = $prospect['company_name'];

  $company_mgr  = new CompanyManager();

  $exists       = $company_mgr->exists($organ_id, $company_name);

  if ($exists){
    $company    = $company_mgr->getBy($organ_id, array('company_name' => $company_name));
    $company_id = $company['_id'];
  }else{
    $param = array('company_name' => $company_name, 'sales_staff' => $sales_staff, 'sales_staff_name' => $sales_staff_name);

    $item_mgr = new OrganItemManager();
    $cursor   = $item_mgr->getOrganItemList($organ_id, 'prospects');

    foreach($cursor as $obj){
      if(isset($obj['create_transaction'])){
        $transaction = $obj['create_transaction'];
        foreach($transaction as $item_id){
          $collection_name   = $item_id['collection_name'];
          if(strcmp($collection_name,'companies') != 0){
            continue;
          }
          $_id  = $item_id['item_id'];
          $item = $item_mgr->getBy($organ_id, array('_id' => new MongoId($_id)));
          if (is_null($item)){
             continue;
          }
          $key = $item['field_name'];
          $value = $prospect[$obj['field_name']];
          if(isset($value)){
            $param = array_merge($param,array($key=>$value));
          }
        }
      }
    }
    
    $company_id = $company_mgr->create($organ_id, $param);
  }

  $prospect['company_id'] = $company_id;
}else{
  $message = '会社名がありません';
  $result->setMessage($message);
  $result->setError(true);
  Utils::printJson($result);
  exit;
}

$customer_mgr            = new CustomerManager();

$customer_id             = $customer_mgr->create($organ_id, $prospect);

$business_discussion_mgr = new BusinessDiscussionManager();

$param                   = array(
  'company_id'       => $company_id,
  'company_name'     => $company_name,
  'customer_ids'     => array($customer_id),
  'sales_staff'      => $sales_staff,
  'sales_staff_name' => $sales_staff_name
);

$business_discussion_id  = $business_discussion_mgr->create($organ_id, $param);

//行動履歴の引継ぎ(見込客→会社、担当者、商談)
$activity_history_mgr    = new ActivityHistoryManager();

$param  = array(
  'prospect_id'             => $prospect_id
);

$activity_history_data     = $activity_history_mgr->getList($organ_id, $param);

if (isset($activity_history_data)){
  $param  = array(
    'company_id'             => $company_id,
    'customer_id'            => $customer_id,
    'business_discussion_id' => $business_discussion_id
  );
  foreach($activity_history_data as $data){
    $activity_history_id     = $data['_id'];

    $activity_history_mgr->update($organ_id, $activity_history_id, $param);
  }
}

//担当者側のキーを更新
$customer_mgr->update($organ_id, $customer_id, array('business_discussion_ids' => array($business_discussion_id)), 'many_to_many');

$prospect_mgr->update($organ_id, $prospect_id, array('deleted' => true));

Utils::printJson($result);
exit();
