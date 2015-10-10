<?php

require_once 'Utils.php';
$document_root = Utils::getDocumentRoot();

require_once $document_root . '/common/php/MongoDbManager.php';
require_once $document_root . '/common/php/MongoDbBaseManager.php';
require_once $document_root . '/common/php/OrganDivisionManager.php';
require_once $document_root . '/common/php/OrganItemGroupManager.php';
require_once $document_root . '/common/php/DefaultItemManager.php';
require_once $document_root . '/common/php/ForeignDataManager.php';
require_once $document_root . '/common/php/UserManager.php';

class OrganItemManager extends MongoDbBaseManager
{

  const TYPE_SELECT          = 'select';
  const TYPE_MULTIPLE_SELECT = 'multiple_select';
  const TYPE_DATE            = 'date';
  const TYPE_DATETIME        = 'datetime';
  const TYPE_TABLE           = 'table';
  const TYPE_COLLECTION      = 'collection';
  const TYPE_NUMBER          = 'number';

  var $mongo_db;

  function __construct()
  {
    parent::__construct('organ_items');
  }

  //組織項目リストを取得する
  public function getOrganItemList($organ_id, $collection_name, $group_id=null)
  {

    if (Utils::isEmpty($organ_id)){
      Utils::log('組織IDがありません');
      return false;
    }

    if (Utils::isEmpty($collection_name)){
      Utils::log('コレクション名称がありません');
      return false;
    }

    $collection = new MongoCollection($this->mongo_db, 'organ_items');

    $query      = array('organ_id' => $organ_id, 'collection_name' => $collection_name);

    if (Utils::isPresent($group_id)){
      $query['group_id'] = $group_id;
    }

    $cursor     = $collection->find($query);

    $cursor->sort(array('group_id' => 1, 'align_div' => 1, 'display_order' => 1));

    return $cursor;
  }

  public function getOrganItemListAsArray($organ_id, $collection_name, $group_id=null, $all_data=false)
  {

    if (Utils::isEmpty($organ_id)){
      Utils::log('組織IDがありません');
      return false;
    }

    if (Utils::isEmpty($collection_name)){
      Utils::log('コレクション名称がありません');
      return false;
    }

    $user_mgr           = new UserManager();

    $organ_division_mgr = new OrganDivisionManager();

    $foreign_data_mgr   = new ForeignDataManager();

    $cursor             = $this->getOrganItemList($organ_id, $collection_name, $group_id);

    $list               = array();

    foreach($cursor as $data){
      if (($all_data == false) && (isset($data['hidden_div'])) && ($data['hidden_div'] == 1 )){
        continue;
      }
      $type = $data['type'];

      if ($type == self::TYPE_SELECT || $type == self::TYPE_MULTIPLE_SELECT){
        //選択肢
        if (isset($data['division_list']) === false && isset($data['division_code'])){
          $division_list         = $organ_division_mgr->getListAsArray($organ_id, array('division_code' => $data['division_code']), array('order' => 1), -1, -1, false);
          $data['division_list'] = $division_list;
        }
      }else if ($type == self::TYPE_TABLE){
        //外部テーブル
        $table_name = $data['table_name'];

        if ($table_name == 'users'){
          $res = $user_mgr->getUserListAsArray($organ_id, array('guest_div' => 0));
        }else{
          $res = $foreign_data_mgr->getForeignDataArray($table_name, $organ_id);
        }

        $data['list'] = $res;
      }else if ($type == self::TYPE_COLLECTION){
        //外部コレクション
        $external_collection_name = $data['external_collection_name'];
        $mongo_db_base_mgr        = new MongoDbBaseManager($external_collection_name);
        $res                      = $mongo_db_base_mgr->getListAsArray($organ_id, null, null, 0, 0, false);
        $data['list']             = $res;
      }

      $list[] = $data;
    }

    return $list;
  }

