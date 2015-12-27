<?php

require_once 'Utils.php';
$document_root = Utils::getDocumentRoot();
require_once $document_root . '/common/php/UserManager.php';
require_once $document_root . '/common/php/DbManager.php';
require_once $document_root . '/common/php/ApplicationManager.php';
require_once $document_root . '/common/php/MenuManager.php';
require_once $document_root . '/common/php/OrganManager.php';
require_once $document_root . '/common/php/Message.php';

class PageManager
{

  const PAGE_LOGIN                   = 'login';
  const PAGE_HOME                    = 'home';
  const PAGE_ITEM_SETTINGS           = 'item_settings';
  const PAGE_CUSTOMER_LIST           = 'customer_list';
  const PAGE_IMPORT                  = 'import';
  const PAGE_EXPORT                  = 'export';
  //const PAGE_COMPANIES               = 'companies';
  const PAGE_DEPARTMENTS             = 'departments';
  const PAGE_WEB_TRACKING_ELEMENT    = 'web_tracking_element';
  const PAGE_TRACKING_ANALYSIS       = 'tracking_analysis';
  const PAGE_MAIL_DELIVERY           = 'mail_delivery';
  const PAGE_MAIL_ANALYSIS           = 'mail_analysis';
  const PAGE_PROJECT                 = 'project';
  const PAGE_TODO                    = 'todo';
  const PAGE_CANVAS                  = 'canvas';
  const PAGE_DISCUSSION              = 'discussion';
  const PAGE_DISCUSSION_COMMENT      = 'discussion_comment';
  const PAGE_DATA                    = 'data';
  const PAGE_USER                    = 'user';
  const PAGE_CONTRACT                = 'contract';
  const PAGE_ORGAN                   = 'organ';
  const PAGE_PROSPECT                = 'prospect';
  const PAGE_TRIAL                   = 'trial';
  const PAGE_TRIAL_END               = 'trial_end';
  const PAGE_TRIAL_REGISTRATION      = 'trial_registration';
  const PAGE_COMPANY                 = 'company';
  const PAGE_CUSTOMER                = 'customer';
  const PAGE_BUSINESS_DISCUSSION     = 'business_discussion';
  const PAGE_BUSINESS_CONTRACT       = 'business_contract';
  const PAGE_ACTIVITY_HISTORY        = 'activity_history';
  const PAGE_MERCHANDISE             = 'merchandise';
  const PAGE_REPORT_FLEXIBLE         = 'report_flexible';
  const PAGE_ADMIN_USERINFO          = 'admin_userinfo';
  const PAGE_ADMIN_PAID_USERS_INFO   = 'admin_paid_users_info';
  const PAGE_MBL_BUSINESS_DISCUSSION = 'mbl_business_discussion';
  const PAGE_MBL_COMPANY             = 'mbl_company';
  const PAGE_MBL_CUSTOMER            = 'mbl_customer';
  const PAGE_MBL_PROSPECT            = 'mbl_prospect';
  const PAGE_MBL_RECENT_VIEW         = 'mbl_recent_view';


  var $mysqli = null;
  var $page   = null;

  function __construct($page_cd=null)
  {
    if (Utils::isEmpty($page_cd)){
      Utils::log(Message::MSG_PAGE_CD_NOT_FOUND);
      return false;
    }

    $db_mgr       = new DbManager();

    $this->mysqli = $db_mgr->getMysqli();

    $ql = "select * from `pages` where `page_cd` = '{$page_cd}' ";

    $res = $this->mysqli->query($ql);

    $this->page = $res->fetch_assoc();
  }

  public function getTitle()
  {
    return $this->page['page_nm'];
  }

  public function getHeader($options=null)
  {

    $document_root = Utils::getDocumentRoot();
    $page_nm = $this->page['page_nm'];
    if (isset($options['page_nm'])){
      $page_nm = $options['page_nm'];
    }
    $app_mgr      = new ApplicationManager();
    $app_nm       = $app_mgr->getApplicationName();
    $style_sheets = $this->getStyleSheetTags($options);

    //if (isset($options['angularjs']) && $options['angularjs'] === true){
    //  $title = '<title>{{page_title}}</title>';
    //}else{
    $title = "<title>{$page_nm} - {$app_nm}</title>";
    //}
    $header  = <<< END_OF_DATA
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<link rel="shortcut icon" href="/common/images/favicon.png">
{$title}
{$style_sheets}
<!--[if lt IE 9]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js" type="text/javascript"></script>
<![endif]-->
END_OF_DATA;

    return $header;
  }

