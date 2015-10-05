var app = angular.module('myApp', ['ngGrid', 'ui.router', 'ngAnimate', 'ngDialog', 'angularFileUpload']);

(function(){

'use strict';

  var REPORT = {
    CREATE          : 0,
    UPDATE          : 1,
    AUTO_REPORT     : 1,//自動
    INPUT_REPORT    : 2//手入力
  };

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('list', {
      url        : '/report_flexible/report_flexible.php',
      controller : 'ReportFlexibleListController',
      templateUrl: '/report_flexible/template/report_flexible_list.php'
    })
    .state('create', {
      url        : '/report_flexible/php/report_flexible.php/create',
      controller : 'ReportFlexibleCreateController',
      templateUrl: '/report_flexible/template/report_flexible_create.php'
    })
    .state('create_detail', {
      url        : '/report_flexible/php/report_flexible.php/create_detail',
      controller : 'ReportFlexibleCreateDetailController',
      templateUrl: '/report_flexible/template/report_flexible_create_detail.php'
    })
    .state('list_detail', {
      url        : '/report_flexible/php/report_flexible.php/list_detail',
      controller : 'ReportFlexibleListDetailController',
      templateUrl: '/report_flexible/template/report_flexible_list_detail.php'
    });
});

app.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});

//変数
app.value('values', {
  title          : 'レポート',
  collection_name: 'report_flexibles',
  collection_singular_name: 'report_flexible',
  currentParent  : {},
  id_name        : 'report_id',
  name_name      : ['report_name'],
  item_setting_options: {
    'use_lookup': false
  },
  listReadUrl              : '/report_flexible/php/report_flexible_read.php',
  createUrl                : '/report_flexible/php/report_flexible_create.php',
  updateUrl                : '/report_flexible/php/report_flexible_update.php',
  deleteUrl                : '/report_flexible/php/report_flexible_delete.php',
  listDtlUrl               : '/report_flexible/php/report_flexible_list_detail.php',
  listDtlReadUrl           : '/report_flexible/php/report_flexible_list_detail_read.php',
  listDtlMatrixReadUrl     : '/report_flexible/php/report_flexible_list_detail_matrix_read.php',
  folderListUrl            : '/report_flexible/php/report_flexible_folder_read.php',
  folderCreateUrl          : '/report_flexible/php/report_flexible_folder_create.php',
  folderUpdateUrl          : '/report_flexible/php/report_flexible_folder_update.php',
  folderDeleteUrl          : '/report_flexible/php/report_flexible_folder_delete.php',
  itemReadUrl              : '/report_flexible/php/report_flexible_item_read.php'
});

app.controller('MyCntr', function($scope, $http){
});

//レポート一覧
app.controller('ReportFlexibleListController', function($scope, $http, $state, $controller, $compile, values, utils, itemManager, listManager, searchManager, ngDialog, contollerParam) {

  $controller('BaseController', {$scope: $scope});

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

  $scope.defaultFolderList = [
    {display_name: 'すべてのフォルダ', collection_name: ''},
    {display_name: '見込客レポート', collection_name: 'prospects'},
    {display_name: '会社レポート', collection_name: 'companies'},
    {display_name: '担当者レポート', collection_name: 'customers'},
    {display_name: '商談レポート', collection_name: 'business_discussions'},
    {display_name: '契約レポート', collection_name: 'contracts'},
    {display_name: '活動履歴レポート', collection_name: 'activity_histories'},
    {display_name: '手入力データ', collection_name: 'datas'}
  ];

  $scope.getPagedDataAsync = function (pageSize, page, filterOptions){

    setTimeout(function(){

      var
        searchText = filterOptions.searchText,
        param   = { rows: pageSize, page: page};

      if (searchText){
        //検索オプション

        param.field_name  = 'report_name';
        param.search_text = searchText;

        param = utils.appendSearchDataToParam(param, filterOptions);
      }

      if ($scope.folder_param){
        param.folder_param  = $scope.folder_param;
      }


      $http.post(
        values.listReadUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        var list = data.list;

        $.each(list, function(i, v){
          v = itemManager.convertObject(v, $scope.my_item_list, {is_list: true});
        });

        $scope.setPagingData(data.list, data.total_count, page, pageSize);

      });
    }, 100);
  };

  $scope.$watch('pagingOptions', function (newVal, oldVal) {
    if (newVal !== oldVal){
      $scope.setPageSize($scope.folder_param.search_text);//ページサイズの保存
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
    plugins: [gridLayoutPlugin]
  };

  $scope.getListDataAsync = function (){
    setTimeout(function(){

      var param   = {};

      $http.post(
        values.folderListUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        var list = data.list,
            listUl = $(listContainer).find('ul'),
            defHtml = '',
            html = '';

        listUl.empty();

        var defClass = '';
        $.each($scope.defaultFolderList, function(i, v){
          if (i == 0) {
            defClass = ' reportItemSelect';
          } else {
            defClass = '';
          }
          defHtml += '<li>'
                   +   '<i class="folderIcon" />'
                   +   '<span ng-click="reloadGridData($event)" class="folderMenu' + defClass + '" name= "' + $scope.defaultFolderList[i].collection_name + '">' + $scope.defaultFolderList[i].display_name + '</span>'
                   + '</li>'
        });

        $.each(list, function(i, v){
            html += '<li class="manualList">'
                  +   '<i class="folderIcon"></i>'
                  +   '<span ng-click="reloadGridData($event)" class="folderMenu">'+ list[i].report_folder_name + '</span>'
                  +   '<i class="functionIcon"  data-toggle="dropdown" ng-click="folderMenu($event)"></i>'
                  +   '<ul class="dropdown-menu folderMenu" _id=' + list[i]._id.$id + ' report_folder_name=' + list[i].report_folder_name +'>'
                  +     '<li>'
                  +       '<a class="folderEdit" ng-click="folderEdit($event)">フォルダ名変更</a>'
                  +     '</li>'
                  +     '<li>'
                  +       '<a class="folderDelete"  ng-click="folderDelete($event)">フォルダ削除</a>'
                  +     '</li>'
                  +   '</ul>'
                  + '</li>';

        });
        listUl.append(defHtml);
        listUl.append(html);

        $compile(listUl)($scope);
      });
    }, 100);
  };

  $scope.folder_param = '';
  $scope.reloadGridData = function($event){
      var folder_name = $event.target.textContent,
          folder_param = {},
          search_text = '',

          existDefaultFolderList = false;

      $.each($scope.defaultFolderList, function(i){
        if ($scope.defaultFolderList[i].display_name == folder_name){
          existDefaultFolderList = true;
          return false;
        }
      });

      if (existDefaultFolderList == true){
        var itemList = $event.target.attributes;
        $.each(itemList, function(i){
          if (itemList[i].name == 'name'){
            search_text = itemList[i].value;
            return false;
          }
        });
        var all_data = false;
        if (search_text == ''){
          all_data = true;
        }
        folder_param = {'field_name': 'report_folder_name', 'search_text': search_text ,'all_data': all_data};
        $scope.folder_param = folder_param;
      } else {
        search_text = folder_name;
        folder_param = {'field_name': 'report_folder_name', 'search_text': search_text ,'all_data': false};
        $scope.folder_param = folder_param;
      }
      var folderList = $event.target.parentNode.parentNode.children;
      $.each(folderList, function(i){
        if (folderList[i].children[1].textContent == folder_name){
          $(folderList[i].children[1]).addClass("reportItemSelect");
        }else {
          $(folderList[i].children[1]).removeClass("reportItemSelect");
        }
      });

    $scope.initPageSize($scope.folder_param.search_text);//ページサイズの初期化
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
  }

  $scope.init = function(){

    var param = {'collection_name': values.collection_name };
// ui-sref="list_detail"
    var columns       = [];
    //グリッド内ボタン
    $scope.buttons = '<div class="common-buttons">'
                   +   '<button tooltip data-original-title="詳細" id="detailButton" type="button" class="common-detail-icon-button" ng-click="detail(row)">&nbsp;</button>&nbsp;'
                   +   '<button tooltip data-original-title="編集" id="editButton"   type="button" class="common-edit-icon-button"   ng-click="edit(row)" ui-sref="create_detail">&nbsp;</button>&nbsp;'
                   +   '<button tooltip data-original-title="削除" id="deleteButton" type="button" class="common-delete-icon-button" ng-click="delete(row)">&nbsp;</button>'
                   + '</div>';

    columns.push({displayName:'操作', cellTemplate: $scope.buttons, width: 140});
    columns.push({field:'report_name', displayName:'レポート名', width: 140});
    columns.push({field:'report_folder_name', displayName:'フォルダ', width: 140});
    columns.push({field:'created_on', displayName:'作成日', width: 140});
    columns.push({field:'created_by', displayName:'作成者', width: 140});

    $scope.my_item_list = columns;
    values.my_item_list = columns;
    $scope.columnDefs = columns;

    var folder_param = {'field_name': 'report_folder_name', 'search_text': '' ,'all_data': true};
    $scope.folder_param = folder_param;
    //起動時folderListデータ読み込み
    $scope.getListDataAsync();
    $scope.initPageSize($scope.folder_param.search_text);//ページサイズの初期化
    //起動時Gridデータ読み込み
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

  };

  //編集
  $scope.edit = function(row){

    var entity = row.entity;
    var params = {entity: entity};
//    if (entity.target_collections == 'datas'){
//      $scope.datamode = REPORT.UPDATE;
//      $scope.showDialog();
//    } else {
      contollerParam.params = params;
      $state.go('create_detail');
//    }
  };

  //削除
  $scope.delete = function(row){

    if (!confirm(values.title + 'を削除してもよろしいですか？')){
      return;
    }

    var _id = row.entity._id.$id;

    $http.post(
      values.deleteUrl,
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

    var entity = row.entity;
    var params = {entity: entity};

    contollerParam.params = params;

    if (entity.target_collections == 'datas'){
      $state.go('create_detail');
    } else {
      $state.go('list_detail');
    }


  };

  //レポートフォルダDlg表示
  $scope.showFolderDialog = function(title,name){
    $scope.report_folder_dialog_title = title;
    $scope.report_folder_name = name;
    ngDialog.open({
      template: '/report_flexible/template/report_flexible_folder_create.php',
      scope: $scope
    });
  };

  //レポートフォルダDlg閉じる
  $scope.closeFolderDialog = function(){
    ngDialog.close();
  };

  //フォルダメニュー表示
  $scope.folderMenu = function($event){

    //スクロール幅を取得
    var html = document.documentElement;
    var body = document.body;
    var scrollTop  = (body.scrollTop || html.scrollTop);
    var scrollLeft  = (body.scrollLeft || html.scrollLeft);
    var bounds = [];
    bounds = $event.target.getBoundingClientRect();
    var x = bounds.left + scrollLeft + 27;
    var y = bounds.top + scrollTop;

    var itemId = $event.target.parentNode.children.item(3).attributes._id;
    var $target = $('ul[' + itemId.name + '=' + itemId.value + ']');
    $target.css("left",x);
    $target.css("top",y);

  }

  $scope.report_folder_name = '';

  //レポートフォルダ作成
  $scope.folderSave = function(){

    var param = {},
        paramItem = {};

    paramItem.report_folder_name = $('#reportFolderNameText').val();
    param.report_folder = paramItem;

    if ($scope.doUpdate === true){
      $scope.doFolderUpdate($scope.report_folder_id)
    }else {
      $http.post(
        values.folderCreateUrl,
        param
      ).success(function(data){
        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }
      });
    }
    if ($scope.doUpdate === false){
      alert('レポートフォルダの作成が完了しました');
    } else {
      alert('レポートフォルダ名の変更が完了しました');
    }

    ngDialog.close();
    $scope.getListDataAsync();
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

  }

  //レポートフォルダ追加
  $scope.folderCreate = function(){
    $scope.doUpdate = false;
    $scope.showFolderDialog('レポートフォルダ追加');
  }
  //レポートフォルダ名称変更
  $scope.folderEdit = function($event){
    $scope.doUpdate = true;
    var element = $event.target.parentNode.parentNode;
    var folderName = element.attributes['report_folder_name'].value;
    $scope.report_folder_id = element.attributes['_id'].value;
    $scope.showFolderDialog('レポートフォルダ名変更', folderName);
  }
  //レポートフォルダ削除
  $scope.folderDelete = function($event){
    var element = $event.target.parentNode.parentNode;

    if (!confirm(element.attributes['report_folder_name'].value + 'を削除してもよろしいですか？')){
       return;
    }

    var _id = element.attributes['_id'].value;

    $scope.doFolderDelete(_id);
    alert('削除処理が完了しました');
    $scope.getListDataAsync();
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

  }

  $scope.doFolderUpdate = function(_id){
    if (_id == undefined){
      return;
    }
    var param   = { report_folder_name: $('#reportFolderNameText').val()};

    $http.post(
      values.folderUpdateUrl,
      {_id: _id, param: param}
    ).success(function(data){
      if (data.has_error){
        myObject.common.showError(data.message);
      }
    });
  }

  $scope.doFolderDelete = function(_id){
    if (_id == undefined){
      return;
    }
    $http.post(
      values.folderDeleteUrl,
      {_id: _id}
    ).success(function(data){
      if (data.has_error){
        myObject.common.showError(data.message);
      }
    });
  }


  $scope.init();

});

