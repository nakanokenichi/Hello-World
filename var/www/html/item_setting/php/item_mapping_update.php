<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/Utils.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/DivisionManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/UserManager.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/Result.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/common/php/OrganItemManager.php';

Utils::startSession();

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

$organ_item_mgr  = new OrganItemManager();

$organ_id        = $user['organ_id'];

$post_data       = Utils::getPostData($_SERVER, $_POST);

$prospectlists   = $post_data['prospectlists'];

foreach($prospectlists as $prospectlist){

  $param = [];
  $_id = new MongoId($prospectlist['_id']);
  $item_list = array();

  if(isset($prospectlist['companies'])){
    $attribute = $prospectlist['companies'];
    $field_name = $attribute['field_name'];
    if(!($field_name === "")){
      $origin_organ_item = $organ_item_mgr->getBy($organ_id, array('field_name' => $field_name,'collection_name' => "companies"));
      $item_id = "{$origin_organ_item['_id']}";
      array_push($item_list,array('collection_name' => "companies", 'item_id' => $item_id));
    }
  }
  if(isset($prospectlist['customers'])){
    $attribute = $prospectlist['customers'];
    $field_name = $attribute['field_name'];
    if(!($field_name === "")){
      $origin_organ_item = $organ_item_mgr->getBy($organ_id, array('field_name' => $field_name,'collection_name' => "customers"));
      $item_id = "{$origin_organ_item['_id']}";
      array_push($item_list,array('collection_name' => "customers", 'item_id' => $item_id));
    }
  }
  if(isset($prospectlist['business_discussions'])){
    $attribute = $prospectlist['business_discussions'];
    $field_name = $attribute['field_name'];
    if(!($field_name === "")){  
      $origin_organ_item = $organ_item_mgr->getBy($organ_id, array('field_name' => $field_name,'collection_name' => "business_discussions"));
      $item_id = "{$origin_organ_item['_id']}";
      array_push($item_list,array('collection_name' => "business_discussions", 'item_id' => $item_id));
    }
  }

  $param['create_transaction'] = $item_list;
  $ret = $organ_item_mgr->update($organ_id, $_id, $param);

  if (!$ret){
    $result->setError(true);
    $result->setMessage('項目の更新に失敗しました');
    Utils::printJson($result);
    exit;
  }
}


$result->setError(false);
Utils::printJson($result);
exit();