  public function getStyleSheetTags($options=null)
  {
    $page_cd = $this->page['page_cd'];

    $tags = '';
    if (Utils::isPresent($options) && is_array($options)){
      if (array_key_exists('jqueryui', $options) === true && $options['jqueryui'] === true){
        $tags .= $this->getJQueryUICssTag();
      }
      if (array_key_exists('jqueryuilatest', $options) === true && $options['jqueryuilatest'] === true){
        $tags .= '<link rel="stylesheet" type="text/css" href="/common/css/jquery-ui.min.css" />';
        //$tags .= $this->getJQueryUICssTag();
      }

      if (array_key_exists('jqgrid', $options) === true && $options['jqgrid'] === true){
        $tags .= $this->getJqGridCssTag();
      }

      if (array_key_exists('jquerysteps', $options) === true && $options['jquerysteps'] === true){
        $tags .= $this->getJQueryStepsCssTag();
      }

      if (array_key_exists('jqueryfileupload', $options) === true && $options['jqueryfileupload'] === true){
        $tags .= $this->getJQueryFileUploadCssTag();
      }

      if (array_key_exists('jquerymultiselect', $options) === true && $options['jquerymultiselect'] === true){
        $tags .= '<link rel="stylesheet" type="text/css" href="/common/css/jquery.multiselect.css">';
      }

      if (array_key_exists('nggrid', $options) === true && $options['nggrid'] === true){
        $tags .= '<link rel="stylesheet" type="text/css" href="/common/css/ng-grid.min.css">';
      }

      //ngDialog
      if (array_key_exists('ngdialog', $options) === true && $options['ngdialog'] === true){
        $tags .= '<link rel="stylesheet" type="text/css" href="/common/css/ngDialog.css">'
              .  '<link rel="stylesheet" type="text/css" href="/common/css/ngDialog-theme-default.min.css">';
              //.  '<link rel="stylesheet" type="text/css" href="/common/css/ngDialog-theme-plain.min.css">';
      }

      if (array_key_exists('item_setting', $options) === true && $options['item_setting'] === true){
        $tags .= '<link rel="stylesheet" type="text/css" href="/item_setting/css/item_setting.css">';
      }

      //ionic
      if (array_key_exists('ionic', $options) === true && $options['ionic'] === true){
        $tags .= '<link rel="stylesheet" type="text/css" href="/mobile/www/lib/ionic/css/ionic.min.css">' .
                 '<link rel="stylesheet" type="text/css" href="/mobile/source/mbl_common/css/mbl_common.css">';
      }
    }
    $tags .= $this->getBootstrapCssTag();

    if (Utils::isPresent($options) && is_array($options)){

      if (array_key_exists('exclusion_smart_admin', $options) === false || $options['exclusion_smart_admin'] === false){
        //smart-admin
        $tags .= '<link rel="stylesheet" type="text/css" media="screen" href="/common/css/smartadmin/font-awesome.min.css">' .
                 '<link rel="stylesheet" type="text/css" media="screen" href="/common/css/smartadmin/smartadmin-production.css">' .
                 '<link rel="stylesheet" type="text/css" media="screen" href="/common/css/smartadmin/smartadmin-skins.css">';

      }

      $tags .= '<link rel="stylesheet" href="/common/css/common.css">';

      if (array_key_exists('mycss', $options) === true && $options['mycss'] === true){
        $tag = '<link rel="stylesheet" type="text/css" href="/' . $page_cd. '/css/' . $page_cd . '.css">';
        $tags .= $tag; //自ページ用CSS
      }

      if (array_key_exists('mbl_mycss', $options) === true && $options['mbl_mycss'] === true){
        $tag = '<link rel="stylesheet" type="text/css" href="/mobile/source/' . $page_cd. '/css/' . $page_cd . '.css">';
        $tags .= $tag; //自ページ用CSS
      }

    }

    $tags .= '<!-- GOOGLE FONT -->' .
             '<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">';

    //favicon
    $tags .= '<link rel="shortcut icon" href="/common/images/favicon/favicon.ico" type="image/x-icon">' .
             '<link rel="icon" href="/common/images/favicon/favicon.ico" type="image/x-icon">';

    return $tags;
  }