// Controller間で引数をやりとりするためのFactory
app.factory('contollerParam', function () {

        // 何も書かないとエラーになったので記載
        return {
        };
    })
;

//レポートタイプを選択
app.controller('ReportFlexibleCreateController', function($scope, $http, $state, $controller, contollerParam) {
  $controller('CreateController', {$scope: $scope});

      $scope.disabledSaveButton = true;
      $scope.reportTypeDisplay = true;

      //レポートアイテムリスト
      $scope.prospectList = [
        {key: "prospects", parentListKey:"prospects", name:"見込客", selected:false, selectClass:""}
      ];

      $scope.companyList = [
        {key: "companies", parentListKey:"companies", name:"会社", selected:false, selectClass:""}
      ];

      $scope.customerList = [
        {key: "customers", parentListKey:"customers", name:"担当者", selected:false, selectClass:""}
      ];

      $scope.businessDiscussionList = [
        {key: "business_discussions", parentListKey:"business_discussions", name:"商談", selected:false, selectClass:""}
      ];

      $scope.contractList = [
        {key: "contracts", parentListKey:"contracts", name:"契約", selected:false, selectClass:""}
      ];

      $scope.activityHistoryList = [
        {key: "activity_histories", parentListKey:"activity_histories", name:"活動履歴", selected:false, selectClass:""}
      ];

      //フォルダリスト
      $scope.reportTypeList = [
        {name:"見込客", key:"prospects", openIconClass:"plusIcon", folderIconClass:"folderIcon", reportItemList:$scope.prospectList, reportItemClass:"ng-hide"},
        {name:"会社", key:"companies", openIconClass:"plusIcon", folderIconClass:"folderIcon", reportItemList:$scope.companyList, reportItemClass:"ng-hide"},
        {name:"担当者", key:"customers", openIconClass:"plusIcon", folderIconClass:"folderIcon", reportItemList:$scope.customerList, reportItemClass:"ng-hide"},
        {name:"商談", key:"business_discussions", openIconClass:"plusIcon", folderIconClass:"folderIcon", reportItemList:$scope.businessDiscussionList, reportItemClass:"ng-hide"},
        {name:"契約", key:"contracts", openIconClass:"plusIcon", folderIconClass:"folderIcon", reportItemList:$scope.contractList, reportItemClass:"ng-hide"},
        {name:"活動履歴", key:"activity_histories", openIconClass:"plusIcon", folderIconClass:"folderIcon", reportItemList:$scope.activityHistoryList, reportItemClass:"ng-hide"}
      ];

      //レポートタイプ選択時
      $scope.reportTypeSelect = function($index){
        $scope.reportTypeListRow = $index;
        if ($scope.reportTypeList[$index].openIconClass == "plusIcon"){
          //フォルダ開く処理
          $scope.reportTypeList[$index].openIconClass = "minusIcon";
          $scope.reportTypeList[$index].reportItemClass = "";
        } else {
          //フォルダ閉じる処理
          $scope.reportTypeList[$index].openIconClass = "plusIcon";
          $scope.reportTypeList[$index].reportItemClass = "ng-hide";
        }
      }

      //レポート項目選択時
      $scope.reportItemSelect = function($index, $event){


        var parentListKey = $event.target.attributes.parentListKey.value;

        $scope.disabledSaveButton = true;
        contollerParam.selectCollectionName  = '';
        contollerParam.selectReportType  = '';
        $.each($scope.reportTypeList, function(i, v){
          if ($scope.reportTypeList[i].key == parentListKey) {
            $scope.reportTypeList[i].reportItemList[$index].selected = true;
            $scope.reportTypeList[i].reportItemList[$index].selectClass = "reportItemSelect";
            $scope.disabledSaveButton = false;
            contollerParam.selectCollectionName = $scope.reportTypeList[i].key;
            contollerParam.selectReportType     = $event.target.attributes.key.value;
          } else {
            $scope.reportTypeList[i].reportItemList[$index].selected = false;
            $scope.reportTypeList[i].reportItemList[$index].selectClass = '';
          }
        });
      }


  $scope.reportTypeDisplay = true;
  contollerParam.reportTypeDiv = REPORT.AUTO_REPORT;

  //レポート作成方法選択
  $scope.selectReportTypeDiv = function($event){
    var target = $event.target;

    if (target.id == 'autoReport'){
      //自動
      $scope.reportTypeDisplay = true;
      contollerParam.reportTypeDiv = REPORT.AUTO_REPORT;
      contollerParam.selectCollectionName = '';

      if (typeof contollerParam.selectCollectionName !== 'undefined'){
        $scope.disabledSaveButton = false;
      } else {
        $scope.disabledSaveButton = true;
      }

    } else {
      //手入力
      $scope.reportTypeDisplay = false;
      contollerParam.reportTypeDiv = REPORT.INPUT_REPORT;
      $scope.disabledSaveButton = false;
      contollerParam.selectCollectionName = 'datas';
    }
  };

});


