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

$organ_item_mgr = new OrganItemManager();
$organ_id             = $user['organ_id'];

//リストの設定
function setSelectList($cursor){
  
  $strings[] = array('field_name'=>"",'display_name'=>"なし");
  $texts[] = array('field_name'=>"",'display_name'=>"なし");
  $selects[] = array('field_name'=>"",'display_name'=>"なし");
  $datetimes[] = array('field_name'=>"",'display_name'=>"なし");
  $dates[] = array('field_name'=>"",'display_name'=>"なし");
  $numbers[] = array('field_name'=>"",'display_name'=>"なし");
  $multiple_selects[] = array('field_name'=>"",'display_name'=>"なし");

  foreach($cursor as $obj){
    if($obj['type'] === "string"){
  	  $strings[] = array('field_name'=>$obj['field_name'],'display_name'=>$obj['display_name']);
  	}else if($obj['type'] === "select"){
  	  $selects[] = array('field_name'=>$obj['field_name'],'display_name'=>$obj['display_name']);
  	}else if($obj['type'] === "datetime"){
  	  $datetimes[] = array('field_name'=>$obj['field_name'],'display_name'=>$obj['display_name']);
  	}else if($obj['type'] === "date"){
  	  $dates[] = array('field_name'=>$obj['field_name'],'display_name'=>$obj['display_name']);
  	}else if($obj['type'] === "text"){
  	  $texts[] = array('field_name'=>$obj['field_name'],'display_name'=>$obj['display_name']);
  	}else if($obj['type'] === "number"){
  	  $numbers[] = array('field_name'=>$obj['field_name'],'display_name'=>$obj['display_name']);
  	}else if($obj['type'] === "multiple_select"){
  	  $multiple_selects[] = array('field_name'=>$obj['field_name'],'display_name'=>$obj['display_name']);
  	}
  }

  $result['strings'] = $strings;
  $result['selects'] = $selects;
  $result['datetimes'] = $datetimes;
  $result['dates'] = $dates;
  $result['texts'] = $texts;
  $result['numbers'] = $numbers;
  $result['multiple_selects'] = $multiple_selects;

  return $result;
}

//selectリスト表示用の制御パラメータ生成
function getShowTypeList($showtype){
  
  $type_array = array("string", "select", "datetime", "date", "text", "number", "multiple_select");
  
  foreach ($type_array as $type) {
  	$show = false;
    if ($type === $showtype){
      $show = true;
  	}
    $key = 'type_' . $type;
    $param[$key] = $show;
  }

  return $param;
}

$list = null;

//会社リストの設定
$cursor = $organ_item_mgr->getOrganItemList($organ_id, 'companies');
$selectlist = setSelectList($cursor);

$list['companies_strings'] = $selectlist['strings'];
$list['companies_selects'] = $selectlist['selects'];
$list['companies_datetimes'] = $selectlist['datetimes'];
$list['companies_dates'] = $selectlist['dates'];
$list['companies_texts'] = $selectlist['texts'];
$list['companies_numbers'] = $selectlist['numbers'];
$list['companies_multiple_selects'] = $selectlist['multiple_selects'];

//担当者リストの設定
$cursor = $organ_item_mgr->getOrganItemList($organ_id, 'customers');
$selectlist = setSelectList($cursor);

$list['customers_strings'] = $selectlist['strings'];
$list['customers_selects'] = $selectlist['selects'];
$list['customers_datetimes'] = $selectlist['datetimes'];
$list['customers_dates'] = $selectlist['dates'];
$list['customers_texts'] = $selectlist['texts'];
$list['customers_numbers'] = $selectlist['numbers'];
$list['customers_multiple_selects'] = $selectlist['multiple_selects'];

//商談リストの設定
$cursor = $organ_item_mgr->getOrganItemList($organ_id, 'business_discussions');
$selectlist = setSelectList($cursor);

$list['business_strings'] = $selectlist['strings'];
$list['business_selects'] = $selectlist['selects'];
$list['business_datetimes'] = $selectlist['datetimes'];
$list['business_dates'] = $selectlist['dates'];
$list['business_texts'] = $selectlist['texts'];
$list['business_numbers'] = $selectlist['numbers'];
$list['business_multiple_selects'] = $selectlist['multiple_selects'];

//見込み客から引き継ぐ項目の設定
$param = null;
$cursor = $organ_item_mgr->getOrganItemList($organ_id, 'prospects');

foreach($cursor as $obj){
  
  $param = array('label'=>$obj['display_name']);
  $param += array('_id'=>"{$obj['_id']}");
  
  $type = $obj['type'];
  if ($type === "email"){
  	$type = "string";
  }
  if ($type === "table"){
  	continue;
  }
  $attribute = getShowTypeList($type);
  
  if(isset($obj['create_transaction'])){
    $transaction = $obj['create_transaction'];
    foreach($transaction as $item_id){

      $_id  = $item_id['item_id'];
      $item = $organ_item_mgr->getBy($organ_id, array('_id' => new MongoId($_id)));
      if (is_null($item)){
         continue;
      }
      $field_name = $item['field_name'];
      $collection_name = $item['collection_name'];
      
      $attribute['field_name'] = $field_name;
      $param[$collection_name] = $attribute;
    }
  }

  if(!isset($param['companies'])){
  	$attribute['field_name'] = "";
    $param['companies'] = $attribute;
  }
  if(!isset($param['customers'])){
  	$attribute['field_name'] = "";
    $param['customers'] = $attribute;
  }
  if(!isset($param['business_discussions'])){
  	$attribute['field_name'] = "";
    $param['business_discussions'] = $attribute;
  }
  
  $prospectlists[] = $param;
}

$list['prospectlists'] = $prospectlists;

$result->setValue(array('list' => $list));
Utils::printJson($result);
exit();