  public function getScriptTags($options=null)
  {
    $page_cd = $this->page['page_cd'];

    $tags    = '';

    if (Utils::isPresent($options) && is_array($options)){

      if (array_key_exists('jquery1', $options) === true && $options['jquery1'] === true){
        $tags .= '<script type="text/javascript" src="/common/js/jquery-1.11.1.min.js"></script>';
      }else{
        $tags .= '<script type="text/javascript" src="/common/js/smartadmin/libs/jquery-2.0.2.min.js"></script>';
      }

      if (array_key_exists('jqueryui', $options) === true && $options['jqueryui'] === true){
        $tags .= $this->getJQueryUIScriptTag();
      }
      if (array_key_exists('jqueryuilatest', $options) === true && $options['jqueryuilatest'] === true){
        $tags .= '<script type="text/javascript" src="/common/js/jquery-ui.min.js"></script>';
      }
      if (array_key_exists('jqgrid', $options) === true && $options['jqgrid'] === true){
        $tags .= $this->getJqGridScriptTag();
      }
      if (array_key_exists('jquerydatepicker', $options) === true && $options['jquerydatepicker'] === true){
        $tags .= $this->getJQueryDatePickerScriptTag();
      }
      if (array_key_exists('jquerydatetimepicker', $options) === true && $options['jquerydatetimepicker'] === true){
        $tags .= $this->getJQueryDateTimePickerScriptTag();
      }
      if (array_key_exists('jquerysteps', $options) === true && $options['jquerysteps'] === true){
        $tags .= $this->getJQueryStepsScriptTag();
      }
      if (array_key_exists('jqueryfileupload', $options) === true && $options['jqueryfileupload'] === true){
        $tags .= $this->getJQueryFileUploadScriptTag();
      }
      if (array_key_exists('jqueryvalidate', $options) === true && $options['jqueryvalidate'] === true){
        $tags .= $this->getJQueryValidateScriptTag();
      }
      if (array_key_exists('ckeditor', $options) === true && $options['ckeditor'] === true){
        $tags .= $this->getCKEditorScriptTag();
      }
      if (array_key_exists('jquery.flot', $options) === true && $options['jquery.flot'] === true){
        $tags .= $this->getJQueryFlotScriptTag();
      }

      if (array_key_exists('jquerymultiselect', $options) === true && $options['jquerymultiselect'] === true){
        $tags .= '<script src="/common/js/jquery.multiselect.min.js"></script>';
      }

      if (array_key_exists('jquerycookie', $options) === true && $options['jquerycookie'] === true){
        $tags .= '<script src="/common/js/jquery.cookie.js"></script>';
      }

      if (array_key_exists('jarvis.widget', $options) === true && $options['jarvis.widget'] === true){
        $tags .= $this->getJarvisWidgetTag();
      }
      if (array_key_exists('item_manager', $options) === true && $options['item_manager'] === true){
        $tags .= $this->getItemManagerScriptTag();
      }

      if (array_key_exists('datatable', $options) === true && $options['datatable'] === true){
        $tags .= $this->getDataTableTag();
      }

      if (array_key_exists('morris', $options) === true && $options['morris'] === true){
        $tags .= '<script src="/common/js/smartadmin/plugin/morris/raphael.2.1.0.min.js"></script>' .
                 '<script src="/common/js/smartadmin/plugin/morris/morris.min.js"></script>';
      }

      if (array_key_exists('easypiechart', $options) === true && $options['easypiechart'] === true){
        $tags .= '<script src="/common/js/smartadmin/plugin/easy-pie-chart/jquery.easy-pie-chart.min.js"></script>';
        //$tags .= '<script src="/common/js/smartadmin/plugin/easy-pie-chart/jquery.easy-pie-chart.js"></script>';
      }

      //$tags .= '<script src="/common/js/smartadmin/plugin/fullcalendar/jquery.fullcalendar.min.js"></script>';

      if (array_key_exists('xeditable', $options) === true && $options['xeditable'] === true){
        $tags .= '<script src="/common/js/smartadmin/plugin/x-editable/x-editable.min.js"></script>';
      }

      if (array_key_exists('moment', $options) === true && $options['moment'] === true){
        $tags .= '<script src="/common/js/smartadmin/plugin/x-editable/moment.min.js"></script>';
      }

      if (array_key_exists('highchart', $options) === true && $options['highchart'] === true){
        $tags .= '<script src="/common/js/highcharts-custom.js"></script>';
      }

      if (array_key_exists('highchart_grouped_categories', $options) === true && $options['highchart_grouped_categories'] === true){
        $tags .= '<script src="/common/js/grouped-categories.js"></script>';
      }

      if (array_key_exists('ngfileupload', $options) === true && $options['ngfileupload'] === true){
        //angularjsより前に読み込む
        $tags .= '<script src="/common/js/angular-file-upload-shim.min.js"></script>';
      }

      //AngularJS
      if (array_key_exists('angularjs', $options) === true && $options['angularjs'] === true){
        //$tags .= '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular.min.js"></script>';
        //$tags .= '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular.js"></script>';
        $tags .= '<script src="/common/js/angular.min.js"></script>';
      }

      //ngRoute
      if (array_key_exists('ngroute', $options) === true && $options['ngroute'] === true){
        //$tags .= '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/X.Y.Z/angular-route.js"></script>';
        $tags .= '<script src="/common/js/angular-route.min.js"></script>';
      }

      //ngAnimate
      if (array_key_exists('nganimate', $options) === true && $options['nganimate'] === true){
        $tags .= '<script src="/common/js/angular-animate.min.js"></script>';
      }

      //ngResource
      if (array_key_exists('ngresource', $options) === true && $options['ngresource'] === true){
        $tags .= '<script src="/common/js/angular-resource.min.js"></script>';
      }

      //ngSanitize
      if (array_key_exists('ngsanitize', $options) === true && $options['ngsanitize'] === true){
        $tags .= '<script src="/common/js/angular-sanitize.min.js"></script>';
      }

      //ionic
      if (array_key_exists('ionic', $options) === true && $options['ionic'] === true){
        $tags .= '<script src="/mobile/www/lib/ionic/js/ionic.js"></script>'
              .  '<script src="/mobile/www/lib/ionic/js/ionic.bundle.js"></script>'
              ;

      }

      if (array_key_exists('nggrid', $options) === true && $options['nggrid'] === true){
        $tags .= '<script src="/common/js/ng-grid-2.0.11.min.js"></script>'
              .  '<script src="/common/js/ng-grid-flexible-height.js"></script>'
              .  '<script src="/common/js/ng-grid-layout.js"></script>'
              .  '<script src="/common/js/ng-grid-reorderable.js"></script>'
              ;
      }

      //ngDialog
      if (array_key_exists('ngdialog', $options) === true && $options['ngdialog'] === true){
        $tags .= '<script src="/common/js/ngDialog.min.js"></script>';
      }

      if (array_key_exists('uirouter', $options) === true && $options['uirouter'] === true){
        $tags .= '<script src="/common/js/angular-ui-router.min.js"></script>';
      }

      if (array_key_exists('ngfileupload', $options) === true && $options['ngfileupload'] === true){
        $tags .= '<script src="/common/js/angular-file-upload.min.js"></script>';
      }
    }

    //Bootstrap
    $tags .= $this->getBootstrapScriptTag();

    //共通JS
    $tags .= '<script type="text/javascript" src="/common/js/common.js"></script>';

    //ツアーナビゲーション
    $tags .= '<script type="text/javascript" src="/common/js/jquery.balloon.min.js"></script>';
    $tags .= '<script type="text/javascript" src="/common/js/tourNavigation.js"></script>';

    $tags .= '<!-- browser msie issue fix --><script src="/common/js/smartadmin/plugin/msie-fix/jquery.mb.browser.min.js"></script>';

    if (Utils::isPresent($page_cd)){
      //自ページのJavascript
      if ((Utils::isPresent($options) && is_array($options)) && (array_key_exists('mbl_myjs', $options) === true && $options['mbl_myjs'])){
        $tags .= "<script type=\"text/javascript\" src=\"/mobile/source/{$page_cd}/js/{$page_cd}.js\"></script>";
      } else {
        $tags .= "<script type=\"text/javascript\" src=\"/{$page_cd}/js/{$page_cd}.js\"></script>";
      }
    }else{
      if (Utils::isPresent($options) && is_array($options)){
        if (array_key_exists('myjs', $options) === true && $options['myjs']){
          $myjs = $options['myjs'];
          $tags .= "<script type=\"text/javascript\" src=\"{$myjs}\"></script>";
        }
      }
    }

    //自ページの後に読み込むjavascript
    if (Utils::isPresent($options) && is_array($options)){
      //共通
      if (array_key_exists('uplogiccommon', $options) === true && $options['uplogiccommon'] === true){
        $tags .= '<script src="/common/js/uplogic_common.js"></script>';
      }

      //import
      if (array_key_exists('import', $options) === true && $options['import'] === true){
        $tags .= '<script src="/import/js/import.js"></script>';
      }

      //detail_list_customer
      if (array_key_exists('detail_list_customer', $options) === true && $options['detail_list_customer'] === true){
        $tags .= '<script src="/customer/js/detail_list_customer.js"></script>';
      }

      //detail_list_business_discussion
      if (array_key_exists('detail_list_business_discussion', $options) === true && $options['detail_list_business_discussion'] === true){
        $tags .= '<script src="/business_discussion/js/detail_list_business_discussion.js"></script>';
      }

      //detail_list_business_contract
      if (array_key_exists('detail_list_business_contract', $options) === true && $options['detail_list_business_contract'] === true){
        $tags .= '<script src="/business_contract/js/detail_list_business_contract.js"></script>';
      }

      //detail_list_merchandise
      if (array_key_exists('detail_list_merchandise', $options) === true && $options['detail_list_merchandise'] === true){
        $tags .= '<script src="/merchandise/js/detail_list_merchandise.js"></script>';
      }

      //detail_list_opportunity_merchandise
      if (array_key_exists('detail_list_opportunity_merchandise', $options) === true && $options['detail_list_opportunity_merchandise'] === true){
        $tags .= '<script src="/opportunity_merchandise/js/detail_list_opportunity_merchandise.js"></script>';
      }

      //activity_history
      if (array_key_exists('activity_history', $options) === true && $options['activity_history'] === true){
        $tags .= '<script src="/activity_history/js/detail_list_activity_history.js"></script>';
      }

      //mbl_opportunity_merchandise_list_select_for_detail
      if (array_key_exists('mbl_opportunity_merchandise_list_select_for_detail', $options) === true && $options['mbl_opportunity_merchandise_list_select_for_detail'] === true){
        $tags .= '<script src="/mobile/source/mbl_opportunity_merchandise/js/mbl_opportunity_merchandise_list_select_for_detail.js"></script>';
      }

      //mbl_business_discussion_list_for_detail
      if (array_key_exists('mbl_business_discussion_list_for_detail', $options) === true && $options['mbl_business_discussion_list_for_detail'] === true){
        $tags .= '<script src="/mobile/source/mbl_business_discussion/js/mbl_business_discussion_list_for_detail.js"></script>';
      }

      //mbl_customer_list_for_detail
      if (array_key_exists('mbl_customer_list_for_detail', $options) === true && $options['mbl_customer_list_for_detail'] === true){
        $tags .= '<script src="/mobile/source/mbl_customer/js/mbl_customer_list_for_detail.js"></script>';
      }

      //mbl_activity_history
      if (array_key_exists('mbl_activity_history', $options) === true && $options['mbl_activity_history'] === true){
        $tags .= '<script src="/mobile/source/mbl_activity_history/js/mbl_activity_history.js"></script>';
      }

      //list
      if (array_key_exists('list', $options) === true && $options['list'] === true){
        $tags .= '<script src="/list/js/list.js"></script>';
      }

      //search
      if (array_key_exists('search', $options) === true && $options['search'] === true){
        $tags .= '<script src="/search/js/search.js"></script>';
      }

      //item_setting
      if (array_key_exists('item_setting', $options) === true && $options['item_setting'] === true){
        $tags .= '<script src="/item_setting/js/item_setting.js"></script>';
      }

      //contract
      if (array_key_exists('contract', $options) === true && $options['contract'] === true){
        $tags .= '<script src="/contract/js/contract.js"></script>';
      }
    }

//    $tags .= '<script type="text/javascript" src="/common/js/smartadmin/app.js"></script>';
    return $tags;
  }