  public function getMultiOrganItemListAsArray($organ_id, $collection_name_list)
  {

    if (Utils::isEmpty($organ_id)){
      Utils::log('組織IDがありません');
      return false;
    }

    if (Utils::isEmpty($collection_name_list)){
      Utils::log('コレクション名称がありません');
      return false;
    }

    $user_mgr           = new UserManager();

    $organ_division_mgr = new OrganDivisionManager();

    $foreign_data_mgr   = new ForeignDataManager();

    $list               = array();
    foreach($collection_name_list as $collection_name){

      $cursor             = $this->getOrganItemList($organ_id, $collection_name);

      foreach($cursor as $data){
        if ((isset($data['hidden_div'])) && ($data['hidden_div'] == 1 )){
          continue;
        }
        $type = $data['type'];

        if ($type == self::TYPE_SELECT || $type == self::TYPE_MULTIPLE_SELECT){
          //選択肢
          if (isset($data['division_list']) === false && isset($data['division_code'])){
            $division_list         = $organ_division_mgr->getListAsArray($organ_id, array('division_code' => $data['division_code']), array('order' => 1), -1, -1, false);
            $data['division_list'] = $division_list;
          }
        }else if ($type == self::TYPE_TABLE){
          //外部テーブル
          $table_name = $data['table_name'];

          if ($table_name == 'users'){
            $res = $user_mgr->getUserListAsArray($organ_id, array('guest_div' => 0));
          }else{
            $res = $foreign_data_mgr->getForeignDataArray($table_name, $organ_id);
          }

          $data['list'] = $res;
        }else if ($type == self::TYPE_COLLECTION){
          //外部コレクション
          $external_collection_name = $data['external_collection_name'];
          $mongo_db_base_mgr        = new MongoDbBaseManager($external_collection_name);
          $res                      = $mongo_db_base_mgr->getListAsArray($organ_id, null, null, 0, 0, false);
          $data['list']             = $res;
        }

        $list[] = $data;
      }
    }

    return $list;
  }

  //項目設定を連想配列で返す
  public function getItemListAsAssoc($organ_id, $collection_name=null, $key_name='field_name'/*, $has_customer_id=false*/)
  {

    if (Utils::isEmpty($organ_id)) {
      Utils::log(Message::MSG_ORGAN_ID_NOT_FOUND);
      return false;
    }

    $query            = null;

    if (Utils::isPresent($collection_name)){
      $query = array('collection_name' => $collection_name);
    }

    $cursor             = $this->getList($organ_id, $query, null, -1, -1, false);

    $organ_division_mgr = new OrganDivisionManager();

    $foreign_data_mgr   = new ForeignDataManager();

    $user_mgr           = new UserManager();

    $arr                = array();

    foreach($cursor as $row){

      $type       = $row['type'];

      $field_name = $row['field_name'];

      if ($type == self::TYPE_SELECT || $type == self::TYPE_MULTIPLE_SELECT) { //区分対応
        $division_code = null;
        if (isset($row['division_code'])){
          $division_code = $row['division_code'];
        }
        $div_arr = null;
        if (isset($row['division_list']) === false && isset($row['division_code'])){
          $div_arr              = $organ_division_mgr->getDivisionArray($organ_id, $division_code);
          $row['division_list'] = $div_arr;
        }/*else if (isset($row['division_list'])){
          $div_arr = Utils::createDivisionListFromOptions($row['options']);
        }*/
      }else if ($type == self::TYPE_TABLE){
        //外部テーブル
        $table_name = $row['table_name'];

        if ($table_name == 'users'){
          $data_arr = $user_mgr->getUserListAsArray($organ_id, array('guest_div' => 0));
        }else{
          $data_arr = $foreign_data_mgr->getForeignDataArray($table_name, $organ_id);
        }
        $row['foreign_data_list'] = $data_arr;
      }else if ($type == self::TYPE_COLLECTION){
        //外部コレクション
        //数万件になる可能性があるため、キャッシュしない（コメントアウト）
        //$external_collection_name = $row['external_collection_name'];
        //$mongo_db_base_mgr        = new MongoDbBaseManager($external_collection_name);
        //$arr                      = $mongo_db_base_mgr->getListAsArray($organ_id, null, null, 0, 0, false);
        //$row['list']              = $res;
      }

      $name           = $row["{$key_name}"];
      $arr["{$name}"] = $row;
    }

    return $arr;
  }

