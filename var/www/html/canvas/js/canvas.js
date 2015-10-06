var app = angular.module('myApp', ['ngGrid', 'ui.router', 'ngAnimate', 'ngDialog', 'angularFileUpload']);

(function(){

  'use strict';

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('list0', {
//      url        : '[/:project_id]',
      url        : '/',
      controller : 'CanvasController',
      templateUrl: '/canvas/template/canvas.php'
    })
    .state('list', {
//      url        : '/canvas/canvas.php[/:project_id]',
      url        : '/canvas/canvas.php',
      controller : 'CanvasController',
      templateUrl: '/canvas/template/canvas.php'
    })
/*
    .state('tab', {
      url        : '/canvas/canvas.php/tab/:project_id',',
      controller : 'CanvasController',
      templateUrl: '/canvas/template/canvas.php'
    })
*/
    ;
});

app.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});

//変数
app.value('values', {
  title          : '',
  collection_name: 'prospects',
  collection_singular_name: 'prospect',
  /*currentParent  : {},
  id_name        : 'prospect_id',
  name_name      : ['prospect_name'],
  item_setting_options: {
    'use_lookup': false
  },
  listReadUrl  : '/prospect/php/prospect_read.php',
  singleReadUrl: '/prospect/php/prospect_read_single.php',
  createUrl    : '/prospect/php/prospect_create.php',
  updateUrl    : '/prospect/php/prospect_update.php',
  deleteUrl    : '/prospect/php/prospect_delete.php',*/
});

app.controller('MyCntr', function($scope, $http){
});