  public function getNavigation($params=null)
  {
    $app_mgr = new ApplicationManager();

    $app_nm  = $app_mgr->getApplicationName();

    $page_cd = $this->page['page_cd'];

    /*$guest_div = 0;
    if (Utils::isPresent($params)){
      $guest_div = $params['guest_div'];
    }*/

    $user_mgr  = new UserManager();

    $user      = $user_mgr->getUser();

    $trial_div = $user['trial_div'];

    $trial_end_at = $user['trial_end_at'];

    $guest_div = $user['guest_div'];

    $show_question_slider = $user['show_question_slider'];

    $prospect_class            = $page_cd === 'prospect'            ? 'prospect_nav'            : 'prospect_nav out';
    $company_class             = $page_cd === 'company'             ? 'company_nav'             : 'company_nav out';
    $customer_class            = $page_cd === 'customer'            ? 'customer_nav'            : 'customer_nav out';
    $business_discussion_class = $page_cd === 'business_discussion' ? 'business_discussion_nav' : 'business_discussion_nav out';
    $merchandise_class         = $page_cd === 'merchandise'         ? 'merchandise_nav'         : 'merchandise_nav out';
    $canvas_class              = $page_cd === 'canvas'              ? 'canvas_nav'              : 'canvas_nav out';
    $project_class             = $page_cd === 'project'             ? 'project_nav'             : 'project_nav out';
    $period_class              = $page_cd === 'period'              ? 'period_nav'              : 'period_nav out';
    $data_class                = $page_cd === 'report_flexible'     ? 'data_nav'                : 'data_nav out';
    $help_class                = $page_cd === 'help'                ? 'help'                    : 'help_nav out';
    $settings_class            = $page_cd === 'settings'            ? 'settings_nav'            : 'settings_nav out';

    $navi = <<< EOS
<nav class="navbar navbar-default" role="navigation">
  <div class="container-fluid">

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <div class="nav navbar-nav">
        <a href="/canvas/canvas.php" target="_self" style="float: left; margin-top: 20px; margin-left: -10px;">
          <img src="/common/images/top_logo.png" alt="" />
        </a>
        <!--<form style="float: right; margin: 10px 15px; width: 200px" class="smart-form">
          <label class="select">
            <select id="organSelect">
            </select> <i></i>
          </label>
        </form>-->
      </div>
      <div>
      <ul class="nav navbar-nav navbar-right common-menu-bar" style=" margin-top: 20px; margin-left: 10px; margin-right: -26px; width: 571px; float: right;">
        <li rel="tooltip" data-placement="bottom" data-original-title="キャンバス">
          <a href="/canvas/canvas.php" class="{$canvas_class}" target="_self"></a>
        </li>
        <li rel="tooltip" data-placement="bottom" data-original-title="見込客">
          <a href="/prospect/prospect.php" class="{$prospect_class}" target="_self"></a>
        </li>
        <li rel="tooltip" data-placement="bottom" data-original-title="会社">
          <a href="/company/company.php" class="{$company_class}" target="_self"></a>
        </li>
        <li rel="tooltip" data-placement="bottom" data-original-title="担当者">
          <a href="/customer/customer.php" class="{$customer_class}" target="_self"></a>
        </li>
        <li rel="tooltip" data-placement="bottom" data-original-title="商談">
          <a href="/business_discussion/business_discussion.php" class="{$business_discussion_class}" target="_self"></a>
        </li>
        <li rel="tooltip" data-placement="bottom" data-original-title="商品">
          <a href="/merchandise/merchandise.php" class="{$merchandise_class}" target="_self"></a>
        </li>
        <li rel="tooltip" data-placement="bottom" data-original-title="プロジェクト">
          <a href="/project/project.php" class="{$project_class}" target="_self"></a>
        </li>
        <li rel="tooltip" data-placement="bottom" data-original-title="レポート">
          <a href="/report_flexible/report_flexible.php" class="{$data_class}" target="_self"></a>
        </li>
        <li rel="tooltip" data-placement="bottom" data-original-title="ヘルプ">
          <a href="http://chikyu.net/help/" target="_blank" class="{$help_class}" target="_self"></a>
        </li>
        <li>
          <a href="/login/php/logout.php" class="logout_button" target="_self">ログアウト</a>
        </li>
EOS;

    $navi .= '<li class="divider-vertical"></li>'
          .    '<div class="btn-group">'
          .      '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" rel="tooltip" data-placement="bottom" data-original-title="設定" style="height: 45px; box-shadow: none; background: #eee; border: 0; border-radius: 0;">'
          .        '<img src="/common/images/function.png" />'
          .      '</button>'
          .      '<ul class="dropdown-menu">';

    if ($guest_div == 0){
      //正式ユーザー
      $navi .= '<li>'
            .    '<a href="/organ/organ.php" target="_self">組織設定</a>'
            .  '</li>'
            .  '<li>'
            .    '<a href="/user/user.php" target="_self">ユーザー一覧</a>'
            .  '</li>'
            .  '<li class="divider"></li>'
            .  '<li>'
            .    '<a href="/prospect/prospect.php/item_settings" target="_self">項目設定&nbsp;‐&nbsp;見込客</a>'
            .  '</li>'
            .  '<li>'
            .    '<a href="/company/company.php/item_settings" target="_self">項目設定&nbsp;‐&nbsp;会社</a>'
            .  '</li>'
            .  '<li>'
            .    '<a href="/customer/customer.php/item_settings" target="_self">項目設定&nbsp;‐&nbsp;担当者</a>'
            .  '</li>'
            .  '<li>'
            .    '<a href="/business_discussion/business_discussion.php/item_settings" target="_self">項目設定&nbsp;‐&nbsp;商談</a>'
            .  '</li>';
            $navi .=
                '<li>'
              .    '<a href="/business_discussion/business_discussion.php/repeat_recorded_item_settings" target="_self">項目設定&nbsp;‐&nbsp;商談の繰り返し計上</a>'
              .  '</li>';
            $navi .= '<li>'
            //.  '<li>'
            //.    '<a href="/business_discussion/business_discussion.php/repeat_recorded_item_settings" target="_self">項目設定&nbsp;‐&nbsp;商談の繰り返し計上</a>'
            //.  '</li>'
            //.  '<li>'
            .    '<a href="/merchandise/merchandise.php/item_settings" target="_self">項目設定&nbsp;‐&nbsp;商品マスタ</a>'
            .  '</li>'
            .  '<li>'
            .    '<a href="/activity_history/activity_history.php/item_settings" target="_self">項目設定&nbsp;‐&nbsp;活動履歴</a>'
            .  '</li>'
            //.  '<li>'
            //.    '<a href="/business_contract/business_contract.php/item_settings" target="_self">項目設定&nbsp;‐&nbsp;契約</a>'
            //.  '</li>'
            .  '<li class="divider"></li>'
            .  '<li>'
            .    '<a id="tourNavigation" href="javascript:void(0)">ツアーの開始</a>'
            .  '</li>'
            .  '<li class="divider"></li>'
            .    '<div class="common-checkbox" style="padding: 0 5px;">'
            .      '<input type="checkbox" id="toggleQuestionCheck" ';

            if ($show_question_slider == 1){
              $navi .= 'checked';
            }

            $navi .= ' />'
            .      '<label for="toggleQuestionCheck" style="margin: 0;">質問フォーム表示</label>'
            .    '</div>'
            .  '<li class="divider"></li>'
            .  '<li>'
            .    '<a href="/contract/contract.php" target="_self">契約設定</a>'
            .  '</li>';
    }else{
      //ゲストユーザー
      $navi .= '<li>'
            .    '<a href="#" class="disabled-link" disabled="disabled">組織設定</a>'
            .  '</li>'
            .  '<li>'
            .    '<a href="#" class="disabled-link" disabled="disabled">ユーザー一覧</a>'
            .  '</li>'
            .  '<li class="divider"></li>'
            .  '<li>'
            .    '<a href="#" class="disabled-link" disabled="disabled">契約設定</a>'
            .  '</li>';
    }

    $navi .= '</ul>'
          . '</div>';

    $navi .= <<< EOS
      </ul>
        <label class="common-select large" style="float: right; margin-top: 20px;">
          <select id="organSelect">
          </select>
          <i></i>
        </label>
EOS;

     //トライアル
    if ($trial_div == 1){

      $today = Utils::getToday();

      $image_url = '/common/images/sign_up.png';
      $alt       = '有料プランのお申込はこちら';

      if (strtotime($trial_end_at) < strtotime($today)){
        $image_url = '/common/images/trial_end.png';
        $alt       = 'トライアルが終了しました。有料プランにお申し込みください';
      }

      $navi .= '<span id="signUpPane">'
            .    '<a href="/trial_registration/trial_registration.php" target="_self">'
            .      '<img src="' . $image_url . '" alt="' . $alt . '" />'
            .    '</a>'
            .  '</span>';
    }

    $navi .= <<< EOS
      </div>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
EOS;
    return $navi;
  }

