var app = angular.module('myApp', ['ngGrid', 'ui.router', 'ngAnimate', 'ngDialog', 'angularFileUpload']);

(function(){

'use strict';

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('list', {
      url        : '/business_discussion/business_discussion.php',
      controller : 'BusinessDiscussionListController',
      templateUrl: '/business_discussion/template/business_discussion_list.php'
    })
    .state('create', {
      url        : '/business_discussion/business_discussion.php/create',
      controller : 'BusinessDiscussionCreateController',
      templateUrl: '/business_discussion/template/business_discussion_create.php'
    })
    .state('update', {
      url        : '/business_discussion/business_discussion.php/update/:id',
      controller : 'BusinessDiscussionUpdateController',
      templateUrl: '/business_discussion/template/business_discussion_update.php'
    })
    .state('detail', {
      url  : '/business_discussion/business_discussion.php/detail/:id',
      views: {
        "": {
          controller : 'BusinessDiscussionDetailController',
          templateUrl: '/business_discussion/template/business_discussion_detail.php'
        },
        "opportunityMerchandises@detail":{
          controller : 'DetailListOpportunityMerchandiseController',
          templateUrl: '/opportunity_merchandise/template/opportunity_merchandise_list_for_detail_select.php'
        },
        "customers@detail":{
          controller : 'DetailListCustomerController',
          templateUrl: '/customer/template/customer_list_for_detail_select.php'
        },
        "activityHistories@detail": {
          controller : 'ActivityHistoryListController',
          templateUrl: '/activity_history/template/activity_history_list.php'
        }
      }
    })
    //商品の選択
    .state('detail.selectMerchandise', {
      url        : '/select_merchandise',
      views: {
        '@': {
          controller : 'DetailListMerchandiseSelectController',
          templateUrl: '/merchandise/template/merchandise_select_for_detail.php'
        }
      }
    })
    //商品の確認
    .state('detail.checkMerchandise', {
      url        : '/check_merchandise/:ids',
      views: {
        '@': {
          controller : 'DetailListMerchandiseCheckController',
          //controller : 'DetailListOpportunityMerchandiseCheckController',
          templateUrl: '/merchandise/template/merchandise_check_for_detail.php'
          //templateUrl: '/opportunity_merchandise/template/opportunity_merchandise_check_for_detail.php'
        }
      }
    })
    .state('detail.updateOpportunityMerchandise', {
      url        : '/update_opportunity_merchandise/:detail_list_data_id',
      views: {
        '@': {
          controller : 'DetailListOpportunityMerchandiseUpdateController',
          templateUrl: '/opportunity_merchandise/template/opportunity_merchandise_update_for_detail.php'
        }
      }
    })
    //担当者の選択
    .state('detail.selectCustomer', {
      url        : '/select_customer',
      views: {
        '@': {
          controller : 'DetailListCustomerSelectController',
          templateUrl: '/customer/template/customer_select_for_detail.php'
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
      url: '/business_discussion/business_discussion.php/edit_list_item',
      views: {
        '': {
          controller : 'ListItemEditController',
          templateUrl: '/organ_item/template/list_item_edit.php'
        }
      }
    })
    //リスト編集
    .state('editList', {
      url: '/business_discussion/business_discussion.php/edit_list/:list_id',
      views: {
        '': {
          controller : 'ListEditController',
          templateUrl: '/list/template/list_edit.php'
        }
      }
    })
    //リスト作成
    .state('createList', {
      url: '/business_discussion/business_discussion.php/create_list',
      views: {
        '': {
          controller : 'ListCreateController',
          templateUrl: '/list/template/list_create.php'
        }
      }
    })
    //ファイルからの一括取込
    .state('importFromFile', {
      url: '/business_discussion/business_discussion.php/select_import_file',
      views: {
        '': {
          controller : 'ImportFileSelectController',
          templateUrl: '/import/template/import_file_select.php'
        }
      }
    })
    //インポートファイル項目マッピング
    .state('mappingImportFileColumns', {
      url: '/business_discussion/business_discussion.php/mapping_import_file_columns/:id',
      views: {
        '': {
          controller : 'ImportFileMappingController',
          templateUrl: '/import/template/import_file_mapping.php'
        }
      }
    })
    //インポート監視
    .state('monitorImportFile', {
      url: '/business_discussion/business_discussion.php/import_file_monitor/:id',
      views: {
        '': {
          controller : 'ImportFileMonitorController',
          templateUrl: '/import/template/import_file_monitor.php'
        }
      }
    })
    //項目設定
    .state('item_settings', {
      url: '/business_discussion/business_discussion.php/item_settings',
      views: {
        '': {
          controller : 'ItemSettingController',
          templateUrl: '/item_setting/template/item_setting_main.php'
        }
      }
    })
    //見込み客データの引継ぎ設定
    .state('prospect_mapping', {
      url: '/business_discussion/business_discussion.php/prospect_mapping',
      views: {
        '': {
          controller : 'ProspectMappingController',
          templateUrl: '/item_setting/template/item_mapping.php'
        }
      }
    });
});

app.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});

//変数
app.value('values', {
  title          : '商談',
  collection_name: 'business_discussions',
  collection_singular_name: 'business_discussion',
  currentParent  : {},
  id_name        : 'business_discussion_id',
  name_name      : ['business_discussion_name'],
  item_setting_options: {
    'use_lookup': false
  },
  listReadUrl  : '/business_discussion/php/business_discussion_read.php',
  singleReadUrl: '/business_discussion/php/business_discussion_read_single.php',
  createUrl    : '/business_discussion/php/business_discussion_create.php',
  updateUrl    : '/business_discussion/php/business_discussion_update.php',
  deleteUrl    : '/business_discussion/php/business_discussion_delete.php',
  detail_list_options: {
    customer : {
      mode: 'select'
    }
  }

});

app.controller('MyCntr', function($scope, $http){
});

//一覧
app.controller('BusinessDiscussionListController', function($scope, $http, $state, $controller, values, utils, itemManager, listManager, searchManager) {

  $controller('ListController', {$scope: $scope});
});

//作成
app.controller('BusinessDiscussionCreateController', function($scope, $http, $state, $controller) {

  $controller('CreateController', {$scope: $scope});
});

//更新
app.controller('BusinessDiscussionUpdateController', function($scope, $http, $state, $controller, $stateParams, values) {

  $controller('UpdateController', {$scope: $scope});
});

//詳細
app.controller('BusinessDiscussionDetailController', function($scope, $http, $state, $controller, $stateParams, values, itemManager) {

  $controller('DetailController', {$scope: $scope});

  $scope.init({title_field_names: ['business_discussion_name']});
});

})();