//レポートを作成
app.controller('ReportFlexibleCreateDetailController', function($scope, $http, $state, $controller, $compile, constants, values, utils, itemManager, listManager, contollerParam) {
  $controller('CreateController', {$scope: $scope});
  $scope.params = contollerParam.params;

  $scope.filterOptions = {
  };

  $scope.totalServerItems = 0;

  $scope.pagingOptions = {
    pageSizes  : [10, 25, 50, 100, 500, 1000, 2500, 5000],
    pageSize   : 25,
    currentPage: 1
  };

  $scope.initPageSize($scope.params.entity.report_name);//ページサイズの初期化

  $scope.showGroupPanel = false;

  $scope.setPagingData = function(data, total, page, pageSize){

    $scope.myData           = data;
    $scope.totalServerItems = total;

    if (!$scope.$$phase){
      $scope.$apply();
    }


  };

  $scope.getRePagedDataAsync = function (){
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
  }

  $scope.getPagedDataAsync = function (pageSize, page, filterOptions){
      setTimeout(function(){

        if ($scope.report_form == 'マトリックス形式') {
          $scope.getPagedDataMatrix(pageSize, page, filterOptions);
        } else {
          $scope.getPagedDataBasic(pageSize, page, filterOptions);
        }
        $scope.selectReportFormAction();

      }, 500);

  };

  $scope.showDropField = false;

  $scope.getPagedDataBasic = function (pageSize, page, filterOptions){

    $('.gridStyle').addClass('ng-hide');
    $('.loadingPane').removeClass('ng-hide');

    var
      param = { rows: pageSize, page: page, collection_name: $scope.collectionName};

      param.condition_list = listManager.getListConditions().list;

    var idxArray = new Array();
    var ordArray = new Array();
    $.each($scope.targetColList, function(i, v){
      if (v['order_div'] != 0){
        idxArray.push(v['field_name']);
        ordArray.push(v['order_div']);
      }
    });
    if (idxArray.length > 0) {
      param.sidx = idxArray;
      param.sord = ordArray;
    }
    $http.post(
      values.listDtlReadUrl,
      param
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }
      var list = data.list;

      $.each(list, function(i, v){
        v = itemManager.convertObject(v, $scope.my_item_list, {is_list: true});
      });

      var colMenuHtml = '<div id="colMenu">'
                  +   '<ul class="colMenu colMenuBase" type="none" ng-show="showColMenu">'
                  +     '<li>'
                  +       '<a class="doOrder" ng-click="doOrder()">昇順に並び替え</a>'
                  +     '</li>'
                  +     '<li>'
                  +       '<a class="doOrderDesc" ng-click="doOrderDesc()">降順に並び替え</a>'
                  +     '</li>'
                  +     '<li>'
                  +       '<a class="doDeleteCol" ng-click="doDeleteCol()">列を削除</a>'
                  +     '</li>'
                  +   '</ul>'
                  + '</div>';

      if ( typeof $('#menuPanel') !== 'undefined'){
        if ($('#menuPanel').find('ul').hasClass('colMenu') == false){
          $('#menuPanel').append(colMenuHtml);
          $compile($('#menuPanel'))($scope);
        }
      }

      $scope.setPagingData(data.list, data.total_count, page, pageSize);

      if ($scope.report_form == 'サマリー形式'){
        var groupcolIndexList = [];
        $.each($scope.targetColList, function(i, v){
          var group_div  = v['group_div'],
              field_name = v['field_name'];
          if (group_div == 1) {
            groupcolIndexList.push(i);
          }
        })

        $scope.gridLayoutPlugin.changeGroupBy(groupcolIndexList, $scope.targetColList.length);
      }

      /*var html = '<div>'
                      +   '<i class="functionIcon" ng-click="colMenu($event)"></i>'
                      + '</div>';
      if ($('.ngHeaderSortColumn > .ngHeaderText').find('i').hasClass('functionIcon') == false){
        $('.ngHeaderText').append(html);
        $compile($('.ngHeaderText'))($scope);
      }*/

      setTimeout(function(){
        $('.ngCellText, .ngHeaderText')

          .sortable({
            cursor     : 'auto',
            //placeholder: 'ui-state-highlight',
            revert     : true,
            stop       : function(event, ui){
            },
            connectWith: 'ngHeaderText, .ngCellText'
          })

          .droppable({
            over: function(e, ui){

              var
                $draggable = $(ui.draggable),
                is_new     = $draggable.data('is-new');
              if (is_new){
                $scope.showDropField = true;

                if (!$scope.$$phase){
                  $scope.$apply();
                }

                var targetIndex = -1;
                $.each(e.target.classList, function(i, v){
                  if (v.indexOf('colt') != -1) {
                    targetIndex = Number(v.slice(4));
                    return false;
                  }
                });

                var leftPos = $('#itemPanel').offset().left + 63 + targetIndex * 100,
                    topPos  = $('#itemPanel').offset().top,
                    $obj     = $('#dropFieldPanel');

                $obj.css('left', leftPos);
                $obj.css('top', topPos);
                $obj.css('width', 100);

                if (targetIndex +1 == $scope.targetColList.length){
                  $obj.css('width', 683 - targetIndex * 100);
                } else {
                  $obj.css('width', 100);
                }

              } else {
                $scope.currentDraggable = $draggable;
                $.each($draggable.find('.colt')[0].classList, function(i, v){
                  if ((v.length > 4) && (v.indexOf('colt') != -1)) {
                    $scope.dragTargetIndex = Number(v.slice(4));
                    return false;
                  }
                });
              }


            },
            out: function(){
              $scope.showDropField = false;

              if (!$scope.$$phase){
                $scope.$apply();
              }

              return;
            },
            drop: function(event, ui){

              if($scope.leftButtonDown){
                //JQuery UI draggableのバグ対応
                return;
              }
              var
                $draggable = $(ui.draggable),
                $droppable = $(event.target),
                is_new     = $draggable.data('is-new'),
                item_name  = $draggable.find('div').html(),
                field_name = $draggable.find('name').html();

              if (is_new){
                var targetIndex = -1;
                $.each($droppable.context.classList, function(i, v){
                  if ((v.length > 4) && (v.indexOf('colt') != -1)) {
                    targetIndex = Number(v.slice(4));
                    return false;
                  }
                });
                //新規追加
                $scope.currentDraggable = $draggable;
                $scope.currentDroppable = $droppable;
                $draggable.data('is-new',false);

                var col = {field_name: field_name, vertical_div: 0, order_div:0, group_div:0, group_order:-1};

                $scope.targetColList.splice(targetIndex +1, 0, col);

                $scope.getColumnDef();

              } else {
                //grid内列順序変更
                var
                  afterDragTargetIndex = -1;

                if ($scope.dragTargetIndex > -1){
                  $.each($scope.currentDraggable.find('.colt')[0].classList, function(i, v){
                    if ((v.length > 4) && (v.indexOf('colt') != -1)) {
                      afterDragTargetIndex = Number(v.slice(4));
                      return false;
                    }
                  });

                  var colList = $scope.targetColList;
                  $scope.targetColList = [];
                  $.each(colList, function(i, v){
                    if (i == afterDragTargetIndex){
                      if ($scope.dragTargetIndex > afterDragTargetIndex){
                        $scope.targetColList.push(colList[$scope.dragTargetIndex]);
                        $scope.targetColList.push(v);
                      } else {
                        $scope.targetColList.push(v);
                        $scope.targetColList.push(colList[$scope.dragTargetIndex]);
                      }


                    } else if (i == $scope.dragTargetIndex){
                      //continue;

                    } else {
                      $scope.targetColList.push(v);

                    }

                  });
                  $scope.dragTargetIndex = -1;
                  $scope.getColumnDef();
                }
              }
            }
          });
      }, 1000);

      $('.loadingPane').addClass('ng-hide');
      $('.gridStyle').removeClass('ng-hide');
    });
  };

  //マトリックス形式時データ読み込み・グリッド描画
  $scope.getPagedDataMatrix = function (pageSize, page, filterOptions){

      $('.gridStyle').addClass('ng-hide');
      $('.loadingPane').removeClass('ng-hide');

      var
        param = { rows: pageSize, page: page, collection_name: $scope.collectionName},
        paramColData,
        paramColDataList,
        paramRowData,
        paramRowDataList;

      param.readDataColList = $scope.targetColList;
      param.readDataRowList = $scope.targetRowList;

      param.condition_list = listManager.getListConditions().list;
      $http.post(
        values.listDtlMatrixReadUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }

        var my_item_list = data.my_item_list;

        $scope.my_item_list = my_item_list;
        values.my_item_list = my_item_list;

        $scope.organ_item_list = data.organ_item_list;

        var columns = $scope.createMatrixColumnDefinisions(my_item_list);

        $scope.columnDefs = columns;

        var list = data.list;

        $.each(list, function(i, v){
          v = itemManager.convertObject(v, $scope.my_item_list, {is_list: true});
        });


      $('div[ng-class*=colt]')
        .sortable({
          cursor     : 'auto',
          placeholder: 'ui-state-highlight',
          revert     : true,
          stop       : function(event, ui){
          },
          connectWith: 'div[ng-class*=colt]'
        })
        .droppable({
          out: function(){
            $scope.showDropField = false;

            if (!$scope.$$phase){
              $scope.$apply();
            }


            return;
          },
          drop: function(event, ui){
            if($scope.leftButtonDown){
              //JQuery UI draggableのバグ対応
              return;
            }
            var
              $draggable = $(ui.draggable),
              $droppable = $(event.target),
              is_new     = $draggable.data('is-new'),
              item_name  = $draggable.find('div').html(),
              field_name = $draggable.find('name').html();

            if (is_new){
              var targetIndex = -1;
              $.each($droppable.context.classList, function(i, v){
                if ((v.length > 4) && (v.indexOf('colt') != -1)) {
                  targetIndex = Number(v.slice(4));
                  return false;
                }
              });

              $scope.currentDraggable = $draggable;
              $scope.currentDroppable = $droppable;

              var col = {field_name: field_name, vertical_div: 0, order_div:0, group_div:0, group_order:-1};

              $scope.targetColList.splice(targetIndex +1, 0, col);

              $draggable.data('is-new',false);
              $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

            }
        }
      });

      $('.ngRow > .col0')
        .sortable({
          cursor     : 'auto',
          placeholder: 'ui-state-highlight',
          revert     : true,
          stop       : function(event, ui){
          },
          connectWith: '.ngRow > .col0'
        })
        .droppable({
          out: function(){
            return;
          },
          drop: function(event, ui){
            if($scope.leftButtonDown){
              //JQuery UI draggableのバグ対応
              return;
            }
            var
              $draggable = $(ui.draggable),
              $droppable = $(event.target),
              is_new     = $draggable.data('is-new'),
              item_name  = $draggable.find('div').html(),
              field_name = $draggable.find('name').html(),

              row = {field: field_name, displayName: item_name, width: 100, visible: true};

            if (is_new){
              var targetIndex = -1;
              $.each($droppable.context.classList, function(i, v){
                if ((v.length > 4) && (v.indexOf('colt') != -1)) {
                  targetIndex = Number(v.slice(4));
                  return false;
                }
              });
              //新規追加
              $scope.currentDraggable = $draggable;
              $scope.currentDroppable = $droppable;

              row = {field_name: field_name, vertical_div: 1, order_div:0, group_div:0, group_order:-1};

              $scope.targetRowList.splice(targetIndex, 0, row);

              $draggable.data('is-new',false);
              $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

            }
        }
      });


      $scope.setPagingData(data.list, data.total_count, page, pageSize);

      var colMenuHtml = '<div id="colMenu">'
                  +   '<ul class="colMenu colMenuBase" type="none" ng-show="showColMenu">'
                  +     '<li>'
                  +       '<a class="doOrder" ng-click="doMatrixOrder(0)">昇順に並び替え</a>'
                  +     '</li>'
                  +     '<li>'
                  +       '<a class="doOrderDesc" ng-click="doMatrixOrderDesc(0)">降順に並び替え</a>'
                  +     '</li>'
                  +     '<li>'
                  +       '<a class="doDeleteCol" ng-click="doMatrixDelete(0)">列を削除</a>'
                  +     '</li>'
                  +   '</ul>'
                  + '</div>';

      var rowMenuHtml = '<div id="rowMenu">'
                  +   '<ul class="colMenu colMenuBase" type="none" ng-show="showRowMenu">'
                  +     '<li>'
                  +       '<a class="doOrder" ng-click="doMatrixOrder(1)">昇順に並び替え</a>'
                  +     '</li>'
                  +     '<li>'
                  +       '<a class="doOrderDesc" ng-click="doMatrixOrderDesc(1)">降順に並び替え</a>'
                  +     '</li>'
                  +     '<li>'
                  +       '<a class="doDeleteCol" ng-click="doMatrixDelete(1)">行を削除</a>'
                  +     '</li>'
                  +   '</ul>'
                  + '</div>';

      if ( typeof $('#menuPanel') !== 'undefined'){
        if ($('#menuPanel').find('ul').hasClass('colMenu') == false){
          $('#menuPanel').append(colMenuHtml);

          $('#menuPanel').append(rowMenuHtml);
          $compile($('#menuPanel'))($scope);

        }
      }


      $('.loadingPane').addClass('ng-hide');
      $('.gridStyle').removeClass('ng-hide');
        //TODO:
        //左二列はヘッダー列なるので固定にする(マトリックス仕様)
//      $scope.gridLayoutPlugin.pinnedCol(0);
//      $scope.gridLayoutPlugin.pinnedCol(1);
    });

  };

  //グリッドカラム設定の作成
  $scope.createMatrixColumnDefinisions = function(list){

    var
      columns = [];

    $.each(list, function(index, value){

      var
        field_name            = value['field_name'],
        display_name          = value['display_name'],
        category_display_name = value['category_display_name'],
        list_div              = value['list_div'],
        type                  = value['type'],
        visible               = value['visible'],
        width                 = value['width'],
        col          = null;

      col = {field: field_name, displayName: display_name,categoryDisplayName: category_display_name, width: 100, visible: (visible === false ? false: true)};

      if (width){
        col.width = width;
      }

      if (type == 'number'){
        col.cellClass = 'grid-cell-align-right';
      }

      if (field_name == 'category_display_name'){
        var html = '<div class="ngCellText" ng-class="col.colIndex()">'
                 +   '<span ng-cell-text>{{COL_FIELD}}</span>'
                 +   '<i class="functionIcon" ng-click="rowMenu($event)"></i>'
                 + '</div>';

        col.cellTemplate = html;
      }

      columns.push(col);
    });

    return columns;
  };

  $scope.doOrder = function (){
    var target = $scope.event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    var targetIndex = -1,
        classIndex = -1;
    $.each(target.classList, function(i, v){
      if ((v.indexOf('colt') != -1) && (v.length > 4)) {
        classIndex = i;
        return false;
      }
    });
    targetIndex = target.classList[classIndex].slice(4);

    var col = $scope.gridLayoutPlugin.getColInfo(targetIndex);
    $.each($scope.targetColList, function(i, v){
      if (v.field_name == col.field){
        var targetCol = $scope.targetColList[i];
        targetCol['order_div'] = 1;
        $scope.targetColList[i] = targetCol;
        return false;
      }
    });

    $scope.showColMenu = !$scope.showColMenu;
    $scope.getColumnDef();

  }

  $scope.doOrderDesc = function (){
    var target = $scope.event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    var targetIndex = -1,
        classIndex = -1;
    $.each(target.classList, function(i, v){
      if ((v.indexOf('colt') != -1) && (v.length > 4)) {
        classIndex = i;
        return false;
      }
    });
    targetIndex = target.classList[classIndex].slice(4);

    var col = $scope.gridLayoutPlugin.getColInfo(targetIndex);
    $.each($scope.targetColList, function(i, v){
      if (v.field_name == col.field){
        var targetCol = $scope.targetColList[i];
        targetCol['order_div'] = -1;
        $scope.targetColList[i] = targetCol;
        return false;
      }
    });

    $scope.showColMenu = !$scope.showColMenu;
    $scope.getColumnDef();
  }

  $scope.doDeleteCol = function (){
    var target = $scope.event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    var targetIndex = -1,
        classIndex = -1;
    $.each(target.classList, function(i, v){
      if ((v.indexOf('colt') != -1) && (v.length > 4)) {
        classIndex = i;
        return false;
      }
    });
    targetIndex = target.classList[classIndex].slice(4);

    var col = $scope.gridLayoutPlugin.getColInfo(targetIndex);
    $.each($scope.targetColList, function(i, v){
      if (v.field_name == col.field){
        $scope.targetColList.splice(i, 1);
        return false;
      }
    });

    $scope.showColMenu = !$scope.showColMenu;
    $scope.getColumnDef();
  }


  $scope.doMatrixOrder = function (vertical_div){

    if (vertical_div == 0 ){
      var target = $scope.event.target.parentNode.parentNode.attributes['name'].nodeValue;
      var listIndex = -1;

      $.each($scope.targetColList, function(i, v){
        if (v['field_name'] == target) {
          listIndex = i;
          return false;
        }
      });

      var col = $scope.targetColList[listIndex];
      col['order_div'] = 1;
      $scope.targetColList[listIndex] = col;

      $scope.showColMenu = !$scope.showColMenu;

    } else {
      var target = $scope.event.target.parentNode.textContent;
      var listIndex = -1;

      $.each($scope.targetRowList, function(i, v){
        var item = itemManager.getItem(v['field_name'], $scope.organ_item_list);
        if (item['display_name'] == target) {
          listIndex = i;
          return false;
        }
      });

      var row = $scope.targetRowList[listIndex];
      row['order_div'] = 1;
      $scope.targetRowList[listIndex] = row;

      $scope.showRowMenu = !$scope.showRowMenu;
    }
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
  }

  $scope.doMatrixOrderDesc = function (vertical_div){

    if (vertical_div == 0 ){
      var target = $scope.event.target.parentNode.parentNode.attributes['name'].nodeValue;
      var listIndex = -1;
      $.each($scope.targetColList, function(i, v){
        if (v['field_name'] == target) {
          listIndex = i;
          return false;
        }
      });

      var col = $scope.targetColList[listIndex];
      col['order_div'] = -1;
      $scope.targetColList[listIndex] = col;

      $scope.showColMenu = !$scope.showColMenu;

    } else {
      var target = $scope.event.target.parentNode.textContent;
      var listIndex = -1;

      $.each($scope.targetRowList, function(i, v){
        var item = itemManager.getItem(v['field_name'], $scope.organ_item_list);
        if (item['display_name'] == target) {
          listIndex = i;
          return false;
        }
      });

      var row = $scope.targetRowList[listIndex];
      row['order_div'] = -1;
      $scope.targetRowList[listIndex] = row;

      $scope.showRowMenu = !$scope.showRowMenu;
    }
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
  }

  $scope.doMatrixDelete = function (vertical_div){

    if (vertical_div == 0 ){
      var target = $scope.event.target.parentNode.parentNode.attributes['name'].nodeValue;
      var listIndex = -1;

      $.each($scope.targetColList, function(i, v){
        if (v['field_name'] == target) {
          listIndex = i;
          return false;
        }
      });

      $scope.targetColList.splice(listIndex, 1);
      $scope.showColMenu = !$scope.showColMenu;

    } else {
      var target = $scope.event.target.parentNode.textContent;
      var listIndex = -1;

      $.each($scope.targetRowList, function(i, v){
        var item = itemManager.getItem(v['field_name'], $scope.organ_item_list);
        if (item['display_name'] == target) {
          listIndex = i;
          return false;
        }
      });

      $scope.targetRowList.splice(listIndex, 1);
      $scope.showRowMenu = !$scope.showRowMenu;
    }
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

  }


  $scope.$watch('pagingOptions', function (newVal, oldVal) {
    if (newVal !== oldVal){
      $scope.setPageSize($scope.params.entity.report_name);//ページサイズの保存
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
    }
  }, true);

  $scope.columnDefs = [];
  $scope.targetColList = [];
  $scope.targetRowList = [];

  $scope.gridLayoutPlugin = new ngGridLayoutPlugin();

  $scope.gridOptions = {
    data                  : 'myData',
    enablePaging          : true,
    showFooter            : true,
    totalServerItems      : 'totalServerItems',
    pagingOptions         : $scope.pagingOptions,
    filterOptions         : $scope.filterOptions,
    columnDefs            : 'columnDefs',
    showGroupPanel        : $scope.showGroupPanel,
    enableSorting         : false,
    enableRowSelection    : false,
    enableColumnResize    : true,
    enableColumnReordering: true,
    i18n                  : 'ja',
    rowHeight             : 50,
    headerRowHeight       : 50,
    footerRowHeight       : 50,
    jqueryUIDraggable     : true,
    plugins               : [$scope.gridLayoutPlugin]
  };

  //レポート情報をDBに保存
  $scope.saveReport = function(){

    var target = $('#report_name').val();
    if (!target){
      alert('レポート名称を入力してください');
      return;
    }

    var reportItems = new Array(),
        param = {},
        paramItem = {},
        groupCols = {};

    paramItem.report_type = $scope.reportType;
    paramItem.report_type_div = $scope.report_type_div;
    paramItem.report_name = $('#report_name').val();
    paramItem.report_folder_id = $scope.report_folders_ids[$('#report_folder_select').val()];
    paramItem.target_collections = $scope.collectionName;//TODO:複数collection対応
    paramItem.report_type_div = $scope.reportTypeDiv;

    if ($scope.reportTypeDiv == REPORT.AUTO_REPORT){
      paramItem.report_form = $('#report_form_select').val();

      groupCols = $scope.gridLayoutPlugin.getGroupCols();
      $.each($scope.targetColList, function(i, v){
        $.each(groupCols, function(ii){
          if (groupCols[ii].field == v['field_name']){
            v['group_div'] = 1;
          }
        });
        reportItems.push($scope.targetColList[i]);
      });
      $.each($scope.targetRowList, function(i){
          reportItems.push($scope.targetRowList[i]);
      });
      paramItem.report_items = reportItems;
      paramItem.conditions = listManager.getListConditions().list;

    } else {
      //手入力内容
      paramItem.target_div = $('#targetSelector').val() ? $('#targetSelector').val() : 1;

      var input_table_arr = $('.inputDatas'),
          data_list       = [];

      $.each(input_table_arr, function(i, v){
        var year         = $(v).data('year'),
            obj          = {year: year},
            input_arr    = $(v).find('input'),
            has_data     = false;

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

      paramItem.data_list = data_list;

    }

    param.report_flexible = paramItem;
    param.mode = $scope.mode;

    if ($scope.mode == REPORT.CREATE){
      $http.post(
        values.createUrl,
        param
      ).success(function(data){
        if (data.result.has_error){
          myObject.common.showError(data.result.message);
          return;
        }
        var _id = {$id : data.id};
        $scope._id = _id;
        alert('レポートの作成が完了しました');

        $scope.saveAfterMovePage(paramItem);
      });
    } else {
      param._id = $scope._id.$id;
      $http.post(
        values.updateUrl,
        param
      ).success(function(data){
        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }
        alert('レポートの更新が完了しました');

        $scope.saveAfterMovePage(paramItem);
      });
    }

  }

  $scope.saveAfterMovePage = function(paramItem){
    if ($scope.reportTypeDiv == REPORT.AUTO_REPORT){

      paramItem._id = $scope._id;
      var params = {entity: paramItem};
      contollerParam.params = params;

      $state.go('list_detail');
    } else {
      $state.go('list');
    }

  }


  $scope.searchGroupCol = function(field_name){
    var groupCols = $scope.gridLayoutPlugin.getGroupCols();
    $.each(groupCols, function(i){
      if (groupCols[i].field == field_name){
        return true;
      }
    });
  }

  //手入力フィールド作成ロジック
  //入力年
  $scope.getDataInputYearHtmlString = function(data){
    var html = '',
        date = new Date(),
        year = date.getFullYear(),
        year_arr = [],
        i        = 0,
        target_div = $('#targetSelector').val() ? $('#targetSelector').val() : 1,
        data_lists = null;

    for (i = 2012; i <= (year + 1); i++){
      year_arr.push(i);
    }

    year_arr.reverse();

    $.each(year_arr, function(i, v){
      html += '<li';
      if (v == year){
        html += ' class="active"';
      }
      html += '><a data-toggle="tab" href="#content_' + v + '">' + v + '</a></li>';
    });

    $(html).appendTo($('ul[class*=nav-tabs]'));

    html = '';

    $.each(year_arr, function(i, v){
      var data_list = $scope.getDataListFromYear(v, data);

      html += '<div id="content_' + v + '" class="tab-pane ';
      if (v == year){
        html += 'active';
      }
      html += '">';

      html += $scope.getDataInputHtmlString(v, target_div, data_list)
      html += '</div>';
    });

    $(html).appendTo($('div[class=tab-content]'));

    $compile($(html))($scope);

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

    html += '<table class="input-table inputDatas" data-year="' + year + '"';

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
          html += '<label class="label inputLabel" style="margin-top: 10px;">目標</label>';
         }
         html +=  '<label class="label inputLabel" style="margin-top: 15px;">実績</label>'
              +  '</section>'
              +  '</th>';
      }

      month = i + 1;
      html += '<td><section class="col col-12">' +
              '<label class="label  inputLabel">' + year + '年' + month + '月' + '</label>';

      if (target_div == 1){
        html += '<label class="input">'
             +  '<input class="common-text inputText" type="text" data-month="' + month + '"data-is-target="true" placeholder="" id="targetText_'
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
           +  '<input  class="common-text inputText" type="text" placeholder="" data-month="' + month + '" id="resultText_' + (i + 1) + '" value="';

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

  //目標あるなし選択
  $scope.clickTargetSelector = function($event){

    var parent    = $($event.target).parent(),
        buttons   = $(parent).find('button'),
        value     = $($event.target).val(),
        year      = $('#yearSelector').prop('value');

    if (!year){
      year = new Date().getFullYear();
    }

    $.each(buttons, function(i, v){
      $(v).removeClass('active');
    });

    $(parent).val(value); //値のセット

    $scope.setAbleToTargetInputElements(value);

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

  $scope.init = function(){
    //レポートフォルダ一覧取得/セット
    $(document).click(function(){
      if ($scope.showColMenu == true && $scope.showColMenuClick == false){
        $scope.showColMenu = false;
        if (!$scope.$$phase){
          $scope.$apply();
        }
      } else {
        $scope.showColMenuClick = false;
      }
    });
    $(document).click(function(){
      if ($scope.showRowMenu == true && $scope.showRowMenuClick == false){
        $scope.showRowMenu = false;
        if (!$scope.$$phase){
          $scope.$apply();
        }
      } else {
        $scope.showRowMenuClick = false;
      }
    });
    $("#colMenu").click(function(e){
    //イベントバブリングの停止
      e.stopPropagation();
    });
    $("#rowMenu").click(function(e){
    //イベントバブリングの停止
      e.stopPropagation();
    });
    $scope.getReportFolders();
    if (typeof $scope.params === 'undefined'){
      $scope.mode = REPORT.CREATE;//新規
      $scope.collectionName = contollerParam.selectCollectionName;
      $scope.reportType = contollerParam.selectReportType;
      $scope.reportTypeDiv = contollerParam.reportTypeDiv;
    } else {
      $scope.mode = REPORT.UPDATE;//編集

      var entity = $scope.params.entity;

      $scope._id = entity._id;
      $scope.collectionName = entity.target_collections;
      $scope.reportType = entity.report_type;
      $scope.reportTypeDiv = entity.report_type_div;
      $('#report_name').val(entity.report_name);
      $scope.report_form = $scope.report_forms[entity.report_form];
      if ($scope.reportTypeDiv == REPORT.AUTO_REPORT){
        //自動
        $.each(entity.report_items, function(i){
          if (entity.report_items[i].vertical_div == 0 ){
            $scope.targetColList.push(entity.report_items[i]);
          } else {
            $scope.targetRowList.push(entity.report_items[i]);
          }
        });
        $scope.condition_list = entity.conditions;
      } else {
        //手入力
        $scope.targetDiv = entity.target_div;
        $scope.dataList = entity.data_list;

      }
    }

    if ($scope.reportTypeDiv == REPORT.AUTO_REPORT){
      $scope.autoReportDisplay  = true;
      $scope.inputReportDisplay = false;

      //抽出条件作成
      values.list_options = {
        //OR条件追加
        afterAddOrCondition      : $scope.getRePagedDataAsync,
        //AND条件追加
        afterAddCondition        : $scope.getRePagedDataAsync,
        //OR条件削除
        afterDeleteCondition     : $scope.getRePagedDataAsync,
        //AND条件削除
        afterDeleteAllCondition  : $scope.getRePagedDataAsync,
        //項目選択変更
        afterItemSelectChange    : $scope.getRePagedDataAsync,
        //演算子選択
        afterOperatorSelectChange: $scope.getRePagedDataAsync,
        //項目値変更
        afterValueElementChange  : $scope.getRePagedDataAsync
      };

      values.condition_list = $scope.condition_list;

      values.collection_name = $scope.collectionName;



      $('#itemPanel > .gridStyle')

        .sortable({
          cursor     : 'auto',
          placeholder: 'ui-state-highlight',
          revert     : true,
          stop       : function(event, ui){
          },
          connectWith: '#itemPanel > .gridStyle'

        })
        .droppable({
          over: function(e, ui){
            var
              leftPos = $('#itemPanel').offset().left + 13,
              topPos  = $('#itemPanel').offset().top,
              $obj    = $('#dropFieldPanel'),
              html = document.documentElement,
              body = document.body,
              scrollLeft  = (body.scrollLeft || html.scrollLeft),
              bounds = [],
              xPosition = e.clientX,
              width = 683,
              itemWidth = $scope.targetColList.length * 100 - 50;

            if (xPosition - leftPos <= itemWidth){
              return;
            }

            if (itemWidth > 0){
              width = width - itemWidth;
              leftPos = leftPos + itemWidth;
            }

            $obj.css('left', leftPos);
            $obj.css('top', topPos);
            $obj.css('height', 547);
            $obj.css('width', width);

            $scope.showDropField = true;

            if (!$scope.$$phase){
              $scope.$apply();
            }
          },
          out: function(){
            $scope.showDropField = false;

            if (!$scope.$$phase){
              $scope.$apply();
            }

            return;
          },
          drop: function(event, ui){

            if($scope.leftButtonDown){
              //JQuery UI draggableのバグ対応
              return;
            }

            var
              leftPos = $('.gridStyle').offset().left + 13,
              topPos  = $('#itemPanel').offset().top,
              $obj     = $('#dropFieldPanel'),
              html = document.documentElement,
              body = document.body,
              scrollLeft  = (body.scrollLeft || html.scrollLeft),
              bounds = [],
              xPosition = event.clientX,
              width = 683,
              itemWidth = $scope.targetColList.length * 100 - 50;

            if (xPosition - leftPos > itemWidth){

              if (itemWidth > 0){
                width = width - itemWidth;
                leftPos = leftPos + itemWidth;
              }

              var
                $draggable = $(ui.draggable),
                $droppable = $(event.target),
                is_new     = $draggable.data('is-new'),
                item_name  = $draggable.find('div').html(),
                field_name = $draggable.find('name').html(),
                col = {field_name: field_name, vertical_div: 0, order_div:0, group_div:0, group_order:-1};

              $scope.targetColList.push(col);

              $draggable.data('is-new',false);

              var $obj     = $('#dropFieldPanel');
              $obj.css('height', 497);
              $obj.css('width', width);
              var $viewObj     = $('.ngViewport');
              $viewObj.css('width', 683);

              $scope.getColumnDef();

              $("#itemPanel > .gridStyle > li").addClass('ng-hide');

              $scope.showDropField = false;

              if (!$scope.$$phase){
                $scope.$apply();
              }

            }
          }
        });

      if (typeof $scope.params !== 'undefined'){
        if ($scope.report_form !== 'マトリックス形式'){
          $scope.getColumnDef();
        } else {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
        }
      } else {
        $scope.selectReportFormAction();
      }
      //選択項目読み込み
      $scope.getSelectItem();

    } else {
      $scope.autoReportDisplay  = false;
      $scope.inputReportDisplay = true;
      $scope.getDataInputYearHtmlString($scope.dataList);

      var buttons   = $('#targetSelector').find('button');

      $.each(buttons, function(i, v){
        if ($(v).val() == $scope.targetDiv){
          $(v).addClass('active');
        } else {
          $(v).removeClass('active');
        }

      });

      $('#targetSelector').val($scope.targetDiv); //値のセット

      $scope.setAbleToTargetInputElements($scope.targetDiv);
    }

  }
  //グリッドカラム設定の作成
  $scope.createColumnDefinisionsForReportEdit = function(list, options){

    var
      columns = [];

    $.each(list, function(index, value){

      var
        field_name   = value['field_name'],
        display_name = value['display_name'],
        list_div     = value['list_div'],
        type         = value['type'],
        visible      = value['visible'],
        width        = value['width'],
        col          = null,
        headerHtml   = '';

      if (!options){
        options = {};
      }

      if (options.isMainList === true && list_div != 1){
        return;
      }

      headerHtml = '<div class="col-md-12 ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !col.noSortVisible() }">'//add class col-md-12
                 +   '<div ng-click="col.sort($event)" ng-class="colt + col.index" class="col-md-12 ngHeaderText">{{col.displayName}}'//add class col-md-12
                 +     '<div><i class="functionIcon" ng-click="colMenu($event)"></i></div>'//not default
                 +   '</div>'
                 +   '<div class="ngSortButtonDown" ng-click="col.sort($event)" ng-show="col.showSortButtonDown()"></div>'
                 +   '<div class="ngSortButtonUp" ng-click="col.sort($event)" ng-show="col.showSortButtonUp()"></div>'
                 +   '<div class="ngSortPriority">{{col.sortPriority}}</div>'
                 +   '<div ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" ng-click="togglePin(col)" ng-show="col.pinnable"></div>'
                 + '</div>'
                 + '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>'

      col = {field: field_name, displayName: display_name, width: 100, visible: (visible === false ? false: true), headerCellTemplate: headerHtml};

      if (width){
        col.width = width;
      }

      if (type == constants.TYPE_NUMBER){
        col.cellClass = 'grid-cell-align-right';
      }

      columns.push(col);
    });

    return columns;
  };

  //my_item_list取得、columnDef作成(表形式/サマリー形式)
  $scope.getColumnDef = function(){
    itemManager.getItemList($scope.collectionName).success(function(data){

      var
        columns          = [],
        my_item_list  = [];

      $.each($scope.targetColList, function(i, v){
        var fieldName = v['field_name'];
        $.each(data.value.list, function(ii, vv){
          if (vv['field_name'] == fieldName){
            my_item_list.push(data.value.list[ii]);
          }
        })
      })


      if (data.has_error){
        myObject.common.showError(data.message);
        return;
      }

      $scope.my_item_list = my_item_list;
      values.my_item_list = my_item_list;

      columns = $scope.createColumnDefinisionsForReportEdit(my_item_list, {isMainList: false});

      $scope.columnDefs = columns;

      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
    });
  }

  //選択項目読み込み
  $scope.getSelectItem = function(){
    var
      $leftItems   = $('#leftItems'),
      $rightItems   = $('#rightItems'),
      param        = [],
      select_items = [];

    //TODO:複数collection対応必要
/*    $.each($scope.collectionName, function(i, v){
      $scope.report_folders.push({'collection_name':$scope.collectionName[i].collectionName});
    });*/

    setTimeout(function(){

      param = {'collection_name': $scope.collectionName};

      $http.post(
        values.itemReadUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        select_items = data.list;

        var html_str = '',
            odd_list  = [],
            even_list = [];
        //デフォルト項目の表示
        if (select_items){
          $.each(select_items, function(i, v){
            var
              index = i + 1;

            if ((index % 2) > 0){
              odd_list.push(v);
            }else{
              even_list.push(v);
            }
          });
        }

        html_str = $scope.createItemsHtmlString(odd_list, $scope);
        $(html_str).appendTo($leftItems);
        html_str = $scope.createItemsHtmlString(even_list, $scope);
        $(html_str).appendTo($rightItems);


        var
          html_str  = '',
          $html    = null;

        $scope.leftButtonDown = null;

        $(document)
          .mousedown(function(e){
            if(e.which === 1) {
              $scope.leftButtonDown = true;
            }
          })
          .mouseup(function(e){
            if(e.which === 1){
              $scope.leftButtonDown = false;
            }
          });

        $('#leftItems li,#rightItems li')
          .draggable({
            connectToSortable: '.ngHeaderText, .ngCellText',
            helper     : 'clone',
            cursor     : 'move',
            placeholder: 'ui-state-highlight',
            start      : function(event, ui){
            },
            stop      : function(event, ui){
              $scope.showDropField = false;

              if (!$scope.$$phase){
                $scope.$apply();
              }

            },
            revert: 'invalid',
            scroll: true,
            zIndex: 9999
          })
          .disableSelection();

      });
    }, 100);

  }

  $scope.showRowMenu = false;
  $scope.showRowMenuClick = false;
  //カラムメニュー表示
  $scope.rowMenu = function($event){
    $scope.showRowMenu = !$scope.showRowMenu;
    $scope.showRowMenuClick = true;
    $scope.event = $event;
    //スクロール幅を取得
    var html = document.documentElement;
    var body = document.body;
    var scrollTop  = (body.scrollTop || html.scrollTop);
    var scrollLeft  = (body.scrollLeft || html.scrollLeft);
    var bounds = [];
    bounds = $event.target.getBoundingClientRect();

    var x = bounds.left + scrollLeft + 20;
    var y = bounds.top + scrollTop;

    var $target = $('#rowMenu > ul');

    $target.css("left",x);
    $target.css("top",y);

  }

  $scope.showColMenu = false;
  $scope.showColMenuClick = false;
  $scope.event = null;
  //カラムメニュー表示
  $scope.colMenu = function($event){
    $scope.showColMenu = !$scope.showColMenu;
    $scope.showColMenuClick = true;
    $scope.event = $event;
    //スクロール幅を取得
    var html = document.documentElement;
    var body = document.body;
    var scrollTop  = (body.scrollTop || html.scrollTop);
    var scrollLeft  = (body.scrollLeft || html.scrollLeft);
    var bounds = [];
    bounds = $event.target.getBoundingClientRect();

    var x = bounds.left + scrollLeft + 20;
    var y = bounds.top + scrollTop;
    var $target = $('#colMenu > ul');

    $target.css("left",x);
    $target.css("top",y);

  }

  $scope.report_folders= [];
  $scope.report_folders_ids = [];
  $scope.report_forms= [
    '表形式',
    'サマリー形式',
    'マトリックス形式'
  ];

  $scope.report_form = '表形式';
  $scope.report_folder= '';


  $scope.getReportFolders = function(){
    setTimeout(function(){

      var param   = {},
          report_folder_items = {};

      $http.post(
        values.folderListUrl,
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

        switch ($scope.collectionName){
          case 'prospects':
            $scope.report_folder = $scope.defaultFolderList[0].report_folder_name;
            break;
          case 'companies':
            $scope.report_folder = $scope.defaultFolderList[1].report_folder_name;
            break;
          case 'customers':
            $scope.report_folder = $scope.defaultFolderList[2].report_folder_name;
            break;
          case 'business_discussions':
            $scope.report_folder = $scope.defaultFolderList[3].report_folder_name;
            break;
          case 'contracts':
            $scope.report_folder = $scope.defaultFolderList[4].report_folder_name;
            break;
          case 'activity_histories':
            $scope.report_folder = $scope.defaultFolderList[5].report_folder_name;
            break;
          case 'datas':
            $scope.report_folder = $scope.defaultFolderList[6].report_folder_name;
            break;
          default:
            $scope.report_folder = $scope.defaultFolderList[0].report_folder_name;
            break;
        }

        //TODO:initで出来るようにする(success内に書かないとreport_folders_idsに値が入らないことがあるため、暫定的にここに書く)
        if (typeof $scope.params !== 'undefined'){
          var entity = $scope.params.entity;
          $scope.report_folder = $scope.report_folders[$scope.report_folders_ids.indexOf(entity.report_folder_id)];
        }

      });

    }, 100);

  }

  //レポート形式切り替え時動作
  $scope.changeDisplayGrid = function(){
    $scope.selectReportFormAction();
    $scope.targetColList = [];
    $scope.targetRowList = [];
    $( '#itemPanel > .gridStyle' ).sortable( 'option', 'disabled', false );
    $( '#itemPanel > .gridStyle' ).droppable( 'option', 'disabled', false );
    $scope.getRePagedDataAsync();
  }

  $scope.selectReportFormAction = function(){
    if ($scope.report_form == 'サマリー形式') {
      $scope.showGroupPanel = true;
      $('.ngGroupPanel').removeClass('ng-hide');
      $('div[category-header=gridOptions]').addClass('ng-hide');

    } else if ($scope.report_form == 'マトリックス形式') {
      $scope.showGroupPanel = false;
      $('.ngGroupPanel').addClass('ng-hide');
      $('div[category-header=gridOptions]').removeClass('ng-hide');

      $scope.gridLayoutPlugin.updateGridLayout();

    } else {
      $scope.showGroupPanel = false;
      $('.ngGroupPanel').addClass('ng-hide');
      $('div[category-header=gridOptions]').addClass('ng-hide');
    }
    if ($scope.targetColList.length > 0) {
      $scope.gridLayoutPlugin.displayGroupPanel($scope.showGroupPanel);
    }

  }


  //itemの一覧作成
  $scope.createItemsHtmlString = function(select_items, scope){
    var
      html_str  = '',
      odd_list  = [],
      even_list = [];

      $.each(select_items, function(i, v){
        var
          type     = v['type'],
          name     = v['display_name'],
          field_name     = v['field_name'];

          html_str += '<li class="ui-state-default" data-type="' + type + '" data-is-new="true" style="height: 30px; width: 150px; padding: 10px;">' +
                        '<div>' + name + '</div>' +
                        '<name style="display:none;">' + field_name + '</name>' +
                      '</li>';

      });

      return html_str;
  }

  $scope.createItemPanelHtmlString = function(item_list, scope){

    var
      html_str  = '',
      odd_list  = [],
      even_list = [];

      html_str += '<li><div class="row" style="background: white;">' +
                    '<div class="col-md-12 itemPanel">';

      //奇数リストと偶数リストの作成
      if (item_list){
        $.each(item_list, function(i, v){
          var
            index = i + 1;

          //if ((index % 2) > 0){
          if (v['align_div'] == 'left'){
            odd_list.push(v);
          }else{
            even_list.push(v);
          }
        });
      }

      html_str += '<div class="row">';

      //左側リスト
      html_str += $scope.createListHtmlString(odd_list, 'oddList', scope);

      //右側リスト
      html_str += $scope.createListHtmlString(even_list, 'evenList', scope);

      html_str += '</div></div>' +
                  '</div></li>';

     return html_str;
  };

  $scope.createListHtmlString = function(list, name, scope){

    var
      html_str = '<div class="col-md-6" style="padding: 0;">' +
                 '<ul name="organItems" class="' + name + '">';

    //項目のループ
    if (list){
      $.each(list, function(index, item){

        html_str += $scope.createItemHtmlString(item, scope);
      });
    }

    html_str += '</ul>'
             +  '</div>';

    return html_str;
  };

  $scope.createItemHtmlString = function(item, scope){
    var
      field_name    = item['field_name'],
      element_id    = 'item_'  + field_name,
      display_name  = item['display_name'],
      ng_model_name = field_name + '.display_name',
      html_str      = '';

    if (scope){
      scope[field_name] = item;
    }

    html_str += '<li class="ui-state-default" data-field-name="' + field_name +'">' +
                   '<div style="height: 30px; width: 40%; padding: 10px;">' +
                     '<span ng-bind="' + ng_model_name + '"></span>' +
                   '</div>' +
                 '</li>';

    return html_str;
  };

  $scope.init();

})
.directive('categoryHeader', ['$compile' ,function($compile) {

  function link(scope, element, attr) {
    scope.$watch('categoryHeader.$gridScope', function(gridScope, oldVal) {
      if (!gridScope) {
        return;
      }
      var viewPort = scope.categoryHeader.$gridScope.domAccessProvider.grid.$viewport[0];
      var headerContainer = scope.categoryHeader.$gridScope.domAccessProvider.grid.$headerContainer[0];

      scope.headerRowHeight=  headerContainer.clientHeight;

      angular.element(viewPort).bind("scroll", function() {
        $(element).find(".categoryHeaderScroller")
          .width($(headerContainer).find(".ngHeaderScroller").width());
        $(element).find(".ngHeaderContainer")
          .scrollLeft($(this).scrollLeft());
      });

      scope.categoryHeader.$gridScope.$on('ngGridEventColumns', function(event, reorderedColumns) {
        createCategories(event, reorderedColumns);

      });

    });

    var createCategories = function(event, cols) {
      scope.categories = [];
      var lastDisplayName = "";
      var lastField = "";
      var totalWidth = 0;
      var left = 0;
      angular.forEach(cols, function(col, key) {
        if (!col.visible) {
          return;
        }
        totalWidth += col.width;
        var displayName = (typeof(col.colDef.categoryDisplayName) === "undefined") ?
          "\u00A0" : col.colDef.categoryDisplayName;
        if (displayName !== lastDisplayName) {
          var field = col.colDef.field;
          var splitIndex = field.lastIndexOf('_');
          field = field.slice(0, splitIndex);
          scope.categories.push({
            displayName: lastDisplayName,
            width: totalWidth - col.width,
            left: left,
            fieldName  : lastField
          });
          left += (totalWidth - col.width);
          totalWidth = col.width;
          lastDisplayName = displayName;
          lastField = field;
         }
      });
      if (totalWidth > 0) {
        scope.categories.push({
          displayName: lastDisplayName,
          width: totalWidth,
          left: left,
          fieldName : lastField
        });
      }
      var $scope = scope.$parent;
      if ($scope.report_form == 'マトリックス形式') {
        setTimeout(function () {

          $('div[ng-class*=colt]')
            .sortable({
              cursor     : 'auto',
              placeholder: 'ui-state-highlight',
              revert     : true,
              stop       : function(event, ui){
              },
              connectWith: 'div[ng-class*=colt]'
            })
            .droppable({
              out: function(){
                return;
              },
              drop: function(event, ui){

                if($scope.leftButtonDown){
                  //JQuery UI draggableのバグ対応
                  return;
                }
                var
                  $draggable = $(ui.draggable),
                  $droppable = $(event.target),
                  is_new     = $draggable.data('is-new'),
                  item_name  = $draggable.find('div').html(),
                  field_name = $draggable.find('name').html();

                if (is_new){
                  var targetIndex = -1;
                  $.each($droppable.context.classList, function(i, v){
                    if ((v.length > 4) && (v.indexOf('colt') != -1)) {
                      targetIndex = Number(v.slice(4));
                      return false;
                    }
                  });

                  $scope.currentDraggable = $draggable;
                  $scope.currentDroppable = $droppable;

                  var col = {field_name: field_name, vertical_div: 0, order_div:0, group_div:0, group_order:-1};

                  $scope.targetColList.splice(targetIndex +1, 0, col);

                  $draggable.data('is-new',false);
                  $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

                }
              }
          });

          $('.ngRow > .col0')
            .sortable({
              cursor     : 'auto',
              placeholder: 'ui-state-highlight',
              revert     : true,
              stop       : function(event, ui){
              },
              connectWith: '.ngRow > .col0'
            })
            .droppable({
              out: function(){
                return;
              },
              drop: function(event, ui){
                var $scope = scope.$parent;
                if($scope.leftButtonDown){
                  //JQuery UI draggableのバグ対応
                  return;
                }
                var
                  $draggable = $(ui.draggable),
                  $droppable = $(event.target),
                  is_new     = $draggable.data('is-new'),
                  item_name  = $draggable.find('div').html(),
                  field_name = $draggable.find('name').html(),
                  row = {field: field_name, displayName: item_name, width: 100, visible: true};

                if (is_new){
                  var targetIndex = -1;
                  $.each($droppable.context.classList, function(i, v){
                    if ((v.length > 4) && (v.indexOf('colt') != -1)) {
                      targetIndex = Number(v.slice(4));
                      return false;
                    }
                  });
                  //新規追加
                  $scope.currentDraggable = $draggable;
                  $scope.currentDroppable = $droppable;

                  row = {field_name: field_name, vertical_div: 1, order_div:0, group_div:0, group_order:-1};

                  $scope.targetRowList.splice(targetIndex, 0, row);

                  $draggable.data('is-new',false);
                  $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

                }
              }
            });

          var html = '<div>'
                   +   '<i class="functionIcon" ng-click="colMenu($event)"></i>'
                   + '</div>';
          var targetObjList = $('.categoryHeaderScroller').children();
          $.each(targetObjList, function(index, item){
            if (index > 1){
              if ($(item).find('i').hasClass('functionIcon') == false){
                $(item).find('.ngHeaderText').append(html);
                $compile($(item).find('.ngHeaderText'))($scope);
              }
            }
          });
        }, 100);
      }

    };
  }
  return {
    scope: {
      categoryHeader: '='
    },
    restrict: 'EA',
    templateUrl: '/report_flexible/template/report_flexible_matrix_header.php',
    link: link
  };

}]);