  //サイドバーHTMLを返す
  public function generateSidebarHtml($company_cd)
  {
    $ssl_domain = Utils::getSslDomain();
    $html = <<< END_OF_DATA
<!-- main_side start -->
<div id="main_side">
  <div id="main_side_inner">
    <ul id="menuTree" class="tree">
      <li>
        <span>機能メニュー</span>
        <ul>
          <li><a href="{$ssl_domain}/cst/cst_list.php">顧客情報管理</a></li>
          <li><a href="{$ssl_domain}/mail/mail_send_list.php">メール管理</a></li>
        </ul>
      </li>
    </ul>
  </div>
</div>
<!-- main_side end -->
END_OF_DATA;
    return $html;
  }

  public function getBodyHeader($param=null)
  {
    $is_login = false;
    $user_nm  = '';
    if (Utils::isPresent($param)){
      if (isset($param['is_login'])){
        $is_login = $param['is_login'];
      }
      if (isset($param['user_nm'])){
        $user_nm = $param['user_nm'];
      }
    }
    $app_mgr = new ApplicationManager();
    $app_nm  = $app_mgr->getApplicationName();
    $body_header = <<< END_OF_DATA
  <div id="header">
    <div class="container">
      <span id="logo">
END_OF_DATA;

    if ($is_login){
      $body_header .= '<a href="/" class="logo" target="_self">' . $app_nm . '</a>';
    }else{
      $body_header .= '<span class="logo">' . $app_nm . '</span>';
    }
    $body_header .= '</span>';

    if ($is_login){
      //$body_header .= '<span style="padding: 7px 0; position: relative; float: right;">'
      $body_header .= '<span style="padding: 7px 10px; position: relative; float: right;">';

      if (Utils::isPresent($user_nm)){
        $body_header  .= '<span class="user-name">' . $user_nm . '様</span>';
      }
      $body_header .= '<a id="btnLogout" class="button green" href="/login/php/logout.php" target="_self">ログアウト</a>'
                   .  '</span>';
    }
    $body_header .= <<< END_OF_DATA
    </div>
  </div>
END_OF_DATA;
    return $body_header;
  }

