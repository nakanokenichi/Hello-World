var app = angular.module('myApp', ['ngGrid', 'ui.router', 'ngAnimate', 'ngDialog', 'angularFileUpload']);

(function(){

'use strict';

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('list', {
      url        : '/company/company.php',
      controller : 'CompanyListController',
      templateUrl: '/company/template/company_list.php'
    })
    .state('create', {
      url        : '/company/company.php/create',
      controller : 'CompanyCreateController',
      templateUrl: '/company/template/company_create.php'
    })
    .state('update', {
      url        : '/company/company.php/update/:id',
      controller : 'CompanyUpdateController',
      templateUrl: '/company/template/company_update.php'
    })
    .state('detail', {
      url  : '/company/company.php/detail/:id',
      views: {
        "": {
          controller : 'CompanyDetailController',
          templateUrl: '/company/template/company_detail.php'
        },
        "customers@detail":{
          controller : 'DetailListCustomerController',
          templateUrl: '/customer/template/customer_list_for_detail.php'
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
    .state('detail.createCustomer', {
      url        : '/create_customer',
      views: {
        '@': {
          controller : 'DetailListCustomerCreateController',
          templateUrl: '/customer/template/customer_create_for_detail.php'
        }
      }
    })
    .state('detail.updateCustomer', {
      url        : '/update_customer/:detail_list_data_id',
      views: {
        '@': {
          controller : 'DetailListCustomerUpdateController',
          templateUrl: '/customer/template/customer_update_for_detail.php'
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
    //表示項目編集
    .state('editListItem', {
      url: '/company/company.php/edit_list_item',
      views: {
        '': {
          controller : 'ListItemEditController',
          templateUrl: '/organ_item/template/list_item_edit.php'
        }
      }
    })
    //リスト編集
    .state('editList', {
      url: '/company/company.php/edit_list/:list_id',
      views: {
        '': {
          controller : 'ListEditController',
          templateUrl: '/list/template/list_edit.php'
        }
      }
    })
    //リスト作成
    .state('createList', {
      url: '/company/company.php/create_list',
      views: {
        '': {
          controller : 'ListCreateController',
          templateUrl: '/list/template/list_create.php'
        }
      }
    })
    //ファイルからの一括取込
    .state('importFromFile', {
      url: '/company/company.php/select_import_file',
      views: {
        '': {
          controller : 'ImportFileSelectController',
          templateUrl: '/import/template/import_file_select.php'
        }
      }
    })
    //インポートファイル項目マッピング
    .state('mappingImportFileColumns', {
      url: '/company/company.php/mapping_import_file_columns/:id',
      views: {
        '': {
          controller : 'ImportFileMappingController',
          templateUrl: '/import/template/import_file_mapping.php'
        }
      }
    })
    //インポート監視
    .state('monitorImportFile', {
      url: '/company/company.php/import_file_monitor/:id',
      views: {
        '': {
          controller : 'ImportFileMonitorController',
          templateUrl: '/import/template/import_file_monitor.php'
        }
      }
    })
    //項目設定
    .state('item_settings', {
      url: '/company/company.php/item_settings',
      views: {
        '': {
          controller : 'ItemSettingController',
          templateUrl: '/item_setting/template/item_setting_main.php'
        }
      }
    })
    //見込み客データの引継ぎ設定
    .state('prospect_mapping', {
      url: '/company/company.php/prospect_mapping',
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
  title          : '会社',
  collection_name: 'companies',
  //data_name      : 'company',
  //parentName     : 'company',
  collection_singular_name: 'company',
  currentParent  : {},
  id_name        : 'company_id',
  name_name      : ['company_name'],
  item_setting_options: {
    'use_lookup': false
  },
  listReadUrl  : '/company/php/company_read.php',
  singleReadUrl: '/company/php/company_read_single.php',
  createUrl    : '/company/php/company_create.php',
  updateUrl    : '/company/php/company_update.php',
  deleteUrl    : '/company/php/company_delete.php',

});

app.controller('MyCntr', function($scope, $http){
});

//一覧
app.controller('CompanyListController', function($scope, $http, $state, $controller, values, utils, itemManager, listManager, searchManager) {

  $controller('ListController', {$scope: $scope});
});

//作成
app.controller('CompanyCreateController', function($scope, $http, $state, $controller) {

  $controller('CreateController', {$scope: $scope});
});

//更新
app.controller('CompanyUpdateController', function($scope, $http, $state, $controller, $stateParams, values) {

  $controller('UpdateController', {$scope: $scope});
});

//詳細
app.controller('CompanyDetailController', function($scope, $http, $state, $controller, $stateParams, values, itemManager) {

  $controller('DetailController', {$scope: $scope});

  $scope.init({title_field_names: ['company_name']});
});

})();
