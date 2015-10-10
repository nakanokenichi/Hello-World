var app = angular.module('myApp', ['ngGrid', 'ui.router', 'ngAnimate', 'ngDialog', 'angularFileUpload']);

(function(){

'use strict';

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('list', {
      url        : '/prospect/prospect.php',
      controller : 'ProspectListController',
      templateUrl: '/prospect/template/prospect_list.php'
    })
    .state('create', {
      url        : '/prospect/prospect.php/create',
      controller : 'ProspectCreateController',
      templateUrl: '/prospect/template/prospect_create.php'
    })
    .state('update', {
      url        : '/prospect/prospect.php/update/:id',
      controller : 'ProspectUpdateController',
      templateUrl: '/prospect/template/prospect_update.php'
    })
    .state('detail', {
      url  : '/prospect/prospect.php/detail/:id',
      views: {
        "": {
          controller : 'ProspectDetailController',
          templateUrl: '/prospect/template/prospect_detail.php'
        },
        "activityHistories@detail": {
          controller : 'ActivityHistoryListController',
          templateUrl: '/activity_history/template/activity_history_list.php'
        }
      }
    })
    .state('detail.createActivityHistory', {
      url        : '/create_activity_history',
      views: {
        '@': {
          controller : 'ActivityHistoryCreateController',
          templateUrl: '/activity_history/template/activity_history_create.php'
        }
      }
    })
    .state('detail.updateActivityHistory', {
      url        : '/update_activity_history/:detail_list_data_id',
      views: {
        '@': {
          controller : 'ActivityHistoryUpdateController',
          templateUrl: '/activity_history/template/activity_history_update.php'
        }
      }
    })
    //表示項目編集
    .state('editListItem', {
      url: '/prospect/prospect.php/edit_list_item',
      views: {
        '': {
          controller : 'ListItemEditController',
          templateUrl: '/organ_item/template/list_item_edit.php'
        }
      }
    })
    //リスト編集
    .state('editList', {
      url: '/prospect/prospect.php/edit_list/:list_id',
      views: {
        '': {
          controller : 'ListEditController',
          templateUrl: '/list/template/list_edit.php'
        }
      }
    })
    //リスト作成
    .state('createList', {
      url: '/prospect/prospect.php/create_list',
      views: {
        '': {
          controller : 'ListCreateController',
          templateUrl: '/list/template/list_create.php'
        }
      }
    })
    //ファイルからの一括取込
    .state('importFromFile', {
      url: '/prospect/prospect.php/select_import_file',
      views: {
        '': {
          controller : 'ImportFileSelectController',
          templateUrl: '/import/template/import_file_select.php'
        }
      }
    })
    //インポートファイル項目マッピング
    .state('mappingImportFileColumns', {
      url: '/prospect/prospect.php/mapping_import_file_columns/:id',
      views: {
        '': {
          controller : 'ImportFileMappingController',
          templateUrl: '/import/template/import_file_mapping.php'
        }
      }
    })
    //インポート監視
    .state('monitorImportFile', {
      url: '/prospect/prospect.php/import_file_monitor/:id',
      views: {
        '': {
          controller : 'ImportFileMonitorController',
          templateUrl: '/import/template/import_file_monitor.php'
        }
      }
    })
    //項目設定
    .state('item_settings', {
      url: '/prospect/prospect.php/item_settings',
      views: {
        '': {
          controller : 'ItemSettingController',
          templateUrl: '/item_setting/template/item_setting_main.php'
        }
      }
    });
});

app.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});

//変数
app.value('values', {
  title          : '見込客',
  collection_name: 'prospects',
  //parentName     : 'prospect',
  collection_singular_name: 'prospect',
  currentParent  : {},
  id_name        : 'prospect_id',
  name_name      : ['prospect_name'],
  item_setting_options: {
    'use_lookup': false
  },
  listReadUrl  : '/prospect/php/prospect_read.php',
  singleReadUrl: '/prospect/php/prospect_read_single.php',
  createUrl    : '/prospect/php/prospect_create.php',
  updateUrl    : '/prospect/php/prospect_update.php',
  deleteUrl    : '/prospect/php/prospect_delete.php',
});

