<?php

require_once '../common/php/Utils.php';

$document_root = Utils::getDocumentRoot();

require_once $document_root . '/common/php/UserManager.php';
require_once $document_root . '/common/php/ApplicationManager.php';
require_once $document_root . '/common/php/PageManager.php';
require_once $document_root . '/common/php/MenuManager.php';

Utils::startSession();

$user_mgr = new UserManager();
$is_login = $user_mgr->isLogin();

if (!$is_login){
  //ログインページに遷移する
  header("Location: /login/login.php");
  exit();
}

$user     = $user_mgr->getUser();
$page_mgr = new PageManager(PageManager::PAGE_COMPANY);
$menu_mgr = new MenuManager();
$title    = $page_mgr->getTitle();

$organ_id = $user['organ_id'];
$user_id  = $user['user_id'];

$tag_options = array(
  'mycss'                => true,
  'angularjs'            => true,
  'ngroute'              => true,
  'nganimate'            => true,
  'nggrid'               => true,
  'uirouter'             => true,
  'jqueryuilatest'       => true,
  'jquerydatepicker'     => true,
  'jquerydatetimepicker' => true,
  'ngfileupload'         => true,
  'uplogiccommon'        => true,
  'list'                 => true,
  'search'               => true,
  'import'               => true,
  'activity_history'     => true,
  'item_setting'         => true,
  'ngdialog'             => true,
  'detail_list_customer' => true,
  'detail_list_business_discussion' => true,
  'detail_list_business_contract'   => true,
  'exclusion_smart_admin' => true
);

?>
<!DOCTYPE html>
<html lang="ja" ng-app="myApp">
<head>
  <?php echo $page_mgr->getHeader($tag_options); ?>
  <?php echo $page_mgr->getScriptTags($tag_options); ?>
</head>
<body ng-controller="MyCntr" style="overflow-y: auto;">
  <?php echo $page_mgr->getNavigation(); ?>
  <div class="container common-container">
    <div ui-view></div>
  </div>
</body>