  public function getFooter()
  {
    $footer = <<< END_OF_DATA
  <div id="footer">
    <div class="container">
      <ul class="list">
        <li><a href="/">ホーム</a></li>
      </ul>
    </div>
  </div>
END_OF_DATA;
    return $footer;
  }

  //dbリソースに基づいてselect要素のhtmlを生成して返す
  public function generateSelectHtml($elm_id, $style, $def_value, $def_text, $res, $col_nm)
  {
    $html  = '<select id="' . $elm_id . '" style="' . $style . '">';
    $html .= '<option value="' . $def_value . '">' . $def_text . '</option>';
    $counter = 0;
    while($row = mysql_fetch_assoc($res)){
      $counter++;
      $data = $row["{$col_nm}"];
      if (!isset($data) || strlen(trim($data)) == 0) continue;
        $html .= '<option value="' . $counter . '">' . $data . '</option>';
    }
    $html .= '</select>';
    return $html;
  }

  public function generateSelectorHtml($elm_id, $tbl_id, $arr_th, $td_id_prefix,
    $td_height, $hide_method, $select_method, $title, $list, $col_list, $value_col_index=1)
  {

    $html = <<< END_OF_DATA
<div id="{$elm_id}" class="divSelector">
  <div class="selectorTitle">{$title}</div>
  <div>
    <a class="btn_cancel" href="javascript:void(0)" style="float: left; margin: 0 0 0 18px;" onclick="{$hide_method}();">閉じる</a>
  </div>
  <div style="clear: both;">
    <table id="{$tbl_id}" class="selector">
      <thead><tr>
END_OF_DATA;
    foreach($arr_th as $th){
      $html .= '<th>' . $th . '</th>';
    }
    $html .= <<< END_OF_DATA
      </tr>
      </thead>
      <tbody>
END_OF_DATA;
      $counter = 0;
      if (!is_array($col_list)){
        $col_list = array($col_list);
      }
      foreach($list as $row){
        $counter++;
        $html .= '<tr>';
        $html .= '<td width="100px" style="width: 100px;">' .
          '<a href="javascript:void(0)" onclick="' . $select_method . '(\'' . $counter . '\');">選択</a>' .
        '</td>';
        $col_counter = 0;
        foreach ($col_list as $col_nm){
          $col_counter++;
          $col_value = $row["{$col_nm}"];
          if ($col_value == '') continue;
          $html .= '<td';
          if ($col_counter == $value_col_index){
            $html .= ' id="' . $td_id_prefix . $counter . '"';
          }
          $html .= ' style="height: ' . $td_height . '; text-align: left;">' .
            Utils::mb_str_replace("\n", '<br />', $col_value, 'utf-8') .
          '</td>';
        }
        $html .= '</tr>';
      }
      $html .= <<< END_OF_DATA
      </tbody>
    </table>
  </div>
</div>
END_OF_DATA;
    return $html;
  }

  //メニューのHTMLを文字列として返す
  public function getMenu($menu_id)
  {
    $ssl_domain = Utils::getSslDomain();
    $user_mgr   = new UserManager();
    $html       = '<ul>';
    //$organ_id   = $user_mgr->getOrganId();
    $menu_mgr   = new MenuManager();
    $res        = $menu_mgr->getMenuList($menu_id);
    $counter    = 0;
    if ($res){
      while($row = $res->fetch_assoc()){
        $menu_nm     = $row['menu_nm'];
        $path        = $this->getMenuPath($row);
        $image_path  = $row['image_file_path'];
        $func_url    = $ssl_domain . $path;
        $description = $row['description'];
        $html       .= "<li style=\"float: left; width: 550px;\">"
                    .  "<a href=\"{$func_url}\">"
                    .  "<div class=\"function_item\"><ul>"
                    .  "<li class=\"function_icon\">"
                    .  "<img class=\"function_image\" src=\"{$ssl_domain}/{$image_path}\" alt=\"{$menu_nm}\" />"
                    .  "<div style=\"margin-top: 10px;\">{$menu_nm}</div></li>"
                    .  "<li class=\"function_desc_li\"><div class=\"function_description\">{$description}</div></li>"
                    .  "</ul></div></a></li>";
      }
      $html      .= '</ul>';
      $html      .= '<div style="clear: both;">';
    }else{
      $html = '利用可能な機能がありません。';
    }
    return $html;
  }

  private function getMenuPath($menu)
  {
    if ($menu['parent_div'] == 1){
      $path = '/home/home.php?p=' . $menu['menu_id'];
    }else{
      $path = $menu['path'];
    }
    return $path;
  }

  //管理画面のメニューHTMLを文字列として返す
  public function generateAdminMenuHtml()
  {
    $ssl_domain     = Utils::getSslDomain();
    //$html           = '<table><tr>';
    $html           = '<ul>';
    $admin_menu_mgr = new AdminMenuManager();
    $res            = $admin_menu_mgr->getAdminMenuList();
    $counter        = 0;
    if (!$res){
      return false;
    }
    while($row = mysql_fetch_assoc($res)){
      $menu_nm     = $row['menu_nm'];
      $url         = $row['url'];
      $icon_path   = $row['icon_file_path'];
      $app_url     = $ssl_domain . $url;
      $description = $row['description'];
      $html       .= "<li style=\"float: left; width: 550px;\">"
                  .  "<a href=\"{$app_url}\">"
                  .  "<div class=\"app_item\"><ul>"
                  .  "<li style=\"float: left; width: 80px;\">"
                  .  "<img class=\"app_img\" src=\"{$ssl_domain}/{$icon_path}\" alt=\"{$menu_nm}\" />"
                  .  "<div style=\"margin-top: 10px;\">{$menu_nm}</div></li>"
                  .  "<li class=\"app_desc_li\"><div class=\"app_description\">{$description}</div></li>"
                  .  "</ul></div></a></li>";
    }
    //$html .= '</tr></table>';
    $html      .= '</ul>';
    return $html;
  }