app.controller('MyCntr', function($scope, $http){
});

//見込客一覧
app.controller('ProspectListController', function($scope, $http, $state, $controller, values, utils, itemManager, listManager, searchManager) {
 
  $controller('ListController', {$scope: $scope});

  var tourNavigation = new TourNavigation();

  $scope.initialize = function(){
    if (tourNavigation.currentTour.id != 0){
      $scope.reStartTour();
    };
  };

  $scope.reStartTour = function(){
    if (tourNavigation.currentTour.id != tourNavigation.TOUR_LEAD
         && tourNavigation.currentTour.id != tourNavigation.TOUR_DB){
      return;
    }
    if (tourNavigation.currentTour.id == tourNavigation.TOUR_LEAD){
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_TOLEADBUTTON
           || tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_TOLEADDETAIL){
        $scope.leadTour3();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_SAVELEAD){
        $scope.leadTour5();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_VIEWLEADLIST){
        $scope.leadTour6();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_FILEIMPORT
           || tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_BACKTOCANVAS){
        $scope.leadTour7();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_TOLDTLBUTTON
           || tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_TOLDTLDETAIL){
        $scope.leadTour10();
        return;
      }
    }
    if (tourNavigation.currentTour.id == tourNavigation.TOUR_DB){
      if (tourNavigation.currentTour.stone == 0){
        $scope.dbTour1();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_OUTLINE){
        $scope.dbTour2();
        return;
      }
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_TOLEADVIEW){
        $scope.dbTour9();
        return;
      }
    }
  };

  $scope.leadTour3 = function(){
    //tourNavigation.hideBalloon('.primary-button');
    tourNavigation.animate(130, $scope.leadTour3ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_TOLEADDETAIL);
  };

  $scope.leadTour3ShowBalloon = function(){
    tourNavigation.showBalloon(".primary-button", {
      //tipSize: 24,
      //offsetY: -80,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（3/13）】＿見込客情報入力画面へ</p><br/>'
                 + '<p style="font-size: 90%;">「見込客を追加する」をクリックしてください。</p></div>'
                 + '<button id="finishToursLead3Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour3closeButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursLead3Button', function(){
      tourNavigation.hideBalloon(".primary-button");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour3closeButton', function(){
      tourNavigation.hideBalloon(".primary-button", false);
    });
  };

  $scope.leadTour5 = function(){
    //tourNavigation.hideBalloon('#gridContainer');
    tourNavigation.animate(180, $scope.leadTour5ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_VIEWLEADLIST);
  };

  $scope.leadTour5ShowBalloon = function(){
    tourNavigation.showBalloon("#gridContainer", {
      tipSize: 24,
      //offsetX: 220,
      //offsetY: -150,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（5/13）】＿一覧への反映</p><br/>'
                 + '<p style="font-size: 90%;">見込客が一件追加されました。</p></div>'
                 + '<button id="finishToursLead5Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour6Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursLead5Button', function(){
      tourNavigation.hideBalloon("#gridContainer");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour6Button', $scope.leadTour6);
  };

  $scope.leadTour6 = function(){
    tourNavigation.hideBalloon('#gridContainer');
    tourNavigation.animate(800, $scope.leadTour6ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_FILEIMPORT);
  };

  $scope.leadTour6ShowBalloon = function(){
    tourNavigation.showBalloon(".upload-button", {
      tipSize: 24,
      //offsetX: 220,
      //offsetY: -150,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（6/13）】＿一括登録</p><br/>'
                 + '<p style="font-size: 90%;">複数の見込客を一括で追加したい場合は、このボタンをクリック</p>'
                 + '<p style="font-size: 90%;">してファイルを取込みます。</p></div>'
                 + '<button id="finishToursLead6Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour7Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursLead6Button', function(){
      tourNavigation.hideBalloon(".upload-button");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour7Button', $scope.leadTour7);
  };

  $scope.leadTour7 = function(){
    tourNavigation.hideBalloon('.upload-button');
    tourNavigation.animate(0, $scope.leadTour7ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_BACKTOCANVAS);
  };

  $scope.leadTour7ShowBalloon = function(){
    tourNavigation.showBalloon("li[data-original-title='キャンバス']", {
      tipSize: 24,
      //offsetX: 220,
      //offsetY: -150,
      position: "bottom right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（7/13）】＿キャンバスに戻る</p><br/>'
                 + '<p style="font-size: 90%;">マイキャンバスに戻って、追加した情報がグラフに反映されて</p>'
                 + '<p style="font-size: 90%;">いるか確認してみましょう。</p></div>'
                 + '<button id="finishToursLead7Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour7closeButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursLead7Button', function(){
      tourNavigation.hideBalloon("li[data-original-title='キャンバス']");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour7closeButton', function(){
      tourNavigation.hideBalloon("li[data-original-title='キャンバス']", false);
    });
  };

  $scope.leadTour10 = function(){
    //tourNavigation.hideBalloon('#gridContainer');
    tourNavigation.animate(220, $scope.leadTour10ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_TOLDTLDETAIL);
  };

  $scope.leadTour10ShowBalloon = function(){
    tourNavigation.showBalloon("#gridContainer", {
      tipSize: 24,
      //offsetX: 220,
      //offsetY: -150,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（10/13）】＿詳細画面へ</p><br/>'
                 + '<p style="font-size: 90%;">任意の行の「詳細」ボタン<img src="/common/images/detail.jpg" />をクリックしてください。</p></div>'
                 + '<button id="finishToursLead10Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour10closeButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursLead10Button', function(){
      tourNavigation.hideBalloon("#gridContainer");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour10closeButton', function(){
      tourNavigation.hideBalloon("#gridContainer", false);
    });
  };

  $scope.dbTour1 = function(){
    //tourNavigation.hideBalloon('.primary-button');
    tourNavigation.animate(0, $scope.dbTour1ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_OUTLINE);
  };

  $scope.dbTour1ShowBalloon = function(){
    tourNavigation.showBalloon("button[data-original-title='設定']", {
      //tipSize: 24,
      //offsetY: -80,
      position: "left bottom",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（1/10）】＿概要</p><br/>'
                 + '<p style="font-size: 90%;">データベースのカスタマイズをしてみましょう。</p>'
                 + '<p style="font-size: 90%;">カスタマイズすることで、業務に必要な項目を表示したり、不要な項目を非表示にすることができます。</p><br />'
                 + '<p style="font-size: 90%;">「設定」をクリックします。</p></div>'
                 + '<button id="finishToursDb1Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour2Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursDb1Button', function(){
      tourNavigation.hideBalloon("button[data-original-title='設定']");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour2Button', $scope.dbTour2);
  };

  $scope.dbTour2 = function(){
    tourNavigation.hideBalloon("button[data-original-title='設定']");
    tourNavigation.animate(0, $scope.dbTour2ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_ITEMSETTINGS);
  };

  $scope.dbTour2ShowBalloon = function(){
    $('.dropdown-menu').css("display", "block");
    tourNavigation.showBalloon('a[href="/prospect/prospect.php/item_settings"]', {
      //tipSize: 24,
      //offsetY: -80,
      position: "left bottom",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（2/10）】＿項目設定へ</p><br/>'
                 + '<p style="font-size: 90%;">「項目設定-見込客」をクリック。</p></div>'
                 + '<button id="finishToursDb2Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour2CloseButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursDb2Button', function(){
      tourNavigation.hideBalloon('a[href="/prospect/prospect.php/item_settings"]');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour2CloseButton', function(){
      tourNavigation.hideBalloon('a[href="/prospect/prospect.php/item_settings"]', false);
    });
  };

  $scope.dbTour9 = function(){
    //tourNavigation.hideBalloon("button[data-original-title='設定']");
    tourNavigation.animate(220, $scope.dbTour9ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_TOLEADDETAIL);
  };

  $scope.dbTour9ShowBalloon = function(){
    tourNavigation.showBalloon('#gridContainer', {
      //tipSize: 24,
      //offsetY: -80,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（9/10）】＿詳細画面へ</p><br/>'
                 + '<p style="font-size: 90%;">任意の行の「詳細」ボタン<img src="/common/images/detail.jpg" />をクリックしてください。</p></div>'
                 + '<button id="finishToursDb9Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour9CloseButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursDb9Button', function(){
      tourNavigation.hideBalloon('#gridContainer');
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour9CloseButton', function(){
      tourNavigation.hideBalloon('#gridContainer', false);
    });
  };

/*
  $scope.filterOptions = {
  };

  $scope.totalServerItems = 0;

  $scope.pagingOptions = {
    pageSizes  : [10, 25, 50, 100],
    pageSize   : 25,
    currentPage: 1
  };

  $scope.setPagingData = function(data, total, page, pageSize){

    $scope.myData           = data;
    $scope.totalServerItems = total;

    if (!$scope.$$phase){
      $scope.$apply();
    }
  };

  $scope.getPagedDataAsync = function (pageSize, page, filterOptions){

    setTimeout(function(){

      var
        //list_id  = $('#listSelect').val() ? $('#listSelect').val() : 1,
        list_id  = $scope.list_id,
        param    = { rows: pageSize, page: page, list_id: list_id };

      if (!list_id){
        list_id = 1;
      }

      if (filterOptions){
        //検索オプション
        var
          field_name  = filterOptions.fieldName,
          search_text = filterOptions.searchText;
        
        if (field_name && search_text){
          param.field_name  = field_name;
          param.search_text = search_text;
        }
      }

      $http.post(
        '/prospect/php/prospect_read.php',
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        var prospect_list = data.list;

        $.each(prospect_list, function(i, prospect){

          prospect = itemManager.convertObject(prospect, $scope.my_item_list);
        });

        $scope.setPagingData(data.list, data.total_count, page, pageSize);
      });
    }, 100);
  };

  $scope.$watch('pagingOptions', function (newVal, oldVal) {
    //if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
    if (newVal !== oldVal){
      //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
    }
  }, true);

  $scope.columnDefs = [];

  var gridLayoutPlugin = new ngGridLayoutPlugin();

  $scope.gridOptions = {
    data              : 'myData',
    enablePaging      : true,
    showFooter        : true,
    totalServerItems  : 'totalServerItems',
    pagingOptions     : $scope.pagingOptions,
    filterOptions     : $scope.filterOptions,
    columnDefs        : 'columnDefs',
    enableRowSelection: false,
    enableColumnResize: true,
    i18n              : 'ja',
    rowHeight         : 50,
    headerRowHeight   : 50,
    footerRowHeight   : 50,
//    plugins: [new ngGridFlexibleHeightPlugin()]
    plugins: [gridLayoutPlugin]
  };

  $scope.init = function(){

    var param        = {'collection_name': 'prospects'};

    listManager.setupListSelect($scope);

    searchManager.setupSearchSelect();

    $http.post(
      //'/organ_item/php/organ_item_read.php',
      '/my_item_list/php/my_item_list_read_single.php',
      param
    ).success(
      function(data){

        var columns          = [],
            //$search_selector = null,
            //$search_text     = null,
            my_item_list  = data.value.list;

        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }

        $scope.my_item_list = my_item_list;

        values.my_item_list = my_item_list;

        $.each(my_item_list, function(index, value){

          var field_name   = value['field_name'],
              display_name = value['display_name'],
              list_div     = value['list_div'];

          if (list_div != 1){
            return;
          }

          //グリッドカラム設定の作成
          columns.push({field: field_name, displayName: display_name, width: 100});

          //検索セレクタの作成
          //$('<option value="' + field_name + '">' + display_name + '</option>').appendTo($search_selector);
        });

        $scope.buttons = '<div class="common-buttons">'
                       +   '<button tooltip data-original-title="詳細" id="detailButton" type="button" class="common-detail-icon-button" ng-click="detail(row)">&nbsp;</button>&nbsp;'
                       +   '<button tooltip data-original-title="編集" id="editButton"   type="button" class="common-edit-icon-button"   ng-click="edit(row)">&nbsp;</button>&nbsp;'
                       +   '<button tooltip data-original-title="削除" id="deleteButton" type="button" class="common-delete-icon-button" ng-click="delete(row)">&nbsp;</button>'
                       + '</div>';

        columns.unshift({displayName:'操作', cellTemplate: $scope.buttons, width: 140});

        $scope.columnDefs = columns;

        //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

        //リストセレクタの監視
        $scope.$watch('list_id', function(newVal, oldVal){
          if (newVal !== oldVal){
            values.list_id = newVal;

            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
          }
        }, true);
      }
    );
  };

  //編集
  $scope.edit = function(row){

    var _id = row.entity._id.$id;

    $state.go('update', {id: _id});
  };

  //削除
  $scope.delete = function(row){

    if (!confirm('見込客情報を削除してもよろしいですか？')){
      return;
    }

    var _id = row.entity._id.$id;

    $http.post(
      '/prospect/php/prospect_delete.php',
      {_id: _id}
    ).success(function(data){
      if (data.has_error){
        myObject.common.showError(data.message);
        return;
      }
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
      alert('削除処理が完了しました');
    });
  };

  //詳細
  $scope.detail = function(row){

    var _id = row.entity._id.$id;

    $state.go('detail', {id: _id});
  };

  //リスト編集
  $scope.editList = function(){

    listManager.editList($scope);
  };

  //リスト削除
  $scope.deleteList = function(){

    var result       = listManager.deleteList(),
        post         = result.post,
        list_id      = result.list_id,
        $list_select = result.$list_select;

    if (post){
      post.success(function(data){

        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }
        alert('リストの削除が完了しました');

        listManager.deleteListOption(list_id);

        $list_select.val(1); //全データにセットする

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
      });
    }

  };

  $scope.init();
  */
  $scope.initialize();
});

app.controller('ProspectCreateController', function($scope, $http, $state, $controller) {

  $controller('CreateController', {$scope: $scope});
  
  var tourNavigation = new TourNavigation();

  $scope.initialize = function(){
    if (tourNavigation.currentTour.id != 0){
      $scope.reStartTour();
    };
  };

  $scope.reStartTour = function(){
    if (tourNavigation.currentTour.id != tourNavigation.TOUR_LEAD){
      return;
    }
    if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_TOLEADDETAIL){
      $scope.leadTour4();
      return;
    }
  };

  $scope.leadTour4 = function(){
    tourNavigation.hideBalloon('.save_button');
    tourNavigation.animate(130, $scope.leadTour4ShowBalloon);
    //tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_SAVELEAD);php（prospect_create.php）側で更新する
  };

  $scope.leadTour4ShowBalloon = function(){
    tourNavigation.showBalloon(".save_button", {
      tipSize: 24,
      offsetX: 220,
      offsetY: -150,
      position: "right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（4/13）】＿入力内容の保存</p><br/>'
                 + '<p style="font-size: 90%;">必要な情報を入力したら、「保存」ボタンをクリックしてください</p>'
                 + '<p style="font-size: 90%;">（赤枠は入力必須項目です）。見込客が一件追加されます。</p></div>'
                 + '<button id="finishToursLead4Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour4closeButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursLead4Button', function(){
      tourNavigation.hideBalloon(".save_button");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour4closeButton', function(){
      tourNavigation.hideBalloon(".save_button", false);
    });
  };
  
  $scope.initialize();
/*
  //初期化
  $scope.init = function(){

  };

  //保存
  $scope.create = function(){

    var prospect = $scope.prospects;

    $http.post(
      '/prospect/php/prospect_create.php',
      prospect
    ).success(function(data){
      if (data.has_error){
        myObject.common.showError(data.message);
        return;
      }

      $state.go('list');
    });
  };

  $scope.init();
*/
});

app.controller('ProspectUpdateController', function($scope, $http, $state, $controller, $stateParams, values) {

  $controller('UpdateController', {$scope: $scope});

/*
  //初期化
  $scope.init = function(){

    var
     _id = $stateParams.id;

    $scope.currentId = _id;

    $http.post(
      '/prospect/php/prospect_read_single.php',
      {_id: _id}
    ).success(function(data){
      if (data.has_error){
        myObject.showError(data.message);
        return;
      }
      $scope.prospects = data.value;
    });

  };

  //更新
  $scope.update = function(){

    $http.post(
      values.updateUrl,
      {_id: $scope.currentId, prospect: $scope.prospects}
    ).success(function(data){
      if (data.has_error){
        myObject.showError(data.message);
        return;
      }

      $state.go('list');
    });

  };

  $scope.init();
*/
});

app.controller('ProspectDetailController', function($scope, $http, $state, $controller, $stateParams, values, itemManager) {

  $controller('DetailController', {$scope: $scope});

  $scope.init({title_field_names: ['last_name', 'first_name']});

  var tourNavigation = new TourNavigation();

  $scope.initialize = function(){
    if (tourNavigation.currentTour.id != 0){
      $scope.reStartTour();
    };
  };

  $scope.reStartTour = function(){
    if (tourNavigation.currentTour.id != tourNavigation.TOUR_LEAD
         && tourNavigation.currentTour.id != tourNavigation.TOUR_DB){
      return;
    }
    if (tourNavigation.currentTour.id == tourNavigation.TOUR_LEAD){
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_TOLDTLDETAIL
          || tourNavigation.currentTour.stone == tourNavigation.TOUR_LEAD_INPUTACTION){
        $scope.leadTour11();
        return;
      }
    }
    if (tourNavigation.currentTour.id == tourNavigation.TOUR_DB){
      if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_TOLEADDETAIL
          || tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_TOURFINISH){
        $scope.dbTour10();
        return;
      }
    }
  };

  $scope.leadTour11 = function(){
    //tourNavigation.hideBalloon('.create_button');
    tourNavigation.animate(800, $scope.leadTour11ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_LEAD, tourNavigation.TOUR_LEAD_INPUTACTION);
  };

  $scope.leadTour11ShowBalloon = function(){
    tourNavigation.showBalloon(".create_button", {
      tipSize: 24,
      //offsetX: 220,
      //offsetY: -150,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【見込客の追加（11/13）】＿活動履歴を追加する</p><br/>'
                 + '<p style="font-size: 90%;">「活動履歴を追加する」ボタンをクリック。</p></div>'
                 + '<button id="finishToursLead11Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="leadTour11closeButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursLead11Button', function(){
      tourNavigation.hideBalloon(".create_button");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#leadTour11closeButton', function(){
      tourNavigation.hideBalloon(".create_button", false);
    });
  };
  
  $scope.dbTour10 = function(){
    //tourNavigation.hideBalloon('.create_button');
    tourNavigation.animate(200, $scope.dbTour10ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_TOURFINISH);
  };

  $scope.dbTour10ShowBalloon = function(){
    tourNavigation.showBalloon("table.detail-table", {
      tipSize: 24,
      //offsetX: 220,
      //offsetY: -150,
      position: "top",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（10/10）】＿確認</p><br/>'
                 + '<p style="font-size: 90%;">追加した項目が表示されました。このように、データベースのカスタマイズができます。</p></div>'
                 + '<button id="finishToursDb10Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="reportTour1Button" type="button" class="common-button" style="float: right;height: 20px;">次のツアー（グラフの作成）へ進む</button>'
//TODO レポートのナビゲーションができたら実装                 + '<button id="reportTour1Button" type="button" class="common-button" style="float: right;height: 20px;">次のツアー（レポートの作成）へ進む</button>'
    });
    $(document).on('click', '#finishToursDb10Button', function(){
      tourNavigation.hideBalloon("table.detail-table");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#reportTour1Button', function(){
      tourNavigation.hideBalloon("table.detail-table");
      tourNavigation.setCurrentTour(tourNavigation.TOUR_GRAPH, 0, function(){
//TODO      tourNavigation.setCurrentTour(tourNavigation.TOUR_REPORT, 0, function(){
        document.location = $('.canvas_nav')[0].href;
      });
    });
  };
  
  $scope.initialize();

  //商談作成
  $scope.createBusinessDiscussion = function(prospect_id){

    var
      param = {prospect_id: prospect_id.id};

    if (!confirm('商談を作成します。\r\n会社情報と担当者情報を自動作成し、データを引き継ぎます。\r\nこの見込客情報は削除されます。\r\nよろしいですか？')){
      return;
    }

    $http.post(
      '/prospect/php/business_discussion_create_from_prospect.php',
      param
    ).success(function(data){

      if (data.has_error){
        myObject.common.showError(data.message);
        return;
      }

      $state.go('list');
      alert('商談の作成が完了しました');
    });
  };

  //$scope.init();

});

})();