//レポートを表示
app.controller('ReportFlexibleListDetailController', function($scope, $http, $state, $controller, $compile, ngDialog, values, utils, itemManager, listManager, contollerParam) {
  $controller('CreateController', {$scope: $scope});
  $scope.params = contollerParam.params;

  $scope.filterOptions = {
  };

  $scope.totalServerItems = 0;

  $scope.pagingOptions = {
    pageSizes  : [10, 25, 50, 100, 500, 1000, 2500, 5000],
    pageSize   : 25,
    currentPage: 1
  };

  $scope.initPageSize($scope.params.entity.report_name);//ページサイズの初期化

  $scope.showGroupPanel = false;

  $scope.setPagingData = function(data, total, page, pageSize){

    $scope.myData           = data;
    $scope.totalServerItems = total;

    if (!$scope.$$phase){
      $scope.$apply();
    }

  };

  $scope.$watch('pagingOptions', function (newVal, oldVal) {
    if (newVal !== oldVal){
      $scope.setPageSize($scope.params.entity.report_name);//ページサイズの保存
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
    }
  }, true);

  $scope.columnDefs = [];
  $scope.targetColList = [];
  $scope.targetRowList = [];


  $scope.gridLayoutPlugin = new ngGridLayoutPlugin();

  $scope.gridOptions = {
    data                  : 'myData',
    enablePaging          : true,
    showFooter            : true,
    totalServerItems      : 'totalServerItems',
    pagingOptions         : $scope.pagingOptions,
    filterOptions         : $scope.filterOptions,
    columnDefs            : 'columnDefs',
    showGroupPanel        : $scope.showGroupPanel,
    enableSorting         : false,
    enableRowSelection    : false,
    enableColumnResize    : true,
    enableColumnReordering: true,
    i18n                  : 'ja',
    rowHeight             : 50,
    headerRowHeight       : 50,
    footerRowHeight       : 50,
    jqueryUIDraggable     : true,
    plugins               : [$scope.gridLayoutPlugin]
  };

  $scope.getPagedDataAsync = function (pageSize, page, filterOptions){
    setTimeout(function(){
      if ($scope.report_form == 2){
        $scope.getPagedDataMatrix(pageSize, page, filterOptions);
      } else {
        $scope.getPagedDataBasic(pageSize, page, filterOptions);
      }
    }, 500);

  }

  $scope.getPagedDataBasic = function (pageSize, page, filterOptions){

//gridlayoutが崩れるため一度コメントアウト
//    $('.gridStyle').addClass('ng-hide');
//    $('.loadingPane').removeClass('ng-hide');

    var
      param = { rows: pageSize, page: page, collection_name: $scope.collectionName};

    param.condition_list = listManager.getListConditions().list;

    var idxArray = new Array();
    var ordArray = new Array();
    $.each($scope.targetColList, function(i, v){
      if (v['order_div'] != 0){
        idxArray.push(v['field_name']);
        ordArray.push(v['order_div']);
      }
    });

    $http.post(
      values.listDtlReadUrl,
      param
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }
      var list = data.list;

      $.each(list, function(i, v){
        v = itemManager.convertObject(v, $scope.my_item_list, {is_list: true});
      });

      $scope.setPagingData(data.list, data.total_count, page, pageSize);
      if ($scope.report_form == 1){
        //サマリー形式の場合
        $scope.displaySummaryRow();
      } else {
        $('#displaySummaryButton').addClass('ng-hide');
      }

//gridlayoutが崩れるため一度コメントアウト
//      $('.loadingPane').addClass('ng-hide');
//      $('.gridStyle').removeClass('ng-hide');

    });
  };

  $scope.getPagedDataMatrix = function (pageSize, page, filterOptions){

    $('.gridStyle').addClass('ng-hide');
    $('.loadingPane').removeClass('ng-hide');

    var
      param = { rows: pageSize, page: page, collection_name: $scope.collectionName},
      paramColDataList,
      paramRowDataList;

    param.readDataColList = $scope.targetColList;
    param.readDataRowList = $scope.targetRowList;

    param.condition_list = listManager.getListConditions().list;

    $http.post(
      values.listDtlMatrixReadUrl,
      param
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }

      var my_item_list = data.my_item_list;

      $scope.my_item_list = my_item_list;
      values.my_item_list = my_item_list;

      var columns = $scope.createMatrixColumnDefinisions(my_item_list);

      $scope.columnDefs = columns;

      var list = data.list;

      $.each(list, function(i, v){
        v = itemManager.convertObject(v, $scope.my_item_list, {is_list: true});
      });

      $scope.setPagingData(data.list, data.total_count, page, pageSize);
      $('#displaySummaryButton').addClass('ng-hide');

      $('.loadingPane').addClass('ng-hide');
      $('.gridStyle').removeClass('ng-hide');
      //TODO:
      //左二列はヘッダー列なるので固定にする(マトリックス仕様)
//      $scope.gridLayoutPlugin.pinnedCol(0);
//      $scope.gridLayoutPlugin.pinnedCol(1);
    });

  }

  //グリッドカラム設定の作成
  $scope.createMatrixColumnDefinisions = function(list){

    var
      columns = [];

    $.each(list, function(index, value){

      var
        field_name            = value['field_name'],
        display_name          = value['display_name'],
        category_display_name = value['category_display_name'],
        list_div              = value['list_div'],
        type                  = value['type'],
        visible               = value['visible'],
        width                 = value['width'],
        col          = null;

      col = {field: field_name, displayName: display_name,categoryDisplayName: category_display_name, width: 100, visible: (visible === false ? false: true)};

      if (width){
        col.width = width;
      }

      if (type == 'number'){
        col.cellClass = 'grid-cell-align-right';
      }

      columns.push(col);
    });

    return columns;
  };

  $scope.init = function(){
    $scope.visibleSummaryRow = false;

    var entity = $scope.params.entity;
    $scope._id            = entity._id.$id;
    $scope.collectionName = entity.target_collections;
    $scope.report_name    = entity.report_name;
    $scope.report_form    = entity.report_form;
    $.each(entity.report_items, function(i){
      if (entity.report_items[i].vertical_div == 0 ){
        $scope.targetColList.push(entity.report_items[i]);
      } else {
        $scope.targetRowList.push(entity.report_items[i]);
      }
    })
    $scope.condition_list = entity.conditions;

    values.condition_list = $scope.condition_list;
    values.collection_name = $scope.collectionName;



    $scope.getColumnDef();
  }


  //my_item_list取得、columnDef作成(表形式/サマリー形式)
  $scope.getColumnDef = function(){
    itemManager.getItemList($scope.collectionName).success(function(data){

      var
        columns          = [],
        my_item_list  = [];

      $.each($scope.targetColList, function(i, v){
        var fieldName = v['field_name'];
        $.each(data.value.list, function(ii, vv){
          if (vv['field_name'] == fieldName){
            my_item_list.push(data.value.list[ii]);
          }
        })
      })

      if (data.has_error){
        myObject.common.showError(data.message);
        return;
      }

      $scope.my_item_list = my_item_list;
      values.my_item_list = my_item_list;

      columns = itemManager.createColumnDefinisions(my_item_list, {isMainList: false});

      $scope.columnDefs = columns;

      $scope.getPagedDataAsync();
    });
  }

  $scope.displaySummaryRow = function(){
    var groupcolIndexList = [];

    $.each($scope.targetColList, function(i, v){
      var group_div  = v['group_div'],
          field_name = v['field_name'];
      if (group_div == 1) {
        groupcolIndexList.push(i);
      }
    })

    if ($scope.visibleSummaryRow == false) {
      $scope.visibleSummaryRow = true;
      $('#displaySummaryButton').html('詳細を非表示');
      $scope.gridLayoutPlugin.changeGroupBy(groupcolIndexList, $scope.targetColList.length);
    } else {
      $scope.visibleSummaryRow = false;
      $('#displaySummaryButton').html('詳細を表示');
      $scope.gridLayoutPlugin.removeGroup(groupcolIndexList, $scope.targetColList.length);
    }


  }

  $scope.displaySummaryAction = function(){

    $scope.displaySummaryRow();

  };

  //ファイル出力Dlg表示
  $scope.showExportDialog = function(){
    ngDialog.open({
      template: '/report_flexible/template/report_flexible_file_export.php',
      scope: $scope
    });
  };

  $scope.radioClickAction = function($event){
    var parent    = $($event.target).parent(),
        buttons   = $(parent).find('button'),
        value     = $($event.target).val()

    $.each(buttons, function(i, v){
      $(v).removeClass('active');
    });

    $(parent).val(value);
  }

  //ファイル出力Dlg閉じる
  $scope.closeExportDialog = function(){
    ngDialog.close();
  };

  //出力処理の開始
  $scope.startExport = function(){
    var export_id          = -1,
        status             = 0,
        encode_div         = $('#encode_div').val() || 1,
        file_format_div    = $('#file_format_div').val() || 1,
        dateTime    = new Date(),
        currentDateTime = '',
        file_name   = '';

    currentDateTime += utils.toDoubleDigits(dateTime.getFullYear());
    currentDateTime += utils.toDoubleDigits(dateTime.getMonth() +1);
    currentDateTime += utils.toDoubleDigits(dateTime.getDate());
    currentDateTime += utils.toDoubleDigits(dateTime.getHours());
    currentDateTime += utils.toDoubleDigits(dateTime.getMinutes());
    currentDateTime += utils.toDoubleDigits(dateTime.getSeconds());
    //レポート名_日付時刻
    file_name          = $scope.report_name + '_' + currentDateTime;

    $scope.execExport({
      export_id         : export_id,
      status            : status,
      encode_div        : encode_div,
      file_format_div   : file_format_div,
      file_name         : file_name,
      collection        : $scope.collectionName,
      id                : $scope._id
    });
  };


  //出力処理の実行
  $scope.execExport = function(list){
    if (list.status == 11){
      alert('このデータは現在出力中であるため、出力できません。\n新しく出力情報を作成するか、出力が完了するまでお待ちください。');
      return;
    }

    $scope.showProcessMessage();
    $.post(
      '/export/php/start_export.php',
      {
        'export_id'         : list.export_id,
        'encode_div'        : list.encode_div,
        'file_format_div'   : list.file_format_div,
        'file_name'         : list.file_name,
        'collection'        : list.collection,
        'id'                : list.id
      }
    ).success(function(data){
      if (data.has_error){
        alert('エラーが発生しました。' + data.message);
      }else{
        alert('出力処理を開始しました');
        $scope.export_id = data.export_id.replace(/'/g, '');
        $scope.downloadFile();
      }
      $scope.hideProcessMessage();
    })
  };

  $scope.downloadFile = function(){
    var export_id = $scope.export_id;
    $.post(
      '/export/php/check_file.php',
      {'export_id' : export_id}
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }else{
        //成功時
        location.href = '/export/php/download_file.php?export_id=' + export_id;
        return;
      }
    })
  };

  //処理メッセージの表示
  $scope.showProcessMessage = function(msg){
      $('#grayLayer').show();
      var over = $('#overLayer');
      if (!msg){
        msg = '処理を行っています…';
      }
      over.html(msg);
      over.show();
  };

  //処理メッセージを隠す
  $scope.hideProcessMessage = function(msg){
      $('#grayLayer').hide();
      var over = $('#overLayer');
      over.html('');
      over.hide();
  };


  $scope.init();

});

})();