  //ItemManagerより移植
  //入力値をチェックする
  public function validate($organ_id, $collection_name, $chk_arr, $item_list=null, $mode='', $exists_check_func=null)
  {

    $error_messages = array();

    //項目設定取得
    if (!isset($item_list) || !is_array($item_list) || count($item_list) == 0) {
      $item_list = $this->getItemListAsAssoc($organ_id, $collection_name, 'item_name');
    }

    $div_mgr          = new OrganDivisionManager();
    $foreign_data_mgr = new ForeignDataManager();
    $user_mgr         = new UserManager();

    //入力値チェック
    foreach ($chk_arr as $item_name => $item_value) {

      $item_value = trim($item_value);

      //ファイルの場合
      if ($mode == 'file'){
        //テキストから値を取得
        $item       = $item_list["{$item_name}"];
        $field_name = $item["field_name"];
        $type       = $item['type'];

        //区分テキストのチェック
        if ($type == self::TYPE_SELECT || $type == self::TYPE_MULTIPLE_SELECT){
          if (Utils::isPresent($item_value)){
            if (isset($item['division_list'])){
              $div_list = $item['division_list'];
              if ($type == self::TYPE_SELECT){
                $div_key  = $div_mgr->getDivisionKeyFromValue($item_value, $div_list);
                if ($div_key === false){
                  $error_messages[] = "{$item[display_name]}の選択リストの選択肢に存在しないデータが入っています。（{$item_value}）";
                }
              } else if ($type == self::TYPE_MULTIPLE_SELECT){
                $value_arr = array();
                $value = preg_replace('/(\s|　)/','',$item_value);
                while ($pos !== false){
                  $pos = mb_strpos($value, ';', 0, 'utf-8');
                  if ($pos === false){
                    $value_arr[] = $value;
                  } else {
                    $value_arr[] = mb_substr($value, 0, $pos, 'utf-8');
                    $value = mb_substr($value, $pos +1, mb_strlen($value, 'utf-8') - $pos +1, 'utf-8');//セミコロンを飛ばす
                  }
                }
                foreach($value_arr as $val){
                  $div_key  = $div_mgr->getDivisionKeyFromValue($val, $div_list);
                  if ($div_key === false){
                    $error_messages[] = "{$item[disp_nm]}の選択リストの選択肢に存在しないデータが入っています。（{$item_value}）";
                  }
                }
              }
            } else {
              //都道府県のみorgan_divisionsを使用
              $div_list = $div_mgr->getDivisionArray($organ_id, $item['division_code']);
              $div_key  = $div_mgr->getDivisionKeyFromValue($item_value, $div_list);
              if ($div_key === false){
                $error_messages[] = "{$item[display_name]}の選択リストの選択肢に存在しないデータが入っています。（{$item_value}）";
              }
            }
          }else{
            $div_key = 0;
          }
        }

        if ($type == self::TYPE_TABLE){
          //外部テーブル
          $table_name        = $item['table_name'];

          $foreign_data_list = $item['foreign_data_list'];

          if (strlen(trim($item_value)) > 0){

            if ($table_name == 'users'){

              $user_id = $user_mgr->getUserIdFromName($item_value, $foreign_data_list);
              if ($user_id === false){
                $error_messages[] = "{$item[display_name]}の表記が正しくありません。（{$item_value}）";
              }
            }else{
              $foreign_data_id = $foreign_data_mgr->getForeignDataIdFromName($item_value, $foreign_data_list);
              if ($foreign_data_id === false){
                $error_messages[] = "{$item[display_name]}の表記が正しくありません。（{$item_value}）";
              }
            }
          }
        }else if ($type == self::TYPE_COLLECTION){
          //外部コレクション
          //存在しない場合は自動生成するため、チェックしない
          if (Utils::isPresent($item_value)){
            /*
            $external_collection_name = $item['external_collection_name'];
            $external_field_name      = $item['external_field_name'];
            $external_name_field_name = $item['external_name_field_name'];

            //TODO キャッシュが必要
            $mongo_db_base_mgr = new MongoDbBaseManager($external_collection_name);

            $collection_object = $mongo_db_base_mgr->getBy($organ_id, array("{$external_name_field_name}" => $item_value));

            if (Utils::isEmpty($collection_object)){

            }else{

            }

            if ($_id === false){
              $error_messages[] = "{$item[display_name]}の表記が正しくありません。（{$item_value}）";
            }
            */
          }

        }
      }

      //入力必須チェック
      if (Utils::isEmpty($item_value) && $item_list["{$item_name}"]['must_div'] == 2) {
        $error_messages[] = "{$item_list[$item_name][disp_nm]}を入力してください";
      }

      //電話番号
      /*if (!Utils::isEmpty($item_value) && $item_list["{$item_name}"]['phone_div'] == 1){
        $item_value = Utils::mb_str_replace('（', '(', $item_value, 'utf-8');
        $item_value = Utils::mb_str_replace('）', ')', $item_value, 'utf-8');

        $chk_num = Utils::mb_str_replace('(', '', $item_value, 'utf-8');
        $chk_num = Utils::mb_str_replace(')', '', $chk_num, 'utf-8');
        $chk_num = Utils::mb_str_replace('-', '', $chk_num, 'utf-8');
        $chk_num = Utils::mb_str_replace(',', '', $chk_num, 'utf-8');
        $chk_num = Utils::mb_str_replace('/', '', $chk_num, 'utf-8');
        if (!is_numeric($chk_num)) {
          $error_messages[] = "{$item_list[$item_name]['disp_nm']}は半角数字と「()」、「-」(ハイフン)、「/」（スラッシュ）で入力してください";
        }
      }*/

      //メールアドレス
      /*if (!Utils::isEmpty($item_value) && $item_list["{$item_name}"]['email_div'] == 1 && !$this->isEmail($item_value)) {
        $error_messages[] = "{$item_list[$item_name]['disp_nm']}を正しく入力してください";
      }*/

      //郵便番号
      /*if (!Utils::isEmpty($item_value) && $item_list["{$item_name}"]['zip_cd_div'] == 1) {
        if (!is_numeric($item_value)){
          $error_messages[] = "{$item_list[$item_name]['disp_nm']}は半角数字で入力してください";
        }
      }*/

      //重複
      /*if (!Utils::isEmpty($item_value) && !is_numeric($item_value) && $item_list["{$item_name}"]['unique_div'] == 1) {
        $arr_where = array();
        if ($mode != 'file' && $chk_arr['customer_id'] > 0) {
          $arr_where[] = array(
            'col_nm'   => 'customer_id',
            'operator' => '!=',
            'value'    => $chk_arr['customer_id']
          );
        }
        $arr_where[] = array(
          'col_nm'   => 'organ_id',
          'operator' => '=',
          'value'    => $organ_id
        );
        $arr_where[] = array(
          'col_nm'   => $item_list["{$item_name}"]['col_nm'],
          'operator' => '=',
          'value'    => $item_value
        );

        if ($exists_check_func && is_callable($exists_check_func)){
          //存在チェック
          $res = call_user_func($exists_check_func, $arr_where);
          if ($ret === true) {
            $error_messages[] = "この{$item_list[$item_name]['disp_nm']}はすでに登録されています。\r\n「{$item_value}」";
          }
        }
      }*/

      //数値
      /*if (!Utils::isEmpty($item_value) && $item_list["{$item_name}"]['num_div'] == 1 && !is_numeric($item_value)) {
        $error_messages[] = "{$item_list[$item_name]['disp_nm']}は半角数字で入力してください";
      }*/

      $chk_arr["{$item_name}"] = $item_value;
    }

    return array($chk_arr, $error_messages);
  }

