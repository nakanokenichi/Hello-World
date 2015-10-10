var app = angular.module('myApp', ['ngGrid', 'ui.router', 'ngAnimate', 'ngDialog', 'angularFileUpload']);

(function(){

'use strict';

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('list', {
      url        : '/customer/customer.php',
      controller : 'CustomerListController',
      templateUrl: '/customer/template/customer_list.php'
    })
    .state('create', {
      url        : '/customer/customer.php/create',
      controller : 'CustomerCreateController',
      templateUrl: '/customer/template/customer_create.php'
    })
    .state('update', {
      url        : '/customer/customer.php/update/:id',
      controller : 'CustomerUpdateController',
      templateUrl: '/customer/template/customer_update.php'
    })
    .state('detail', {
      url  : '/customer/customer.php/detail/:id',
      views: {
        "": {
          controller : 'CustomerDetailController',
          templateUrl: '/customer/template/customer_detail.php'
        },
        "businessDiscussions@detail":{
          controller : 'DetailListBusinessDiscussionController',
          templateUrl: '/business_discussion/template/business_discussion_list_for_detail.php'
        },
        "businessContracts@detail":{
          controller : 'DetailListBusinessContractController',
          templateUrl: '/business_contract/template/business_contract_list_for_detail.php'
        },
        "activityHistories@detail": {
          controller : 'ActivityHistoryListController',
          templateUrl: '/activity_history/template/activity_history_list.php'
        }
      }
    })
    .state('detail.createBusinessDiscussion', {
      url        : '/create_business_discussion',
      views: {
        '@': {
          controller : 'DetailListBusinessDiscussionCreateController',
          templateUrl: '/business_discussion/template/business_discussion_create_for_detail.php'
        }
      }
    })
    .state('detail.updateBusinessDiscussion', {
      url        : '/update_business_discussion/:detail_list_data_id',
      views: {
        '@': {
          controller : 'DetailListBusinessDiscussionUpdateController',
          templateUrl: '/business_discussion/template/business_discussion_update_for_detail.php'
        }
      }
    })
    .state('detail.createBusinessContract', {
      url        : '/create_business_contract',
      views: {
        '@': {
          controller : 'DetailListBusinessContractCreateController',
          templateUrl: '/business_contract/template/business_contract_create_for_detail.php'
        }
      }
    })
    .state('detail.updateBusinessContract', {
      url        : '/update_business_contract/:detail_list_data_id',
      views: {
        '@': {
          controller : 'DetailListBusinessContractUpdateController',
          templateUrl: '/business_contract/template/business_contract_update_for_detail.php'
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
    .state('detail.detailActivityHistory', {
      url        : '/update_activity_history/:detail_list_data_id',
      views: {
        '@': {
          controller : 'ActivityHistoryDetailController',
          templateUrl: '/activity_history/template/activity_history_detail.php'
        }
      }
    })
    //表示項目編集
    .state('editListItem', {
      url: '/customer/customer.php/edit_list_item',
      views: {
        '': {
          controller : 'ListItemEditController',
          templateUrl: '/organ_item/template/list_item_edit.php'
        }
      }
    })
    //リスト編集
    .state('editList', {
      url: '/customer/customer.php/edit_list/:list_id',
      views: {
        '': {
          controller : 'ListEditController',
          templateUrl: '/list/template/list_edit.php'
        }
      }
    })
    //リスト作成
    .state('createList', {
      url: '/customer/customer.php/create_list',
      views: {
        '': {
          controller : 'ListCreateController',
          templateUrl: '/list/template/list_create.php'
        }
      }
    })
    //ファイルからの一括取込
    .state('importFromFile', {
      url: '/customer/customer.php/select_import_file',
      views: {
        '': {
          controller : 'ImportFileSelectController',
          templateUrl: '/import/template/import_file_select.php'
        }
      }
    })
    //インポートファイル項目マッピング
    .state('mappingImportFileColumns', {
      url: '/customer/customer.php/mapping_import_file_columns/:id',
      views: {
        '': {
          controller : 'ImportFileMappingController',
          templateUrl: '/import/template/import_file_mapping.php'
        }
      }
    })
    //インポート監視
    .state('monitorImportFile', {
      url: '/customer/customer.php/import_file_monitor/:id',
      views: {
        '': {
          controller : 'ImportFileMonitorController',
          templateUrl: '/import/template/import_file_monitor.php'
        }
      }
    })
    //項目設定
    .state('item_settings', {
      url: '/customer/customer.php/item_settings',
      views: {
        '': {
          controller : 'ItemSettingController',
          templateUrl: '/item_setting/template/item_setting_main.php'
        }
      }
    })
    //見込み客データの引継ぎ設定
    .state('prospect_mapping', {
      url: '/customer/customer.php/prospect_mapping',
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
  title          : '担当者',
  collection_name: 'customers',
  //data_name      : 'customer',
  //parentName     : 'customer',
  collection_singular_name: 'customer',
  currentParent    : {},
  id_name          : 'customer_id',
  name_name        : ['last_name', 'first_name'],
  public_name_name : 'customer_name',
  item_setting_options: {
    'use_lookup': false
  },
  listReadUrl  : '/customer/php/customer_read.php',
  singleReadUrl: '/customer/php/customer_read_single.php',
  createUrl    : '/customer/php/customer_create.php',
  updateUrl    : '/customer/php/customer_update.php',
  deleteUrl    : '/customer/php/customer_delete.php',

});

app.controller('MyCntr', function($scope, $http){
});

//一覧
app.controller('CustomerListController', function($scope, $http, $state, $controller, values, utils, itemManager, listManager, searchManager) {

  $controller('ListController', {$scope: $scope});
});

//作成
app.controller('CustomerCreateController', function($scope, $http, $state, $controller) {

  $controller('CreateController', {$scope: $scope});
});

//更新
app.controller('CustomerUpdateController', function($scope, $http, $state, $controller, $stateParams, values) {

  $controller('UpdateController', {$scope: $scope});
});

//詳細
app.controller('CustomerDetailController', function($scope, $http, $state, $controller, $stateParams, values, itemManager) {

  $controller('DetailController', {$scope: $scope});

  $scope.init({title_field_names: ['last_name', 'first_name']});
});

})();