  public function getBreadcrumb($menu_with_link)
  {
    $ssl_domain = Utils::getSslDomain();
    $parent_menu_id = $menu_with_link['parent_menu_id'];
    if ($parent_menu_id == -99){
      return false;
    }
    $list       = $this->getBreadcrumbList($parent_menu_id, array());
    $html       = '<ul class="bread-crumb">';
    foreach($list as $link){
      $menu_nm  = $link['menu_nm'];
      $path     = $this->getMenuPath($link);
      $func_url = $ssl_domain . $path;
      $html    .= "<li><a href=\"{$func_url}\">{$menu_nm}</a>&nbsp;>&nbsp;</li>";
    }
    $html .= "<li>{$menu_with_link['menu_nm']}</li>";
    $html .= '</ul>';
    return $html;
  }

  private function getBreadcrumbList($parent_menu_id, $list)
  {
    if (Utils::isEmpty($parent_menu_id)){
      return $list;
    }

    $menu_mgr         = new MenuManager();
    $parent_menu_link = $menu_mgr->getMenuWithLink($parent_menu_id);
    if (Utils::isEmpty($parent_menu_link)){
      return $list;
    }
    array_unshift($list, $parent_menu_link);
    if ($parent_menu_link['parent_menu_id'] == -99){
      return $list;
    }else{
      return $this->getBreadcrumbList($parent_menu_link['parent_menu_id'], $list);
    }
  }

  /*public function getJQueryUITag(){
    return '<script type="text/javascript" src="/common/js/jquery-ui.min.js"></script>' .
      '<script type="text/javascript" src="/common/js/i18n/jquery.ui.datepicker-ja.js"></script>' .
      '<link rel="stylesheet" href="/common/css/jquery-ui-1.8.15.custom.css" type="text/css" />';
  }*/

  public function getJQueryUIScriptTag()
  {
    //return '<script type="text/javascript" src="/common/js/jquery-ui.min.js"></script>';
    return '<script type="text/javascript" src="/common/js/smartadmin/libs/jquery-ui-1.10.3.min.js"></script>';
  }

  public function getJQueryUICssTag()
  {
    return '<link rel="stylesheet" href="/common/css/jquery-ui-1.8.15.custom.css" type="text/css" />';
  }

  public function getJQueryDatepickerScriptTag()
  {
    return '<script type="text/javascript" src="/common/js/i18n/jquery.ui.datepicker-ja.js"></script>';
  }

  /*public function getJqGridTag(){
    return '<script type="text/javascript" src="/common/js/jquery.jqGrid.js"></script>'  .
      '<script type="text/javascript" src="/common/js/i18n/grid.locale-ja.js"></script>' .
      '<link rel="stylesheet" href="/common/css/ui.jqgrid.css" type="text/css" />';
  }*/

  public function getJqGridScriptTag()
  {
    return '<script type="text/javascript" src="/common/js/jquery.jqGrid.js"></script>'  .
      '<script type="text/javascript" src="/common/js/i18n/grid.locale-ja.js"></script>';
  }

  public function getJqGridCssTag()
  {
    return '<link rel="stylesheet" href="/common/css/ui.jqgrid.css" type="text/css" />';
  }

  public function getItemManagerTag()
  {
    return '<script type="text/javascript" src="/common/js/item_manager.js"></script>';
  }

  public function getJQueryUploadTag()
  {
    return '<script type="text/javascript" src="/common/js/jquery.upload-1.0.2.js"></script>';
  }

  /*public function getJQueryFileUploadTag(){
    return '<script type="text/javascript" src="/common/js/jquery.iframe-transport.js"></script>' .
           '<script type="text/javascript" src="/common/js/jquery.fileupload.js"></script>' .
           '<link rel="stylesheet" href="/common/css/jquery.fileupload.css" />';
  }*/

  public function getJQueryFileUploadScriptTag()
  {
    return '<script type="text/javascript" src="/common/js/jquery.iframe-transport.js"></script>' .
           '<script type="text/javascript" src="/common/js/jquery.fileupload.js"></script>';
  }

  public function getJQueryFileUploadCssTag()
  {
    return '<link rel="stylesheet" href="/common/css/jquery.fileupload.css" />';
  }

  public function getFormToWizardTag(){
    return '<script type="text/javascript" src="/common/js/formToWizard.js"></script>' .
      '<link rel="stylesheet" href="/common/css/wizard.css" />';
  }

  public function getJQueryStepsTag()
  {
    return '<script type="text/javascript" src="/common/js/jquery.steps.js"></script>' .
      '<link rel="stylesheet" href="/common/css/jquery.steps.css" />';
  }

  public function getJQueryStepsScriptTag()
  {
    return '<script type="text/javascript" src="/common/js/jquery.steps.js"></script>';
  }

  public function getJQueryStepsCssTag()
  {
    return '<link rel="stylesheet" href="/common/css/jquery.steps.css" />';
  }

  public function getZeroClipboardTag()
  {
    return '<script type="text/javascript" src="/common/js/ZeroClipboard.min.js"></script>';
  }

  public function getJQueryDateTimePickerScriptTag()
  {
    return '<script type="text/javascript" src="/common/js/jquery-ui-timepicker-addon.js"></script>';
  }

  public function getCKEditorScriptTag()
  {
    return '<script type="text/javascript" src="/common/js/ckeditor/ckeditor.js"></script>';
  }

  public function getJQueryFlotScriptTag()
  {
    return '<script type="text/javascript" src="/common/js/smartadmin/plugin/flot/jquery.flot.cust.js"></script>' .
           '<script type="text/javascript" src="/common/js/smartadmin/plugin/flot/jquery.flot.fillbetween.js"></script>' .
           '<script type="text/javascript" src="/common/js/smartadmin/plugin/flot/jquery.flot.orderBar.js"></script>' .
           '<script type="text/javascript" src="/common/js/smartadmin/plugin/flot/jquery.flot.pie.js"></script>' .
           '<script type="text/javascript" src="/common/js/smartadmin/plugin/flot/jquery.flot.resize.js"></script>' .
           '<script type="text/javascript" src="/common/js/smartadmin/plugin/flot/jquery.flot.tooltip.js"></script>';
  }

  public function getJarvisWidgetTag()
  {
    return '<script type="text/javascript" src="/common/js/smartadmin/smartwidgets/jarvis.widget.min.js"></script>';
    //return '<script type="text/javascript" src="/common/js/smartadmin/smartwidgets/jarvis.widget.js"></script>';
  }

  public function getBootstrapScriptTag()
  {
    return '<script src="/common/js/bootstrap.min.js"></script>';
  }

  public function getBootstrapCssTag()
  {
//    return '<link href="/common/css/bootstrap.min.css" rel="stylesheet">';
    return '<link href="/common/css/smartadmin/bootstrap.min.css" rel="stylesheet" />';
  }