  public function getUserFieldNames($organ_id, $collection_name)
  {
    if (Utils::isEmpty($organ_id)){
      Utils::log('組織IDがありません');
      return false;
    }

    if (Utils::isEmpty($collection_name)){
      Utils::log('コレクション名称がありません');
      return false;
    }

    $collection      = $this->getCollection();

    $query           = array('organ_id' => $organ_id, 'collection_name' => $collection_name, 'table_name' => 'users', 'column_name' => 'user_id');

    $cursor          = $collection->find($query);

    $list            = array();

    foreach($cursor as $data){
      $list[] = $data['field_name'];
    }

    return $list;
  }

  public function createOrganItemsFromDefaultItems($organ_id)
  {

    if (Utils::isEmpty($organ_id)){
      Utils::log('組織IDがありません');
      return false;
    }

    $organ_item_group_mgr = new OrganItemGroupManager();

    $default_item_mgr     = new DefaultItemManager();

    $sort                 = array('collection_name' => 1, 'align_div' => 1, 'display_order' => 1);

    $default_items        = $default_item_mgr->getListAsArray(null, $sort, 0, 0, false, false);

    $old_collection_name  = false;

    $group_id             = null;

    foreach($default_items as $default_item){

      $collection_name = $default_item['collection_name'];

      if ($old_collection_name === false || ($old_collection_name != $collection_name)){
        $old_collection_name = $collection_name;
        $group_id            = $organ_item_group_mgr->createBaseInfoGroup($organ_id, $collection_name);
      }

      $param                = $default_item;
      $param['group_id']    = $group_id;
      $param['default_div'] = 1;
      $_id                  = $this->create("{$organ_id}", $param);

      if (!$_id){
        Utils::log('項目設定の作成に失敗しました');
        return false;
      }

    }

    return true;
  }

}