app.controller('CanvasController', function($scope, $http, $state, $stateParams, $compile, $controller, $timeout, values, utils, itemManager, listManager) {

  var //self   = {},
      common = myObject.common,
      tourNavigation = new TourNavigation();

  $scope.gadget_mode        = null;

  //定数
  $scope.GADGET_MODE_CREATE = 1;
  $scope.GADGET_MODE_UPDATE = 2;

  $scope.DT_DATA_LIST       = 1;
  $scope.DT_DATA_INPUT      = 2;

  $scope.DT_PROSPECT            = 11;
  $scope.DT_COMPANY             = 16;
  $scope.DT_BUSINESS_DISCUSSION = 21;
  $scope.DT_ACTIVITY_HISTORY    = 26;

  $scope.GD_GRAPH               = 11;
  $scope.GD_DATA_INPUT          = 1;
  $scope.GD_TODO_LIST           = 2;
  $scope.GD_DISCUSSION          = 3;
  $scope.GD_TEXT_AND_IMAGE      = 4;

  //グラフタイプ区分
  $scope.GTD_BAR_CHART            = 1;
  $scope.GTD_HORIZONTAL_BAR_CHART = 2;
  $scope.GTD_LINE_CHART           = 3;
  $scope.GTD_ACHIEVEMENT          = 4;

  //分類期間区分
  $scope.CPD_YEAR    = 10;
  $scope.CPD_QUARTER = 20;
  $scope.CPD_MONTH   = 30;
  $scope.CPD_WEEK    = 40;
  $scope.CPD_DAY     = 50;
  $scope.CPD_HOUR    = 60;
  $scope.CPD_MINUTE  = 70;

  //集計方法
  $scope.AM_RECORD_COUNT          = 10;
  $scope.AM_TOTAL                 = 20;
  $scope.AM_AVERAGE               = 30;
  $scope.AM_MAX                   = 40;
  $scope.AM_MIN                   = 50;

  //ソート区分
  $scope.SD_AGGREGATION_VALUE     = 10;
  $scope.SD_LARGE_CATEGORY        = 20;
  $scope.SD_MIDDLE_CATEGORY       = 30;
  $scope.SD_SMALL_CATEGORY        = 40;

  //昇順・降順
  $scope.OD_ASC                   = 1;
  $scope.OD_DESC                  = 2;

  /* chart colors default */
  var $chrt_border_color = "#efefef";
  var $chrt_grid_color   = "#DDD"
  var $chrt_main         = "#E24913"; /* red       */
  //var $chrt_second       = "#6595b4"; /* blue      */
  var $chrt_second       = "#82bedc"; /* blue      */
  var $chrt_third        = "#FF9F01"; /* orange    */
  //var $chrt_fourth       = "#7e9d3a"; /* green     */
  var $chrt_fourth       = "#64a564"; /* green     */
  var $chrt_fifth        = "#BD362F"; /* dark red  */
  var $chrt_mono         = "#000";

  $scope.initialize = function(){

    $scope.bindEventListener();

//$scope.selectTab();

    var
      params     = common.getUrlParameter(),
      project_id = params['pid'];

    $timeout(function(){
      if (project_id){
        $('a[href=#project_' + project_id + ']').trigger('click');
      }else{
        //プロジェクトＩＤが無い場合はマイキャンバスを開く
        $('#myCanvasTabLink').trigger('click');
      }
    });

    //初回ログイン時はツアーメッセージを表示する
    if (tourNavigation.currentTour.id == 0){
      $scope.showTourMessage();
    } else {
      $scope.reStartTour();
    }

  };

  //ツアーメッセージを表示
  $scope.showTourMessage = function(){
    //ガジェット情報の取得
    $.post(
      '/canvas/php/get_login_count.php',
      {},
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        if (data && data.value){
          if (data.value == 1){
            $scope.confirmTours();
          }
        }
      }
    );
  };

  $scope.reStartTour = function(){
    if (tourNavigation.currentTour.id != tourNavigation.TOUR_LEAD
         && tourNavigation.currentTour.id != tourNavigation.TOUR_GRAPH){
      return;
    }
    if (tourNavigation.currentTour.id == tourNavigation.TOUR_LEAD){
      if (tourNavigation.currentTour.stone == 0){
        $scope.leadTour1();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_OUTLINE){
        $scope.leadTour2();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_BACKTOCANVAS){
        $scope.leadTour8();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_CONFIRMGRAPH){
        $scope.leadTour9();
        return;
      }
    }
    if (tourNavigation.currentTour.id == tourNavigation.TOUR_GRAPH){
      if (tourNavigation.currentTour.stone == 0){
        $scope.graphTour1();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_OUTLINE){
        $scope.graphTour2();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_SAVE){
        $scope.graphTour10();
        return;
      }
    }
  }

  //ナビゲーションツアーの開始
  $scope.confirmTours = function(){

    tourNavigation.showBalloon('#tabNavigator',{
      offsetY: -80,
      contents: '<div style="margin: 0px 0px 10px;line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 120%">【ツアーの開始】</p>'
                 + '<p class="lead" style="font-size: 100%;font-weight:bold">chikyuにログインいただき、ありがとうございます。</p><br/>'
                 + '<p style="font-size: 90%;">まずはchikyuを快適にご利用いただくための、簡単なツアーを行います。</p>'
                 + '<p style="font-size: 90%;">実際に操作しながら、chikyuの使い方を学習することができます。</p><br/>'
                 + '<p style="font-size: 90%;">開始されるお客様は「ツアーを始める」をクリックしてください。</p>'
                 + '<p style="font-size: 90%;">※あとで行うこともできます（「設定」→「ツアーの開始」）。</p></div>'
                 + '<button id="closeToursButton" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">結構です</button>'
                 + '<button id="leadTour1Button" type="button" class="common-button" style="float: right;height: 20px;">ツアーを始める</button>'
    },false);
    $(document).on('click', '#closeToursButton', function(){
      tourNavigation.hideBalloon('#tabNavigator', false);
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour1Button', $scope.leadTour1);

  };

  //イベントリスナーのひもづけ
  $scope.bindEventListener = function(){

    //ガジェット作成
    $(document).on('click', '#gadgetCreateButton', $scope.showGadgetDialogEx);

    //保存処理
    $(document).on('click', '#doCreateButton', $scope.createGadgetEx);

    //ダイアログキャンセル
    $(document).on('click', '#cancelButton', function(){$scope.closeGadgetDialog(true);});

    //ガジェット区分選択
    $(document).on('click', 'input[name=gadgetTypeRadio]', $scope.selectGadgetDiv);

    //グラフ区分選択
    $(document).on('click', 'input[name=graphTypeRadio]', $scope.selectGraphDiv);

    //データ区分選択
    $(document).on('click', 'input[name=dataTypeRadio]', $scope.selectDataDiv);

    //データ一覧選択ボタンクリック
    $(document).on('click', 'div[data-button-kind=select]', $scope.selectData);

    //目標あるなし選択
    $(document).on('click', '#targetSelector button', $scope.clickTargetSelector);

    //タブ切り替え
    $(document).on('click', '#tabNavigator li a', $scope.selectTab);

    //やることチェック
    $(document).on('click', 'input[data-element-kind=todo_check]', $scope.clickCheckbox);

    //TODO作成ペインの表示
    $(document).on('click', 'a.create_todo_button', $scope.createTodo);

    //TODO保存
    $(document).on('click', '#todoSaveButton', $scope.saveTodo);

    //TODO作成ペインキャンセル
    $(document).on('click', '#todoCancelButton', $scope.cancelTodo);

    //ディスカッションコメントリンククリック
    $(document).on('click', 'a[data-element-kind=discussion_comment_link]', $scope.clickDiscussionCommentLink);

    //ディスカッションスマイルリンククリック
    $(document).on('click', 'a[data-element-kind=discussion_smile_link]', $scope.clickDiscussionSmileLink);

    //ディスカッションコメントスマイルリンククリック
    $(document).on('click', 'a[data-element-kind=discussion_comment_smile_link]', $scope.clickDiscussionCommentSmileLink);

    //過去のコメントを取得する
    $(document).on('click', '#previousDiscussionCommentLink', $scope.getPreviousDiscussionComment);

    //ディスカッションコメントダイアログを閉じる
    $(document).on('click', '#discussionCommentDialogCloseButton', $scope.closeDiscussionCommentDialog);

    //ディスカッションコメント保存
    $(document).on('click', '#discussionCommentSaveButton', $scope.saveDiscussionComment);

    //ディスカッションコメント画像削除
    $(document).on('click', '#imageDeleteButton', $scope.deleteDiscussionCommentImage);

    //アラートメール宛先変更
    $(document).on('click', 'input[name=alert_mail_div]', $scope.changeAlertMailDiv);

    //やることリスト登録
    $(document).on('click', 'input[name=todo_div]', $scope.changeTodoDiv);

    //やることリスト期限無しチェック
    $(document).on('click', '#noTimeLimitCheck', $scope.checkNoTimeLimit);

    //テキスト画像区分選択
    $(document).on('click', 'input[name=textAndImageDivRadio]', $scope.clickTextAndImageDivRadio);

    //ガジェット編集
    $(document).on('click', 'a[data-element-kind=gadget_update]', $scope.updateGadget);
    //ガジェット削除
    $(document).on('click', 'a[data-element-kind=gadget_delete]', $scope.deleteGadget);

    //マイキャンバスやることリストプロジェクト選択
    $(document).on('change', '#todoProjectSelector', $scope.selectProject4Todo);

    //マイキャンバスディスカッションプロジェクト選択
    $(document).on('change', '#discussionProjectSelector', $scope.selectProject4Discussion);

    //分析ガジェット
    //利用データ選択
    $(document).on('change', 'input[name=targetDataRadio]', $scope.selectTargetData);

    //大項目選択
    $(document).on('change', '#largeItemSelector', $scope.selectCategoryField);

    //中項目選択
    $(document).on('change', '#middleItemSelector', $scope.selectCategoryField);

    //小項目選択
    $(document).on('change', '#smallItemSelector', $scope.selectCategoryField);

    //大項目期間選択
    $(document).on('change', '#largeCategoryPeriodSelector', $scope.selectCategoryPeriod);

    //中項目期間選択
    $(document).on('change', '#middleCategoryPeriodSelector', $scope.selectCategoryPeriod);

    //小項目期間選択
    $(document).on('change', '#smallCategoryPeriodSelector', $scope.selectCategoryPeriod);

    //集計方法選択
    $(document).on('change', 'label[name=aggregationMethodSelector] > select', $scope.selectAggregationMethod);

    //集計値選択
    $(document).on('change', '[name=aggregationFieldSelectorPane] select', $scope.selectAggregationField);

    //集計方法追加
    $(document).on('click', 'button[name=addAggregationMethodButton]', $scope.addAggregationMethod);

    //集計方法削除
    $(document).on('click', 'button[name=deleteAggregationMethodButton]', $scope.deleteAggregationMethod);

    //ソート区分選択
    $(document).on('change', '[name=sortDivSelector] > select', $scope.selectSortDiv);

    //オーダー区分選択
    $(document).on('change', '[name=orderDivSelector] > select', $scope.selectOrderDiv);

    //ソート区分追加
    $(document).on('click', 'button[name=addSortDivButton]', $scope.addSortDiv);

    //ソート区分削除
    $(document).on('click', 'button[name=deleteSortDivButton]', $scope.deleteSortDiv);

    //グラフ区分（自動集計）選択
    $(document).on('change', 'input:radio[name=graphTypeRadio_auto]', $scope.changeGraphTypeForGraph);

    //達成度グラフ：目標値
    $(document).on('change', '#targetValueText', $scope.createPreviewGraph)

    $("[rel=tooltip]").tooltip({container: 'body'});

    //条件
    values.list_options = {
      //OR条件追加
      afterAddOrCondition      : $scope.createPrevewGraph,
      //AND条件追加
      afterAddCondition        : $scope.createPrevewGraph,
      //OR条件削除
      afterDeleteCondition     : $scope.createPreviewGraph,
      //AND条件削除
      afterDeleteAllCondition  : $scope.createPreviewGraph,
      //項目選択変更
      afterItemSelectChange    : $scope.createPreviewGraph,
      //演算子選択
      afterOperatorSelectChange: $scope.createPreviewGraph,
      //項目値変更
      afterValueElementChange  : $scope.createPreviewGraph
    };
  };

  $scope.leadTour1 = function(){
    tourNavigation.hideBalloon('#tabNavigator', false);
    tourNavigation.animate(0, $scope.leadTour1ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_OUTLINE);
  };

  $scope.leadTour1ShowBalloon = function(){
    tourNavigation.showBalloon("#project_0",{
      tipSize: 24,
      //offsetY: -10,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（1/13）】＿概要</p><br/>'
                 + '<p style="font-size: 90%;">見込客や商談の情報を蓄積する事で、</p>'
                 + '<p style="font-size: 90%;">マイキャンバス上の様々なグラフで最新状況を把握できます。</p></div>'
                 + '<button id="finishToursLead1Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour2Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursLead1Button', function(){
      tourNavigation.hideBalloon('#project_0');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour2Button', $scope.leadTour2);
  };

  $scope.leadTour2 = function(){
    tourNavigation.hideBalloon('#project_0');
    tourNavigation.animate(0 , $scope.leadTour2ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_TOLEADBUTTON);
  };

  $scope.leadTour2ShowBalloon = function(){
    tourNavigation.showBalloon("li[data-original-title='見込客']", {
      tipSize: 24,
      offsetX: -100,
      offsetY: -60,
      position: "bottom right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（2/13）】＿見込客一覧画面へ</p><br/>'
                 + '<p style="font-size: 90%;">ではまず、見込客を一件登録してみましょう。</p>'
                 + '<p style="font-size: 90%;">上のメニューのハイライトされている見込客ボタンをクリックしてみてください。</p></div>'
                 + '<button id="finishToursLead2Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour2closeButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursLead2Button', function(){
      tourNavigation.hideBalloon("li[data-original-title='見込客']");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour2closeButton', function(){
      tourNavigation.hideBalloon("li[data-original-title='見込客']", false);
    });
  };

  $scope.leadTour8 = function(){
    //tourNavigation.hideBalloon('#project_0');
    tourNavigation.animate( 400 , $scope.leadTour8ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_CONFIRMGRAPH);
  };

  $scope.leadTour8ShowBalloon = function(){
    tourNavigation.showBalloon("#project_0", {
      tipSize: 24,
      //offsetY: -80,
      //position: "bottom right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（8/13）】＿グラフの確認</p><br/>'
                 + '<p style="font-size: 90%;">先ほど入力した見込客情報がグラフに反映されています。</p></div>'
                 + '<button id="finishToursLead8Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour9Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursLead8Button', function(){
      tourNavigation.hideBalloon("#project_0");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour9Button', $scope.leadTour9);
  };

  $scope.leadTour9 = function(){
    tourNavigation.hideBalloon('#project_0');
    tourNavigation.animate(0, $scope.leadTour9ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_TOLDTLBUTTON);
  };

  $scope.leadTour9ShowBalloon = function(){
    tourNavigation.showBalloon("li[data-original-title='見込客']", {
      tipSize: 24,
      //offsetY: -80,
      position: "bottom right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（9/13）】＿見込客一覧画面へ</p><br/>'
                 + '<p style="font-size: 90%;">次に、見込客に対して行った、活動履歴を入力してみましょう。</p></div>'
                 + '<button id="finishToursLead9Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour9closeButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursLead9Button', function(){
      tourNavigation.hideBalloon("li[data-original-title='見込客']");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour9closeButton', function(){
      tourNavigation.hideBalloon("li[data-original-title='見込客']", false);
    });
  };

  $scope.graphTour1 = function(){
    //tourNavigation.hideBalloon('#tabNavigator', false);
    tourNavigation.animate(0, $scope.graphTour1ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_OUTLINE);
  };

  $scope.graphTour1ShowBalloon = function(){
    tourNavigation.showBalloon("#project_0",{
      tipSize: 24,
      offsetY: 200,
      position: "",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（1/10）】＿概要</p><br/>'
                 + '<p style="font-size: 90%;">グラフを作成することで、プロジェクトメンバー間で視覚的に情報共有を行うことができ、</p>'
                 + '<p style="font-size: 90%;">営業活動に対して効果的に意識統一を図ることができます。</p><br />'
                 + '<p style="font-size: 90%;">例として、「見込客の獲得目標の進捗」を作成してみましょう。</p></div>'
                 + '<button id="finishToursGraph1Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour2Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursGraph1Button', function(){
      tourNavigation.hideBalloon('#project_0');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour2Button', $scope.graphTour2);
  };

  $scope.graphTour2 = function(){
    tourNavigation.hideBalloon('#project_0');
    tourNavigation.animate(0, $scope.graphTour2ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_CLICKBTN);
  };

  $scope.graphTour2ShowBalloon = function(){
    tourNavigation.showBalloon("#gadgetCreateButton",{
      tipSize: 24,
      //offsetY: -10,
      position: "left",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（2/10）】＿ガジェットの設定</p><br/>'
                 + '<p style="font-size: 90%;">ガジェット追加をクリック。</p></div>'
                 + '<button id="finishToursGraph2Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour2CloseButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursGraph2Button', function(){
      tourNavigation.hideBalloon('#gadgetCreateButton');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour2CloseButton', function(){
      tourNavigation.hideBalloon('#gadgetCreateButton', false);
    });
  };

  $scope.graphTour3 = function(){
    tourNavigation.hideBalloon('#gadgetCreateButton');
    tourNavigation.animate(0, $scope.graphTour3ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_GADGETNAME);
  };

  $scope.graphTour3ShowBalloon = function(){
    tourNavigation.showBalloon("#gadgetNameText",{
      tipSize: 24,
      //offsetY: -10,
      position: "buttom",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（3/10）】＿ガジェット名称の指定</p><br/>'
                 + '<p style="font-size: 90%;">ガジェット名称に、「見込客の獲得目標の進捗」と入力してください。</p>'
                 + '<p style="font-size: 90%;">入力したらこのメッセージの「次へ」をクリックしてください。次に進みます。</p></div>'
                 + '<button id="finishToursGraph3Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour4Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursGraph3Button', function(){
      tourNavigation.hideBalloon('#gadgetNameText');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour4Button', $scope.graphTour4);
  };

  $scope.graphTour4 = function(){
    tourNavigation.hideBalloon('#gadgetNameText');
    tourNavigation.animate(100, $scope.graphTour4ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_TYPEDATA);
  };

  $scope.graphTour4ShowBalloon = function(){
    tourNavigation.showBalloon("label:contains('ガジェットタイプ')",{
      tipSize: 24,
      //offsetY: -10,
      position: "bottom",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（4/10）】＿ガジェットタイプと利用データ</p><br/>'
                 + '<p style="font-size: 90%;">ガジェットタイプと利用データは選択してあるもので、OKです。</p></div>'
                 + '<button id="finishToursGraph4Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour5Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $("label:contains('利用データ')").css('box-shadow', '0px 0px 5px 5px rgba(255,128,0,0.8)');
    $(document).on('click', '#finishToursGraph4Button', function(){
      tourNavigation.hideBalloon("label:contains('ガジェットタイプ')");
      $("label:contains('利用データ')").css('box-shadow', '');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour5Button', $scope.graphTour5);
  };

  $scope.graphTour5 = function(){
    tourNavigation.hideBalloon("label:contains('ガジェットタイプ')");
    $("label:contains('利用データ')").css('box-shadow', '');
    tourNavigation.animate(400, $scope.graphTour5ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_GRAPHTYPE);
  };

  $scope.graphTour5ShowBalloon = function(){
    $('label[for="graphDivAchievement_auto"]').click();
    tourNavigation.showBalloon('img[data-original-title="達成度グラフ"]',{
      tipSize: 24,
      offsetX: 600,
      offsetY: -50,
      position: "right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（5/10）】＿グラフタイプの選択</p><br/>'
                 + '<p style="font-size: 90%;">グラフタイプは、達成度タイプを選択しましょう。</p></div>'
                 + '<button id="finishToursGraph5Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour6Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursGraph5Button', function(){
      tourNavigation.hideBalloon('img[data-original-title="達成度グラフ"]');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour6Button', $scope.graphTour6);
  };

  $scope.graphTour6 = function(){
    tourNavigation.hideBalloon('img[data-original-title="達成度グラフ"]');
    tourNavigation.animate(400, $scope.graphTour6ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_GOALVALUE);
  };

  $scope.graphTour6ShowBalloon = function(){
    $('#targetValueText').focus();
    tourNavigation.showBalloon('label[name="aggregationMethodSelector"]',{
      tipSize: 24,
      offsetX: 100,
      offsetY: -230,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（6/10）】＿目標値の設定</p><br/>'
                 + '<p style="font-size: 90%;">集計方法は、レコード件数のままで、目標値に例として「100」と入力しましょう。</p>'
                 + '<p style="font-size: 90%;">入力したらこのメッセージの「次へ」をクリックしてください。次に進みます。</p></div>'
                 + '<button id="finishToursGraph6Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour7Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $("#targetValueText").css('box-shadow', '0px 0px 5px 5px rgba(255,128,0,0.8)');
    $(document).on('click', '#finishToursGraph6Button', function(){
      tourNavigation.hideBalloon('label[name="aggregationMethodSelector"]');
      $("#targetValueText").css('box-shadow', '');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour7Button', $scope.graphTour7);
  };

  $scope.graphTour7 = function(){
    tourNavigation.hideBalloon('label[name="aggregationMethodSelector"]');
    $("#targetValueText").css('box-shadow', '');
    tourNavigation.animate(400, $scope.graphTour7ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_PREVIEW);
  };

  $scope.graphTour7ShowBalloon = function(){
    tourNavigation.showBalloon('#previewGraph',{
      tipSize: 24,
      //offsetY: -10,
      position: "left",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（7/10）】＿プレビュー</p><br/>'
                 + '<p style="font-size: 90%;">見込客が登録されていれば、プレビューが確認できます。</p></div>'
                 + '<button id="finishToursGraph7Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour8Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursGraph7Button', function(){
      tourNavigation.hideBalloon('#previewGraph');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour8Button', $scope.graphTour8);
  };

  $scope.graphTour8 = function(){
    tourNavigation.hideBalloon('#previewGraph');
    tourNavigation.animate(600, $scope.graphTour8ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_FILTER);
  };

  $scope.graphTour8ShowBalloon = function(){
    tourNavigation.showBalloon('#conditionPane',{
      tipSize: 24,
      //offsetY: -10,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（8/10）】＿絞り込み条件</p><br/>'
                 + '<p style="font-size: 90%;">グラフの種類によって、絞り込み条件を使うことができます。</p></div>'
                 + '<button id="finishToursGraph8Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour9Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursGraph8Button', function(){
      tourNavigation.hideBalloon('#conditionPane');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour9Button', $scope.graphTour9);
  };

  $scope.graphTour9 = function(){
    tourNavigation.hideBalloon('#conditionPane');
    tourNavigation.animate(800, $scope.graphTour9ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_SAVE);
  };

  $scope.graphTour9ShowBalloon = function(){
    tourNavigation.showBalloon('#doCreateButton',{
      tipSize: 24,
      //offsetY: -10,
      position: "left",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（9/10）】＿保存</p><br/>'
                 + '<p style="font-size: 90%;">「保存」をクリックして作成したグラフを確認してみましょう。</p></div>'
                 + '<button id="finishToursGraph9Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="graphTour9CloseButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursGraph9Button', function(){
      tourNavigation.hideBalloon('#doCreateButton');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#graphTour9CloseButton', function(){
      tourNavigation.hideBalloon('#doCreateButton', false);
    });
  };

  $scope.graphTour10 = function(){
    //tourNavigation.hideBalloon('#conditionPane');
    tourNavigation.animate(200, $scope.graphTour10ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_TOURFINISH);
  };

  $scope.graphTour10ShowBalloon = function(){
    tourNavigation.showBalloon('#project_0',{
      tipSize: 24,
      //offsetY: -10,
      //position: "left",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【グラフの作成（10/10）】＿グラフ作成完了</p><br/>'
                 + '<p style="font-size: 90%;">グラフが作成されたことが確認できます。</p></div>'
                 + '<button id="graphTour10CloseButton" type="button" class="common-button" style="float: right;height: 20px;">終了</button>'
    });
    $(document).on('click', '#graphTour10CloseButton', function(){
      tourNavigation.hideBalloon('#project_0');
    });
  };

  $scope.showGadgetDialogEx = function(){

    $scope.gadget_mode = $scope.GADGET_MODE_CREATE;

    $scope.showGadgetDialog({ gadget_div: 11, graph_type_div: 1, data_type_div: $scope.DT_PROSPECT, target_data_name: 'prospects'});

    if (tourNavigation != null){
      if (tourNavigation.currentTour.id != tourNavigation.TOUR_GRAPH){
        return;
      }
      if (tourNavigation.currentTour.id == tourNavigation.TOUR_GRAPH){
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_CLICKBTN){
          $scope.graphTour3();
          return;
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_GADGETNAME){
          $scope.graphTour4();
          return;
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_TYPEDATA){
          $scope.graphTour5();
          return;
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_GRAPHTYPE){
          $scope.graphTour6();
          return;
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_GOALVALUE){
          $scope.graphTour7();
          return;
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_PREVIEW){
          $scope.graphTour8();
          return;
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_FILTER){
          $scope.graphTour9();
          return;
        }
      }
    }
  };

  //マイキャンバスやることリストプロジェクト選択
  $scope.selectProject4Todo = function(){

    $scope.showTodoInputPane();
  };

  //マイキャンバスディスカッションプロジェクト選択
  $scope.selectProject4Discussion = function(){

    var project_id = $(this).val();

    $scope.showDiscussionInputPane();
  };

  //タブの選択
  $scope.selectTab = function(){

    $scope.selected_project_id = $(this).data('project-id');
//$scope.selected_project_id = $stateParams.project_id;

    $scope.readGadgets();
  };

  //ガジェットの読み込み
  $scope.readGadgets = function(callback){

    var $section = $scope.getProjectGadgetSection(),
        param    = null;

    $scope.getLoader('section').appendTo($section);

    if ($scope.isMyCanvas()){
      param = {project_id: $scope.selected_project_id, my_canvas_div: 1};
    }else{
      param = {project_id: $scope.selected_project_id, my_canvas_div: 0};
    }

    //ガジェット情報の取得
    $.post(
      '/canvas/php/gadget_read.php',
      param,
      function(data){
        $scope.removeLoader('section');

        if (data.has_error){
          common.showError(data.message);
          return;
        }
        if (data && data.value && data.value.list){
          $scope.showGadgets(data.value.list);
        }
        $scope.setupJarvisWidgets('widget-grid' + $scope.selected_project_id);
        if (typeof callback !== 'undefined'){
          setTimeout(function(){
            callback();
          }, 3000); //3秒後
        }
      }
    );
  };

  //ガジェット区分選択
  $scope.selectGadgetDiv = function(){

    var
      gadget_div = $(this).val();

    if (gadget_div == $scope.GD_GRAPH){
      //グラフ（自動集計）
      $scope.showGraphPane();
    }else if (gadget_div == $scope.GD_DATA_INPUT){
      //グラフ（手入力）
      $scope.showDataInputPane();
    }else if (gadget_div == $scope.GD_TODO_LIST){
      //やることリスト
      if ($scope.isMyCanvas()){
        $scope.setupTodoProjectSelector();
      }else{
        $scope.showTodoInputPane();
      }
    }else if (gadget_div == $scope.GD_DISCUSSION){
      //ディスカッション
      if ($scope.isMyCanvas()){
        $scope.setupDiscussionProjectSelector();
      }else{
        $scope.showDiscussionInputPane();
      }
    }else if (gadget_div == $scope.GD_TEXT_AND_IMAGE){
      //テキスト画像挿入
      $scope.showTextAndImageInputPane();
    }else{
      console.log('ガジェットタイプが不正です');
      return;
    }
  };

  //グラフ区分選択
  $scope.selectGraphDiv = function(){

    var
      graph_div            = $(this).val(),
      $target_pane         = $('#targetPane'),
      $data_div_pane       = $('#dataDivPane'),
      $data_div_pane_for_graph = $('#dataDivPane4Graph'),
      $achievement_pane    = $('#achievementPane'),
      $dataDirectInputPane = $('#dataDirectInputPane'),
      $target_input        = $('input[data-is-target=true]');

    $data_div_pane.show();
    $data_div_pane_for_graph.show();
    $target_pane.show();
    $achievement_pane.hide();
    $target_input.removeAttr('disabled');
    $target_input.css('background', '#ffffff');
    $dataDirectInputPane.show();

    if (graph_div == $scope.GTD_LINE_CHART){
      //折れ線グラフ
      $target_pane.hide();
      $target_input.prop('disabled', 'disabled');
      $target_input.css('background', '#eeeeee');
    }else if (graph_div == $scope.GTD_ACHIEVEMENT){
      //達成度グラフ
      $target_pane.hide();
      $data_div_pane.hide();
      $data_div_pane_for_graph.hide();
      $dataDirectInputPane.hide();
      $achievement_pane.show();
    }

  };

  //データ区分選択
  $scope.selectDataDiv = function(){

    var data_type_div = $(this).val();

    if (data_type_div == 1){
      //データ一覧のデータを選択する
      $('#dataInputSubPane').hide();
      $scope.showDataSelectPane();
    }else{
      //この場で入力する
      var $dataSelectPane   = $('#dataSelectPane'),
          $dataInputSubPane = $('#dataInputSubPane');

      $dataInputSubPane.show();

      $dataSelectPane.empty();

      $dataSelectPane.hide();
    }
  };

  //データ一覧データ選択
  $scope.selectData = function(){

    var data_id   = $(this).data('data-id'),
        data_name = $(this).data('data-name'),
        $data_id_hidden = $('#dataIdHidden'),
        $data_name_text = $('#dataNameText');

    $data_id_hidden.val(data_id);
    $data_name_text.val(data_name);
  };

  //ガジェットの編集
  $scope.updateGadget = function(){

    var gadget_id = $(this).data('gadget-id');

    $scope.gadget_mode = $scope.GADGET_MODE_UPDATE;

    $.post(
      '/canvas/php/gadget_read_single.php',
      {gadget_id: gadget_id},
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        $scope.showGadgetDialog(data.value);
      }
    );
  };


  //ガジェットの削除
  $scope.deleteGadget = function(){

    var gadget_id = $(this).data('gadget-id');

    if (!confirm('ガジェットを削除します。よろしいですか？')){
      return;
    }

    $.post(
      '/canvas/php/gadget_delete.php',
      {gadget_id: gadget_id},
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        $scope.removeGadgetElement(gadget_id);
        common.showInfo('ガジェットを削除しました');
      }
    );
  };

  //ガジェット要素の削除
  $scope.removeGadgetElement = function(gadget_id){
    var element_id = 'wid-id-' + gadget_id;

    $('#' + element_id).remove();
  };

  //ディスカッションコメント画像の削除
  $scope.deleteDiscussionCommentImage = function(){

    var file_name = $(this).data('file-name'),
        image_div = $('#imageDiv'),
        children  = image_div.children(),
        file_list = $scope.attachment_file_list;

    if (file_name){
      //HTMLの表示から削除
      $.each(children, function(i, v){
        var span = $(v).find('span').html();
        if (span == file_name){
          $(v).remove();
          return;
        }
        var img = $(v).find('img');
        if ($(img).attr('alt') == file_name){
          $(v).remove();
          return;
        }
      });
      //内部リストから削除
      $.each(file_list, function(i, v){
        if (v['file_name'] == file_name){
          file_list.splice(i, 1);
        }
      });
      //サーバーサイドのファイルを削除する
      $.post(
        '/fileupload/php/upload_file_delete.php',
        {file_name: file_name},
        function(data){
          if (data.has_error){
            //alert(data.message);
            common.showError(data.message);
            return;
          }
          common.showInfo('削除処理が完了しました');
        }
      );
    }
  };

  $scope.clickTextAndImageDivRadio = function(){
    var text_and_image_div = $(this).val(),
        $text_pane         = $('#tiTextPane'),
        $image_pane        = $('#tiImagePane');

    if (text_and_image_div == 1){
      //テキスト
      $text_pane.show();
      $image_pane.hide();
    }else if (text_and_image_div == 2){
      //画像
      $text_pane.hide();
      $image_pane.show();
    }
  };

  $scope.closeDiscussionCommentDialog = function(){

    var $dialog       = $('#discussion_comment_dialog'),
        discussion_id = $(this).data('discussion-id'),
        commet_key    = $scope.current_commet_key;

    $scope.current_commet_key = null;

    //コメット停止信号を送る
    $.post(
      '/discussion/php/discussion_commet_create.php',
      {discussion_id: discussion_id, commet_key: commet_key},
      function(data){
        if (data.has_error){
          common.showError('コメットの停止に失敗しました');
          return;
        }
        $dialog.dialog('close');
      }
    );
  };

  //ディスカッションスマイル
  $scope.clickDiscussionSmileLink = function(){
    var discussion_id         = $(this).data('discussion-id'),
        param                 = {discussion_id: discussion_id},
        $discussion_smile_num = $(this).parent().find('[data-element-kind=discussion_smile_num]');

    $.post(
      '/discussion/php/discussion_smile_create.php',
      param,
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        $discussion_smile_num.html(data.value);
      }
    );

  };

  //ディスカッションコメントスマイル
  $scope.clickDiscussionCommentSmileLink = function(){

    var discussion_id                 = $(this).data('discussion-id'),
        discussion_comment_id         = $(this).data('discussion-comment-id'),
        param                         = {discussion_id: discussion_id, discussion_comment_id: discussion_comment_id},
        $discussion_comment_smile_num = $(this).parent().find('[data-element-kind=discussion_comment_smile_num]');

    $.post(
      '/discussion_comment/php/discussion_comment_smile_create.php',
      param,
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        $discussion_comment_smile_num.html(data.value);
      }
    );

  };

  $scope.clickDiscussionCommentLink = function(){

    var project_id                 = $(this).data('project-id'),
        discussion_id              = $(this).data('discussion-id'),
        title                      = $(this).data('title'),
        $discussion_comment_dialog = $('#discussion_comment_dialog'),
        html_str = null;

    if ($discussion_comment_dialog.size() > 0){
      $discussion_comment_dialog.remove();
    }

    html_str = '<div id="discussion_comment_dialog" title="' + title + '">'
             +   '<div id="previousDiscussionCommentDiv" class="row" style="margin: 10px 0;">'
             +     '<div class="col-md-10">'
             +       '<a id="previousDiscussionCommentLink" data-project-id="' + project_id + '" data-discussion-id="' + discussion_id + '" '
             +         ' href="javascript:void(0)">過去のコメントを表示する</a>'
             +     '</div>'
             +   '</div>'
             +   '<table id="discussionCommentListTable"></table>'
             +   '<div>'
             +   '<form class="smart-form">'
             +     '<fieldset>'
             +       '<label class="label">コメント</label>'
             +       '<label class="textarea"> <i class="icon-append fa fa-comment"></i>'
             +       '<textarea rows="10" name="comment" id="commentTextarea"></textarea> </label>'
             +       '<div id="imageDiv"></div>'
             +     '</fieldset>'
             +     '<fieldset>'
             +       '<label class="label">アラートメールの宛先</label>'
             +       '<div class="inline-group">'
             +         '<label class="radio">'
             +           '<input type="radio" id="alertMailAllRadio" checked="checked" data-project-id="' + project_id + '" name="alert_mail_div" value="1" />'
             +           '<i></i>プロジェクト全員'
             +         '</label>'
             +         '<label class="radio">'
             +           '<input type="radio" id="alertMailSelectRadio"  data-project-id="' + project_id + '" name="alert_mail_div" value="2" />'
             +           '<i></i>アラートメールの宛先ユーザーを選択する'
             +         '</label>'
             +       '</div>'
             +     '</fieldset>'
             +     '<fieldset style="padding: 15px 0 10px 15px; border: none;">'
             +       '<div id="memberSelectDiv"></div>'
             +     '</fieldset>'
             +     '<fieldset>'
             +       '<label class="label">やることリスト</label>'
             +       '<label class="checkbox">'
             +         '<input type="checkbox" id="todoDivCheck" name="todo_div" value="1" data-project-id="' + project_id + '"/>'
             +         '<i></i>このコメントをやることリストにも登録する'
             +       '</label>'
             +     '</fieldset>'
             +     '<fieldset style="padding: 15px 0 10px 15px; border: none;">'
             +       '<div id="todoSettingsDiv"></div>'
             +     '</fieldset>'
             +     '<footer style="background-color: white;">'
             +     '<button id="discussionCommentSaveButton" data-project-id="' + project_id + '" data-discussion-id="' + discussion_id + '" '
             +       ' class="primary-button" type="button" style="float: right; margin-left: 10px;">コメントする</button>'
             +     '<span class="create_button fileinput-button" style="float: right; padding: 4px 6px 4px 25px;">'
             +       '<i class="glyphicon glyphicon-plus"></i>'
             +       '<span id="fileUploadButtonCaption">ファイルアップロード</span>'
             +       '<input type="file" data-url="/fileupload/php/upload_file_save.php" id="fileupload" name="upload_file">'
             +     '</span>'
             +     '</footer>'
             +   '</form>'
             +   '</div>'
             +   '<footer style="float: right;"><button id="discussionCommentDialogCloseButton" data-discussion-id="' + discussion_id
             + '" type="button" class="common-button">閉じる</button></footer>';
             + '</div>'

    $(html_str).appendTo($('body'));

    $scope.setupFileuploadButton();

    $discussion_comment_dialog = $('#discussion_comment_dialog');

    $.post(
      '/discussion_comment/php/discussion_comment_read.php',
      {project_id: project_id, discussion_id: discussion_id},
      function(data){
        var last_commented_at = null;

        if(data.has_error){
          common.showError(data.message);
          return;
        }

        $.each(data.value.list, function(i, v){
          var discussion_comment_id = v['discussion_comment_id'],
              comment               = v['comment'],
              user_name             = v['last_name'] + v['first_name'],
              user_image            = v['user_image'],
              smile_num             = v['smile_num'],
              commented_on          = v['commented_on'],
              todo_div              = v['todo_div'],
              list_element_id       = 'discussion_comment_' + discussion_comment_id;

          $scope.addComment(project_id, discussion_id, user_image, user_name, comment, smile_num, commented_on, discussion_comment_id, todo_div);
          last_commented_at = commented_on;
        });

        $discussion_comment_dialog.dialog({
          modal: true,
          width: 900
        });

        $scope.getDiscussionCommentCount(project_id, discussion_id); //トータル件数の取得

        //Cometで更新データを取得
        $scope.getUpdatedData(project_id, discussion_id, last_commented_at);
      }
    );

  };

  //ディスカッションコメント保存
  $scope.saveDiscussionComment = function(){

    var discussion_id       = $(this).data('discussion-id'),
        commentTextArea     = $('#commentTextarea'),
        comment             = commentTextArea.val(),
        project_id          = $(this).data('project-id'),
        alert_mail_div      = $('input[name=alert_mail_div]:checked').val(),
        todo_div            = $('#todoDivCheck').prop('checked') == true ? 1 : 0,
        todo_info           = {},
        param               = {project_id: project_id, discussion_id: discussion_id, comment: comment, alert_mail_div: alert_mail_div, todo_div: todo_div},
        alert_mail_user_ids = null;

    if (alert_mail_div == 2){
      //アラートメール宛先選択の場合
      alert_mail_user_ids = $scope.getAlertMailUserIds();
      param['alert_mail_user_ids'] = alert_mail_user_ids;
    }

    if (todo_div == 1){
      //やることリストに登録する
      todo_info.todo_group_id = $('#todoGroupSelect').val();
      todo_info.user_id       = $('#todoUserSelect').val();
      todo_info.deadline_at   = $('#deadlineAt').val();
      var no_time_limit = $('#noTimeLimitCheck').prop('checked') == true ? 1 : 0;
      if (no_time_limit){
        delete todo_info.deadline_at;
      }
      param.todo_info = todo_info;
    }

    //添付ファイル
    if ($scope.attachment_file_list.length > 0){
      param['attachment_files'] = $scope.attachment_file_list;
    }

    $.post(
      '/discussion_comment/php/discussion_comment_create.php',
      param,
      function(data){
        var user_image   = '',
            user_name    = '',
            commented_on = '',
            discussion_comment_id = '';

        if (data.has_error){
          common.showError(data.message);
          return;
        }

        common.showInfo('追加処理が完了しました');
        commentTextArea.val('');
        $scope.attachment_file_list = []; //添付ファイルリストクリア
        $('#imageDiv').empty();         //添付ファイル表示クリア
        var $radio = $('#alertMailAllRadio');
        $radio.prop('checked', true);
        $('#memberSelectDiv').empty();
        $('input[name=todo_div]').val([0]);
        $('#todoSettingsDiv').empty();
      }
    );
  };

  $scope.getAlertMailUserIds = function(){

    var user_ids = [],
        $checks  = $('input[name=alert_mail_user_check]:checked');

    if ($checks.size() == 0){
      return [];
    }

    $.each($checks, function(index, check){
      var user_id = $(check).val();
      user_ids.push(user_id);
    });

    return user_ids;
  };

  $scope.checkNoTimeLimit = function(){

    var checked     = $(this).prop('checked'),
        $deadlineAt = $('#deadlineAt');

    if (checked){
      $deadlineAt.parent().addClass('state-disabled');
      $deadlineAt.attr('disabled', true);
    }else{
      $deadlineAt.parent().removeClass('state-disabled');
      $deadlineAt.attr('disabled', false);
    }
  };

  $scope.changeAlertMailDiv = function(){

    var alert_mail_div = $(this).val(),
        project_id     = $(this).data('project-id');

    if (alert_mail_div == 1){
      //プロジェクト全メンバー
      $('#memberSelectDiv').empty();
    }else if (alert_mail_div == 2){
      //選択したメンバー
      $scope.showAlertMailDiv(project_id);
    }else{
      common.showError('アラートメール区分が不正です');
      return;
    }
  };

  //アラートメール部を表示する
  $scope.showAlertMailDiv = function(project_id){

    var $member_select_div = $('#memberSelectDiv');

    $member_select_div.empty();

    $.post(
      '/user/php/project_user_read.php',
      {project_id: project_id},
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        var project_users = data.value.list,
            html_str      = '<label class="label">メールを送るユーザーを選択する</label>'
                          + '<label class="inline-group">';

        $.each(project_users, function(index, project_user){
          var user_id    = project_user['user_id'],
              user_name  = project_user['last_name'] + project_user['first_name'],
              user_image = project_user['user_image'],
              element_id = 'alertMailCheck_' + user_id;

          html_str += '<label class="checkbox">'
                   +    '<input type="checkbox" id="' + element_id + '" name="alert_mail_user_check" value="' + user_id + '" checked="checked" />&nbsp;'
                   +    '<i></i>' + user_name
                   +  '</label>&nbsp;&nbsp;&nbsp;';
        });

        html_str += '</label>';

        $(html_str).appendTo($member_select_div);
      }
    );
  };

  $scope.changeTodoDiv = function(){

    var $check     = $(this),
        project_id = $check.data('project-id'),
        todo_div   = 0;

    if ($check.size() > 0){
     todo_div = $check.prop('checked') == true ? 1 : 0;
    }

    if (todo_div == 0){
      $('#todoSettingsDiv').empty();
    }else if (todo_div == 1){
      //やることリストに登録する
      $scope.showTodoSettingsDiv(project_id);
    }else{
      common.showError('やること区分が不正です');
      return;
    }
  };

  //やること設定部を表示する
  $scope.showTodoSettingsDiv = function(project_id){

    var $todo_settings_div = $('#todoSettingsDiv');

    $todo_settings_div.empty();

    $.post(
      '/user/php/project_user_read.php',
      {project_id: project_id},
      function(data){

        if (data.has_error){
          common.showError(data.message);
          return;
        }

        var project_users = data.value.list,
            html_str      = '<label class="label">やることリスト</label>'
                          + '<label class="select">'
                          +   '<select id="todoGroupSelect"><option value="0">未分類</option></select>'
                          + '</label>'
                          + '<label class="label">担当者</label>'
                          + '<label class="select">'
                          +   '<select id="todoUserSelect">'
                          +     '<option value="0">未選択</option>';

        $.each(project_users, function(index, project_user){
          var user_id    = project_user['user_id'],
              user_name  = project_user['last_name'] + project_user['first_name'],
              user_image = project_user['user_image'],
              element_id = 'alertMailCheck_' + user_id;

          html_str += '<option value="' + user_id + '">' + user_name +  '</option>';
        });

        html_str += '</select></label>';

        html_str += '<label class="label">期限</label>' +
          '<label class="input"> <i class="icon-append fa fa-calendar"></i>' +
          '<input id="deadlineAt" type="text" name="request" placeholder="" class="" data-dateformat="yy/mm/dd">' +
          '</label>' +
          '<label class="input">' +
            '<label class="checkbox"><input type="checkbox" id="noTimeLimitCheck"><i></i>期限無し</label>' +
          '</label>';

        $(html_str).appendTo($todo_settings_div);

        $scope.getTodoGroupList(project_id);

        $('#deadlineAt').datepicker(common.datepicker_settings);
      }
    );
  };

  $scope.getTodoGroupList = function(project_id){
    $.post(
      '/todo/php/todo_group_read.php',
      {project_id: project_id},
      function(data){

        if (data.has_error){
          common.showError(data.message);
          return;
        }

        var todo_group_list    = data.value.list,
            $todo_group_select = $('#todoGroupSelect'),
            html_str           = '';

        $.each(todo_group_list, function(index, todo_group){

          var todo_group_id   = todo_group['todo_group_id'],
              todo_group_name = todo_group['todo_group_name'];

          html_str += '<option value="' + todo_group_id + '">' + todo_group_name + '</option>';
        });

        $(html_str).appendTo($todo_group_select);
      }
    );
  };

  $scope.getLoader = function(id){
    return $('<div id="imageLoader_' + id + '"><img src="/common/images/loader.gif" alt="" /></div>');
  };

  $scope.removeLoader = function(id){
    $('#imageLoader_' + id).remove();
  };

  //ファイルアップロードボタンの準備
  $scope.setupFileuploadButton = function(options){
    $scope.attachment_file_list = []; //初期化

    if (!options){
      options = {is_multiple: true};
    }

    $('#fileupload').fileupload({
      dataType: 'json',
      add     : function (e, data) {
        var imageDiv = $('#imageDiv');

        if (options && options.is_multiple === false){
          imageDiv.empty();
        }

        $scope.getLoader('fileupload').appendTo(imageDiv);

        $('#fileUploadButtonCaption').html('アップロード中');
        data.submit();
      },
      done    : function (e, data) {
        var imageDiv = $('#imageDiv');

        //$('#imageLoader').remove();
        $scope.removeLoader('fileupload');

        $.each(data.result.files, function (index, file) {
          var error     = file.error,
              html_str  = '',
              image_div = 0;
          if (error){
            common.showError(error);
            return;
          }
          if (file.is_image){
            image_div = 1;
          }
          $scope.attachment_file_list.push({file_name: file.name, file_path: file.url, image_div: image_div});
          html_str += '<div>';
          if (file.is_image){
            html_str += '<img src="' + file.url + '" alt="' + file.name + '" width="850" />';
          }else{
            html_str += '<span>' + file.name + '</span>';
          }
          if (options && options.is_multiple === true){
            html_str += '&nbsp;<button class="btn btn-xs btn-default" id="imageDeleteButton" type="button" data-button-type="file_delete" data-file-name="'
                     + file.name + '">削除</button>';
          }
          html_str += '</div>';
          $(html_str).appendTo(imageDiv);
        });

        $('#fileUploadButtonCaption').html('ファイルアップロード');
      },
      fail: function(e, data){
        console.log(data.jqXHR.responseText);
      }
    });
  };

  $scope.getDiscussionCommentCount = function(project_id, discussion_id){
    $.post(
      '/discussion_comment/php/discussion_comment_count.php',
      {project_id: project_id, discussion_id: discussion_id},
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        $scope.total_count = data.value;
        $scope.checkListCount();
      }
    );
  };

  $scope.checkListCount = function(){

    var
      total_count                   = $scope.total_count,
      list                          = null,
      list_count                    = 0,
      discussion_comment_list_table = $('#discussionCommentListTable'),
      previousDiscussionCommentDiv  = $('#previousDiscussionCommentDiv');

    if (!total_count){
      return;
    }

    list = $(discussion_comment_list_table).find('tr[data-element-name=discussion_comment]');

    if (list.size() == 0){
      previousDiscussionCommentDiv.hide();
      return;
    }

    list_count = list.length;

    if (total_count <= list_count){
      previousDiscussionCommentDiv.hide();
    }else{
      previousDiscussionCommentDiv.show();
    }
  };

  //コメント更新情報をCometで取得する
  $scope.getUpdatedData = function(project_id, discussion_id, last_commented_at){
    var commet_key = $scope.getCommetKeyString();

    $scope.current_commet_key = commet_key;

    $.post(
      '/discussion_comment/php/discussion_comment_get_updated.php',
      {project_id: project_id, discussion_id: discussion_id, last_commented_at: last_commented_at, commet_key: commet_key},
      function(data){
        var list = null,
            last_commented_at = null;
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        list = data.value.list;

        $.each(list, function(i, v){
          var user_name = v['last_name'] + v['first_name'];
          $scope.addComment(project_id, discussion_id, v['user_image'], user_name, v['comment'], v['smile_num'], v['commented_on'], v['discussion_comment_id'], v['todo_div']);
          last_commented_at = v['commented_on'];
        });

        //$scope.scrollBottom();

        if ($scope.current_commet_key){
          //再帰呼び出しで更新データを取得する
          $scope.getUpdatedData(project_id, discussion_id, last_commented_at);
        }
      }
    );
  };

  $scope.getCommetKeyString = function(){
    return common.getRandomString(100);
  };

  $scope.getPreviousDiscussionComment = function(){

     var discussion_comment_list_table = $('#discussionCommentListTable'),
         commented_on_list             = null,
         commented_on                  = null,
         project_id                    = $(this).data('project-id'),
         discussion_id                 = $(this).data('discussion-id');

     commented_on_list = discussion_comment_list_table.find('small[data-col-name=commented_on]');
     if (!commented_on_list || commented_on_list.length == 0){
       return;
     }
     commented_on = $(commented_on_list[0]).html();

     $.post(
       '/discussion_comment/php/discussion_comment_read.php',
       {project_id: project_id, discussion_id: discussion_id, commented_on: commented_on},
       function(data){
         var list = null;
         if (data.has_error){
           common.showError(data.message);
           return;
         }

         list = data.value.list;

         list.reverse();

         $.each(list, function(i, v){
           var comment = v['comment'];
           $scope.addComment(project_id, discussion_id, v['user_image'], v['last_name'] + v['first_name'], comment, v['smile_num'], v['commented_on'], v['discussion_comment_id'], v['todo_div'], {is_prepend: true});
         });
         $scope.checkListCount();
       }
     );
  };

  $scope.addComment = function(project_id, discussion_id, user_image, user_name, comment, smile_num, commented_on, discussion_comment_id, todo_div, options){

    var html_str                       = '',
        $discussion_comment_list_table = $('#discussionCommentListTable');

    if (comment){
      //スキームがある場合、リンクに変更する
      if (comment.indexOf('http:') > -1 || comment.indexOf('https:') > -1){
        comment = comment.replace(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)/g, '<a href="$1" target="_blank">$1</a>');
      }

      comment = comment.replace(/[\n\r]/g, '<br />');
    }

    if (!options){
      options = {is_prepend: false};
    }

    $scope.comment_count +=1;
    html_str += '<tr data-element-name="discussion_comment">';
    html_str += '<td class="col-md-1" style="vertical-align: top;">'
    html_str += '<img src="' + user_image + '" alt="" height="40" width="40" />&nbsp;</td><td><strong>' + user_name + '</strong><br />'; //+ '</td><tr>';
    html_str += '<span class="discussion_comment">' + comment + '</span>';
    html_str += '<div style="margin-bottom: 5px;">';
    html_str += '<a href="javascript:void(0)" data-element-kind="discussion_comment_smile_link" data-discussion-id="' + discussion_id + '" data-discussion-comment-id="' + discussion_comment_id + '">'
             +   '<img src="/common/images/smile.jpg">'
             +  '</a>&nbsp;'
             +  '<span class="badge bg-color-blueLight" data-element-kind="discussion_comment_smile_num" style="font-size: 85%;">' + smile_num + '</span>&nbsp;&nbsp;';
    html_str += '<small data-col-name="commented_on">' + commented_on + '</small>';
    if (todo_div == 1){
      //やることリスト登録済の場合
      html_str += '&nbsp;&nbsp;<span class="label bg-color-blue txt-color-white">やることリスト</span>';
    }
    html_str += '</div>';
    html_str += '<div id="file_list_' + discussion_comment_id + '"></div>';
    html_str += '</td>';
    html_str += '</tr>';

    if (options.is_prepend === true){
      $($discussion_comment_list_table).prepend($(html_str));
    }else{
      $(html_str).appendTo($discussion_comment_list_table);
    }

    $scope.getFileList(project_id, discussion_id, discussion_comment_id);
  };

  //コメント添付ファイルの取得
  $scope.getFileList = function(project_id, discussion_id, discussion_comment_id) {

    var file_list_element_id = 'file_list_' + discussion_comment_id,
        file_list_element    = $('#' + file_list_element_id);

    $.post(
      '/discussion_comment/php/discussion_comment_file_read.php',
      {project_id: project_id, discussion_id: discussion_id, discussion_comment_id: discussion_comment_id},
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        $.each(data.value.list, function(i, v){
          var element = null,
           image_obj  = new Image(),
           width      = 0;

          if (v['image_div'] == 1){

            image_obj.src = v['file_path'];

            element = '<img src="' + v['file_path'] + '" alt="' + v['file_name'] + '" ';

            if (image_obj.width > 780){
              //element += ' style="width: 780px;" ';
              element += ' width="780" ';
            }

            element  += ' />';
          }else{
            element = '<span><a href="' + v['file_path'] + '" target="_blank">' + v['file_name'] + '</a></span>';
          }
          $(element).appendTo($(file_list_element));
          //$scope.scrollBottom();
        });
      }
    );
  };

  $scope.closeGadgetDialog = function(cancelbool){
    if (typeof cancelbool == "undefined"){
      cancelbool = false;
    }

    var $gadgetDialog = $('#gadgetDialog');

    if ($gadgetDialog.size() > 0){
      $gadgetDialog.dialog('close');

      $scope.closeGadgetNavigation(cancelbool);
    }
  };

  $scope.closeGadgetNavigation = function(cancelbool){
    if (tourNavigation != null){
      if (tourNavigation.currentTour.id != tourNavigation.TOUR_GRAPH){
        return;
      }
      if (tourNavigation.currentTour.id == tourNavigation.TOUR_GRAPH){
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_GADGETNAME){
          tourNavigation.hideBalloon('#gadgetNameText');
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_TYPEDATA){
          tourNavigation.hideBalloon("label:contains('ガジェットタイプ')");
          $("label:contains('利用データ')").css('box-shadow', '');
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_GRAPHTYPE){
          tourNavigation.hideBalloon('img[data-original-title="達成度グラフ"]');
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_GOALVALUE){
          tourNavigation.hideBalloon('label[name="aggregationMethodSelector"]');
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_PREVIEW){
          tourNavigation.hideBalloon('#previewGraph');
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_FILTER){
          tourNavigation.hideBalloon('#conditionPane');
        }
        if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_SAVE){
          tourNavigation.hideBalloon('#doCreateButton');
        }
        var comparestone = tourNavigation.TOUR_GRAPH_FILTER;//最後まで行ってるってことは入力は全て完了しているとみなすのでTOUR_GRAPH_SAVEはいれない
        if (cancelbool){
          comparestone = tourNavigation.TOUR_GRAPH_SAVE;
        }
        if (tourNavigation.currentTour.stone >= tourNavigation.TOUR_GRAPH_GADGETNAME
             && tourNavigation.currentTour.stone <= comparestone){
          tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, tourNavigation.TOUR_GRAPH_CLICKBTN);
        }
      }
    }
  }

  $scope.showGadgets = function(gadgets){

    var
      $section = $scope.getProjectGadgetSection(),
      $main    = null;

    $section.remove();

    $main = $('#project_' + $scope.selected_project_id + ' #main .main_div');

    $('<section id="widget-grid' + $scope.selected_project_id + '"></section>').appendTo($main);

    $section = $scope.getProjectGadgetSection();

    $scope.getArticleElement().appendTo($section);

    $.each(gadgets, function(index, gadget){

      if ((index > 0 && ((index % 4) == 0))){
        $scope.getArticleElement().appendTo($section);
      }

      var $article = $section.find('article:last');

      $scope.createGadget(gadget, {parent: $article});
    });
  };

  $scope.getArticleElement  = function(){
    return $('<div class="row"><article class="col-xs-12 col-sm-12 col-md-12 col-lg-12"></article></div>');
  };

  //目標あるなし選択
  $scope.clickTargetSelector = function(){

    var parent    = $(this).parent(),
        buttons   = $(parent).find('button'),
        value     = $(this).val(),
        year      = $('#yearSelector').prop('value');

    if (!year){
      year = new Date().getFullYear();
    }

    $.each(buttons, function(i, v){
      $(this).removeClass('active');
    });

    //$(this).addClass('active'); //あえてコメントアウト

    $(parent).val(value); //値のセット
    //$scope.currentTargetDiv = value;

    $scope.setAbleToTargetInputElements(value);

  };

  //ガジェット情報の保存
  $scope.createGadgetEx = function(){

    var gadget_name = $('#gadgetNameText').val(),
        gadget_div  = $('input[name=gadgetTypeRadio]:checked').val(),
        graph_div   = $('input[name=graphTypeRadio]:checked').val(),
        data_div    = $('input[name=dataTypeRadio]:checked').val(),
        data_id     = 0,
        param       = {
          project_id       : $scope.selected_project_id,
          gadget_name      : gadget_name,
          gadget_div       : gadget_div,
          graph_div        : graph_div,
          data_div         : data_div,
          data_id          : data_id
        },
        todo_group_ids = null,
        checkboxes     = null,
        target         = null,
        result         = null,
        gadget_id      = $(this).data('gadget-id');

    if (!param.data_div){
      param.data_div = 0;
    }

    if ($scope.isMyCanvas()){
      param.my_canvas_div = 1;
    }else{
      param.my_canvas_div = 0;
    }

    if (gadget_div == $scope.GD_DATA_INPUT){
      //データ入力
      if (graph_div == 4){
        //達成度
        target = $('#targetText').val();
        result = $('#resultText').val();

        if (!target){
          alert('目標値を入力してください');
          return;
        }

        if (!result){
          alert('実績値を入力してください');
          return;
        }

        param.target = target;
        param.result = result;
      }else{
        //データ
        if (data_div == 1){
          //データ選択
          data_id = $('#dataIdHidden').val();
          param.report_id = data_id;
        }else if (data_div == 2){
          //データ入力
          var target_div      = null,
              data_arr        = [],
              input_table_arr = $('.input-table'),
              data_list       = [],
              data_name       = gadget_name;

          if (graph_div == 3){
            //折れ線グラフは目的無し
            target_div = 0;
          }else{
            target_div = $('#targetSelector .active').val(); // ? $('#targetSelector').val() : 1;
            //target_div = $scope.currentTargetDiv;
          }

          $.each(input_table_arr, function(i, v){
            var year         = $(v).data('year'),
                data_list_id = $(v).data('data-list-id'),
                obj          = {year: year},
                input_arr    = $(v).find('input'),
                has_data     = false;

            if ($scope.mode == $scope.MODE_UPDATE){
              obj.data_list_id = data_list_id;
            }

            $.each(input_arr, function(index, value){

              var is_target = $(value).data('is-target'),
                  month     = $(value).data('month'),
                  key       = null,
                  num       = null;

              if (month < 10 || month.length == 1){
                month = '0' + month.toString();
              }

              if (is_target){
                key = 'target' + month;
              }else{
                key = 'result' + month;
              }

              num = $(value).val();

              if (num){
                obj[key] = num;
                has_data = true;
              }

            });

            if (has_data){
              data_list.push(obj);
            }
          });
          //手入力データ→report_flexibles作成用
          var report_type_div = 2,
              report_name = gadget_name,
              report_folder_id = $scope.report_folders_ids[$('#report_folder_select').val()],
              target_collections = 'datas';
          param.data_info = {
            report_type_div    : report_type_div,
            report_name        : report_name,
            report_folder_id   : report_folder_id,
            target_collections : target_collections,
            target_div         : target_div,
            data_list          :data_list
          };

          if ($scope.gadget_mode == $scope.GADGET_MODE_UPDATE){
            data_id = $scope.currentDataId; //データ入力でも更新時はdata_idあり。
            param.report_id = data_id;
          }
        }
      }
    }else if (gadget_div == $scope.GD_TODO_LIST){
      //やることリスト
      checkboxes     = $('input[name=todo_group_check]:checked');
      todo_group_ids = [];
      $.each(checkboxes, function(i, v){
        todo_group_ids.push($(v).val());
      });

      if (todo_group_ids.length == 0){
        alert('やることリストを一つ以上選択してください');
        return;
      }

      if ($scope.isMyCanvas()){
        //マイキャンバスの場合、選択したプロジェクトIDを利用する
        param.project_id = $('#todoProjectSelector').val();
      }
      param.todo_group_ids = todo_group_ids;
    }else if (gadget_div == $scope.GD_DISCUSSION){
      //ディスカッション
      var discussion_div = $('input[name=discussionDivRadio]:checked').val();

      if (!discussion_div){
        alert('選択してください');
        return;
      }

      if ($scope.isMyCanvas()){
        //マイキャンバスの場合、選択したプロジェクトIDを利用する
        param.project_id = $('#discussionProjectSelector').val();
      }
      param.discussion_div = discussion_div;
    }else if (gadget_div == $scope.GD_TEXT_AND_IMAGE){
      //テキスト・画像
      var text_and_image_div = $('input[name=textAndImageDivRadio]:checked').val(),
          text               = $('#textTextarea').val(),
          $image             = $('#imageDiv img'),
          image_url          = null,
          url                = null;

      if (!text_and_image_div){
        alert('選択してください');
        return;
      }else if (text_and_image_div == 1){
        if (!text){
          alert('テキストを入力してください');
          return;
        }
      }else if (text_and_image_div == 2){
        //画像
        if ($image.size() == 0){
          alert('画像を選択してください');
          return;
        }
        image_url = $image.attr('src');
      }

      param.text_and_image_div = text_and_image_div;
      param.text      = text;
      param.image_url = image_url;
    }else if (gadget_div == $scope.GD_GRAPH){
      //グラフ（自動集計）
      param = $scope.createParameter4Graph(param);

      if (!param){
        console.log('パラメータの作成に失敗しました');
        return;
      }
    }

    if ($scope.gadget_mode == $scope.GADGET_MODE_CREATE){
      url = '/canvas/php/gadget_create.php';
    }else if ($scope.gadget_mode == $scope.GADGET_MODE_UPDATE){
      url             = '/canvas/php/gadget_update.php';
      param.gadget_id = gadget_id;
    }

    $.post(
      url,
      param,
      function(data){
        var $parent         = null,
            $project_canvas = null;

        if (data.has_error){
          common.showError(data.message);
          return;
        }

        $project_canvas = $scope.getProjectGadgetSection();

        $parent = $project_canvas.find('article:last');

        if ($scope.gadget_mode == $scope.GADGET_MODE_UPDATE){
          //更新時既に存在するガジェット要素を削除する
          $scope.removeGadgetElement(gadget_id);
        }

        $scope.closeGadgetDialog();

        //ガジェット読み込み
        $scope.readGadgets();
        if ($scope.gadget_mode == $scope.GADGET_MODE_CREATE){
          $scope.readGadgets(function(){$('#' + $scope.getProjectGadgetSection()[0].lastChild.lastChild.children[0].id)[0].scrollIntoView(true);})
        } else {
          $scope.readGadgets()
        }
        if (tourNavigation != null){
          if (tourNavigation.currentTour.id != tourNavigation.TOUR_GRAPH){
            return;
          }
          if (tourNavigation.currentTour.id == tourNavigation.TOUR_GRAPH){
            if (tourNavigation.currentTour.stone == tourNavigation.TOUR_GRAPH_SAVE){
              $scope.graphTour10();
              return;
            }
          }
        }
      }
    );
  };

  $scope.createParameter4Graph = function(param){

    var
      target_data_name                  = $('input:radio[name=targetDataRadio]:checked').val(),
      graph_type_div                    = $('input:radio[name=graphTypeRadio_auto]:checked').val(),
      large_category_name               = $('#largeItemSelector').val(),
      large_category_period_div         = $('#largeCategoryPeriodSelector').val(),
      middle_category_name              = $('#middleItemSelector').val(),
      middle_category_period_div        = $('#middleCategoryPeriodSelector').val(),
      small_category_name               = $('#smallItemSelector').val(),
      small_category_period_div         = $('#smallCategoryPeriodSelector').val(),
      aggregation_method_selector_panes = null,
      sort_div_selector_panes           = $('[name=sortDivSelectorPane]'),
      aggregation_method_list           = [],
      sort_div_list                     = [],
      result                            = listManager.getListConditions(),
      target_value                      = $('#targetValueText').val();

    //設定チェック
    //分類項目
    if (!large_category_name && (middle_category_name || small_category_name)){
      common.showError('大分類を設定してください');
      return null;
    }

    if (!middle_category_name && small_category_name){
      common.showError('中分類を設定してください');
      return;
    }

    if (graph_type_div == $scope.GTD_ACHIEVEMENT){
      aggregation_method_selector_panes = $('[name=aggregationMethodSelectorPane4Gauge]');
    }else{
      aggregation_method_selector_panes = $('[name=aggregationMethodSelectorPane]');
    }

    //リスト条件
    if (result){
      if (result.has_error === true){
        //common.showError(result.message);
        console.log(result.message);
        //return;
      }

      param.condition_list = result.list;
    }

    param.target_data_name           = target_data_name;
    param.graph_type_div             = graph_type_div;
    param.large_category_name        = large_category_name;
    param.large_category_period_div  = large_category_period_div;
    param.middle_category_name       = middle_category_name;
    param.middle_category_period_div = middle_category_period_div;
    param.small_category_name        = small_category_name;
    param.small_category_period_div  = small_category_period_div;
    param.target_value               = target_value;

    if ($scope.gadget_mode == $scope.GADGET_MODE_UPDATE){
      param.report_id = $scope.selectedReportId;
    }

    //集計方法
    $.each(aggregation_method_selector_panes, function(i, v){
      var
        $aggregation_method_selector = $(v).find('[name=aggregationMethodSelector] select'),
        aggregation_method_div       = $aggregation_method_selector.val(),
        $aggregation_field_selector  = $(v).find('[name=aggregationFieldSelectorPane] select'),
        aggregation_field            = null;

      if (aggregation_method_div > $scope.AM_RECORD_COUNT){
        aggregation_field = $aggregation_field_selector.val();
      }

      aggregation_method_list.push({aggregation_method_div: aggregation_method_div, aggregation_field: aggregation_field});
    });

    param.aggregation_method_list = aggregation_method_list;

    //ソート
    $.each(sort_div_selector_panes, function(i, v){
      var
        $sort_div_selector  = $(v).find('[name=sortDivSelector] select'),
        sort_div            = $sort_div_selector.val(),
        $order_div_selector = $(v).find('[name=orderDivSelectorPane] select'),
        order_div           = $order_div_selector.val();

      sort_div_list.push({sort_div: sort_div, order_div: order_div});
    });

    param.sort_div_list = sort_div_list;

    return param;
  };

  $scope.getProjectGadgetSection = function(){
    //return $('#project_' + $scope.selected_project_id + ' #widget-grid' + $scope.selected_project_id);
    return $('#widget-grid' + $scope.selected_project_id);
  };

  //ガジェットの表示
  $scope.createGadget = function(gadget, options){

    var
      gadget_div  = gadget.gadget_div,
      graph_div   = gadget.graph_div,
      data_div    = gadget.data_div,
      data_obj    = null,
      data_list   = null,
      gadget_html = null,
      chart_id    = null,
      $parent     = options.parent;

    gadget_html = $scope.createGadgetHtmlString(gadget);
    $(gadget_html).appendTo($parent);

    if (gadget_div == $scope.GD_DATA_INPUT){
      //グラフ（手入力）
      $scope.createChart(gadget);
    }else if (gadget_div == $scope.GD_TODO_LIST){
      //やることリスト
      $scope.createTodoGadget(gadget);
    }else if (gadget_div == $scope.GD_DISCUSSION){
      //ディスカッション
      $scope.createDiscussionGadget(gadget);
    }else if (gadget_div == $scope.GD_TEXT_AND_IMAGE){
      //画像・テキスト挿入
      $scope.createTextAndImageGadget(gadget);
    }else if (gadget_div == $scope.GD_GRAPH){
      //グラフ（自動集計）
      var
        organ_item_list = $scope.getOrganItemListFromCache(gadget.target_data_name);

      if (organ_item_list){
        $scope.createChart4Graph(gadget);
      }else{
        $http.post(
          '/organ_item/php/organ_item_read.php',
          {collection_name: gadget.target_data_name}
        ).success(function(data){
          if (data.has_error){
            common.showError(data.message);
            return;
          }

          $scope.setOrganItemListToCache(gadget.target_data_name, data.value.list);

          $scope.createChart4Graph(gadget);
        });
      }
    }else{
      console.log('ガジェット区分が不正です');
      return;
    }

  };

  $scope.getOrganItemListFromCache = function(collection_name){

    if (!collection_name){
      return null;
    }

    if (!$scope.organ_item_lists){
      return null;
    }

    return $scope.organ_item_lists[collection_name];
  };

  $scope.setOrganItemListToCache = function(collection_name, organ_item_list){

    if (!collection_name || !organ_item_list){
      return;
    }

    if (!$scope.organ_item_lists){
      $scope.organ_item_lists = {};
    }

    $scope.organ_item_lists[collection_name] = organ_item_list;
  };

  //グラフ（自動集計）用チャート生成
  $scope.createChart4Graph = function(gadget, options){

    var
      chart_id        = null,
      data_list       = null,
      graph_div       = gadget.graph_type_div,
      xAxis           = null,
      yAxis           = null,
      series          = null,
      chart_type      = null,
      category_list   = null,
      is_preview      = false,
      font_size       = '70%';

    if (options && options.is_preview === true){
      is_preview = true;
      font_size  = '85%';
    }

    data_list = gadget.data_list;

    if (graph_div == $scope.GTD_ACHIEVEMENT){
      //達成度
      if (is_preview === true){
        chart_id = '#previewGraph';
      }else{
        chart_id = '#gauge_' + gadget.gadget_id;
      }

      var
        result_value = $scope.getResultValue(gadget),
        value        = Math.floor(result_value / gadget.target_value * 100),
        gaugeOptions = {
          chart: {
            type: 'solidgauge'
          },
          title: null,
          pane: {
            center    : ['50%', '50%'],
            size      : '80%',
            startAngle: 0,
            endAngle  : 360,
            background: {
              backgroundColor: '#eee',
              innerRadius    : '60%',
              outerRadius    : '100%',
              shape          : 'arc'
            }
          },
          tooltip: {
//            enabled: false,
            formatter: function(){
              return '実績値：' + '<b>' + result_value + '</b>' + '<br>目標値：' + '<b>' + gadget.target_value + '</b>';
            }
          },
          yAxis: {
            stops: [
              [0.1, '#55BF3B'], //green
              [0.5, '#DDDF0D'], //yellow
              [0.9, '#DF5353']  //red
            ],
            lineWidth        : 0,
            tickInterval     : 25,
            tickPosition     : 'outside',
            tickColor        : '#ccc',
            tickWidth        : 1,
            tickLength       : 10,
            minorTickInterval: 5,
            minorTickPosition: 'outside',
            minorTickColor   : '#ccc',
            minorTickWidth   : 1,
            minorTickLength  : 10,
            title            : null,
            labels: {
              distance: 15
            },
            min: 0,
            max: 100
          },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                y          : 5,
                borderWidth: 0,
                useHTML    : true
              }
            }
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          series: [{
            name      : null,
            data      : [value],
            dataLabels: {
              format: '<div style="text-align: center; vertical-align: middle;">' +
                        '<span style="font-size: 20px; color: #000; ' +
                        //  ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') +
                        '">{y}%</span></div>',
              y: -20
            },
            tooltip: {
              valueSuffix: ' %'
            }
          }]
      };

      if (is_preview === true){
        $scope.removeLoader('preview');
      }else{

      }

      $(chart_id).highcharts(gaugeOptions);
    }else{

      if (is_preview === true){
        chart_id = '#previewGraph';
      }else{
        chart_id = '#chart_' + gadget.gadget_id;
      }

      xAxis = $scope.createXAxis(gadget, is_preview);

      category_list = xAxis.categories;

      if (!data_list || data_list.length == 0){
        //データが無い場合は終了
        return;
      }else if (graph_div == $scope.GTD_BAR_CHART){
        //縦棒グラフ
        chart_type = 'column';
      }else if (graph_div == $scope.GTD_HORIZONTAL_BAR_CHART){
        //横棒グラフ
        chart_type = 'bar';
      }else if (graph_div == $scope.GTD_LINE_CHART){
        //折れ線グラフ
        chart_type = 'line';
      }

      series = $scope.createSeries(gadget, category_list);

      if (is_preview === true){
        $scope.removeLoader('preview');
      }else{
      }

      $(chart_id).highcharts({
        chart: {
          type: chart_type
        },
        title: {
          text: ''
        },
        credits  : {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        xAxis: xAxis,
        yAxis: {
          title: {
            text: null
          },
          labels: {
            formatter: function(){
              return utils.addComma(this.value);
            },
            style: {
              fontSize: font_size //'70%'
            }
          },
          min: 0
        },
        legend: {
          enabled      : true,
          floating     : true,
          verticalAlign: 'top',
          align        : 'right',
          y            : -10,
          itemStyle        : {
            fontSize  : font_size, //'70%',
            fontWeight: 'normal'
          }
        },
        series: series
      });

      /*if (chart_type == 'bar'){
        //カテゴリー表示位置補正
        $(chart_id + ' text[text-anchor=end]').attr('x', '86');
      }*/

    }

  };

  $scope.getResultValue = function(gadget){

    var
      data_list = gadget.data_list;

    if (!data_list[0]){
      return 0;
    }

/*    if (!data_list[0][0]){
      return 0;
    }*/

    return data_list[0]['value'];
  };

  $scope.createSeries = function(gadget, category_list){

    var
      data_list               = gadget.data_list,
      series                  = [],
      aggregation_method_list = gadget.aggregation_method_list,
      collection_name         = gadget.target_data_name;

    $.each(aggregation_method_list, function(i, v){
      var
        aggregation_method_div = v['aggregation_method_div'],
        aggregation_field      = v['aggregation_field'],
        name                   = null,
        datas                  = [],
        item                   = null,
        display_name           = null;

      if (aggregation_method_div == $scope.AM_RECORD_COUNT){
        name = '件数';
      }else{
        var
          organ_item_list = $scope.getOrganItemListFromCache(gadget.target_data_name);

        item         = $scope.getItem(organ_item_list, aggregation_field);

        display_name = item['display_name'];

        if (aggregation_method_div == $scope.AM_TOTAL){
          name = '合計';
        }else if (aggregation_method_div == $scope.AM_AVERAGE){
          name = '平均';
        }else if (aggregation_method_div == $scope.AM_MAX){
          name = '最大値';
        }else if (aggregation_method_div == $scope.AM_MIN){
          name = '最小値';
        }
        name = name + '(' + display_name + ')';
      }

      var category_info = {
        large_category_name  : gadget.large_category_name,
        middle_category_name : gadget.middle_category_name,
        small_category_name  : gadget.small_category_name,
        large_category_value : null,
        middle_category_value: null,
        small_category_value : null
      };

      if (category_list){
        $.each(category_list, function(ii, category){

          var
            data_value        = null,
            sub_category_list = null,
            large_category_value = null;

          if (category['name']){

            large_category_value = category['name'];

            category_info.large_category_value = large_category_value;

            sub_category_list    = category.categories;

            $.each(sub_category_list, function(iii, sub_category){

              var
                sub_sub_category_list = null,
                middle_category_value = null;

              if (sub_category['name']){
                middle_category_value = sub_category['name'];

                category_info.middle_category_value = middle_category_value;

                sub_sub_category_list = sub_category.categories;

                $.each(sub_sub_category_list, function(iiii, sub_sub_category){

                  category_info.small_category_value = sub_sub_category;

                  data_value = $scope.getDataValue(collection_name, data_list, aggregation_method_div, aggregation_field, category_info);

                  datas.push(data_value);
                });

              }else{
                category_info.middle_category_value = sub_category;
                data_value = $scope.getDataValue(collection_name, data_list, aggregation_method_div, aggregation_field, category_info);
                datas.push(data_value);
              }
            });

          }else{
            category_info.large_category_value = category;
            data_value = $scope.getDataValue(collection_name, data_list, aggregation_method_div, aggregation_field, category_info);
            datas.push(data_value);
          }
        });

      }else{
        var data_value = $scope.getDataValue(collection_name, data_list, aggregation_method_div, aggregation_field, category_info);
        datas.push(data_value);
      }

      var object = {name: name, data: datas};

      if (i == 0){
        object.color = $chrt_second;
      }else if (i == 1){
        object.color = $chrt_fourth;
      }

      series.push(object);
    });

    return series;
  };

  $scope.getDataValue = function(collection_name, data_list, aggregation_method_div, aggregation_field, category_info){

    var
      data_value   = 0,
      large_name   = category_info.large_category_name,
      middle_name  = category_info.middle_category_name,
      small_name   = category_info.small_category_name,
      large_value  = category_info.large_category_value,
      middle_value = category_info.middle_category_value,
      small_value  = category_info.small_category_value,
      organ_item_list = $scope.getOrganItemListFromCache(collection_name);

    $.each(data_list, function(index, data){

      var
        data_large_value  = $scope.getText(organ_item_list, large_name, data[large_name]),
        data_middle_value = $scope.getText(organ_item_list, middle_name, data[middle_name]),
        data_small_value  = $scope.getText(organ_item_list, small_name, data[small_name]);

      if (((data['aggregation_method_div'] == aggregation_method_div) && (
        (aggregation_method_div == $scope.AM_RECORD_COUNT) || (data['aggregation_field'] == aggregation_field))) &&
        (
          (!large_name) ||
          (large_name && middle_name  && small_name  && data_large_value == large_value && data_middle_value == middle_value && data_small_value == small_value) ||
          (large_name && middle_name  && !small_name && data_large_value == large_value && data_middle_value == middle_value) ||
          (large_name && !middle_name && !small_name && data_large_value == large_value)
        )
      ){
        data_value = data['value'];
        //console.log(data_value);
      }
    });

    return data_value;
  };

  $scope.getItem = function(organ_item_list, field_name){
    var
      result = null;

    //$.each($scope.organ_item_list, function(i, v){
    $.each(organ_item_list, function(i, v){
      if (v['field_name'] == field_name){
        result = v;
        return;
      }
    });

    return result;
  };

  //X軸を作成する
  $scope.createXAxis = function(gadget, is_preview){

    var
      large_category_name   = gadget.large_category_name,
      middle_category_name  = gadget.middle_category_name,
      small_category_name   = gadget.small_category_name,
      large_category_value  = null,
      middle_category_value = null,
      small_category_value  = null,
      result                = {
        labels: {
          style: {
            fontSize: '70%'
          }
        },
        lineColor: 'none',
        lineWidth: 0
      },
      data_list             = gadget.data_list,
      small_categories      = [],
      middle_categories     = [],
      large_categories      = [],
      //value_categories      = [],
      organ_item_list       = $scope.getOrganItemListFromCache(gadget.target_data_name),
      sort_div_list         = gadget.sort_div_list,
      sort_by_value         = false,
      value_sort_order      = -1,
      value_sort_order_div  = 0,
      aggregation_method_list           = gadget.aggregation_method_list,
      value_sort_aggregation_method_div = null,
      value_sort_aggregation_field      = null;

    if (is_preview === true){
      result.labels.style.fontSize = '85%';
    }

    if (!large_category_name){
      result.categories = [data_list[0].value];
      return result;
    }

    if (sort_div_list){
      $.each(sort_div_list, function(i, sort){
        if (sort['sort_div'] == $scope.SD_AGGREGATION_VALUE){
          if (i <= 2){
            //値ソートは3番目以内
            sort_by_value        = true;
            value_sort_order     = i;
            value_sort_order_div = sort['order_div'];
          }
        }
      });

      //値ソートは以下の場合のみ可能
      //値ソートのみ：value_sort_order=0。以後のソートは無視する
      //大項目、中項目ががあり、大項目ソート後に値ソートする。value_sort_order=1。
      //大項目、中項目、小項目ががあり、中項目ソート後に値ソートする。value_sort_order=2。
      //原則として値ソートはもっとも小さい項目で行う。
      //以下値ソートの厳密な判定を行う。
      if (sort_by_value === true){

        if (!large_category_name){
          sort_by_value = false;
        }

        if (large_category_name && !middle_category_name && value_sort_order != 0){
          sort_by_value = false;
        }

        if (large_category_name && middle_category_name && !small_category_name && value_sort_order != 1){
          sort_by_value = false;
        }

        if (large_category_name && middle_category_name && small_category_name && value_sort_order != 2){
          sort_by_value = false;
        }
      }
    }

    if (sort_by_value === true){
      //値ソートがある場合
      //値ソートに利用する最初の集計項目を取得する
      value_sort_aggregation_method_div = aggregation_method_list[0].aggregation_method_div;
      value_sort_aggregation_field      = aggregation_method_list[0].aggregation_field;

      var
        old_large_category_value = null,
        large_category           = null;

      $.each(data_list, function(i, data){

        if (old_large_category_value == null){
          old_large_category_value = data[large_category_name];
          large_category           = {name: old_large_category_value};
        }

        if (!middle_category_name && value_sort_order == 0){
          if (data['aggregation_method_div'] == value_sort_aggregation_method_div && data['aggregation_field'] == value_sort_aggregation_field){

            large_category = {name: data[large_category_name], value: data['value']};
            if ($scope.inCategory(large_category.name, large_categories) === false){
              large_categories.push(large_category);
            }
          }
        }else{

          if (data[large_category_name] !== old_large_category_value || (i + 1) == data_list.length){

            var
              vs_middle_categories = $scope.createMiddleCategories({
                data_list                        : data_list,
                organ_item_list                  : organ_item_list,
                large_category_name              : large_category_name,
                middle_category_name             : middle_category_name,
                small_category_name              : small_category_name,
                old_large_category_value         : old_large_category_value,
                value_sort_aggregation_method_div: value_sort_aggregation_method_div,
                value_sort_aggregation_field     : value_sort_aggregation_field,
                value_sort_order_div             : value_sort_order_div,
                value_sort_order                 : value_sort_order
              });

            large_category.categories = vs_middle_categories;

            if ($scope.inCategory(large_category.name, large_categories) === false){
              large_categories.push(large_category);
             }
            old_large_category_value = data[large_category_name];
            large_category           = {name: old_large_category_value};
          }
        }
      });

      var
        vs_middle_categories = $scope.createMiddleCategories({
          data_list                        : data_list,
          organ_item_list                  : organ_item_list,
          large_category_name              : large_category_name,
          middle_category_name             : middle_category_name,
          small_category_name              : small_category_name,
          old_large_category_value         : old_large_category_value,
          value_sort_aggregation_method_div: value_sort_aggregation_method_div,
          value_sort_aggregation_field     : value_sort_aggregation_field,
          value_sort_order_div             : value_sort_order_div,
          value_sort_order                 : value_sort_order
        });

      if (vs_middle_categories){
        large_category.categories = vs_middle_categories;
        if ($scope.inCategory(large_category.name, large_categories) === false){
          large_categories.push(large_category);
        }
      }

      if (!middle_category_name && value_sort_order == 0){
        //大項目の値ソート
        if (value_sort_order_div == $scope.OD_ASC){
          large_categories.sort(function(a, b){
            if(a.value < b.value) return -1;
            if(a.value > b.value) return 1;
            return 0;
          });
        }else{
          large_categories.sort(function(a, b){
            if(a.value < b.value) return 1;
            if(a.value > b.value) return -1;
            return 0;
          });
        }
      }

      var
        new_large_categories = [];

      $.each(large_categories, function(i, data){

        var
          key  = data.name ? data.name: data,
          text = $scope.getText(organ_item_list, large_category_name, key);

        if (data.name && data.categories){
          data.name = text;
        }else{
          data = text;
        }

        new_large_categories.push(data);
      });

//console.log(new_large_categories);

      result.categories = new_large_categories;
    }else{
      //通常カテゴリリストの作成
      $.each(data_list, function(i, data){

        var
          value = null;

        small_categories  = $scope.pushCategory(small_categories, small_category_name, null, data[small_category_name]);
        middle_categories = $scope.pushCategory(middle_categories, middle_category_name, small_category_name, data[middle_category_name]);
        large_categories  = $scope.pushCategory(large_categories, large_category_name, middle_category_name, data[large_category_name]);
      });

      if (small_categories.length > 0 && middle_categories.length > 0){
        //小項目のソート
        var
          sort_by_small_category = false,
          order_div              = null;
        if (sort_div_list){
          $.each(sort_div_list, function(i, v){
            if (v['sort_div'] == $scope.SD_SMALL_CATEGORY){
              sort_by_small_category = true;
              order_div              = v['order_div'];
            }
          });
        }

        if(sort_by_small_category === true){
          if (order_div == $scope.OD_ASC){
            small_categories.sort(function(a, b){
              /*if (value_sort_order == 3){
                a = a.name;
                b = b.name;
              }*/
              if(a < b) return -1;
              if(a > b) return 1;
              return 0;
            });
          }else if(order_div == $scope.OD_DESC){
            small_categories.sort(function(a, b){
              /*if (value_sort_order == 3){
                a = a.name;
                b = b.name;
              }*/
              if(a < b) return 1;
              if(a > b) return -1;
              return 0;
            });
          }
        }

        var
          new_small_categories = [];

        $.each(small_categories, function(i, v){

          var
            value = $scope.getText(organ_item_list, small_category_name, v);

          new_small_categories.push(value);
        });

        small_categories = new_small_categories;

        $.each(middle_categories, function(i, v){
          v['categories'] = small_categories;
        });
      }

      if (middle_categories.length && large_categories.length > 0){
        //中項目のソート
        var
          sort_by_middle_category = false,
          order_div               = 0;

        if (sort_div_list){
          $.each(sort_div_list, function(i, v){
            if (v['sort_div'] == $scope.SD_MIDDLE_CATEGORY){
              sort_by_middle_category = true;
              order_div               = v['order_div'];
            }
          });
        }

        if(sort_by_middle_category === true){

          if (order_div == $scope.OD_ASC){
            middle_categories.sort(function(a, b){
              if(small_category_name){ // || value_sort_order == 2){
                a = a.name;
                b = b.name;
              }

              if(a < b) return -1;
              if(a > b) return 1;
              return 0;
            });
          }else if(order_div == $scope.OD_DESC){
            middle_categories.sort(function(a, b){
              if(small_category_name){ // || value_sort_order == 2){
                a = a.name;
                b = b.name;
              }

              if(a < b) return 1;
              if(a > b) return -1;
              return 0;
            });
          }
        }

        var
          new_middle_categories = [];

        $.each(middle_categories, function(i, v){
          var
            value = null;

          if(small_category_name){
            value = v['name'];
          }else{
            value = v;
          }

          value = $scope.getText(organ_item_list, middle_category_name, value);

          if (small_category_name){ // || value_sort_order == 2){
            v['name'] = value;
            new_middle_categories.push(v);
          }else{
            new_middle_categories.push(value);
          }
        });

        middle_categories = new_middle_categories;

        $.each(large_categories, function(i, v){
          v['categories'] = middle_categories;
        });
      }

      if (large_categories.length && large_categories.length > 0){
        //大項目のソート
        var
          sort_by_large_category = false,
          order_div              = 0;

        if (sort_div_list){
          $.each(sort_div_list, function(i, v){
            if (v['sort_div'] == $scope.SD_LARGE_CATEGORY){
              sort_by_large_category = true;
              order_div              = v['order_div'];
            }
          });
        }

        if(sort_by_large_category === true){

          if (order_div == $scope.OD_ASC){
            large_categories.sort(function(a, b){
              if(middle_category_name){ // || value_sort_order == 1){
                a = a.name;
                b = b.name;
              }

              if(a < b) return -1;
              if(a > b) return 1;
              return 0;
            });
          }else if(order_div == $scope.OD_DESC){
            large_categories.sort(function(a, b){
              if(middle_category_name){ // || value_sort_order == 1){
                a = a.name;
                b = b.name;
              }

              if(a < b) return 1;
              if(a > b) return -1;
              return 0;
            });
          }
        }

        var
          new_large_categories = [];

        $.each(large_categories, function(i, v){
          var
            value = null;

          if(middle_category_name){
            value = v['name'];
          }else{
            value = v;
          }

          value = $scope.getText(organ_item_list, large_category_name, value);

          if (middle_category_name){ // || value_sort_order == 1){
            v['name'] = value;
            new_large_categories.push(v);
          }else{
            new_large_categories.push(value);
          }
        });

        large_categories = new_large_categories;
      }

      result.categories = large_categories;
    }

    return result;
  };

  $scope.createMiddleCategories = function(options){

    var
      data_list                         = options.data_list,
      organ_item_list                   = options.organ_item_list,
      large_category_name               = options.large_category_name,
      middle_category_name              = options.middle_category_name,
      small_category_name               = options.small_category_name,
      old_large_category_value          = options.old_large_category_value,
      value_sort_aggregation_method_div = options.value_sort_aggregation_method_div,
      value_sort_aggregation_field      = options.value_sort_aggregation_field,
      value_sort_order_div              = options.value_sort_order_div,
      value_sort_order                  = options.value_sort_order;

    if (middle_category_name && !small_category_name && value_sort_order == 1){

      var
        vs_middle_categories = [];

      $.each(data_list, function(ii, data){

        if (data[large_category_name]      == old_large_category_value &&
            data['aggregation_method_div'] == value_sort_aggregation_method_div &&
            data['aggregation_field']      == value_sort_aggregation_field){

          vs_middle_categories.push({name: data[middle_category_name], value: data['value']});
        }

      });

      //値によるソートを実施する（中項目）
      if (value_sort_order_div == $scope.OD_ASC){
        vs_middle_categories.sort(function(a, b){
          if(a.value < b.value) return -1;
          if(a.value > b.value) return 1;
          return 0;
        });
      }else{
        vs_middle_categories.sort(function(a, b){
          if(a.value < b.value) return 1;
          if(a.value > b.value) return -1;
          return 0;
        });
      }

      var
        new_vs_middle_categories = [];

      $.each(vs_middle_categories, function(ii, data){

        var
          key  = data.name ? data.name : data,
          text = $scope.getText(organ_item_list, middle_category_name, key);

        new_vs_middle_categories.push(text);
      });

      return new_vs_middle_categories;
    }else if (middle_category_name && small_category_name && value_sort_order == 2){
      //小項目の値による並び替え
      var
        old_middle_category_value = null,
        middle_category           = null,
        vs_middle_categories      = [];

      $.each(data_list, function(ii, data){

        if (old_middle_category_value == null){
          old_middle_category_value = data[middle_category_name];
          middle_category           = {name: old_middle_category_value};
        }

        if (old_middle_category_value != data[middle_category_name] || (ii + 1) == data_list.length){

          var
            vs_small_categories = $scope.createSmallCategories({
              data_list                        : data_list,
              organ_item_list                  : organ_item_list,
              large_category_name              : large_category_name,
              middle_category_name             : middle_category_name,
              small_category_name              : small_category_name,
              old_large_category_value         : old_large_category_value,
              old_middle_category_value        : old_middle_category_value,
              value_sort_aggregation_method_div: value_sort_aggregation_method_div,
              value_sort_aggregation_field     : value_sort_aggregation_field,
              value_sort_order_div             : value_sort_order_div
            });

          if (vs_small_categories){
            middle_category.categories = vs_small_categories;
            if ($scope.inCategory(middle_category.name, vs_middle_categories) === false){
              vs_middle_categories.push(middle_category);
            }
          }

          old_middle_category_value = data[middle_category_name];
          middle_category           = {name: old_middle_category_value};
        }

      });

      if (middle_category_name && small_category_name && value_sort_order == 2){
        var
          vs_small_categories = $scope.createSmallCategories({
            data_list                        : data_list,
            organ_item_list                  : organ_item_list,
            large_category_name              : large_category_name,
            middle_category_name             : middle_category_name,
            small_category_name              : small_category_name,
            old_large_category_value         : old_large_category_value,
            old_middle_category_value        : old_middle_category_value,
            value_sort_aggregation_method_div: value_sort_aggregation_method_div,
            value_sort_aggregation_field     : value_sort_aggregation_field,
            value_sort_order_div             : value_sort_order_div
          });

        if (vs_small_categories){
          middle_category.categories = vs_small_categories;
          if ($scope.inCategory(middle_category.name, vs_middle_categories) === false){
            vs_middle_categories.push(middle_category);
          }
        }
      }

      var
        new_vs_middle_categories = [];

      $.each(vs_middle_categories, function(i, data){
        var
          key  = data.name ? data.name : data,
          text = $scope.getText(organ_item_list, middle_category_name, key);

        if (data.name){
          data.name = text;
        }else{
          data = text;
        }

        new_vs_middle_categories.push(data);
      });

      return new_vs_middle_categories;
    }else{
      return null;
    }
  };

  $scope.createSmallCategories = function(options){

    var
      data_list                         = options.data_list,
      organ_item_list                   = options.organ_item_list,
      large_category_name               = options.large_category_name,
      middle_category_name              = options.middle_category_name,
      small_category_name               = options.small_category_name,
      old_large_category_value          = options.old_large_category_value,
      old_middle_category_value         = options.old_middle_category_value,
      value_sort_aggregation_method_div = options.value_sort_aggregation_method_div,
      value_sort_aggregation_field      = options.value_sort_aggregation_field,
      value_sort_order_div              = options.value_sort_order_div,
      vs_small_categories               = [],
      new_vs_small_categories           = [];

    $.each(data_list, function(i, data){
      var
        name = null;
      if (data[large_category_name]      == old_large_category_value  &&
          data[middle_category_name]     == old_middle_category_value &&
          data['aggregation_method_div'] == value_sort_aggregation_method_div &&
          data['aggregation_field']      == value_sort_aggregation_field
      ){
        name = data[small_category_name];
        if ($scope.inCategory(name, vs_small_categories) === false){
          vs_small_categories.push({name: name, value: data['value']});
        }
      }
    });

    //値によるソートを実施する（小項目）
    if (value_sort_order_div == $scope.OD_ASC){
      vs_small_categories.sort(function(a, b){
        if(a.value < b.value) return -1;
        if(a.value > b.value) return 1;
        return 0;
      });
    }else{
      vs_small_categories.sort(function(a, b){
        if(a.value < b.value) return 1;
        if(a.value > b.value) return -1;
        return 0;
      });
    }

    if (vs_small_categories.length == 0){
      return null;
    }

    $.each(vs_small_categories, function(ii, data){

      var
        key  = data.name ? data.name : data,
        text = $scope.getText(organ_item_list, small_category_name, key);

      new_vs_small_categories.push(text);
    });

    return new_vs_small_categories;
  };

  $scope.inCategory = function(name, categories){
    var
      exists = false;

    if (!name){
      return false;
    }

    if (!categories){
      return false;
    }

    $.each(categories, function(i, v){
      if (name == v['name']){
        exists = true;
      }
    });

    return exists;
  };

  $scope.pushCategory = function(categories, category_name, sub_category_name, value){

    if (!categories || !category_name || !value){
      return categories;
    }

    if (sub_category_name){

      if ($scope.exists(value, categories) === false){
        categories.push({name: value});
      }
    }else{
      if ($scope.exists(value, categories) === false){
        categories.push(value);
      }
    }

    return categories;
  };

  $scope.exists  = function(value, list){

    var
      exists = false;

    $.each(list, function(i, v){
      if (v == value || v['name'] == value){
        exists = true;
      }
    });

    return exists;
  };

  $scope.getText = function(organ_item_list, name, value){

    $.each(organ_item_list, function(i, v){

      var
        type          = v['type'],
        field_name    = v['field_name'],
        division_list = null;

      if (field_name == name){
        if (type == 'select'){
          division_list = v['division_list'];

          $.each(division_list, function(index, division){
            if (value == division['key']){
              value = division['value'];
            }
          });
        }else if (type == 'multiple_select'){
          //複数選択

          division_list = v['division_list'];

          var
            new_value = '',
            val_list  = null;

          value = value.toString();

          if (value.indexOf(',') >= 0){
            val_list = value.split(',');
          }else{
            val_list = [value];
          }

          $.each(division_list, function(index, division){
            $.each(val_list, function(ii, val){
              if (division['key'] == val){
                new_value += division['value'] + ',';
              }
            });
          });

          new_value = new_value.slice(0, new_value.length - 1);

          value = new_value;
        }
      }
    });

    if (!value){
      value = '-';
    }

    return value;
  };

  $scope.createChart = function(gadget){

    var chart_id    = '#chart_' + gadget.gadget_id,
        target_list = new Array(),
        result_list = null,
        data        = null,
        data_list   = null,
        ds          = [],
        graph_div   = gadget.graph_div,
        bars        = null,
        tooltipOpts = null,
        xAxis       = null,
        yAxis       = null,
        target      = null,
        result      = null,
        year_month_list = null,
        bar_width       = null,
        tooltip         = null,
        chart_type      = null,
        series          = [],
        legend          = null;


    data = gadget.data;

    if (data){
      data_list = data.data_list;
    }

    if (graph_div == $scope.GTD_ACHIEVEMENT){
      //達成度
      var
        value        = Math.floor(gadget.result / gadget.target * 100),
        gaugeOptions = {
          chart: {
            type: 'solidgauge'
          },
          title: null,
          pane: {
            center    : ['50%', '50%'],
            size      : '80%',
            startAngle: 0,
            endAngle  : 360,
            background: {
              backgroundColor: '#eee',
              innerRadius    : '60%',
              outerRadius    : '100%',
              shape          : 'arc'
            }
          },
          tooltip: {
            enabled: false
          },
          yAxis: {
            stops: [
              [0.1, '#55BF3B'], //green
              [0.5, '#DDDF0D'], //yellow
              [0.9, '#DF5353']  //red
            ],
            lineWidth        : 0,
            tickInterval     : 25,
            tickPosition     : 'outside',
            tickColor        : '#ccc',
            tickWidth        : 1,
            tickLength       : 10,
            minorTickInterval: 5,
            minorTickPosition: 'outside',
            minorTickColor   : '#ccc',
            minorTickWidth   : 1,
            minorTickLength  : 10,
            title            : null,
            labels: {
              distance: 15
            },
            min: 0,
            max: 100
          },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                y          : 5,
                borderWidth: 0,
                useHTML    : true
              }
            }
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          series: [{
            name      : null,
            data      : [value],
            dataLabels: {
              format: '<div style="text-align: center; vertical-align: middle;">' +
                        '<span style="font-size: 20px; color: #000; ' +
                        //  ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') +
                        '">{y}%</span></div>',
              y: -20
            },
            tooltip: {
              valueSuffix: ' %'
            }
          }]
      };

      $('#gauge_' + gadget.gadget_id).highcharts(gaugeOptions);
    }else{

      if (!data || !data_list || data_list.length == 0){
        //データが無い場合は終了
        return;
      }

      //データリスト取得（結果）
      result      = $scope.createChartData(data_list, 'result', graph_div);
      result.result = result.result.splice(-6, 6); //直近６カ月分のみ表示する
      result.year_month_list = result.year_month_list.splice(-6, 6);
      result_list = result.result;

      if (data.target_div && data.target_div == 1){
        //データリスト取得（目標）
        target      = $scope.createChartData(data_list, 'target', graph_div);

        $.each(target.result, function(tIndex, tValue){
          if (target_list.length < result_list.length){
            $.each(result_list, function(rIndex, rValue){
              if (rIndex == tIndex){
                target_list.push(tValue);
                return;
              }
            });
            return;
          }
          if (target_list.length == 6){
            return false;
          } else {
            target_list.push(tValue);
          }
        });

        //target.result = target.result.splice(-6, 6); //直近６カ月分のみ表示する
        target.year_month_list = target.year_month_list.splice(-6, 6);
        //target_list = target.result;

        series.push({
          name : '目標',
          color: $chrt_fourth,
          data : target_list
        });

      }

      if (graph_div == $scope.GTD_BAR_CHART || graph_div == $scope.GTD_HORIZONTAL_BAR_CHART){
        //棒グラフ
        series.push({
          name : '実績',
          color: $chrt_second,
          data : result_list
        });

        legend = {
          enabled      : true,
          floating     : true,
          verticalAlign: 'top',
          align        : 'right',
          y            : -10,
          //borderWidth  : 1
          itemStyle        : {
            fontSize  : '70%',
            fontWeight: 'normal'
          }
        };
      }else if (graph_div == $scope.GTD_LINE_CHART){
        //折れ線グラフ
        series = [{
          name : 'データ',
          color: $chrt_second,
          data : result_list
        }];

        legend = {
          enabled: false,
        };
      }

      tooltip = {
        backgroundColor: '#fff',
        borderColor    : '#ccc',
        borderRadius   : 0,
        borderWidth    : 1,
/*        formatter      : function() {
          var
            date = new Date(this.x);
          return utils.addComma(this.y) + '<br />' + date.getFullYear() + '年' + (parseInt(date.getMonth(), 10) + 1) + '月';
        },*/
        shadow         : false
      };

      if (graph_div == $scope.GTD_BAR_CHART){
        //縦棒グラフ
        chart_type = 'column';

        xAxis = {
          /*type: 'datetime',
          dateTimeLabelFormats: {
            month: '%Y<br>%m'
          },*/
          type : 'category',
          title: {
            text: null
          },
          labels: {
            style: {
              fontSize: '70%'
            }
          },
          gridLineWidth: 1
        };

        yAxis = {
          title: {
            text: null
          },
          labels: {
            formatter: function(){
              return utils.addComma(this.value);
            },
            style: {
              fontSize: '70%'
            }
          },
          gridLineWidth: 0
        };

      }else if (graph_div == $scope.GTD_HORIZONTAL_BAR_CHART){
        //横棒グラフ
        chart_type = 'bar';

        xAxis = {
//          reversed: true,
/*
          type: 'datetime',
          dateTimeLabelFormats: {
            month: '%Y<br>%m'
          },
*/        type : 'category',
          title: {
            text: null
          },
          labels: {
            style: {
              fontSize: '70%'
            }
          },
          gridLineWidth: 1
        };

        yAxis = {
          title: {
            text: null
          },
          gridLineWidth: 0,
          labels: {
            formatter: function(){
              return utils.addComma(this.value);
            },
            style: {
              fontSize: '70%'
            }
          }
        };
      }else if (graph_div == $scope.GTD_LINE_CHART){
        //折れ線グラフ
        chart_type = 'line';

        xAxis = {
          /*type: 'datetime',
          dateTimeLabelFormats: {
            month: '%Y<br>%m'
          },*/
          type : 'category',
          title: {
            text: null
          },
          labels: {
            style: {
              fontSize: '70%'
            }
          },
          gridLineWidth: 1
        };

        yAxis = {
          title: {
            text: null
          },
          labels: {
            formatter: function(){
              return utils.addComma(this.value);
            },
            style: {
              fontSize: '70%'
            }
          },
          gridLineWidth: 0
        };

      }

      $(chart_id).highcharts({
        chart: {
          type: chart_type
        },
        title: {
          text: null
        },
        xAxis  : xAxis,
        yAxis  : yAxis,
        tooltip: tooltip,
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        legend: legend,
        series: series
      });

    }
  };

  $scope.createChartData = function(data_list, kind, graph_div){
    var
      result          = [],
      ii              = 0, //通し番号
      year_month_list = [];

    $.each(data_list, function(index, v){
      var
        i          = 0,
        key        = '',
        value      = 0,
        year_month = null,
        year       = v.year;

      for(i = 1; i <= 12; i++){
        ii += 1;
        if (i < 10){
          key = '0' + i;
        }else{
          key = i;
        }
        key = kind + key;
        value = v[key];

        //year_month = $scope.createYearMonthAsMiliSeconds(year, i);
        year_month = $scope.createYearMonthAsString(year, i);

        value = parseInt(value, 10);

        if (value > 0){
          //if (graph_div == 1 || graph_div == 3){
            //縦棒グラフ、折れ線グラフ
            result.push([year_month, value]);
          //}else if (graph_div == 2){
            //横棒グラフ
          //  result.push([value, year_month]);
          //}
          year_month_list.push(year_month);
        }
      }
    });

    //result          = result.splice(-6, 6); //直近６カ月分のみ表示する
    //year_month_list = year_month_list.splice(-6, 6);

    return {result: result, year_month_list: year_month_list};
  };

  $scope.createYearMonthAsString = function(year, month){

    month = month.toString();

    if (month.length == 1){
      month = '0' + month;
    }

    return year + '/' + month;
  };

  /*$scope.createChartData4Graph = function(data_list, kind, graph_div){

    var
      result          = [],
      ii              = 0, //通し番号
      year_month_list = [];

    $.each(data_list, function(index, v){
      var
        i          = 0,
        key        = '',
        value      = 0,
        year_month = null,
        year       = v.year;

      for(i = 1; i <= 12; i++){
        ii += 1;
        if (i < 10){
          key = '0' + i;
        }else{
          key = i;
        }
        key = kind + key;
        value = v[key];

        year_month = $scope.createYearMonthAsMiliSeconds(year, i);

        value = parseInt(value, 10);

        if (value > 0){
          if (graph_div == 1 || graph_div == 3){
            //縦棒グラフ、折れ線グラフ
            result.push([year_month, value]);
          }else if (graph_div == 2){
            //横棒グラフ
            result.push([value, year_month]);
          }
          year_month_list.push(year_month);
        }
      }
    });

    result          = result.splice(-6, 6); //直近６カ月分のみ表示する
    year_month_list = year_month_list.splice(-6, 6);

    return {result: result, year_month_list: year_month_list};
  };*/

  $scope.createYearMonthAsMiliSeconds = function(year, month){

    var date = new Date();

    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(2);
//date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    return date.getTime();
  };

  //やることリストガジェットの作成
  $scope.createTodoGadget = function(gadget){

    var todo_gadget_id  = 'todo_gadget_' + gadget.gadget_id,
        todo_group_list = gadget.todo_group_list,
        $todo_gadget    = $('#' + todo_gadget_id);

    $.each(todo_group_list, function(i, v){

      var todo_group_id         = v['todo_group_id'],
          todo_group_element_id = null,
          todo_group_name       = v['todo_group_name'];

      if (!todo_group_id){
        todo_group_id   = 0;
        todo_group_name = '未分類';
      }

      todo_group_element_id = 'todogroup_' + gadget.gadget_id + '_' + todo_group_id;

      $('<div>' + todo_group_name + '</div>').appendTo($todo_gadget);
      $('<ul id="' + todo_group_element_id + '" style="list-style-type: none; padding-left: 0;"></ul>').appendTo($todo_gadget);

      $scope.getTodoList(gadget.project_id, todo_group_element_id, todo_group_id);
    });

    $scope.closeGadgetDialog();
  };

  //ディスカッションガジェットの作成
  $scope.createDiscussionGadget = function(gadget){

    var discussion_gadget_id = 'discussion_gadget_' + gadget.gadget_id,
        discussion_list      = gadget.discussion_list,
        $discussion_gadget   = $('#' + discussion_gadget_id),
        project_id           = gadget.project_id;

    if (discussion_list){

      $.each(discussion_list, function(i, v){

        var discussion_id         = v['discussion_id'],
            discussion_element_id = 'discussion_' + discussion_id,
            title                 = v['title'],
            user_name             = v['last_name'] + v['first_name'],
            comment               = v['comment'],
            commented_at          = v['commented_at'],
            comment_num           = v['count'],
            smile_num             = v['smile_num'],
            user_image            = v['user_image'],
            html_str              = null;

        if (!user_name){
          user_name = '';
        }

        if (!user_image){
          user_image = '';
        }

        if (!comment){
          comment = '';
        }

        if (!commented_at){
          commented_at = '';
        }

        html_str = '<div class="row" style="margin: 0;">'
//                 + '<div class="col-md-1"></div>'
                 + '<div class="col-md-12" style="font-size: 90%; margin: 0 0 10px 0; background-color: #fff; padding: 10px;">'
                 +   '<div class="row" style="margin: 0 0 10px 0; border-bottom: 1px solid #cccccc;">'
                 +     '<div class="col-md-12" style="padding: 0;">' + title + '</div>'
                 +   '</div>'
                 +   '<div class="row">'
                 +     '<div class="col-md-2"><img src="' + user_image + '" alt="' + user_name + '" title="' + user_name + '" style="height: 30px; width: 30px;" /></div>'
                 +     '<div class="col-md-10"><span style="font-size: 90%;">' + comment + '</span></div>'
                 +   '</div>'
                 +   '<div class="row" style="margin: 0 0 10px 0; border-bottom: 1px solid #cccccc;">'
                 +     '<div class="col-md-12"><span style="font-size: 80%; float: right;">' + commented_at + '</span></div>'
                 +   '</div>'
                 +   '<div class="row">'
                 +     '<div class="col-md-5" style="margin: 0;">'
                 +       '<a href="javascript:void(0)" data-project-id="' + project_id + '" data-discussion-id="' + discussion_id + '" data-title="' + title
                 +       ' "data-element-kind="discussion_comment_link">コメントする</a>'
                 +     '</div>'
                 +     '<div class="col-md-7" style="margin: 0;">'
                 +       '<span class="badge bg-color-blueLight" style="font-size: 85%; float: right;">' + comment_num + '</span>'
                 +       '<a href="javascript:void(0)" data-project-id="' + project_id + '" data-discussion-id="' + discussion_id + '" data-title="' + title
                 +         '" data-element-kind="discussion_comment_link" style="float: right; margin-left: 5px;"><img src="/common/images/comment.jpg" /></a>&nbsp;'
                 +       '<span class="badge bg-color-blueLight" data-element-kind="discussion_smile_num" style="font-size: 85%; float: right;">' + smile_num + '</span>&nbsp;&nbsp;'
                 +       '<a href="javascript:void(0)" data-element-kind="discussion_smile_link" data-discussion-id="' + discussion_id + '">'
                 +         '<img src="/common/images/smile.jpg" style="float: right;">'
                 +       '</a>&nbsp;'
                 +     '</div>'
                 +   '</div>'
                 + '</div>';
                 + '</div>';

        $(html_str).appendTo($discussion_gadget);
        $('<ul id="' + discussion_id + '" style="list-style-type: none; padding-left: 0;"></ul>').appendTo($discussion_gadget);
      });
    }

    $scope.closeGadgetDialog();
  };

  $scope.createTextAndImageGadget = function(gadget){

    var text_and_image_gadget_id = 'text_and_image_gadget_' + gadget.gadget_id,
        $text_and_image_gadget   = $('#' + text_and_image_gadget_id),
        html_str                 = '',
        text                     = gadget.text;

    html_str += '<div style="height: 250px; display: table-cell; vertical-align: middle;">';

    if (gadget.text_and_image_div == 1){
      //テキスト
      text = text.replace(/[\n\r]/g, '<br />');
      html_str += '<strong>' + text + '</strong>';
    }else if (gadget.text_and_image_div == 2){
      var image_obj = new Image();

      image_obj.src = gadget.image_url;

      //画像
      html_str += '<span><img src="' + gadget.image_url + '" alt="" ';

      if (image_obj.width > 270){
        html_str += ' style="width: 260px;" ';
      }

      html_str += ' />';
    }

    html_str += '</div>';

    $(html_str).appendTo($text_and_image_gadget);

    $scope.closeGadgetDialog();
  };

  $scope.getTodoList = function(project_id, list_element_id, todo_group_id){

    var param = {project_id: project_id, todo_group_id: todo_group_id, completion_div: 0};

    $.post(
      '/todo/php/todo_read.php',
      param,
      function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        $scope.createTodoList(data.value.list, list_element_id, project_id, todo_group_id);
      }
    );
  }

  $scope.createTodoList = function(list, list_element_id, project_id, todo_group_id){

    var list_element = $('#' + list_element_id),
        html_str     = '';

    $(list_element).empty();

    $.each(list, function(i, v){

      var todo_id        = v['todo_id'],
          todo_content   = v['todo_content'],
          deadline_at    = v['deadline_at'],
          last_name      = v['last_name'],
          first_name     = v['first_name'],
          user_nm        = last_name + first_name,
          completion_div = v['completion_div'],
          project_id     = v['project_id'];

      html_str = '';

      if (!deadline_at || deadline_at == '0000-00-00'){
        deadline_at = '期限無し';
      }else{
        deadline_at = deadline_at.replace(/-/g, '/');
      }

      if (!user_nm){
        user_nm = '未選択';
      }

      html_str += '<li>'
               +    '<div class="todo row" style="background-color: #fff; margin-bottom: 10px;">'
               +      '<div class="col-md-12">'
               +        '<div class="row" style="margin: 0;">'
               +          '<div class="col-md-12" style="height: 100%; padding: 5px 0 0 10px;">'
               +            '<div class="common-checkbox" style="padding: 0;">'
               +              '<input type="checkbox" data-element-kind="todo_check" data-project-id="' + project_id + '" data-todo-id="' + todo_id + '" id="' + todo_id + '" name="selectCheck" ';

      if (completion_div == 1){
        html_str += 'checked ';
      }

      html_str +=             ' />'
               +              '<label style="font-size: 90%;" for="' + todo_id + '">'
               +                todo_content
               +              '</label>'
               +            '</div>'
               +          '</div>'
               +        '</div>'
               +        '<div class="row" style="margin: 0;">'
               +          '<div class="col-md-12" style="height: 100%; line-height: 20px; padding: 0;">'
               +            '<span style="float: right; margin-right: 10px;">'
               +              '<sub>' + deadline_at + '</sub>&nbsp;'
               +              '<sub style="width: 100px;">' + user_nm + '</sub>'
               +            '</span>'
               +          '</div>'
               +        '<div>';
               +      '<div>';
      html_str += '</li>';
      $(html_str).appendTo(list_element);
    });

    html_str = '<li>'
      + '<div class="row" style="margin: 5px 0 20px 0;">'
      + '<div class="col col-md-12" style="padding: 0;">'
      + '<a href="javascript:void(0)" class="create_todo_button" data-project-id="' + project_id + '" data-todo-group-id="' + todo_group_id
      + '" style="font-size: 90%;">やることを追加する</a>'
      + '</div>'
      + '</div>'
      + '</li>';
    $(html_str).appendTo(list_element);
  };

  //todoチェッククリック
  $scope.clickCheckbox = function(){
    var label          = $(this).parent(),
        checked        = $(this).prop('checked'),
        todo_id        = $(this).data('todo-id'),
        project_id     = $(this).data('project-id'),
        list_item      = $(label).parent().parent().parent(),
        completion_div = null,
        callback       = null;

    if (!todo_id){
      return;
    }

    if (checked){
      $(label).css('text-decoration', 'line-through');
    }else{
      $(label).css('text-decoration', 'none');
    }

    completion_div = checked == true ? 1 : 0;

    callback = function(){
      $.post(
        '/todo/php/todo_update.php',
        {todo_id: todo_id, completion_div: completion_div},
        function(data){
          if (data.has_error){
            alert(data.message);
            return;
          }
          if (checked){
            if (project_id >= 0){
              $(list_item).hide('slow');
            }else{
              $(list_item).show('slow');
            }
          }else{
            if (project_id >= 0){
              $(list_item).show('slow');
            }else{
              $(list_item).hide('slow');
            }
          }
        }
      );
    };

    setTimeout(callback, 5000); //5秒後
  };

  //やることの追加
  $scope.createTodo = function(){

    var todo_group_id = $(this).data('todo-group-id'),
        project_id    = $(this).data('project-id'),
        momentObj = moment(),
        now       = '',
        parent    = $(this).parent().parent().parent().parent(),
        s         = null,
        pane      = $('#createTodoPane');

    if ($(pane).size() > 0){
      //多重作成防止
      return;
    }

    now = momentObj.format('YYYY-MM-DD');

    s = $(
      '<div id="createTodoPane" title="やることの追加">' +
        '<form class="smart-form">' +
        '<fieldset style="padding: 0;">' +
          '<label class="label">やること</label>' +
          '<label class="input"><input type="text" id="todoContent" style="ime-mode: active;" /></label>' +
          '<label class="label">担当者</label>' +
          '<label class="select"><select id="userSelect" class="form-control"></select></label>' +
          '<label class="label">期限</label>' +
          '<label class="input"> <i class="icon-append fa fa-calendar"></i>' +
          '<input id="deadlineAt" type="text" name="request" placeholder="" class="" data-dateformat="yy/mm/dd">' +
          '</label>' +
          '<label class="input">' +
            '<label class="checkbox"><input type="checkbox" id="noTimeLimitCheck"><i></i>期限無し</label>' +
          '</label>' +
        '</fieldset>' +
        '<footer>' +
          '<button id="todoSaveButton" type="button" class="primary-button" data-project-id="' + project_id + '" data-todo-group-id="' +
            todo_group_id + '" style="float: right; margin-left: 10px;">作成</button>' +
          '<button id="todoCancelButton" type="button" class="common-button" style="float: right;">キャンセル</button>' +
        '</footer>' +
        '</form>' +
      '</div>'
    );

    $(s).appendTo($(parent));

    $('#deadlineAt').datepicker(common.datepicker_settings);

    $scope.project_list = null;
    $scope.user_list    = null;

    //担当者リストの取得
    $.post(
      '/user/php/project_user_read.php',
      //{project_id: $scope.selected_project_id},
      {project_id: project_id},
      function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        $scope.user_list = data.value.list; //rows;
        if ($scope.user_list){
          $scope.user_list.unshift({user_id: 0, user_nm: '未選択'});
        }

        var user_select = $('#userSelect');

        $.each($scope.user_list, function(i, v){
          var user    = v,
              user_id = user['user_id'];
          if (user_id < 1){
            return;
          }
          $('<option value="' + user_id + '">' + user['last_name'] + user['first_name'] + '</option>').appendTo(user_select);
        });

      }
    );
  };

  //TODOの保存
  $scope.saveTodo = function(){

    var todo_content  = $('#todoContent').val(),
        todo_group_id = $(this).data('todo-group-id'),
        project_id    = $(this).data('project-id'),
        user_id       = $('#userSelect').val(),
        deadline_at   = $('#deadlineAt').val(),
        no_time_limit = $('#noTimeLimitCheck').prop('checked'),
        param         = null;

    if (!todo_content || todo_content.trim().length == 0){
      alert('やることを入力してください');
      return;
    }

    param = {
      todo_content : todo_content,
      deadline_at  : deadline_at,
      //project_id   : $scope.selected_project_id,
      project_id   : project_id,
      user_id      : user_id,
      todo_group_id: todo_group_id
    };

    if (no_time_limit){
      delete param.deadline_at;
    }

    $.post(
      '/todo/php/todo_create.php',
      param,
      function(data){
        var todo_list_element_id = 'todo_list_' + todo_group_id;
        if (data.has_error){
          common.showAlert({
            is_error: true,
            message : data.message,
            auto_remove: false,
            show_close_button: true
          });
          return;
        }
        $('#createTodoPane').remove();
        common.showAlert({
          is_error   : false,
          message    : '追加処理が完了しました',
          auto_remove: true,
          show_close_button: true
        });
//        $('#' + todo_list_element_id).empty();
//        $scope.getTodoList(project_id, todo_list_element_id, todo_group_id);
        $scope.readGadgets(); //ガジェット読み込み
      }
    );
  };

  $scope.cancelTodo = function(){

    $('#createTodoPane').remove();
  };

  $scope.createGadgetHtmlString = function(gadget){

    var html        = null,
        header      = null,
        gadget_name = gadget.gadget_name,
        gadget_div  = gadget.gadget_div,
        graph_div   = gadget.graph_div,
        graph_type_div = gadget.graph_type_div;

    if (!gadget){
      return '';
    }

    if (gadget_name && gadget_name.length > 20){
      gadget_name = gadget_name.slice(0, 19) + '…';
    }

    header = '<header style="width: 100%;" role="heading">';

    header += '<h2>' + gadget_name + '</h2>'
                   +   '<div class="jarviswidget-ctrls" role="menu">'
                   +     '<a data-placement="bottom" title="" rel="tooltip" class="button-icon" href="javascript:void(0);" '
                   +       'data-original-title="編集" data-element-kind="gadget_update" data-gadget-id="' + gadget.gadget_id + '">'
                   +       '<i class="fa fa-cog"></i>'
                   +     '</a> '
                   +     '<a data-placement="bottom" title="" rel="tooltip" class="button-icon jarviswidget-delete-btn" href="javascript:void(0);" '
                   +       'data-original-title="削除" data-element-kind="gadget_delete" data-gadget-id="' + gadget.gadget_id + '">'
                   +       '<i class="fa fa-times"></i>'
                   +     '</a>'
                   +   '</div>';

    header += '</header>';

    html = '<!-- Widget ID (each widget will need unique ID)-->'
         + '<div class="jarviswidget col-xs-12 col-sm-3 col-md-3 col-lg-3" id="wid-id-' + gadget.gadget_id + '" data-gadget-id="' + gadget.gadget_id + '" '
         + ' data-widget-editbutton="false" '
         + ' data-widget-deletebutton="false" data-widget-colorbutton="false" data-widget-togglebutton="false" data-widget-fullscreenbutton="false">'
         + header
         + '<!-- widget div-->'
         + '<div style="padding: 0;" role="content">'
         + '<!-- widget edit box -->'
         + '<div class="jarviswidget-editbox">'
         + '<!-- This area used as dropdown edit box -->'
         + '</div>'
         + '<!-- end widget edit box -->'
         + '<!-- widget content -->';

    if (gadget_div == $scope.GD_DATA_INPUT || gadget_div == $scope.GD_GRAPH){
      //グラフ
      html += '<div class="widget-body" style="margin: 0; padding: 0 11px;">';
    }else{
      html += '<div class="widget-body no-padding" style="margin: 0;">';
    }

    if (gadget_div == $scope.GD_DATA_INPUT){
      //データ
      if (graph_div == 4){
        //達成度
        //var percent = Math.floor(gadget.result / gadget.target * 100);
        /*html += '<div id="pieChart_' + gadget.gadget_id + '" class="easy-pie-chart txt-color-blue easyPieChart" data-percent="' + percent + '" data-pie-size="' + gadget.target
             +    '" style="margin: 20px 18px 30px 18px;">'
             +    '<span class="percent percent-sign txt-color-blue font-xl semi-bold">' + percent + '</span>'
             +  '</div>';*/
        html += '<div id="gauge_' + gadget.gadget_id + '" class="solidGauge"></div>';
      }else{
        html += '<div id="chart_' + gadget.gadget_id + '" class="chart"></div>';
        //html += '<div id="chart_' + gadget.gadget_id + '" class="chart" style="height: 240px; width: 257px;"></div>';
      }
    }else if (gadget_div == $scope.GD_GRAPH){
      //グラフ（自動集計）
      if (graph_type_div == 4){
        html += '<div id="gauge_' + gadget.gadget_id + '" class="solidGauge"></div>';
      }else{
        html += '<div id="chart_' + gadget.gadget_id + '" class="chart" style="height: 240px; width: 257px;"></div>';
      }
    }else if (gadget_div == $scope.GD_TODO_LIST){
      //やることリスト
      html += '<div id="todo_gadget_' + gadget.gadget_id + '" style="margin-left: 0; background-color: #eee;" class="gadget-body"></div>';
    }else if (gadget_div == $scope.GD_DISCUSSION){
      //ディスカッション
      html += '<div id="discussion_gadget_' + gadget.gadget_id + '" style="margin-left: 0; background-color: #eee;" class="gadget-body">'
           + '</div>';
    }else if (gadget_div == $scope.GD_TEXT_AND_IMAGE){
      //画像・テキスト
      html += '<div id="text_and_image_gadget_' + gadget.gadget_id + '" style="margin-left: 0; background: none;" class="gadget-body"></div>';
    }

    html += '</div>'
         +  '<!-- end widget content -->'
         +  '</div>'
         +  '<!-- end widget div -->'
         +  '</div>';

    return html;
  };

  $scope.setAbleToTargetInputElements = function(target_div){

    var input_arr  = $('.input-table input');

    $.each(input_arr, function(i, v){
      var is_target = $(v).attr('data-is-target');

      if (is_target){
        if (target_div == 1){
          $(v).removeAttr('disabled');
          $(v).css('background', '');
        }else{
          $(v).attr('disabled', 'disabled');
          $(v).css('background', '#EEEEEE');
        }
      }
    });
  };

  //データ一覧選択
  $scope.showDataSelectPane = function(callback){
    var param = {field_name: 'report_type_div', search_value: 2};
    $http.post(
        '/report_flexible/php/report_flexible_read.php',
        param
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }
      var list = data.list;
      if (list){
        $scope.createDataTable(list);
        $('#dataSelectPane').show();

        if (callback){
          callback();
        }
      }

    });

/*    $.post(
//      '/data/php/data_read.php',
      '/report_flexible/php/report_flexible_read.php',
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        if (data && data.value){
          $scope.createDataTable(data.value.list);
          $('#dataSelectPane').show();

          if (callback){
            callback();
          }
        }
      }
    );*/
  };


  $scope.createDataTable = function(list){

    var html_str       = '',
        dataSelectPane = $('#dataSelectPane');

    dataSelectPane.empty();

    html_str += '<div style="margin-bottom: 50px;">';
    html_str +=   '<label class="control-label">選択データ</label>';
    html_str +=   '<input type="hidden"  id="dataIdHidden" />';
    html_str +=   '<input type="text"    id="dataNameText" class="form-control" disabled="disabled" />';
    html_str += '</div>';

    $(html_str).appendTo(dataSelectPane);

    html_str = '';

    html_str += '<table id="dataTable" class="table table-striped table-bordered table-hover">'
             +  '<thead>'
             +    '<tr>'
             +      '<th>選択</th>'
             +      '<th>データ名</th>'
             +      '<th>更新日時</th>'
             +      '<th>更新者</th>'
             +    '</tr>'
             +  '</thead>'
             +  '<tbody>';

    $.each(list, function(i, v){
      var updated_user_name = '',
          created_user_name = '';

      if (v['updated_user_last_name'] && v['updated_user_first_name']){
        updated_user_name = v['updated_user_last_name'] + v['updated_user_first_name'];
      }

      if (v['created_user_last_name'] && v['created_user_first_name']){
        created_user_name = v['created_user_last_name'] + v['created_user_first_name'];
      }

      html_str += '<tr>';

      html_str += '<td><div class="common-button" data-data-id="' + v['_id'].$id + '" data-data-name="' + v['report_name'] + '" '
               +  ' data-target-div="' + v['target_div'] + '" data-button-kind="select" style="width: 40px;">選択</div>'
               +  '</td>';
      html_str += '<td>' + v['report_name']         + '</td>';
      html_str += '<td>' + v['updated_on']        + '</td>';
      html_str += '<td>' + updated_user_name      + '</td>';
      //html_str += '<td>' + v['created_on']        + '</td>';
      //html_str += '<td>' + created_user_name      + '</td>';
      //html_str += '<td></td>';
      html_str += '</tr>';
    });

    html_str += '</tbody></table>';

    $(html_str).appendTo(dataSelectPane);

    $('#dataTable').dataTable({
      'sPaginationType': 'bootstrap_full',
      'oLanguage' : {
        'oPaginate': { 'sFirst': '最初', 'sLast': '最後', 'sPrevious': '前', 'sNext': '次' },
        'sInfo'    : "_TOTAL_ 件中、_START_ 件目から_END_ 件目まで表示"
      },
      'aoColumnDefs': [
        { 'bSortable': false, "aTargets": [ 0 ], 'sWidth': '70px', "sContentPadding": "mmm" }
      ]
    });
  };

  $scope.showGraphPane = function(){
    $scope.hideInputPanes();
    $('#graphPane').show();
  };

  $scope.showDataInputPane = function(){
    $scope.hideInputPanes();
    $('#dataInputPane').show();
  };

  $scope.showTodoInputPane = function(gadget){

    $scope.hideInputPanes();

    var $todoInputPane      = $('#todoInputPane'),
        $todoInputPaneInner = $('#todoInputPaneInner'),
        project_id          = null;

    $todoInputPaneInner.empty();

    if ($scope.isMyCanvas()){
      //マイキャンバス時
      project_id = $('#todoProjectSelector').val();
    }else{
      project_id = $scope.selected_project_id;
    }

    //やることリストの取得
    $.post(
      '/todo/php/todo_group_read.php',
      {project_id: project_id},
      function(data){
        var html_str = null,
            list     = null;

        if(data.has_error){
          alert(data.message);
          return;
        }

        html_str = '<ul style="list-style-type: none; padding-left: 10px;">';

        list = data.value.list;

        list.unshift({todo_group_id: 0, todo_group_name: '未分類'});

        $.each(data.value.list, function(i, v){
          var todo_group_id   = v['todo_group_id'],
              todo_group_name = v['todo_group_name'],
              element_id      = 'todo_group_check_' + todo_group_id;
          html_str += '<li><label class="checkbox"><input type="checkbox" id="' + element_id + '" name="todo_group_check" value="' + todo_group_id + '" />'
                   +  '<i> </i>' + todo_group_name + '</label></li>';
        });
        html_str += '</ul>';
        $(html_str).appendTo($todoInputPaneInner);

        if ($scope.gadget_mode == $scope.GADGET_MODE_CREATE){
          //あらかじめチェックしておく
          $('input[name=todo_group_check]').prop('checked', true);
        }else if ($scope.gadget_mode == $scope.GADGET_MODE_UPDATE){

          var todo_group_list = null,
              check_list      = [];

          if (gadget){
            todo_group_list = gadget.todo_group_list;

            $.each(todo_group_list, function(i, v){
              var todo_group_id = v['todo_group_id'];
              if (!todo_group_id){
                //未分類対応
                todo_group_id = 0;
              }
              check_list.push(todo_group_id);
            });
            $('input[name=todo_group_check]').val(check_list);
          }
        }

        $todoInputPane.show();
      }
    );
  };

  $scope.showDiscussionInputPane = function(){
    $scope.hideInputPanes();
    $('#discussionInputPane').show();
  };

  $scope.showTextAndImageInputPane = function(){
    $scope.hideInputPanes();
    $('#textAndImageInputPane').show();
  };

  $scope.hideInputPanes = function(){
    $('#graphPane').hide();
    $('#dataInputPane').hide();
    $('#todoInputPane').hide();
    $('#discussionInputPane').hide();
    $('#textAndImageInputPane').hide();
  };

  //ガジェット作成ダイアログ表示
  $scope.showGadgetDialog = function(gadget){

//    $scope.isDialogDisplayProccessing = true;

    var create_dialog     = $('#gadgetDialog'),
        create_dialog_str = '',
        title             = '',
        gadget_id         = null;

    if ($(create_dialog).size() > 0){
      $(create_dialog).remove();
    }

    if ($scope.gadget_mode == $scope.GADGET_MODE_CREATE){
      title = '新規ガジェットを作成する';
    }else{
      title     = 'ガジェットを編集する';
      gadget_id = gadget.gadget_id;
    }

    create_dialog_str =
      '<div id="gadgetDialog" title="' + title + '">' +
        '<div class="form-group">';

    //ガジェット名称
    create_dialog_str +=
        '<label class="col-md-4 control-label">ガジェット名称</label>' +
        '<div class="col-md-12">' +
          '<input id="gadgetNameText" type="text" placeholder="ガジェット名称" class="form-control" value="';

    if (gadget && gadget.gadget_name){
      create_dialog_str += gadget.gadget_name;
    }

    create_dialog_str +=
          '"/>' +
        '</div>';

    //ガジェットタイプ
    create_dialog_str += '<label class="col-md-12 control-label">ガジェットタイプ</label>';
    create_dialog_str += '<div class="col-md-12">' + $scope.getGadgetTypeHtmlString(gadget) + '</div>';

    //チャート（自動集計）
    if (gadget.gadget_div == $scope.GD_GRAPH){
      create_dialog_str += $scope.getGraphHtmlStringEx(gadget, {display: true});
    }else{
      create_dialog_str += $scope.getGraphHtmlStringEx(gadget, {display: false});
    }

    //チャート（手入力）
    //report_folder取得
    setTimeout(function(){

      var param   = {},
          report_folder_items = {};

      $http.post(
        '/report_flexible/php/report_flexible_folder_read.php',
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        $scope.report_folders = [];
        $scope.report_folders_ids = [];

        $scope.defaultFolderList = [
          {report_folder_name: '見込客レポート', _id: 'prospects'},
          {report_folder_name: '会社レポート', _id: 'companies'},
          {report_folder_name: '担当者レポート', _id: 'customers'},
          {report_folder_name: '商談レポート', _id: 'business_discussions'},
          {report_folder_name: '契約レポート', _id: 'contracts'},
          {report_folder_name: '活動履歴レポート', _id: 'activity_histories'},
          {report_folder_name: '手入力データ', _id: 'datas'}
        ];
        $.each($scope.defaultFolderList, function(i, v){
          $scope.report_folders.push($scope.defaultFolderList[i].report_folder_name);
          $scope.report_folders_ids.push($scope.defaultFolderList[i]._id);
        });
        $.each(data.list, function(i, v){
          $scope.report_folders.push(data.list[i].report_folder_name);
          $scope.report_folders_ids.push(data.list[i]._id.$id);
        });
        $scope.report_folder = $scope.defaultFolderList[6].report_folder_name;
      });

    }, 100);


    if (gadget.gadget_div == $scope.GD_DATA_INPUT){
      create_dialog_str += $scope.getDataInputHtmlStringEx(gadget, {display: true});
    }else{
      create_dialog_str += $scope.getDataInputHtmlStringEx(gadget, {display: false});
    }

    //やることリスト
    if (gadget.gadget_div == $scope.GD_TODO_LIST){
      create_dialog_str += $scope.getTodoInputHtmlString(gadget, {display: true});
    }else{
      create_dialog_str += $scope.getTodoInputHtmlString(gadget, {display: false});
    }

    //ディスカッション
    if (gadget.gadget_div == $scope.GD_DISCUSSION){
      create_dialog_str += $scope.getDiscussionInputHtmlString(gadget, {display: true});
    }else{
      create_dialog_str += $scope.getDiscussionInputHtmlString(gadget, {display: false});
    }

    //テキスト・画像
    if (gadget.gadget_div == $scope.GD_TEXT_AND_IMAGE){
      create_dialog_str += $scope.getTextAndImageInputHtmlString(gadget, {display: true});
    }else{
      create_dialog_str += $scope.getTextAndImageInputHtmlString(gadget, {display: false});
    }

    create_dialog_str += '<div class="col-md-12">' +
            '<button id="doCreateButton" type="button" data-gadget-id="' + gadget_id + '" ' +
              ' class="primary-button" style="float: right; margin-left: 5px;">保存</button>' +
            '<button id="cancelButton" type="button" class="common-button" style="float: right;">取消</button>' +
          '</div>';

    create_dialog_str += '</div></div>';

    create_dialog = $(create_dialog_str);

    $(create_dialog).appendTo($('body'));

    $compile(create_dialog)($scope);

    $(document).on('click', 'button.ui-dialog-titlebar-close', function(){$scope.closeGadgetDialog(true);});

    $scope.setupFileuploadButton({is_multiple: false});

    //ツールチップ
    if ($("[rel=tooltip]").length) {
      $("[rel=tooltip]").tooltip({container: 'body'});
    }

    $('#gadgetDialog').dialog({
      width: 900,
      modal: true
    });

    if (tourNavigation.currentTour.id == tourNavigation.TOUR_GRAPH){
      $('#gadgetDialog').removeClass('ng-scope');
      $('#gadgetDialog').removeClass('ui-dialog-content');
      $('#gadgetDialog').removeClass('ui-widget-content');
    }

    if ($scope.gadget_mode == $scope.GADGET_MODE_UPDATE){

      //更新モード
      if (gadget.gadget_div == $scope.GD_DATA_INPUT){
        //グラフ
        //グラフ区分
        $('input[name=graphTypeRadio]').val([gadget.graph_div]);
        //利用データ区分
        $('input[name=dataTypeRadio]').val([gadget.data_div]);

        var callback = null;

        if (gadget.graph_div == 4){
          //達成度
          $('#targetText').val(gadget.target);
          $('#resultText').val(gadget.result);
          $('input[name=graphTypeRadio]').trigger('click');
        }else{
          if (gadget.data_div == 1){
            //データ選択
            callback = function(){
              $('#dataIdHidden').val(gadget.report_id);
              $('#dataNameText').val(gadget.data.report_name);
            };
            $scope.showDataSelectPane(callback);
          }else if (gadget.data_div == 2){
            //データ入力
            //$('#dataIdHidden').val(gadget.data_id);
            $scope.currentDataId = gadget.report_id;
            $scope.report_folder = $scope.report_folders[$scope.report_folders_ids.indexOf(gadget.data.report_folder_id)];
          }
          //$('#targetSelector button.active').trigger('click');
        }

        //グラフ
        $('input[name=graphTypeRadio]:checked').trigger('click');
        if (gadget.graph_div == 1 || gadget.graph_div == 2 || gadget.graph_div == 3){
          //縦棒、横棒、折れ線
          $('input[name=dataTypeRadio]:checked').trigger('click');

          if (gadget.graph_div == 1 || gadget.graph_div == 2){
            $('#targetSelector button.active').trigger('click');
          }
        }

      }else if (gadget.gadget_div == $scope.GD_TODO_LIST){
        //やることリスト
        if ($scope.isMyCanvas()){
          $scope.setupTodoProjectSelector(gadget);
        }else{
          $scope.showTodoInputPane(gadget);
        }
      }else if (gadget.gadget_div == $scope.GD_DISCUSSION){
        //ディスカッション
        if ($scope.isMyCanvas()){
          $scope.setupDiscussionProjectSelector(gadget);
        }
      }else if (gadget.gadget_div == $scope.GD_TEXT_AND_IMAGE){
        //テキスト・画像
        $('input[name=textAndImageDivRadio]').val([gadget.text_and_image_div]);
        if (gadget.text_and_image_div == 1){
          //テキスト
          $('#textTextarea').val(gadget.text);
        }else if (gadget.text_and_image_div == 2){
          $('<div><img src="' + gadget.image_url + '" alt="" /></div>').appendTo($('#imageDiv'));
          $('#tiTextPane').hide();
          $('#tiImagePane').show();
        }
      }else if (gadget.gadget_div == $scope.GD_GRAPH){
        //グラフ（自動集計）
        $scope.selectedReportId = gadget.report_id;

        $('input:radio[name=graphTypeRadio_auto]').val([gadget.graph_type_div]);

        //$('input:radio[name=graphTypeRadio_auto]:checked').trigger('change');
        $scope.changeGraphTypeForGraph.call($('input:radio[name=graphTypeRadio_auto]:checked'), {do_preview: false});
      }else{
        console.log('ガジェット区分が不正です');
        return;
      }
    }else{
      //ガジェット新規追加
      //プレビューグラフ表示
      //$scope.createPreviewGraph();
    }

    //$scope.isDialogDisplayProccessing = false;

    //プレビューグラフ表示
    //$scope.createPreviewGraph();
  };

  $scope.createPreviewGraph = function(){

    //if ($scope.isDialogDisplayProccessing === true){
    //  return;
    //}

    var
      $preview_graph = $('#previewGraph'),
      param          = null;

    $preview_graph.empty();

    $scope.getLoader('preview').appendTo($preview_graph);

    //抽出条件が描画されるまで2秒待つ
    setTimeout(function(){

      param = $scope.createParameter4Graph({});

      if (!param){
        $scope.removeLoader('preview');
        return;
      }

      $http.post(
        '/report/php/report_preview.php',
        {report: param}
      ).success(function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }

        var
          report = data.value;

        $scope.createChart4Graph(report, {is_preview: true});
      });

    }, 2000);

  };

  //やることリストプロジェクト選択準備
  $scope.setupTodoProjectSelector = function(gadget){

    var callback_func = function(project_list){

      var $selector = $('#todoProjectSelector');

      $.each(project_list, function(i, v){

        var
          project_id   = v['project_id'],
          project_name = v['project_name'],
          html_str     = '';

        html_str += '<option value="' + project_id + '"';

        //if (gadget && gadget.project_id && project_id == gadget.project_id){
        //  html_str += ' checked ';
        //}

        html_str += ' >' + project_name + '</option>';

        $(html_str).appendTo($selector);
      });

      if (gadget){
        $selector.val(gadget.project_id);
      }

      if (gadget){
        $scope.showTodoInputPane(gadget);
      }else{
        $('#todoProjectSelector').trigger('change');
      }
    };

    $scope.getProjectList(callback_func);
  };

  //ディスカッションプロジェクト選択準備
  $scope.setupDiscussionProjectSelector = function(gadget){

    var callback_func = function(project_list){

      var $selector = $('#discussionProjectSelector');

      $.each(project_list, function(i, v){

        var
          project_id   = v['project_id'],
          project_name = v['project_name'],
          html_str     = '';

        html_str += '<option value="' + project_id + '" ';

        if (gadget && (gadget.project_id == project_id)){
          html_str += ' selected="selected" ';
        }

        html_str += '>' + project_name + '</option>'

        $(html_str).appendTo($selector);

      });

      $('#discussionProjectSelector').trigger('change');
    };

    $scope.getProjectList(callback_func);
  };

  $scope.getProjectList = function(callback){
    $.post(
      '/project/php/project_read_from_user.php',
      function(data){
        if (data.has_error){
          common.showError(data.message);
          return;
        }
        callback(data.value.list);
      }
    );
  };

  $scope.isMyCanvas = function(){
    return ($scope.selected_project_id == 0);
  };

  $scope.getTodoInputHtmlString = function(gadget, options){

    var display_str = '',
        html_str    = '';

    if (!options){
      options = {display: true};
    }

    if (options.display === true){
      display_str = 'block;';
    }else{
      display_str = 'none;';
    }

    html_str += '<div id="todoInputPane" style="display: ' + display_str + '">';

    //if ($scope.selected_project_id == 0){
    if ($scope.isMyCanvas()){
      //マイキャンバスの場合、
      html_str += '<div class="col-md-4" style="margin-bottom: 15px;">'
               +  '<label class="control-label">やることリストを追加したいプロジェクト</label>'
               +  '<select id="todoProjectSelector"></select>'
               +  '</div>';
    }

    html_str += '<label class="col-md-12 control-label">表示するやることリスト</label>'
             +  '<div id="todoInputPaneInner" class="col-md-4 smart-form"></div>';

    html_str += '</div>';
    return html_str;
  };

  $scope.getDiscussionInputHtmlString = function(gadget, options){

    var display_str = '',
        html_str    = '';

    if (!options){
      options = {display: true};
    }

    if (options.display === true){
      display_str = 'block;';
    }else{
      display_str = 'none;';
    }

    html_str = '<div id="discussionInputPane" class="col-md-12" style="display: ' + display_str + '">';

    if ($scope.isMyCanvas()){
      //マイキャンバスの場合、
      html_str += '<div class="col-md-4" style="margin-bottom: 15px;">'
               +  '<label class="control-label">ディスカッションを追加したいプロジェクト</label>'
               +  '<select id="discussionProjectSelector"></select>'
               +  '</div>';
    }

    html_str += '<div class="col-md-12">'
           + '<div class="common-radio">'
           + '<input type="radio" name="discussionDivRadio" id="radioDiscussionDiv" value="1" checked="checked" />'
           + '<label for="radioDiscussionDiv" style="top: 5px; margin-right: 0;"></label>'
           + '<label for="radioDiscussionDiv">全ディスカッションのタイトルと最新コメントを表示する</label>'
           + '</div>'
           + '</div>';

    html_str += '<div id="discussionInputPaneInner"></div>'
    html_str += '</div>';
    return html_str;
  };

  //テキスト、画像
  $scope.getTextAndImageInputHtmlString = function(gadget, options){

    var display_str = '',
        html_str    = '';

    if (!options){
      options = {display: true};
    }

    if (options.display === true){
      display_str = 'block;';
    }else{
      display_str = 'none;';
    }

    html_str = '<div id="textAndImageInputPane" class="col-md-12" style="display: ' + display_str + '">';

    html_str += '<div class="col-md-12">'
           + '<div class="common-radio">'
           + '<input type="radio" id="radioTextAdd" name="textAndImageDivRadio" value="1" checked="checked" />'
           + '<label for="radioTextAdd" style="top: 5px; margin-right: 0;"></label>'
           + '<label for="radioTextAdd">テキストを追加する</label>'
           + '</div></div>'
           + '<div class="col-md-12" id="tiTextPane">'
           + '<textarea class="custom-scroll" id="textTextarea" cols="30" rows="5"></textarea>'
           + '</div>'
           + '<div class="col-md-12">'
           + '<div class="common-radio">'
           + '<input type="radio" id="radioImageAdd" name="textAndImageDivRadio" value="2" />'
           + '<label for="radioImageAdd" style="top: 5px; margin-right: 0;"></label>'
           + '<label for="radioImageAdd">画像を追加する</label>'
           + '</div>'
           + '</div>'
           + '<div class="col-md-12" id="tiImagePane" style="display: none;">'
           +   '<div id="imageDiv" style="margin-bottom: 10px;"></div>'
           //+   '<input type="hidden" id="imageUrlHidden" />'
           +   '<span class="btn btn-success fileinput-button">'
           +     '<i class="glyphicon glyphicon-plus"></i>'
           +     '<span id="fileUploadButtonCaption">ファイルアップロード</span>'
           +     '<input type="file" data-url="/fileupload/php/upload_file_save.php" id="fileupload" name="upload_file">'
           +   '</span>'
           + '</div>';

    html_str += '</div>';
    return html_str;
  };

  //グラフ（自動集計）
  $scope.getGraphHtmlStringEx = function(gadget, options){

    var
      html_str             = '',
      collection_data_list = [
        {collection_name: 'prospects',            display_name: '見込客', data_type_div: $scope.DT_PROSPECT },
        {collection_name: 'companies',            display_name: '会社', data_type_div: $scope.DT_COMPANY },
        {collection_name: 'business_discussions', display_name: '商談',   data_type_div: $scope.DT_BUSINESS_DISCUSSION },
        {collection_name: 'activity_histories',   display_name: '活動履歴', data_type_div: $scope.DT_ACTIVITY_HISTORY }
      ];

    html_str += '<div id="graphPane" class="" style="display: ';

    if (options && options.display === true){
      html_str += ' block; ';
    }else{
      html_str += ' none; ';
    }

    html_str += '">';

    //利用データ
    html_str += '<div id="dataDivPane4Graph" class="col-md-12">';
    html_str +=   '<label class="col-md-12 control-label">利用データ</label>';
    html_str +=   '<div class="col-md-12">';

    $.each(collection_data_list, function(i, v){
      var
        collection_name = v['collection_name'],
        display_name    = v['display_name'],
        data_type_div   = v['data_type_div'],
        id              = 'radio_for_' + collection_name;

      html_str += '<div class="common-radio col-md-6">'
        +  '<input type="radio" id="' + id + '" name="targetDataRadio" value="' + collection_name + '" ';

      if (gadget){
        //if (gadget.collection_name == collection_name){
        if (gadget.target_data_name == collection_name){
          html_str += ' checked="checked" ';
        }
      }

      html_str += ' />'
           +  '<label for="' + id + '" style="top: 5px; margin-right: 0;"></label>'
//           +  '<label for="' + id + '">' + display_name + 'を利用する</label>'
           +  '<label for="' + id + '">' + display_name + '</label>'
           +  '</div>';
    });

    html_str += '</div>';
    html_str += '</div>';

    //グラフタイプ
    html_str += '<label class="col-md-12 control-label">グラフタイプ</label>';
    html_str += '<div class="col-md-12">' + $scope.getGraphTypeHtmlString(gadget, {mode: 'auto'}) + '</div>';

    //ゲージ以外のチャート
    html_str += '<div id="chartControlPane" class="col-md-6">';

      //分類項目
      html_str += '<label class="col-md-12 control-label">分類項目</label>';
      html_str += '<div class="col-md-12">' + $scope.getCategoryFieldHtmlString(gadget) + '</div>';

      //集計方法
      html_str += '<label class="col-md-12 control-label">集計方法</label>';
      html_str += '<div class="col-md-12" id="aggregationMethodPane">';
      html_str += $scope.createAggregationMethodHtmlString(gadget, {type: 'chart'});
      html_str += '</div>';

      //ソート
      html_str += '<label class="col-md-12 control-label">ソート</label>';
      html_str += '<div class="col-md-12" id="sortPane">';
      html_str += $scope.createSortDivHtmlString(gadget);
      html_str += '</div>';

    html_str += '</div>';

    //ゲージ
    html_str += '<div id="gaugeControlPane" style="display: none;" class="col-md-6">';

      //集計方法
      html_str += '<label class="col-md-12 control-label">集計方法</label>';
      html_str += '<div class="col-md-12" id="aggregationMethodPane4Gauge">';
      html_str += $scope.createAggregationMethodHtmlString(gadget, {type: 'gauge'});
      html_str += '</div>';

      //目標値
      html_str += '<label class="col-md-12 control-label">目標値</label>';
      html_str += '<div class="col-md-12" id="targetValuePane">';
      html_str +=   '<input type="text" class="common-text" id="targetValueText" ';
      if (gadget && gadget.target_value){
        html_str += ' value="' + gadget.target_value + '" ';
      }
      html_str +=   '/>';
      html_str += '</div>';

    html_str += '</div>';

    //プレビューグラフ
    html_str += '<div class="col-md-6">';
    html_str +=   '<label class="col-md-12 control-label">プレビュー</label>';
    html_str +=   '<div id="previewGraph" class="col-md-12"></div>';
    html_str += '</div>';

    //絞り込み条件
    html_str += '<label class="col-md-12 control-label">絞り込み条件</label>';
    html_str += '<div class="col-md-12" id="conditionPane">';
    html_str += $scope.createConditionHtmlString(gadget);
    html_str += '</div>';

    html_str += '</div>';

    return html_str;
  };

  $scope.createConditionHtmlString = function(gadget){
    var
      html_str = '';

    if ($scope.gadget_mode == $scope.GADGET_MODE_UPDATE){
      if (gadget){
        values.collection_name = gadget.target_data_name;

        values.condition_list = gadget.condition_list;
      }else{
        values.collection_name = 'prospects';
      }

      html_str += '<div ng-controller="ListEditController">';
    }else{
      html_str += '<div ng-controller="ListCreateController">';
    }

    html_str += '<div id="listConditionPane"></div>';

    html_str += '</div>';

    return html_str;
  };

  $scope.createAggregationMethodHtmlString = function(gadget, options){

    var
      html_str        = '',
      type            = 'chart',
      collection_name = gadget ? gadget.target_data_name : null,
      organ_item_list = null;

    if (!collection_name){
      collection_name = $('input:radio[name=targetDataRadio]:checked').val();
    }

    organ_item_list = $scope.getOrganItemListFromCache(collection_name);

    if (options && options.type){
      type = options.type;
    }

    if (gadget && gadget.aggregation_method_list){
      $.each(gadget.aggregation_method_list, function(i, v){
        html_str += $scope.getAggregationMethodHtmlString(organ_item_list, type, v);
      });
    }else{
      html_str += $scope.getAggregationMethodHtmlString(organ_item_list, type);
    }

    return html_str;
  };

  $scope.createSortDivHtmlString = function(gadget){

    var
      html_str = '';

    if (gadget && gadget.sort_div_list){
      $.each(gadget.sort_div_list, function(i, v){
        html_str += $scope.getSortDivHtmlString(v);
      });
    }else{
      html_str += $scope.getSortDivHtmlString();
    }

    return html_str;
  };

  //データ入力
  $scope.getDataInputHtmlStringEx = function(gadget, options){

    var html_str = '';

    html_str += '<div id="dataInputPane" class="" style="display: ';

    if (options && options.display === true){
      html_str += ' block; ';
    }else{
      html_str += ' none; ';
    }
    html_str += '">';

    //グラフタイプ
    html_str += '<label class="col-md-12 control-label">グラフタイプ</label>';
    html_str += '<div class="col-md-12">' + $scope.getGraphTypeHtmlString(gadget, {mode: 'date_input'}) + '</div>';

    //達成度
    html_str += '<div id="achievementPane" class="col-md-12" style="display: none;">'
             +    '<div class="row"><div class="col-md-4"><label class="control-label">目標値</label></div></div>'
             +    '<div class="row"><div class="col-md-4">'
             +      '<input type="text" id="targetText" class="form-control" style="ime-mode: disabled; text-align: right;" />'
             +    '</div></div>'
             +    '<div class="row"><div class="col-md-4"><label class="control-label">実績値</label></div></div>'
             +    '<div class="row"><div class="col-md-4">'
             +      '<input type="text" id="resultText" class="form-control" style="ime-mode: disabled; text-align: right;" />'
             +    '</div></div>'
             +  '</div>';

    //利用データ
    html_str += '<div id="dataDivPane">';
    html_str += '<label class="col-md-12 control-label">利用データ</label>';
    html_str += '<div class="col-md-12">' + $scope.getDataTypeHtmlString(gadget) + '</div>';
    html_str += '</div>';

    html_str += '<div id="dataSelectPane" class="col-md-12" style="margin-top: 25px; display: none;"></div>';

    html_str += '<div id="dataInputSubPane" style="display: none;">';
    //レポートフォルダ
    html_str += '<div id="reportFolderPane">' +
                  '<label class="col-md-12 control-label">レポート保存フォルダ</label>' +
                  '<div class="col-md-12">' +
                      '<label class = "common-select">' +
                        '<select id="report_folder_select" ng-model="report_folder" ng-options="folder for folder in report_folders" style="height:27px;">' +
                        '</select>' +
                        '<i></i>' +
                      '</label>' +
                  '</div>' +
                '</div>';

    //目標値
    html_str += '<div id="targetPane">' +
          '<label class="col-md-12 control-label">目標値</label>' +
          '<div class="col-md-12">' +
          '<div class="btn-group" data-toggle="buttons-radio" id="targetSelector" value="';

    if (gadget && gadget.data && gadget.data.target_div){
      html_str += gadget.data.target_div;
    }else{
      html_str += 1;
    }

    html_str += '">';

    if (!gadget.data || (gadget.data && gadget.data.target_div == 1)){
      html_str += '<button type="button" value="1" class="btn btn-default active">あり</button>' +
            '<button type="button" value="0" class="btn btn-default">なし</button>';
    }else{
      html_str += '<button type="button" value="1" class="btn btn-default">あり</button>' +
            '<button type="button" value="0" class="btn btn-default active">なし</button>';
    }

    html_str += '</div>';

    html_str += '</div>' +
          '</div>' +
          '<div id="dataDirectInputPane">' +
          '<label class="col-md-4 control-label">データ入力</label>' +
          '<div class="col-md-12">' + $scope.getDataInputYearHtmlString(gadget.data) + '</div>';

    html_str += '</div></div></div>';

    return html_str;
  };

  //グラフタイプ
  $scope.getGraphTypeHtmlString = function(gadget, options){

    var
      html            = '',
      mode            = options.mode,
      radio_name      = 'graphTypeRadio',
      graph_type_list = [
        {id: 'graphDivBarChart',           gtd: $scope.GTD_BAR_CHART,            image_path: '/common/images/bar_chart.jpg',            name: '縦棒グラフ'  },
        {id: 'graphDivHorizontalBarChart', gtd: $scope.GTD_HORIZONTAL_BAR_CHART, image_path: '/common/images/horizontal_bar_chart.jpg', name: '横棒グラフ'  },
        {id: 'graphDivLineChart',          gtd: $scope.GTD_LINE_CHART,           image_path: '/common/images/line_chart.jpg',           name: '折れ線グラフ'},
        {id: 'graphDivAchievement',        gtd: $scope.GTD_ACHIEVEMENT,          image_path: '/common/images/achievement.jpg',          name: '達成度グラフ'}
      ];

    if (mode == 'auto'){
      radio_name += '_auto';
    }

    //縦棒グラフ
    html += '<ul id="graphDivList">';

    $.each(graph_type_list, function(i, v){

      var
        id         = v['id'],
        gtd        = v['gtd'],
        image_path = v['image_path'],
        name       = v['name'];

      if (mode == 'auto'){
        id += '_auto';
      }

      html += '<li>'
           +  '<div class="common-radio">'
           +  '<input type="radio" id="' + id + '" name="' + radio_name + '" value="' + gtd + '" ';

      if (gadget && gadget.graph_type_div == gtd){
        html += 'checked="checked"';
      }

      html += '>'
           + '<label for="' + id + '"></label>'
           + '<br />'
           + '<label for="' + id + '">'
           + '<img src="' + image_path + '" rel="tooltip" data-placement="bottom" data-original-title="' + name + '" alt="' + name + '" />'
           + '</label>'
           + '</div></li>';
    });

/*
    html += '<li>'
         +  '<div class="common-radio">'
         //+  '<input type="radio" id="graphDivBarChart" name="graphTypeRadio" value="1" ';
         +  '<input type="radio" id="graphDivBarChart" name="' + radio_name + '" value="' + $scope.GTD_BAR_CHART + '" ';

    //if (gadget && gadget.graph_type_div == 1){
    if (gadget && gadget.graph_type_div == $scope.GTD_BAR_CHART){
      html += 'checked="checked"';
    }

    html += '>'
         + '<label for="graphDivBarChart"></label>'
         + '<br />'
         + '<label for="graphDivBarChart">'
         + '<img src="/common/images/bar_chart.jpg" rel="tooltip" data-placement="bottom" data-original-title="縦棒グラフ" alt="縦棒グラフ" />'
         + '</label>'
         + '</div></li>';

    //横棒グラフ
    html += '<li>'
         +  '<div class="common-radio">'
         //+  '<input type="radio" id="graphDivHorizontalBarChart" name="graphTypeRadio" value="2" ';
         +  '<input type="radio" id="graphDivHorizontalBarChart" name="' + radio_name + '" value="' + $scope.GTD_HORIZONTAL_BAR_CHART + '" ';

    //if (gadget && gadget.graph_type_div == 2){
    if (gadget && gadget.graph_type_div == $scope.GTD_HORIZONTAL_BAR_CHART){
      html += ' checked="checked" ';
    }

    html += '>'
         + '<label for="graphDivHorizontalBarChart"></label>'
         + '<br />'
         + '<label for="graphDivHorizontalBarChart">'
         + '<img src="/common/images/horizontal_bar_chart.jpg" rel="tooltip" data-placement="bottom" data-original-title="横棒グラフ" alt="横棒グラフ" />'
         + '</label>'
         + '</div></li>';

    //折れ線グラフ
    html += '<li>'
         +  '<div class="common-radio">'
         //+  '<input type="radio" id="graphDivLineChart" name="graphTypeRadio" value="3" ';
         +  '<input type="radio" id="graphDivLineChart" name="'+ radio_name + '" value="' + $scope.GTD_LINE_CHART + '" ';
    //if (gadget && gadget.graph_type_div == 3){
    if (gadget && gadget.graph_type_div == $scope.GTD_LINE_CHART){
      html += ' checked="checked" ';
    }
    html += '>'
         + '<label for="graphDivLineChart"></label>'
         + '<br />'
         + '<label for="graphDivLineChart">'
         + '<img src="/common/images/line_chart.jpg" rel="tooltip" data-placement="bottom" data-original-title="折れ線グラフ" alt="折れ線グラフ" />'
         + '</label>'
         + '</div></li>';

    //達成度グラフ
    html += '<li>'
         +  '<div class="common-radio">'
         //+  '<input type="radio" id="graphDivAchievement" name="graphTypeRadio" value="4" ';
         +  '<input type="radio" id="graphDivAchievement" name="' + radio_name + '" value="' + $scope.GTD_ACHIEVEMENT + '" ';
    //if (gadget && gadget.graph_type_div == 4){
    if (gadget && gadget.graph_type_div == $scope.GTD_ACHIEVEMENT){
      html += ' checked="checked" ';
    }
    html += '>'
         + '<label for="graphDivAchievement"></label>'
         + '<br />'
         + '<label for="graphDivAchievement">'
         + '<img src="/common/images/achievement.jpg" rel="tooltip" data-placement="bottom" data-original-title="達成度グラフ" alt="達成度グラフ" />'
         + '</label>'
         + '</div></li>';
*/

    html += '</ul>';

    return html;
  };

  //分類項目
  $scope.getCategoryFieldHtmlString = function(gadget){

    var
      collection_name = $('input:radio[name=targetDataRadio]:checked').val(),
      html_str        = '<div class="row" style="margin-left: 20px;">'
                      +   '<div>大項目&nbsp;'
                      +     '<label class="common-select">'
                      +       '<select id="largeItemSelector" data-category-select-pane-id="largeCategoryPeriodSelectorPane">'
                      +       '</select>'
                      +       '<i></i>'
                      +     '</label>&nbsp;'
                      +     '<label id="largeCategoryPeriodSelectorPane" name="categoryPeriodSelectorPane" class="common-select" style="display: none;">'
                      +       '<select id="largeCategoryPeriodSelector">'
                      +       '</select>'
                      +       '<i></i>'
                      +     '</label>'
                      +   '</div>'
                      +   '<div>中項目&nbsp;'
                      +     '<label class="common-select">'
                      +       '<select id="middleItemSelector" data-category-select-pane-id="middleCategoryPeriodSelectorPane">'
                      +       '</select>'
                      +       '<i></i>'
                      +     '</label>&nbsp;'
                      +     '<label id="middleCategoryPeriodSelectorPane" name="categoryPeriodSelectorPane" class="common-select" style="display: none;">'
                      +       '<select id="middleCategoryPeriodSelector">'
                      +       '</select>'
                      +       '<i></i>'
                      +     '</label>'
                      +   '</div>'
                      +   '<div>小項目&nbsp;'
                      +     '<label class="common-select">'
                      +       '<select id="smallItemSelector" data-category-select-pane-id="smallCategoryPeriodSelectorPane">'
                      +       '</select>'
                      +       '<i></i>'
                      +     '</label>&nbsp;'
                      +     '<label id="smallCategoryPeriodSelectorPane" name="categoryPeriodSelectorPane" class="common-select" style="display: none;">'
                      +       '<select id="smallCategoryPeriodSelector">'
                      +       '</select>'
                      +       '<i></i>'
                      +     '</label>'
                      +   '</div>'
                      + '</div>';

    if (!collection_name){
      console.log('利用データが選択されていません');
      collection_name = gadget.target_data_name;
    }

    $scope.getOrganItemList(collection_name, gadget);

    return html_str;
  };

  $scope.getAggregationMethodHtmlString = function(organ_item_list, type, aggregation_method){

    var
      method_list = [
        {key: $scope.AM_RECORD_COUNT, value: 'レコード件数'},
        {key: $scope.AM_TOTAL,        value: '合計'        },
        {key: $scope.AM_AVERAGE,      value: '平均'        }
      ],
      html_str = '',
      div_name = 'aggregationMethodSelectorPane';

    //if (gadget && gadget.graph_type_div == $scope.GTD_ACHIEVEMENT){
    if (type == 'gauge'){
      div_name = div_name + '4Gauge';
    }else{
      method_list.push({key: $scope.AM_MAX, value: '最大値'});
      method_list.push({key: $scope.AM_MIN, value: '最小値'});
    }

    html_str += '<div name="' + div_name + '">'
             +  '<label name="aggregationMethodSelector" class="common-select">'
             +    '<select>';

    $.each(method_list, function(i, v){
      html_str += '<option value="' + v['key'] + '" ';

      if (aggregation_method && aggregation_method.aggregation_method_div){
        if (v['key'] == aggregation_method.aggregation_method_div){
          html_str += ' selected ';
        }
      }

      html_str += '>' + v['value'] + '</option>';
    });

    html_str +=   '</select>'
             +    '<i></i>'
             +  '</label>&nbsp;&nbsp;'
             +  '<span  name="aggregationFieldSelectorPane" style="display: ';

    if (aggregation_method && aggregation_method.aggregation_method_div > $scope.AM_RECORD_COUNT){
      html_str += ' inline;">';
    }else{
      html_str += ' none;">';
    }

    html_str +=   '<span>集計値</span>&nbsp;'
             +    '<label class="common-select">'
             +      '<select>';

    if (aggregation_method && aggregation_method.aggregation_method_div > $scope.AM_RECORD_COUNT){
      //html_str += $scope.createAggregationFieldOptionHtmlString($scope.organ_item_list, aggregation_method.aggregation_method_div, aggregation_method.aggregation_field);
      html_str += $scope.createAggregationFieldOptionHtmlString(organ_item_list, aggregation_method.aggregation_method_div, aggregation_method.aggregation_field);
    }

    html_str +=     '</select>'
             +      '<i></i>'
             +    '</label>'
             +  '</span>';

    //if (!gadget || (gadget && gadget.graph_type_div != $scope.GTD_ACHIEVEMENT)){
    if (type == 'chart'){
      html_str += '&nbsp;&nbsp;'
               +  '<button type="button" name="addAggregationMethodButton"    class="common-button" rel="tooltip" data-placement="bottom" data-original-title="追加">+</button>&nbsp;'
               +  '<button type="button" name="deleteAggregationMethodButton" class="common-button" rel="tooltip" data-placement="bottom" data-original-title="削除">-</button>';
               //+  '<span name="addAggregationMethodButton"    class="common-button" rel="tooltip" data-placement="bottom" data-original-title="追加">+</span>&nbsp;'
               //+  '<span name="deleteAggregationMethodButton" class="common-button" rel="tooltip" data-placement="bottom" data-original-title="削除">-</span>';
    }

    html_str += '</div>';

    return html_str;
  };

  $scope.getSortDivHtmlString = function(sort_info){

    var
      sort_div_list = [
        {key: $scope.SD_AGGREGATION_VALUE, value: '集計値' },
        {key: $scope.SD_LARGE_CATEGORY,    value: '大項目' },
        {key: $scope.SD_MIDDLE_CATEGORY,   value: '中項目' },
        {key: $scope.SD_SMALL_CATEGORY,    value: '小項目' }
      ],
      order_div_list = [
        {key: $scope.OD_ASC,  value: '昇順'},
        {key: $scope.OD_DESC, value: '降順'}
      ],
      html_str = '';

    html_str += '<div name="sortDivSelectorPane">'
             +  '<label name="sortDivSelector" class="common-select">'
             +    '<select>';

    $.each(sort_div_list, function(i, v){

      html_str += '<option value="' + v['key'] + '" ';

      if (sort_info && sort_info.sort_div){
        if (v['key'] == sort_info.sort_div){
          html_str += ' selected ';
        }
      }

      html_str += '>' + v['value'] + '</option>';
    });

    html_str +=   '</select>'
             +    '<i></i>'
             +  '</label>&nbsp;&nbsp;'
             +  '<span name="orderDivSelectorPane">'
             +    '<label class="common-select" name="orderDivSelector">'
             +      '<select>';

    $.each(order_div_list, function(i, v){

      html_str += '<option value="' + v['key'] + '" ';

      if (sort_info && sort_info.order_div){
        if (v['key'] == sort_info.order_div){
          html_str += ' selected ';
        }
      }

      html_str += '>' + v['value'] + '</option>';
    });

    html_str +=     '</select>'
             +      '<i></i>'
             +    '</label>'
             +  '</span>&nbsp;&nbsp;'
             +  '<button type="button" name="addSortDivButton"    class="common-button" rel="tooltip" data-placement="bottom" data-original-title="追加">+</button>&nbsp;'
             +  '<button type="button" name="deleteSortDivButton" class="common-button" rel="tooltip" data-placement="bottom" data-original-title="削除">-</button>'
             +  '</div>';

    return html_str;
  };

  $scope.selectTargetData = function(){

    var
      collection_name = $(this).val(),
      $condition_pane = $('#conditionPane'),
      $condition_html = null;

    $('label[name=categoryPeriodSelectorPane]').hide();

    $scope.getOrganItemList(collection_name, null);

    values.collection_name = collection_name;

    $condition_pane.empty();

    $condition_html = $($scope.createConditionHtmlString());

    $condition_html.appendTo($condition_pane);

    $compile($condition_html)($scope);

    $scope.createPreviewGraph();
  };

  $scope.selectCategoryField = function(){
    $scope.selectCategoryFieldEx(this);
  };

  //分類項目選択
  $scope.selectCategoryFieldEx = function(that, options){

    var
      $option               = $(that).find('option:selected'),
      type                  = $option.data('type'),
      category_select_id    = $(that).data('category-select-pane-id'),
      $category_select_pane = $('#' + category_select_id),
      $category_select      = $category_select_pane.find('select'),
      period_list           = [
        {key: '',                 value: '-' },
        {key: $scope.CPD_YEAR,    value: '年' },
        {key: $scope.CPD_QUARTER, value: '四半期' },
        {key: $scope.CPD_MONTH,   value: '月' },
        {key: $scope.CPD_WEEK,    value: '週' },
        {key: $scope.CPD_DAY,     value: '日' }
      ],
      do_preview = true;

    if (options){
      do_preview = options.do_preview;
    }

    $category_select.empty();

    if (type == 'date' || type == 'datetime'){

      //日付、日時の場合集計期間選択を表示する
      if (type == 'datetime'){
        period_list.push({key: $scope.CPD_HOUR,   value: '時' });
        period_list.push({key: $scope.CPD_MINUTE, value: '分' });
      }

      $.each(period_list, function(i, v){

        var
          key   = v['key'],
          value = v['value'],
          str   = '<option value="' + key + '">' + value + '</option>';

        $(str).appendTo($category_select);
      });

      $category_select_pane.show();
    }else{
      $category_select_pane.hide();
    }

    if (do_preview === true){
      $scope.createPreviewGraph();
    }
  };

  $scope.selectCategoryPeriod = function(){
    $scope.createPreviewGraph();
  };

  $scope.selectAggregationMethod = function(){

    var
      aggregation_method             = $(this).val(),
      $parent_div                    = $(this).parent().parent(),
      $aggregation_field_select_pane = $parent_div.find('span[name=aggregationFieldSelectorPane]'),
      $aggregation_field_select      = $aggregation_field_select_pane.find('select'),
      html_str                       = '',
      collection_name                = $('input:radio[name=targetDataRadio]:checked').val(),
      organ_item_list                = $scope.getOrganItemListFromCache(collection_name);

    if (aggregation_method > $scope.AM_RECORD_COUNT){
      //レコード件数以外の場合、集計値選択を表示する
      $aggregation_field_select.empty();

      //html_str = $scope.createAggregationFieldOptionHtmlString($scope.organ_item_list, aggregation_method);
      html_str = $scope.createAggregationFieldOptionHtmlString(organ_item_list, aggregation_method);

      $(html_str).appendTo($aggregation_field_select);

      if ($aggregation_field_select.children('option').size() == 0){
        alert('選択した集計方法で、集計可能な項目がありません');
        $(this).val($scope.AM_RECORD_COUNT);
        $aggregation_field_select_pane.hide();
        return;
      }

      $aggregation_field_select_pane.show();
    }else{
      //レコード件数の場合、集計値選択を非表示にする
      $aggregation_field_select_pane.hide();
    }

    $scope.createPreviewGraph();
  };

  $scope.selectAggregationField = function(){

    $scope.createPreviewGraph();
  };

  $scope.createAggregationFieldOptionHtmlString = function(organ_item_list, aggregation_method, aggregation_field){

    var html_str = '';

    $.each(organ_item_list, function(i, v){

      var
        type         = v['type'],
        field_name   = v['field_name'],
        display_name = v['display_name'],
        option_str   = '';

      if (type == 'number' ||
         ((aggregation_method == $scope.AM_MAX || aggregation_method == $scope.AM_MIN) && (type == 'date' || type == 'datetime'))){
        option_str += '<option value="' + field_name + '"'

        if (aggregation_field && (field_name == aggregation_field)){
          option_str += ' selected ';
        }

        option_str += '>' + display_name + '</option>';
        html_str   += option_str;
      }
    });

    return html_str;
  };

  //集計方法の追加
  $scope.addAggregationMethod = function(){

    var
      collection_name = $('input:radio[name=targetDataRadio]:checked').val(),
      organ_item_list = $scope.getOrganItemListFromCache(collection_name),
      $parent         = $(this).parent().parent(),
      html_str        = $scope.getAggregationMethodHtmlString(organ_item_list, 'chart');

    $(html_str).appendTo($parent);

    //$("[rel=tooltip]").tooltip({container: 'body'});
    $('#aggregationMethodPane [rel=tooltip]').tooltip();

    $scope.createPreviewGraph();
  };

  //集計方法の削除
  $scope.deleteAggregationMethod = function(){

    var
      $parent   = $(this).parent(),
      $pp       = $parent.parent(),
      $children = $pp.children('[name=aggregationMethodSelectorPane]');

    if ($children.size() == 1){
      common.showError('集計方法は最低一つは必要です');
      return;
    }

    common.confirm('確認', '集計方法を削除します。よろしいですか？', function(){
      $parent.remove();

      $scope.createPreviewGraph();
    });
  };

  //ソート区分選択
  $scope.selectSortDiv = function(){

    $scope.createPreviewGraph();
  };

  //オーダー区分選択
  $scope.selectOrderDiv = function(){

    $scope.createPreviewGraph();
  };

  //ソート区分の追加
  $scope.addSortDiv = function(){

    var
      $parent  = $(this).parent().parent(),
      html_str = $scope.getSortDivHtmlString();

    $(html_str).appendTo($parent);

    //$("#sortPane [rel=tooltip]").tooltip({container: 'body'});
    $("#sortPane [rel=tooltip]").tooltip();

    $scope.createPreviewGraph();
  };

  //ソート区分の削除
  $scope.deleteSortDiv = function(){

    var
      $parent   = $(this).parent(),
      $pp       = $parent.parent(),
      $children = $pp.children('[name=sortDivSelectorPane]');

    if ($children.size() == 1){
      alert('ソートは最低一つは必要です');
      return;
    }else if (!confirm('ソートを削除します。よろしいですか？')){
      return;
    }

    $parent.remove();

    $scope.createPreviewGraph();
  };

  //グラフ（自動集計）区分選択
  $scope.changeGraphTypeForGraph = function(options){
    var
      graph_div  = $(this).val(),
      do_preview = true;

    if (options){
      do_preview = options.do_preview;
    }

    if (graph_div == $scope.GTD_ACHIEVEMENT){
      $('#chartControlPane').hide();
      $('#gaugeControlPane').show();
    }else{
      $('#gaugeControlPane').hide();
      $('#chartControlPane').show();
    }

    if (do_preview === true){
      $scope.createPreviewGraph();
    }
  };

  $scope.getOrganItemList = function(collection_name, gadget){

    var
      organ_item_list = $scope.getOrganItemListFromCache(collection_name);

    if (organ_item_list){
      $scope.setGraphControlSettings(organ_item_list, gadget);
    }else{
      $.post(
        '/organ_item/php/organ_item_read.php',
        {collection_name: collection_name},
        function(data){

          if (data.has_error){
            common.showError(data.message);
            return;
          }

          var
            list = data.value.list;

          $scope.setOrganItemListToCache(collection_name, list);

          $scope.setGraphControlSettings(list, gadget);
        }
      );
    }

  };


  $scope.setGraphControlSettings = function(organ_item_list, gadget) {

    var
      $largeSelector = $('#largeItemSelector'),
      func = setInterval(function(){

        $largeSelector = $('#largeItemSelector');

        if ($largeSelector.size() > 0){
          clearInterval(func);

          $scope.setGraphControlSettingsEx(organ_item_list, gadget);
        }
      }, 1000);

  };

  $scope.setGraphControlSettingsEx = function(organ_item_list, gadget){

    var
      $largeSelector                     = $('#largeItemSelector'),
      $middleSelector                    = $('#middleItemSelector'),
      $smallSelector                     = $('#smallItemSelector'),
      $largeCategoryPeriodSelector       = $('#largeCategoryPeriodSelector'),
      $middleCategoryPeriodSelector      = $('#middleCategoryPeriodSelector'),
      $smallCategoryPeriodSelector       = $('#smallCategoryPeriodSelector'),
      $aggregation_method_pane           = $('#aggregationMethodPane'),
      $aggregation_method_pane_for_gauge = $('#aggregationMethodPane4Gauge'),
      $sort_pane                         = $('#sortPane');

    $largeSelector.empty();
    $middleSelector.empty();
    $smallSelector.empty();

    $('<option value="">-</option>').appendTo($largeSelector);
    $('<option value="">-</option>').appendTo($middleSelector);
    $('<option value="">-</option>').appendTo($smallSelector);

    $.each(organ_item_list, function(i, v){

      var
        field_name     = v['field_name'],
        display_name   = v['display_name'],
        type           = v['type'],
        option_str     = '<option value="' + v['field_name'] + '" data-type="' + type + '">' + display_name + '</option>',
        $large_option  = $(option_str),
        $middle_option = $large_option.clone(true),
        $small_option  = $large_option.clone(true);

      $large_option.appendTo($largeSelector);
      $middle_option.appendTo($middleSelector);
      $small_option.appendTo($smallSelector);
    });

    if (gadget){
      if (gadget.large_category_name){
        $largeSelector.val(gadget.large_category_name);
        //$largeSelector.trigger('change');
        $scope.selectCategoryFieldEx($largeSelector, {do_preview: false});

        if (gadget.large_category_period_div){
          $largeCategoryPeriodSelector.val(gadget.large_category_period_div);
        }
      }

      if (gadget.middle_category_name){
        $middleSelector.val(gadget.middle_category_name);
        //$middleSelector.trigger('change');
        $scope.selectCategoryFieldEx($middleSelector, {do_preview: false});

        if (gadget.middle_category_period_div){
          $middleCategoryPeriodSelector.val(gadget.middle_category_period_div);
        }
      }

      if (gadget.small_category_name){
        $smallSelector.val(gadget.small_category_name);
        //$smallSelector.trigger('change');
        $scope.selectCategoryFieldEx($smallSelector, {do_preview: false});

        if (gadget.small_category_period_div){
          $smallCategoryPeriodSelector.val(gadget.small_category_period_div);
        }
      }
    }

    if ($aggregation_method_pane.size() > 0){
      $aggregation_method_pane.empty();
      $($scope.createAggregationMethodHtmlString(gadget, {type: 'chart'})).appendTo($aggregation_method_pane);
    }

    if ($aggregation_method_pane_for_gauge.size() > 0){
      $aggregation_method_pane_for_gauge.empty();
      $($scope.createAggregationMethodHtmlString(gadget, {type: 'gauge'})).appendTo($aggregation_method_pane_for_gauge);
    }

    if ($sort_pane.size() > 0){
      $sort_pane.empty();
      $($scope.createSortDivHtmlString(gadget)).appendTo($sort_pane);
    }

    if ($scope.gadget_mode == $scope.GADGET_MODE_UPDATE){
      //更新時は、分類選択の作成を待ってからプレビューグラフを生成する
      $scope.createPreviewGraph();
    }

  };

  //利用データ
  $scope.getDataTypeHtmlString = function(gadget){

    var
      html = '';

    //データ一覧から選択
    html += '<div>'
         +  '<div class="common-radio">'
         +  '<input type="radio" id="radioDataList" name="dataTypeRadio" value="' + $scope.DT_DATA_LIST + '" ';

    if (gadget && gadget.data_type_div == $scope.DT_DATA_LIST){
      html += 'checked="checked"';
    }

    html += ' />'
         +  '<label for="radioDataList" style="top: 5px; margin-right: 0;"></label>'
         +  '<label for="radioDataList">データ一覧から選択する</label>'
         +  '</div>';

    //データ入力
    html += '<div class="common-radio">'
         +  '<input type="radio" id="radioDataInput" name="dataTypeRadio" value="' + $scope.DT_DATA_INPUT + '" ';

    if (gadget && gadget.data_type_div == $scope.DT_DATA_INPUT){
      html += ' checked="checked" ';
    }

    html += ' />'
         +  '<label for="radioDataInput" style="top: 5px; margin-right: 0;"></label>'
         +  '<label for="radioDataInput">この場でデータを入力する</label>'
         +  '</div>';

    html += '</div>';

    return html;
  };

  //入力年
  $scope.getDataInputYearHtmlString = function(data){

    var html = '',
        date = new Date(),
        year = date.getFullYear(),
        year_arr = [],
        i        = 0,
        target_div = $('#targetSelector').val() ? $('#targetSelector').val() : 1,
        //target_div = $scope.currentTargetDiv,
        data_lists = null;

    if (data && data.data_list){
      data_lists = data.data_list;
    }

    for (i = 2012; i <= (year + 1); i++){
      year_arr.push(i);
    }

    year_arr.reverse();

    html += '<ul class="nav nav-tabs">';

    $.each(year_arr, function(i, v){
      html += '<li';
      if (v == year){
        html += ' class="active"';
      }
      html += '><a data-toggle="tab" href="#content_' + v + '">' + v + '</a></li>';
    });

    html += '</ul>';

    html += '<div class="tab-content">';

    $.each(year_arr, function(i, v){
      var data_list = $scope.getDataListFromYear(v, data_lists);

      html += '<div id="content_' + v + '" class="tab-pane ';
      if (v == year){
        html += 'active';
      }
      html += '">';

      html += $scope.getDataInputHtmlString(v, target_div, data_list)
      html += '</div>';
    });

    html += '</div>';

    return html;
  };

  $scope.getDataListFromYear = function(year, data_list){
    var res = null;

    if (!year){
      return;
    }

    if (!data_list){
      return;
    }

    $.each(data_list, function(i, v){
      if (year == v['year']){
        res = v;
      }
    });

    return res;
  };

  $scope.getDataInputHtmlString = function(year, target_div, data_list){
    var html  = '',
        month = 0,
        key   = null;

    html += '<table class="smart-form input-table" data-year="' + year + '"';
    if (data_list && data_list.data_list_id){
      html += 'data-data-list-id="' + data_list.data_list_id + '"';
    }

    html += ' style="margin: 20px 0;">';
    html += '<tr>';

    for (var i = 0; i < 12; i++){

      if ((i % 4) == 0){
        html += '</tr><tr>';
      }

      if (i == 0 || ((i % 4) == 0)){

        html += '<th>'
             +  '<section class="col col-1">'
             +  '<label class="label">&nbsp;</label>';

        if (target_div == 1){
          html += '<label class="label" style="margin-top: 10px;">目標</label>';
        }

        html += '<label class="label" style="margin-top: 15px;">実績</label>'
             +  '</section>'
             +  '</th>';
      }

      month = i + 1;
      html += '<td><section class="col col-12">' +
              '<label class="label">' + year + '年' + month + '月' + '</label>';

      if (target_div == 1){
        html += '<label class="input">'
             +  '<input type="text" data-month="' + month + '"data-is-target="true" placeholder="" id="targetText_'
             +  (i + 1) + '" style="margin: 0 0 5px 0;" value="';

        key = $scope.createDataListKey('target', month);
        if (data_list && data_list[key]){
          html += data_list[key];
        }

        html += '" />'
             +  '</label>';
      }

      key = $scope.createDataListKey('result', month);

      html += '<label class="input">'
           +  '<input type="text" placeholder="" data-month="' + month + '" id="resultText_' + (i + 1) + '" value="';

      if (data_list && data_list[key]){
        html += data_list[key];
      }

      html += '"/>'
           +  '</label>'
           +  '</section></td>';
    }

    html += '</tr>';
    html += '</table>';

    return html;
  };

  $scope.createDataListKey = function(key_string, month){
    if (!key_string){
      return;
    }
    if (!month){
      return;
    }

    if (month.toString().length == 1){
      month = '0' + month;
    }

    return key_string + month;
  };

  $scope.getGadgetTypeHtmlString = function(gadget){

    var html_str = '<div>';

    html_str += '<ul id="gadgetTypeList" class="smart-form">';

    //グラフ（自動集計）
    html_str += '<li>';
    html_str +=   '<div class="common-radio">';
    html_str +=     '<input type="radio" id="gadgetTypeGraph" name="gadgetTypeRadio" value="11" ';

    if (gadget.gadget_div == 11){
      html_str += ' checked="checked" ';
    }

    html_str +=     '/>'
             +      '<label for="gadgetTypeGraph"></label>'
             +      '<br />'
             +      '<label for="gadgetTypeGraph">'
             +        '<img src="/common/images/graph_auto.jpg" alt="グラフ（自動集計）" data-original-title="グラフ（自動集計）" data-placement="bottom" rel="tooltip" />'
             +      '</label>';
             +    '</div>';
    html_str += '</li>';

    //グラフ（手入力）
    html_str += '<li>';
    html_str +=   '<div class="common-radio">';
    html_str +=     '<input type="radio" id="gadgetTypeData" name="gadgetTypeRadio" value="1" ';
    if (gadget.gadget_div == 1){
      html_str += ' checked="checked" ';
    }
    html_str +=     '/>'
             +      '<label for="gadgetTypeData"></label>'
             +      '<br />'
             +      '<label for="gadgetTypeData">'
             +        '<img src="/common/images/gadget_5.png" alt="グラフ（手入力）" data-original-title="グラフ（手入力）" data-placement="bottom" rel="tooltip" />'
             +      '</label>';
             +    '</div>';
    html_str += '</li>';

    //ディスカッション
    html_str += '<li>';
    html_str +=   '<div class="common-radio">';
    html_str +=     '<input type="radio" id="gadgetTypeDiscussion" name="gadgetTypeRadio" value="3" ';
    if (gadget.gadget_div == 3){
      html_str += ' checked="checked" ';
    }
    html_str +=     '/>'
             +      '<label for="gadgetTypeDiscussion"></label>'
             +      '<br />'
             +      '<label for="gadgetTypeDiscussion">'
             +        '<img src="/common/images/gadget_4.png" alt="ディスカッション" data-original-title="ディスカッション" data-placement="bottom" rel="tooltip" />'
             +      '</label>';
             +    '</div>';
    html_str += '</li>';

    //やることリスト
    html_str += '<li>';
    html_str +=   '<div class="common-radio">';
    html_str +=     '<input type="radio" id="gadgetTypeTodo" name="gadgetTypeRadio" value="2" ';
    if (gadget.gadget_div == 2){
      html_str += ' checked="checked" ';
    }
    html_str +=     '/>'
             +      '<label for="gadgetTypeTodo"></label>'
             +      '<br />'
             +      '<label for="gadgetTypeTodo">'
             +        '<img src="/common/images/gadget_3.png" alt="やることリスト" data-original-title="やることリスト" data-placement="bottom" rel="tooltip" />'
             +      '</label>';
             +    '</div>';
    html_str += '</li>';

    //テキスト・画像挿入
    html_str += '<li>';
    html_str +=   '<div class="common-radio">';
    html_str +=     '<input type="radio" id="gadgetTypeInsert" name="gadgetTypeRadio" value="4" ';
    if (gadget.gadget_div == 4){
      html_str += ' checked="checked" ';
    }
    html_str +=     ' />'
             +      '<label for="gadgetTypeInsert"></label>'
             +      '<br />'
             +      '<label for="gadgetTypeInsert">'
             +        '<img src="/common/images/text_and_image.jpg" alt="テキスト・画像挿入" data-original-title="テキスト・画像挿入" data-placement="bottom" rel="tooltip" />'
             +      '</label>';
             +    '</div>';
    html_str += '</li>';

    html_str += '</ul>';

    html_str += '<div style="clear: both;"></div>';

    html_str += '</div>';
    return html_str;
  };

  // count tasks
  $scope.countTasks = function(){

    $('.todo-group-title').each(function() {
      var $this = $(this);
      $this.find(".num-of-tasks").text($this.next().find("li").size());
    });

  };

  //イベントバインド
  $(document).on('click', 'button[data-resize-button="true"]', function(){
    var widget_id = $(this).data('widget-id'),
        widget    = $('#' + widget_id),
        dialog    = null;

    $scope.widget_id = widget_id;

    if ($(widget).size() > 0){

      dialog = $scope.createResizeDialog();

      $(dialog).dialog({
        modal: true
      });
    }
  });

  $(document).on('click', '#resize_dialog_decide_button', function(){
    var widget_id = $scope.widget_id,
        widget    = $('#' + widget_id),
        col_num   = $('input[name=col_num]:checked').val();

    $(widget).removeClass('col-lg-3');
    $(widget).removeClass('col-lg-6');
    $(widget).removeClass('col-lg-12');

    if (col_num == 1){
      $(widget).addClass('col-lg-3');
    }else if (col_num == 2){
      $(widget).addClass('col-lg-6');
    }else if (col_num == 3){
      $(widget).addClass('col-lg-12');
    }

    $('#resize_dialog').dialog('close');
    //$('#resize_dialog').dialog('destroy');
    //$('#resize_dialog').dialog('widget').remove();
  });

  $(document).on('click', '#resize_dialog_cancel_button', function(){
    $('#resize_dialog').dialog('close');
    //$('#resize_dialog').dialog('destroy');
    //$('#resize_dialog').dialog('widget').remove();
  });

  $scope.createResizeDialog = function(){
    var dialog = $('#resize_dialog');

    if ($(dialog).size() > 0){
      $(dialog).remove();
    }

    dialog = $(
      '<div id="resize_dialog" title="サイズ変更">' +
        '<p>サイズを選択してください</p>' +
        '<form class="smart-form" style="margin: 10px 5px;">' +
        '<label class="radio" for="3col_radio">小<input type="radio" id="3col_radio" name="col_num" value="1" /><i></i></label>' +
        '<label class="radio" for="6col_radio">中<input type="radio" id="6col_radio" name="col_num" value="2" /><i></i></label>' +
        '<label class="radio" for="12col_radio">大<input type="radio" id="12col_radio" name="col_num" value="3" /><i></i></label>' +
        '</form>' +
        '<button id="resize_dialog_decide_button" class="btn btn-primary" style="float: right; margin: 0 0 0 5px;">' +
        '<i class="fa fa-check"></i>&nbsp;確定</button>' +
        '<button id="resize_dialog_cancel_button" class="btn btn-default" style="float: right;">' +
        '<i class="fa fa-times"></i>&nbsp;キャンセル</button>' +
      '</div>'
    );

    $(dialog).appendTo($('body'));

    return dialog;
  };

  $scope.setupJarvisWidgets = function(widget_grid_id){

    //$('#widget-grid').jarvisWidgets({
    $('#' + widget_grid_id).jarvisWidgets({

      grid : 'article',
      widgets : '.jarviswidget',
      localStorage : false,
      deleteSettingsKey : '#deletesettingskey-options',
      settingsKeyLabel : 'Reset settings?',
      deletePositionKey : '#deletepositionkey-options',
      positionKeyLabel : 'Reset position?',
      sortable : true,
      buttonsHidden : false,
      // toggle button
      toggleButton : true,
      toggleClass : 'fa fa-minus | fa fa-plus',
      toggleSpeed : 200,
      onToggle : function() {
      },
      // delete btn
      deleteButton : true,
      deleteClass : 'fa fa-times',
      deleteSpeed : 200,
      onDelete : function() {
      },
      // edit btn
      editButton : true,
      editPlaceholder : '.jarviswidget-editbox',
      editClass : 'fa fa-cog | fa fa-save',
      editSpeed : 200,
      onEdit : function() {
      },
      // color button
      colorButton : true,
      // full screen
      fullscreenButton : true,
      fullscreenClass : 'fa fa-resize-full | fa fa-resize-small',
      fullscreenDiff : 3,
      onFullscreen : function() {
      },
      // custom btn
      customButton : false,
      customClass : 'folder-10 | next-10',
      customStart : function() {
        alert('Hello you, this is a custom button...')
      },
      customEnd : function() {
        alert('bye, till next time...')
      },
      // order
      buttonOrder : '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
      opacity : 1.0,
      dragHandle : '> header',
      placeholderClass : 'jarviswidget-placeholder',
      indicator : true,
      indicatorTime : 600,
      ajax : true,
      timestampPlaceholder : '.jarviswidget-timestamp',
      timestampFormat : 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
      refreshButton : true,
      refreshButtonClass : 'fa fa-refresh',
      labelError : 'Sorry but there was a error:',
      labelUpdated : 'Last Update:',
      labelRefresh : 'Refresh',
      labelDelete : 'Delete widget:',
      afterLoad : function() {
      },
      rtl : false, // best not to toggle this!
      onChange : function() {
      },
      onSave : function(storePositionObj) {
        $scope.saveGadgetOrder();
      },
      ajaxnav : $.navAsAjax // declears how the localstorage should be saved

    });
  };

  $scope.saveGadgetOrder = function(){

    var $widget_list  = $('section .jarviswidget-sortable'),
        display_order = 0,
        result_list   = [];

    $.each($widget_list, function(i, element){
      display_order += 1;

      var gadget_id = $(element).data('gadget-id');

      result_list.push({gadget_id: gadget_id, display_order: display_order});
    });

    $.post(
      '/canvas/php/gadget_order_save.php',
      {gadget_list: result_list},
      function(data){
        if (data.has_error){
          console.log('サーバー側で並び順の保存に失敗しました。' + data.message);
          return;
        }
      }
    );
  };

  //$(document).ready($scope.initialize);
  $scope.initialize();

});

})();