  public function getJQueryValidateScriptTag()
  {
    return '<script src="/common/js/jquery.validate.min.js"></script>' .
      '<script src="/common/js/jquery.validate.japlugin.js"></script>';
  }

  public function getPagination($page, $total_pages, $url, $param=array())
  {
    if ($total_pages == 0){
      return '';
    }

    if($page == 1){
      $href     = '#';
      $disabled = ' disabled';
    }else{
      $previous = $page - 1;
      $href = "{$url}?p={$previous}";
      foreach($param as $key => $value){
        $href .= "&{$key}={$value}";
      }
      $disabled = '';
    }

    $pager = '<ul class="pagination pagination-alt">' .
               '<li>' .
                 "<a href=\"{$href}\">" .
                   "<i class=\"fa fa-angle-left{$disabled}\"></i>" .
                 '</a>' .
               '</li>';

    for($page_index = 0; $page_index < $total_pages; $page_index++){

      $this_index = $page_index + 1;

      if (($page_index + 1) == $page){
        $class = ' class="active"';
        $href  = '#';
      }else{
        $class = '';
        $href       = "{$url}?p={$this_index}";
        foreach($param as $key => $value){
          $href .= "&{$key}={$value}";
        }
      }

      $pager .= "<li{$class}>" .
                  "<a href=\"{$href}\">{$this_index}</a>" .
                "</li>";
    }

    if ($page < $total_pages){
      $next = $page + 1;
      $href = "{$url}?p={$next}";
      foreach($param as $key => $value){
        $href .= "&{$key}={$value}";
      }
      $disabled = '';
    }else{
      $href     = '#';
      $disabled = ' disabled';
    }

    $pager .=   "<li>" .
                  "<a href=\"{$href}\">" .
                    "<i class=\"fa fa-angle-right{$disabled}\"></i>" .
                  "</a>" .
                "</li>" .
              "</ul>";

    return $pager;
  }

  public function getHeaderEx()
  {

    $header = <<< EOS
<header id="header" style="background: white; height: 90px;">
  <div id="logo-group">
    <span id="logo"><img src="/common/images/top_logo.png" alt="Chikyu Inc." style="width: 250px;" /></span>
  </div>
  <!-- end pulled right: nav area -->
</header>
EOS;

    return $header;
  }

  public function getMyCanvasMenuTag()
  {
    $tag = <<< EOS
<div>
  <ul class="nav navbar-nav navbar-right" style="margin: 15px 0 0 0;">
    <li rel="tooltip" data-placement="bottom" data-original-title="ガジェット追加">
      <a href="javascript:void(0)" class="gadget_create gadget_create_nav out" id="gadgetCreateButton"></a>
    </li>
  </ul>
</div>
EOS;
    return $tag;
  }

  //プロジェクトキャンバスメニュー
  public function getProjectMenuTag($page_cd=null, $project_id=0)
  {
    $comunication_class   = $page_cd === 'comunication' ? 'comunication_nav' : 'comunication_nav out';
    $todo_class           = $page_cd === 'todo'         ? 'todo_nav'         : 'todo_nav out';
    $settings_class       = $page_cd === 'settings'     ? 'settings_nav'     : 'settings_nav out';

    $tag = <<< EOS
<div>
  <ul class="nav navbar-nav navbar-right" style="margin: 15px 0 0 0;">
    <li rel="tooltip" data-placement="bottom" data-original-title="ディスカッション">
      <a href="/discussion/discussion.php?pid={$project_id}" target="_self" class="{$comunication_class}"></a>
    </li>
    <li rel="tooltip" data-placement="bottom" data-original-title="やることリスト">
      <a href="/todo/todo.php?pid={$project_id}" target="_self" class="{$todo_class}"></a>
    </li>
    <li rel="tooltip" data-placement="bottom" data-original-title="ガジェット追加">
      <a href="javascript:void(0)" class="gadget_create gadget_create_nav out" id="gadgetCreateButton"></a>
    </li>
  </ul>
</div>
EOS;
    return $tag;
  }

  //ディスカッションメニュー
  public function getDiscussionMenuTag($project_id, $project_name)
  {

    if (Utils::isEmpty($project_name)){
      return '';
    }

    $tag = <<< EOS
<div>
  <ul class="nav navbar-nav navbar-right" style="margin: 15px 0 0 0;">
    <li data-original-title="{$project_name}のキャンバス" data-placement="bottom" rel="tooltip">
      <a href="/canvas/canvas.php?pid={$project_id}" target="_self" class="canvas_nav out"></a>
    </li>
    <li data-original-title="{$project_name}のやることリスト" data-placement="bottom" rel="tooltip">
      <a href="/todo/todo.php?pid={$project_id}" target="_self" class="todo_nav out"></a>
    </li>
  </ul>
</div>
EOS;
    return $tag;
  }

  //やることリストメニュー
  public function getTodoMenuTag($project_id, $project_name)
  {

    if (Utils::isEmpty($project_name)){
      return '';
    }

    $tag = <<< EOS
<div>
  <ul class="nav navbar-nav navbar-right" style="margin: 15px 0 0 0;">
    <li data-original-title="{$project_name}のキャンバス" data-placement="bottom" rel="tooltip">
     <a href="/canvas/canvas.php?pid={$project_id}" class="project_nav out"></a>
    </li>
    <li data-original-title="{$project_name}のディスカッション" data-placement="bottom" rel="tooltip">
      <a href="/discussion/discussion.php?pid={$project_id}" target="_self" class="comunication_nav out"></a>
    </li>
  </ul>
</div>
EOS;
    return $tag;
  }

  public function getDataTableTag(){
 $tag = <<< EOS
<script src="/common/js/smartadmin/plugin/datatables/jquery.dataTables-cust.min.js"></script>
<script src="/common/js/smartadmin/plugin/datatables/ColReorder.min.js"></script>
<script src="/common/js/smartadmin/plugin/datatables/FixedColumns.min.js"></script>
<script src="/common/js/smartadmin/plugin/datatables/ColVis.min.js"></script>
<script src="/common/js/smartadmin/plugin/datatables/ZeroClipboard.js"></script>
<script src="/common/js/smartadmin/plugin/datatables/media/js/TableTools.min.js"></script>
<script src="/common/js/smartadmin/plugin/datatables/DT_bootstrap.js"></script>
EOS;
    return $tag;
  }

}
?>
