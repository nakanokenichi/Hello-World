(function(){

'use strict';

app.factory('item_setting_constants', ['constants', function(constants){

  return {
    'TYPE_NAME_STRING': {
      type: constants.TYPE_STRING,
      name: 'テキスト（一行）'
    },

    'TYPE_NAME_TEXT': {
      type: constants.TYPE_TEXT,
      name: 'テキスト（複数行）'
    },

    'TYPE_NAME_SELECT': {
      type: constants.TYPE_SELECT,
      name: '選択'
    },

    'TYPE_NAME_NUMBER': {
      type: constants.TYPE_NUMBER,
      name: '数値'
    },

    'TYPE_NAME_LOOKUP': {
      type: 'lookup',
      name: 'ルックアップ'
    },

    'TYPE_NAME_DATE': {
      type: constants.TYPE_DATE,
      name: '日付'
    },

    'TYPE_NAME_DATETIME': {
      type: constants.TYPE_DATETIME,
      name: '日時'
    },

    'TYPE_NAME_MULTIPLE_SELECT': {
      type: constants.TYPE_MULTIPLE_SELECT,
      name: '複数選択'
    },

    'TYPE_NAME_BLANK': {
      type: constants.TYPE_BLANK,
      name: 'ブランク'
    }

  };

}]);

app.factory('itemSettingManager', ['$http', '$timeout', function($http, $timeout){

  var itemSettingManager = {};

  itemSettingManager.setupGroupList = function(){

    $('#groupList').sortable({
      cursor     : 'move',
      placeholder: 'ui-state-highlight',
      handle     : '.groupPaneHeader',
      stop       : function(){
        //グループの並び順を保存する
        itemSettingManager.saveGroupOrder();
      }
    }).disableSelection();
  };

  itemSettingManager.saveGroupOrder = function(){

    var
      $itemGroupPanes = $('.itemGroupPane'),
      list            = [];

    if ($itemGroupPanes.size() > 1){ //グループの個数が一つの場合は処理しない
      $.each($itemGroupPanes, function(i, v){
        var
          group_id = $(v).data('group-id'),
          order    = (i + 1) * 10;

        list.push({group_id: group_id, order: order});
      });

      if (list.length > 0){
        $http.post(
          '/organ_item_group/php/organ_item_group_list_update.php',
          {group_list: list}
        ).success(function(data){
          if (data.has_error){
            alert(data.message);
            return;
          }
          
        });
      }
    }

  };

  //項目の表示順を保存する
  itemSettingManager.saveItemOrder = function(group_id, collection_name){

    var
      //$organItems = $('ul[name=organItems][data-group-id=' + group_id + ']'),
      //$children   = $organItems.children('li'),
      list          = [],
      $odd_list_ul  = $('ul[name=organItems][data-group-id=' + group_id + '].oddList  li'),
      $even_list_ul = $('ul[name=organItems][data-group-id=' + group_id + '].evenList li');

    if ($odd_list_ul.size() > 0){
      $.each($odd_list_ul, function(i, v){
        var
          organ_item_id = $(v).data('organ-item-id'),
          display_order = (i + 1) * 10;

        list.push({organ_item_id: organ_item_id, display_order: display_order, group_id: group_id, align_div: 'left'});
      });
    }

    if ($even_list_ul.size() > 0){
      $.each($even_list_ul, function(i, v){
        var
          organ_item_id = $(v).data('organ-item-id'),
          display_order = (i + 1) * 10;

        list.push({organ_item_id: organ_item_id, display_order: display_order, group_id: group_id, align_div: 'right'});
      });
    }

    if (list.length > 0){
      $http.post(
        '/organ_item/php/organ_item_list_update.php',
        {organ_item_list: list, collection_name: collection_name}
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
      });
    }
    //}
  };

  itemSettingManager.createItemGroupPaneHtmlString = function(group_id, group_name, item_list, not_basic_information, scope){

    var
      html_str  = '',
      odd_list  = [],
      even_list = [];

      html_str += '<li><div class="row" style="background: white;">' +
                    '<div class="col-md-12 itemGroupPane" data-group-id="' + group_id + '">';

      if (not_basic_information === true){
        html_str += '<button class="pane-delete-button" ng-click="deleteItemGroup($event)" data-group-id="' + group_id +
                      '" style="top: -15px; right: -13px;">&nbsp;×&nbsp;</button>';
      }

      html_str += '<div class="groupPaneHeader">';

      if (not_basic_information === true){
        html_str += '<a ng-click="editItemGroup($event)" data-group-id="' + group_id + '">';
      }

      html_str += group_name;

      if (not_basic_information === true){
        html_str += '</a>';
      }

      html_str += '</div>';

      //奇数リストと偶数リストの作成
      if (item_list){
        $.each(item_list, function(i, v){
          var
            index = i + 1;

          //非表示項目は対象外
          if ((typeof v['hidden_div'] === 'undefined') || (v['hidden_div'] == 0)){
            //if ((index % 2) > 0){
            if (v['align_div'] == 'left'){
              odd_list.push(v);
            }else{
              even_list.push(v);
            }
          }
        });
      }

      html_str += '<div class="row">';

      //左側リスト
      html_str += itemSettingManager.createListHtmlString(group_id, odd_list, 'oddList', scope);

      //右側リスト
      html_str += itemSettingManager.createListHtmlString(group_id, even_list, 'evenList', scope);

      html_str += '</div></div>' +
                  '</div></li>';

     return html_str;
  };

  itemSettingManager.createListHtmlString = function(group_id, list, name, scope){

    var
      html_str = '<div class="col-md-6" style="padding: 0;">' +
                 '<ul name="organItems" data-group-id="' + group_id + '" class="' + name + '">';

    //項目のループ
    if (list){
      $.each(list, function(index, item){
        var
          field_name = item['field_name'];

        html_str += itemSettingManager.createItemHtmlString(item, scope);
      });
    }

    html_str += '</ul>'
             +  '</div>';

    return html_str;
  };

  itemSettingManager.updateItemGroupName = function(group_id, group_name){
    var
      links = $('.groupPaneHeader a');

    if (!links || links.size() == 0){
      return;
    }

    $.each(links, function(i, v){

      var
        $link         = $(v),
        this_group_id = $link.data('group-id');

      if (group_id == this_group_id){
        $link.html(group_name);
        return;
      }

    });
  };

  itemSettingManager.createItemHtmlString = function(item, scope){
    var
      field_name    = item['field_name'],
      //type          = item['type'],
      element_id    = 'item_'  + field_name,
      _id           = item['_id']['$id'],
      display_name  = item['display_name'],
      ng_model_name = field_name + '.display_name',
      default_div   = item['default_div'],
      html_str      = '';

    if (scope){
      scope[field_name] = item;
    }

    html_str += '<li class="ui-state-default" id="' + element_id + '" data-field-name="' + field_name +'" data-organ-item-id=' + _id + '>' +
                   '<div style="height: 50px; width: 100%; padding: 10px;">' +
                     '<span ng-bind="' + ng_model_name + '"></span>' +
                     '<button tooltip data-original-title="非表示" class="common-hidden-icon-button" data-organ-item-id="' + _id + '" ' +
                       ' data-field-name="' + field_name + '" data-display-name="' + display_name + '" style="float: right;" ng-click="hideItem($event)">&nbsp;</button>' +
                     '<button tooltip data-field-name="' + field_name + '" data-original-title="削除" class="common-delete-icon-button" ' +
                       ' style="float: right; margin-right: 10px;" ng-click="delete($event)"';

    if (default_div == 1){
      //初期項目は削除不可
      html_str += ' disabled="disabled" ';
    }

    html_str +=    '>&nbsp;</button>' +
                     '<button tooltip data-original-title="編集" class="common-edit-icon-button" data-organ-item-id="' + _id + '" ' +
                       ' data-field-name="' + field_name + '" data-display-name="' + display_name + '" style="float: right; margin-right: 10px;" ng-click="edit($event)">&nbsp;</button>' +
                   '</div>' +
                 '</li>';

    return html_str;
  };

  itemSettingManager.createHiddenItemGroupPaneHtmlString = function(item_list, scope){
    var html_str      = '';

    if (item_list){
      $.each(item_list, function(index, item){
        //非表示となっている項目が対象
        if ((typeof item['hidden_div'] !== 'undefined') && (item['hidden_div'] == 1)){
          var
            field_name    = item['field_name'],
            element_id    = 'hideitem_'  + field_name,
            _id           = item['_id']['$id'],
            ng_model_name = field_name + '.display_name';

          html_str += itemSettingManager.createHiddenItemHtmlString(item, scope);

        }
      });
    }

    return html_str;
  }

  itemSettingManager.createHiddenItemHtmlString = function(item, scope){
    var
      field_name    = item['field_name'],
      element_id    = 'item_'  + field_name,
      _id           = item['_id']['$id'],
      display_name  = item['display_name'],
      ng_model_name = field_name + '.display_name',
      html_str      = '';

    if (scope){
      scope[field_name] = item;
    }

    var html_str = '<li class="ui-state-default" id="' + element_id + '" data-field-name="' + field_name +'" data-organ-item-id="' + _id +'" data-display-name="' + display_name + '" data-is-update="true">' +
                      '<div style="height: 50px; width: 234px; padding: 10px;">' +
                        '<span ng-bind="' + ng_model_name + '"></span>' +
                      '</div>' +
                   '</li>';

    return html_str;
  }

  itemSettingManager.createDivisionListGrid = function($scope, options){

    var
      division_list   = null,
      button_template = null;

    if ($scope.$parent && $scope.$parent.selectedItem){
      division_list = $scope.$parent.selectedItem.division_list;
    }

    if (!options){
      options = {mode: 'create'};
    }

    if (options.mode == 'create'){
      $scope.division_list = [];
    }else{
      $scope.division_list = division_list;

      if (!$scope.division_list){
        $scope.division_list = [];
      }
    }

    $scope.pagingOptions = {
      pageSizes  : [10, 20, 50],
      pageSize   : 10,
      currentPage: 1
    };

    button_template = '<div class="common-buttons">'
                    +   '<button tooltip data-original-title="削除" id="deleteButton" type="button" class="common-delete-icon-button" ng-click="deleteDivision(row)">&nbsp;</button>'
                    + '</div>';

    $scope.divisionListGrid = {
      data               : 'division_list',
      pagingOptions      : $scope.pagingOptions,
      enableCellSelection: true,
      enableRowSelection : false,
      //enableCellEdit     : true,
      enableCellEditOnFocus: true,
      //enableRowReordering: true,
      columnDefs: [
        {field: 'tool',          displayName: '操作',         enableCellEdit: false, cellTemplate: button_template, width: 50},
        {field: 'key',           displayName: '値',           enableCellEdit: true},
        {field: 'display_order', displayName: '表示順位',     enableCellEdit: true},
        {field: 'value',         displayName: '表示テキスト', enableCellEdit: true}
      ],
      enableColumnResize: true,
      i18n              : 'ja',
      rowHeight         : 50,
      headerRowHeight   : 50,
      footerRowHeight   : 50,
    };
  };

  itemSettingManager.createDivision = function($scope){
    var
      division_list = $scope.division_list,
      max_key       = 0,
      max_order     = 0,
      object        = {key: 1, display_order: 1};

    //最大keyプラス１を自動入力する
    if (division_list.length == 0){
      division_list.push(object);
    }else{
      $.each(division_list, function(i, v){
        var
          key           = v.key,
          display_order = v.display_order;

        if (max_key < key){
          max_key = key;
        }

        if (max_order < display_order){
          max_order = display_order;
        }

      });

      object.key           = (parseInt(max_key, 10) + 1);

      object.display_order = (parseInt(max_order, 10) + 1);

      division_list.push(object);
    }

    $timeout(function(){
      $('.gridStyle .ngCanvas .ngRow:last-child .ngCell:last-child .ngCellText').trigger('click');
    }, 800);
  };

  itemSettingManager.checkDuplicateKey = function(key, keys){

    var
      is_duplicate = false;

    if (keys.length > 0){
      $.each(keys, function(i, v){
        if (key == v){
          is_duplicate = true;
        }
      });
    }
    return is_duplicate;
  };

  //区分リストのチェック
  itemSettingManager.checkDivisionList = function(division_list){

      if (!division_list){
        return {is_error: true, message: '選択肢を入力してください'};
      }

      var
        is_error = false,
        message  = '',
        keys     = [];

      $.each(division_list, function(i, v){

        var
          key           = v['key'],
          display_order = v['display_order'],
          value         = v['value'],
          is_duplicate  = itemSettingManager.checkDuplicateKey(key, keys);

        if (is_duplicate === true){
          message += "値が重複しています。" + key + "\n";
          is_error = true;
        }else{
          keys.push(key);
        }

        if (!key){
          message += "値を入力してください\n";
          is_error = true;
        }else {
          key = key.toString();
          if (key.match(/[^0-9]+/)){
            message += "値は数値で入力してください\n";
            is_error = true;
          }
        }

        if (!display_order){
          message += "表示順位を入力してください";
          is_error = true;
        }else{
          display_order = display_order.toString();
          if (display_order.match(/[^0-9]+/)){
            message += "表示順位は数値で入力してください\n";
            is_error = true;
          }
        }

        if (!value){
          message += "表示テキストを入力してください\n";
          is_error = true;
        }
      });

      return {is_error: is_error, message: message};
  };

  itemSettingManager.sortDivisionList = function(division_list){

    if (!division_list || ((division_list instanceof Array) === false)){
      return;
    }

    division_list.sort(
      function(a, b){

        var
          a_order = a['display_order'],
          b_order = b['display_order'];

        if(a_order < b_order){
          return -1;
        }else if(a_order > b_order) {
          return 1;
        }else{
          return 0;
        }
      }
    );

    return division_list;
  };

  return itemSettingManager;
}]);

//項目設定
app.controller('ItemSettingController', function($scope, $http, $state, $stateParams, $compile, ngDialog, values, item_setting_constants, itemSettingManager) {

  var tourNavigation = null;

  $scope.init = function(){

    var
      $items       = $('#items'),
      title        = values.title,
      page_title   = '項目設定 - ' + title,
      param        = {'collection_name': values.collection_name},
      def_items    = [
        item_setting_constants.TYPE_NAME_STRING,
        item_setting_constants.TYPE_NAME_TEXT,
        item_setting_constants.TYPE_NAME_NUMBER,
        item_setting_constants.TYPE_NAME_SELECT,
        item_setting_constants.TYPE_NAME_MULTIPLE_SELECT,
        item_setting_constants.TYPE_NAME_DATE,
        item_setting_constants.TYPE_NAME_DATETIME
        //item_setting_constants.TYPE_NAME_LOOKUP
      ];

    if (values.item_setting_options && values.item_setting_options.use_lookup){
      def_items.push(item_setting_constants.TYPE_NAME_LOOKUP);
    }

    $scope.page_title = page_title;

    //商談引継ぎボタンの表示・非表示の制御
    $scope.prospects_mapping_button = false;
    if((values.collection_name　=== "prospects")||
       (values.collection_name　=== "companies")||
       (values.collection_name　=== "customers")||
       (values.collection_name　=== "business_discussion")
      ){
      $scope.prospects_mapping_button = true;
    }

    //デフォルト項目の表示
    $.each(def_items, function(i, v){
      var
        type     = v['type'],
        name     = v['name'],
        html_str = '';

      html_str += '<li class="ui-state-default" data-type="' + type + '" data-is-new="true">' +
                    '<div style="height: 50px; width: 234px; padding: 10px;">' + name + '</div>' +
                  '</li>';

      $(html_str).appendTo($items);
    });

    $scope.leftButtonDown = null;

    $(document).mousedown(function(e){

      if(e.which === 1) {
        $scope.leftButtonDown = true;
      }
    }).mouseup(function(e){
      if(e.which === 1){
        $scope.leftButtonDown = false;
      }
    });

    $scope.hiddenItemsView = false;

    //既存項目の取得
    $http.post(
      '/organ_item_group/php/organ_item_group_read.php',
      param
    ).success(
      function(data){

        var
          list     = null,
          html_str = '',
          hidden_html_str = '',
          $html    = null;

        if (data.has_error){
          alert(data.message);
          return;
        }

        list = data.value.list;

        html_str += '<ul id="groupList" class="ui-state-default">';

        hidden_html_str += '<div class="hiddenPaneHeader">非表示項目</div>';

        //項目グループのループ
        $.each(list, function(i, v){

          var
            item_list  = v['item_list'],
            group_name = v['group_name'],
            group_id   = v['_id']['$id'],
            not_basic  = (group_name !== '基本情報');

          html_str += itemSettingManager.createItemGroupPaneHtmlString(group_id, group_name, item_list, not_basic, $scope);
          hidden_html_str += itemSettingManager.createHiddenItemGroupPaneHtmlString(item_list, $scope);
        });

        html_str += '</ul>';

        $html = $(html_str);

        $html.appendTo($('#itemGroupBasePane'));

        $compile($html)($scope);

        //非表示項目フィールド作成

        $html = $(hidden_html_str);
        $html.appendTo($('#hiddenItems'));

        $compile($html)($scope);

        $('ul[name=organItems]').sortable({
          cursor     : 'move',
          placeholder: 'ui-state-highlight',
          revert     : true,
          stop       : function(event, ui){
            //var
            //  group_id = $(this).data('group-id');

            //項目の並び順を保存する
            //itemSettingManager.saveItemOrder(group_id);
          },
          connectWith: 'ul[name=organItems]'
        })//.disableSelection()
        .droppable({
          out: function(){
            return;
          },
          drop: function(event, ui){

            if($scope.leftButtonDown){
              //JQuery UI draggableのバグ対応
              return;
            }

            if (values.dialog_is_open === true){
              return;
            }

            if ($scope.updating == true){
              return;
            }

            var
              $draggable = $(ui.draggable),
              $droppable = $(event.target),
              group_id   = $droppable.data('group-id'),
              is_new     = $draggable.data('is-new'),
              is_update  = $draggable.data('is-update'),
              item_name  = $draggable.find('div').html();

            if (is_new){
              //新規追加
              $scope.currentDraggable = $draggable;

              $scope.currentDroppable = $droppable;

              $scope.$on('ngDialog.closed', function (e, $dialog) {

                var $li = $droppable.find('li[data-is-new=true]');

                if ($li.size() > 0){
                  $li.remove();
                }

                $('body').css('cursor', 'auto');

                values.dialog_is_open = false;

                //ツアーナビゲーション用
                if (values.collection_name == 'prospects' && tourNavigation != null){
                  if (tourNavigation.currentTour.id != tourNavigation.TOUR_DB){
                    return;
                  }
                  tourNavigation.getSession();
                  if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_EMPLOYEEITEM){
                    $scope.dbTour7();
                    return;
                  }
                }

              });

              //項目作成ダイアログを開く
              values.dialog_is_open = true;

              ngDialog.open({
                template  : '/item_setting/template/item_creating_dialog.php',
                controller: 'ItemCreateController',
                scope     : $scope
              });
            } else if (is_update){
              $scope.updating = true;
              var
                field_name       = $draggable.data('field-name'),
                display_name     = $draggable.data('display-name'),
                _id              = $draggable.data('organ-item-id'),
                param            = {_id: _id, display_name: display_name, field_name: field_name, hidden_div: 0, collection_name: values.collection_name},
                doUpdMyItemList  = true;

              $http.post(
                '/organ_item/php/organ_item_update.php',
                param
              ).success(function(data){
                if (data.has_error){
                  alert(data.message);
                  return;
                }

                var
                  $li = $droppable.find('li[data-is-update=true]'),
                  item     = data.value,
                  html_str = itemSettingManager.createItemHtmlString(item, $scope),
                  $html    = $(html_str);

                //要素の置き換え
                $draggable.replaceWith($html);

                $compile($html)($scope);

                if ($li.size() > 0){
                  $li.remove();
                }

                $.each($('#hiddenItems > li'), function(i, v){
                  if ($(v).data('organ-item-id') == _id){
                    $(v).remove();
                  }
                });

                setTimeout(function () {
                  //準備が整う時間が必要なため、遅延実行する
                  itemSettingManager.saveItemOrder(group_id, values.collection_name);
                }, 800);

                $http.post(
                  '/my_item_list/php/my_item_list_exist_check.php',
                  {collection_name: values.collection_name, field_name: field_name}
                ).success(function(data){
                  if (data.has_error){
                    alert(data.message);
                    return;
                  }
  
                  var exists = data.value;
                  if (exists){
                    if (!confirm('一覧画面にある全ユーザーの個人表示項目設定に追加しますか？')){
                      doUpdMyItemList = false;
                    }
                  }
                  if (doUpdMyItemList == true){
                    $http.post(
                      '/my_item_list/php/my_item_list_update_organ.php',
                      {collection_name: values.collection_name, field_name: field_name}
                    ).success(function(data){
                      if (data.has_error){
                        alert(data.message);
                        return;
                      }
                    });
                  }
                });

                $('body').css('cursor', 'auto');
                $scope.updating = false;
              });
            }else{
              //ソート、グループ間移動の場合
              //項目の並び順を保存する
              setTimeout(function () {
                //準備が整う時間が必要なため、遅延実行する
                itemSettingManager.saveItemOrder(group_id, values.collection_name);
              }, 800);
            }
          }
        });

//$('<div id="draggable" class="ui-widget-content">	<p>Scroll set to true, default settings</p></div>').appendTo($('body'));
//$( "#draggable" ).draggable({ scroll: true });

        $('#items li,#hiddenItems li').draggable({
          connectToSortable: 'ul[name=organItems]',
          helper     : 'clone',
          cursor     : 'move',
          placeholder: 'ui-state-highlight',
          start      : function(event, ui){
            $(this).css('z-index', '9999');
          },
          revert: 'invalid',
          scroll: true,
          /* drag: function(event, ui){
            if($.browser.msie || $.browser.mozilla){
              ui.position.top -= $('html').scrollTop();
            }else{
              ui.position.top -= $('body').scrollTop();
            }
          }*/
        }).disableSelection();

        itemSettingManager.setupGroupList();
      }
    );

    //ツアーナビゲーション初期化
    if (values.collection_name != 'prospects'){
      return;
    }
    tourNavigation = new TourNavigation();
    if (tourNavigation.currentTour.id != 0){
      $scope.reStartTour();
    };
  };

  $scope.reStartTour = function(){
    if (tourNavigation.currentTour.id != tourNavigation.TOUR_DB){
      return;
    }
    if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_ITEMSETTINGS){
      $scope.dbTour3();
      return;
    }
    if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_SELECTABLEITEM){
      $scope.dbTour4();
      return;
    }
    if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_ITEMDRUGDROP){
      $scope.dbTour5();
      return;
    }
    if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_EMPLOYEEITEM){
      $scope.dbTour7();
      return;
    }
  };

  $scope.dbTour3 = function(){
    //tourNavigation.hideBalloon('.primary-button');
    tourNavigation.animate(250, $scope.dbTour3ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_SELECTABLEITEM);
  };

  $scope.dbTour3ShowBalloon = function(){
    tourNavigation.showBalloon(".col-md-3", {
      //tipSize: 24,
      //offsetY: -80,
      position: "right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（3/10）】＿設定可能項目</p><br/>'
                 + '<p style="font-size: 90%;">追加したいデータの形式をここから選択できます。</p></div>'
                 + '<button id="finishToursDb3Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour4Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursDb3Button', function(){
      tourNavigation.hideBalloon(".col-md-3");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour4Button', $scope.dbTour4);
  };

  $scope.dbTour4 = function(){
    tourNavigation.hideBalloon('.col-md-3');
    tourNavigation.animate(250, $scope.dbTour4ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_ITEMDRUGDROP);
  };

  $scope.dbTour4ShowBalloon = function(){
    tourNavigation.showBalloon(".col-md-3", {
      //tipSize: 24,
      //offsetY: -80,
      position: "right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（4/10）】＿管理項目の追加</p><br/>'
                 + '<p style="font-size: 90%;">例として、「従業員数」を追加してみましょう。</p></div>'
                 + '<button id="finishToursDb4Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour5Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursDb4Button', function(){
      tourNavigation.hideBalloon(".col-md-3");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour5Button', $scope.dbTour5);
  };

  $scope.dbTour5 = function(){
    tourNavigation.hideBalloon('.col-md-3');
    tourNavigation.animate(250, $scope.dbTour5ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_SELECTNUMITEM);
  };

  $scope.dbTour5ShowBalloon = function(){
    tourNavigation.showBalloon("li[data-type='number']", {
      //tipSize: 24,
      //offsetY: -80,
      position: "right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（5/10）】＿「従業員数」の追加</p><br/>'
                 + '<p style="font-size: 90%;">「従業員数」は数値で入力するのが適切なので、</p>'
                 + '<p style="font-size: 90%;">数値と書かれたボックスをドラッグし、好きな場所にドラッグしてください。</p></div>'
                 + '<button id="finishToursDb5Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour5closeButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursDb5Button', function(){
      tourNavigation.hideBalloon("li[data-type='number']");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour5closeButton', function(){
      tourNavigation.hideBalloon("li[data-type='number']", false);
    });
  };

  $scope.dbTour7 = function(){
    //tourNavigation.hideBalloon('.primary-button');
    tourNavigation.animate(280, $scope.dbTour7ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_ADDEDITEM);
  };

  $scope.dbTour7ShowBalloon = function(){
    tourNavigation.showBalloon("#itemGroupBasePane", {
      //tipSize: 24,
      offsetY: 100,
      //position: "left",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（7/10）】＿項目追加完了</p><br/>'
                 + '<p style="font-size: 90%;">「従業員数」という項目が追加されました。</p></div>'
                 + '<button id="finishToursDb7Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour8Button" type="button" class="common-button" style="float: right;height: 20px;">次へ</button>'
    });
    $(document).on('click', '#finishToursDb7Button', function(){
      tourNavigation.hideBalloon("#itemGroupBasePane");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour8Button', $scope.dbTour8);
  };

  $scope.dbTour8 = function(){
    tourNavigation.hideBalloon('#itemGroupBasePane');
    tourNavigation.animate(0, $scope.dbTour8ShowBalloon);
    tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_TOLEADVIEW);
  };

  $scope.dbTour8ShowBalloon = function(){
    tourNavigation.showBalloon("li[data-original-title='見込客']", {
      //tipSize: 24,
      //offsetY: -80,
      position: "bottom right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（8/10）】＿追加項目の確認</p><br/>'
                 + '<p style="font-size: 90%;">実際に項目が追加されているか、見込客の画面で確認してみましょう。</p></div>'
                 + '<button id="finishToursDb8Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour8CloseButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursDb8Button', function(){
      tourNavigation.hideBalloon("li[data-original-title='見込客']");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour8CloseButton', function(){
      tourNavigation.hideBalloon("li[data-original-title='見込客']", false);
    });
  };

  $scope.createItemGroup = function(){

    ngDialog.open({
      template  : '/item_setting/template/item_group_creating_dialog.php',
      controller: 'ItemGroupCreateController',
      scope     : $scope
    });

  };

  //項目グループの編集
  $scope.editItemGroup = function(event){

    var
      $target    = $(event.target),
      group_id   = $target.data('group-id'),
      group_name = $target.html();

    $scope.selectedGroupId   = group_id;
    $scope.selectedGroupName = group_name;

    ngDialog.open({
      template  : '/item_setting/template/item_group_editing_dialog.php',
      controller: 'ItemGroupEditController',
      scope     : $scope
    });
  };

  $scope.deleteItemGroup = function(event){
    var
      $target     = $(event.target),
      $rows       = $target.parents('.row'),
      group_id    = $target.data('group-id'),
      param       = {group_id: group_id},
      targetItems = $target.parent('.itemGroupPane').find('button.common-delete-icon-button'),
      targetCheck = true;

    //グループにデフォルト項目が設定されていないかチェック
    $.each(targetItems, function(i, v){
      if (typeof v.attributes['disabled'] !== 'undefined'){
        targetCheck = false;
        return;
      }
    });

    if (targetCheck == false){
      alert('削除対象の項目グループにデフォルト項目が含まれているため、削除できません。\nデフォルト項目を他の項目グループに移動させてください。');
      return;
    }

    if (!confirm('項目グループを削除します。項目グループに所属している項目も同時に削除されますが、よろしいですか？')){
      return;
    }

    $http.post(
      '/organ_item_group/php/organ_item_group_delete.php',
      param
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }

      if ($rows.size() > 0){
        $rows[0].remove();
      }
    });

  };

  //項目の編集
  $scope.edit = function(event){

    var
      $target      = $(event.target),
      _id          = $target.data('organ-item-id'),
      field_name   = $target.data('field-name'),
      type         = $target.data('type'),
      display_name = $scope[field_name]['display_name'];

    if (!_id){
      console.log('IDがありません');
      return;
    }

    $scope.selectedItem = $scope[field_name];

    //$scope.type = type;

    ngDialog.open({
      template  : '/item_setting/template/item_editing_dialog.php',
      controller: 'ItemEditController',
      scope     : $scope
    });
  };

  //項目の削除
  $scope.delete = function(event){

    if (!confirm('項目を削除します。よろしいですか？')){
      return;
    }

    var
      $target    = $(event.target),
      $lis       = $target.parents('li'),
      field_name = $target.data('field-name'),
      param      = {collection_name: values.collection_name, field_name: field_name};

    if (field_name){

      $http.post(
        '/organ_item/php/organ_item_delete.php',
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }

        if ($lis.size() > 0){
          $lis[0].remove();
        }
      });

    }else{
      if ($lis.size() > 0){
        $lis[0].remove();
      }
    }

  };

  //項目の非表示
  $scope.hideItem = function(event){
    var
      $target       = $(event.target),
      $lis          = $target.parents('li'),
      field_name    = $target.data('field-name'),
      display_name  = $target.data('display-name'),
      _id           = $target.data('organ-item-id'),
      element_id    = 'hideitem_'  + field_name,
      ng_model_name = field_name + '.display_name',
      html_str      = '',
      $html         = null,
      param         = {_id: _id, display_name: display_name, field_name: field_name, hidden_div: 1, collection_name: values.collection_name};

    $http.post(
      '/organ_item/php/organ_item_update.php',
      param
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }
      html_str = itemSettingManager.createHiddenItemHtmlString(data.value, $scope);

      //非表示項目一覧に追加
      $html = $(html_str);
      $html.appendTo($('#hiddenItems'));

      $compile($html)($scope);

      if ($lis.size() > 0){
        $lis[0].remove();
      }

      $('#items li,#hiddenItems li').draggable({
        connectToSortable: 'ul[name=organItems]',
        helper     : 'clone',
        cursor     : 'move',
        placeholder: 'ui-state-highlight',
        start      : function(event, ui){
          $(this).css('z-index', '9999');
        },
        revert: 'invalid',
        scroll: true,
      }).disableSelection();

    });
 };

  $scope.displayHiddenItems = function(){
    if ($scope.hiddenItemsView == false) {
      $scope.hiddenItemsView = true;
      $('#hiddenItemsViewBtn').html('非表示項目を隠す');
    } else {
      $scope.hiddenItemsView = false;
      $('#hiddenItemsViewBtn').html('非表示項目を表示する');
    }
  }


  $scope.init();

});

//項目グループ作成
app.controller('ItemGroupCreateController', function($scope, $http, $state, $stateParams, $compile, ngDialog, values, item_setting_constants, itemSettingManager) {

  $scope.init = function(){
    
  };

  //項目グループの登録
  $scope.doCreateItemGroup = function(){

    var
      group_name = $scope.group_name,
      order      = $scope.getMaxOrder() + 10,
      param      = {group_name: group_name, collection_name: values.collection_name, order: order};

    if (!group_name){
      alert('グループ名称を入力してください');
      return;
    }else if (group_name === '基本情報'){
      alert('「基本情報」というグループ名称では登録できません');
      return;
    }

    $http.post(
      '/organ_item_group/php/organ_item_group_create.php',
      param
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }

      var
        group_id   = data.value._id['$id'],
        group_name = data.value.group_name,
        html_str   = '',
        $html      = null;

      html_str = itemSettingManager.createItemGroupPaneHtmlString(group_id, group_name, null, true);

      $html    = $(html_str);

      $html.appendTo($('#groupList'));

      itemSettingManager.setupGroupList();

//      $compile($html)($scope.$parent); //親スコープでコンパイルする
      $compile($html)($scope.__proto__); //親スコープでコンパイルする

      $('ul[name=organItems]').sortable({
        cursor     : 'move',
        placeholder: 'ui-state-highlight',
        revert     : true,
        stop       : function(event, ui){
          //var
          //  group_id = $(this).data('group-id');

          //項目の並び順を保存する
          //itemSettingManager.saveItemOrder(group_id);
        },
        connectWith: 'ul[name=organItems]'
      })//.disableSelection()
      .droppable({
        out: function(){
          return;
        },
        drop: function(event, ui){

          var scope = $scope.__proto__;

          if(scope.leftButtonDown){
            //JQuery UI draggableのバグ対応
            return;
          }

          if (values.dialog_is_open === true){
            return;
          }

          if ($scope.updating == true){
            return;
          }

          var
            $draggable = $(ui.draggable),
            $droppable = $(event.target),
            group_id   = $droppable.data('group-id'),
            is_new     = $draggable.data('is-new'),
            is_update  = $draggable.data('is-update'),
            item_name  = $draggable.find('div').html();

          if (is_new){
            //新規追加
            scope.currentDraggable = $draggable;

            scope.currentDroppable = $droppable;

            scope.$on('ngDialog.closed', function (e, $dialog) {

              var $li = $droppable.find('li[data-is-new=true]');

              if ($li.size() > 0){
                $li.remove();
              }

              $('body').css('cursor', 'auto');

              values.dialog_is_open = false;

              //ツアーナビゲーション用
              if (values.collection_name == 'prospects' && tourNavigation != null){
                if (tourNavigation.currentTour.id != tourNavigation.TOUR_DB){
                  return;
                }
                tourNavigation.getSession();
                if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_EMPLOYEEITEM){
                  scope.dbTour7();
                  return;
                }
              }

            });

            //項目作成ダイアログを開く
            values.dialog_is_open = true;

            ngDialog.open({
              template  : '/item_setting/template/item_creating_dialog.php',
              controller: 'ItemCreateController',
              scope     : scope
            });
          } else if (is_update){
            $scope.updating = true;
            var
              field_name       = $draggable.data('field-name'),
              display_name     = $draggable.data('display-name'),
              _id              = $draggable.data('organ-item-id'),
              param            = {_id: _id, display_name: display_name, field_name: field_name, hidden_div: 0, collection_name: values.collection_name},
              doUpdMyItemList  = true;

            $http.post(
              '/organ_item/php/organ_item_update.php',
              param
            ).success(function(data){
              if (data.has_error){
                alert(data.message);
                return;
              }

              var
                $li = $droppable.find('li[data-is-update=true]'),
                item     = data.value,
                html_str = itemSettingManager.createItemHtmlString(item, $scope),
                $html    = $(html_str);

              //要素の置き換え
              $draggable.replaceWith($html);

              $compile($html)($scope);

              if ($li.size() > 0){
                $li.remove();
              }

              $.each($('#hiddenItems > li'), function(i, v){
                if ($(v).data('organ-item-id') == _id){
                  $(v).remove();
                }
              });

              setTimeout(function () {
                //準備が整う時間が必要なため、遅延実行する
                itemSettingManager.saveItemOrder(group_id, values.collection_name);
              }, 800);

              $http.post(
                '/my_item_list/php/my_item_list_exist_check.php',
                {collection_name: values.collection_name, field_name: field_name}
              ).success(function(data){
                if (data.has_error){
                  alert(data.message);
                  return;
                }

                var exists = data.value;
                if (exists){
                  if (!confirm('一覧画面にある全ユーザーの個人表示項目設定に追加しますか？')){
                    doUpdMyItemList = false;
                  }
                }
                if (doUpdMyItemList == true){
                  $http.post(
                    '/my_item_list/php/my_item_list_update_organ.php',
                    {collection_name: values.collection_name, field_name: field_name}
                  ).success(function(data){
                    if (data.has_error){
                      alert(data.message);
                      return;
                    }
                  });
                }
              });

              $('body').css('cursor', 'auto');
              $scope.updating = false;
            });
          }else{
            //ソート、グループ間移動の場合
            //項目の並び順を保存する
            setTimeout(function () {
              //準備が整う時間が必要なため、遅延実行する
              itemSettingManager.saveItemOrder(group_id, values.collection_name);
            }, 800);
          }
        }
      });

  });

    ngDialog.close();
  };

  $scope.getMaxOrder = function(){

    var
      $itemGroupPanes = $('.itemGroupPane'),
      size            = null;

    if (!$itemGroupPanes){
      return 0;
    }

    size = $itemGroupPanes.size();

    return size * 10;
  };

  $scope.init();
});


//項目グループ更新
app.controller('ItemGroupEditController', function($scope, $http, $state, $stateParams, $compile, ngDialog, values, item_setting_constants, itemSettingManager) {

  $scope.init = function(){

    $scope.group_id   = $scope.$parent.selectedGroupId;

    $scope.group_name = $scope.$parent.selectedGroupName;
  };

  //項目グループの更新
  $scope.updateItemGroup = function(){

    var
      group_id   = $scope.group_id,
      group_name = $scope.group_name,
      param      = {group_id: group_id, group_name: group_name, collection_name: values.collection_name};

    if (!group_name){
      alert('グループ名称を入力してください');
      return;
    }else if (group_name === '基本情報'){
      alert('「基本情報」というグループ名称では登録できません');
      return;
    }

    $http.post(
      '/organ_item_group/php/organ_item_group_update.php',
      param
    ).success(function(data){

      if (data.has_error){
        alert(data.message);
        return;
      }

      itemSettingManager.updateItemGroupName(group_id, group_name);
    });

    ngDialog.close();
  };

  $scope.init();
});

//項目作成
app.controller('ItemCreateController', function($scope, $http, $state, $stateParams, $compile, ngDialog, utils, constants, values, item_setting_constants, itemSettingManager) {

  var tourNavigation = null;

  $scope.init = function(){
    var
      $draggable = $scope.$parent.currentDraggable,
      $droppable = $scope.$parent.currentDroppable,
      field_name = null,
      terminate  = false,
      $organ_items = null;

    $scope.draggable = $draggable;
    $scope.droppable = $droppable;

    $scope.type      = $draggable.data('type');

    //選択の場合
    $scope.is_select = ($scope.type === item_setting_constants.TYPE_NAME_SELECT.type ||
                        $scope.type === item_setting_constants.TYPE_NAME_MULTIPLE_SELECT.type);

    //if ($scope.is_select){
      itemSettingManager.createDivisionListGrid($scope, {mode: 'create'});
    //}

    $scope.group_id  = $droppable.data('group-id');

    //フィールド名称自動生成
    $organ_items = $('ul[name=organItems] li, #hiddenItems > li');
    field_name   = $scope.createFieldName(field_name);

    while(terminate === false){
      terminate = true;
      $.each($organ_items, function(i, v){
        if (field_name == $(v).data('field-name')){
          terminate  = false;
          field_name = $scope.createFieldName(field_name);
          return;
        }
      });
    }

    $scope.field_name = field_name;

    //ツアーナビゲーション初期化
    if (values.collection_name != 'prospects'){
      return;
    }
    tourNavigation = new TourNavigation();
    if (tourNavigation.currentTour.id != 0){
      $scope.reStartTour();
    };
  };

  $scope.reStartTour = function(){
    if (tourNavigation.currentTour.id != tourNavigation.TOUR_DB){
      return;
    }
    if (tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_SELECTNUMITEM){
      $scope.dbTour6();
      return;
    }
  };

  $scope.dbTour6 = function(){
    //tourNavigation.hideBalloon('.primary-button');
    tourNavigation.animate(0, $scope.dbTour6ShowBalloon);
    //tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_EMPLOYEEITEM);
  };

  $scope.dbTour6ShowBalloon = function(){
    tourNavigation.showBalloon("input[ng-model='display_name']", {
      //tipSize: 24,
      //offsetY: -80,
      position: "right",
      contents: '<div style="margin: 0px 0px 10px; line-height: 1;">'
                 + '<p class="ui-dialog-title" style="font-weight:bold;font-size: 100%">ツアー：【データベースのカスタマイズ（6/10）】＿設定可能項目</p><br/>'
                 + '<p style="font-size: 90%;"> 「項目名称」に従業員数と入力して保存ボタンをクリックしてください。</p></div>'
                 + '<button id="finishToursDb6Button" type="button" class="common-button" style="float: right;height: 20px;margin-left: 5px;">ツアーを終了する</button>'
                 + '<button id="dbTour6CloseButton" type="button" class="common-button" style="float: right;height: 20px;">OK</button>'
    });
    $(document).on('click', '#finishToursDb6Button', function(){
      tourNavigation.hideBalloon("input[ng-model='display_name']");
      tourNavigation.initCurrentTour();
    });
    $(document).on('click', '#dbTour6CloseButton', function(){
      tourNavigation.hideBalloon("input[ng-model='display_name']", false);
    });
  };

  $scope.createDivision = function(){

    itemSettingManager.createDivision($scope);
  };

  $scope.deleteDivision = function(row){

    if (!confirm('選択肢を削除します。よろしいですか？')){
      return;
    }

    var
      key = row.entity.key;

    $.each($scope.division_list, function(i, v){
      if (v.key == key){
        $scope.division_list.splice(i, 1);
        return;
      }
    });
  };

  $scope.createFieldName = function(field_name){
     if (!field_name){
       return 'item_001';
     }

     var num = parseInt(field_name.split('_')[1], 10);

     num += 1;

     return 'item_' + utils.pad(num, 3);
  };

  //項目の保存
  $scope.save = function(){

    var
      field_name    = $scope.field_name,
      display_name  = $scope.display_name,
      type          = $scope.type,
      group_id      = $scope.group_id,
      division_list = $scope.division_list,
      param         = {field_name: field_name, display_name: display_name, collection_name: values.collection_name, type: type, group_id: group_id};

    if (type == constants.TYPE_SELECT || type == constants.TYPE_MULTIPLE_SELECT){

      var result = itemSettingManager.checkDivisionList(division_list);

      if (result.is_error === true){
        alert(result.message);
        return;
      }

      division_list = itemSettingManager.sortDivisionList(division_list);

      param.division_list = division_list;
    }

    if (!field_name){
      alert('フィールド名称を入力してください');
      return;
    }

    if (!display_name){
      alert('表示名称を入力してください');
      return;
    }

    //フィールド名称文字チェック
    if (field_name.search(/\W/) >= 0){
      alert('フィールド名称は英数字および_（アンダースコア）で記述してください。');
      return;
    }

    //フィールド名称存在チェック
    $http.post(
      '/organ_item/php/organ_item_field_name_check.php',
      {field_name: field_name, collection_name: values.collection_name}
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }

      var exists = data.value;

      if (exists){
        alert('このフィールド名称は既に利用されています。別のフィールド名称を指定してください');
        return;
      }

      //項目作成
      $http.post(
        '/organ_item/php/organ_item_create.php',
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          $scope.draggable.remove();
          return;
        }

        //ナビゲーションツアー
        if (values.collection_name == 'prospects' && tourNavigation != null){
          if (type == "number" && display_name == "従業員数"
               && tourNavigation.currentTour.id == tourNavigation.TOUR_DB 
               && tourNavigation.currentTour.stone == tourNavigation.TOUR_DB_SELECTNUMITEM){
            tourNavigation.hideBalloon("li[data-type='number']");
            tourNavigation.setCurrentTour(tourNavigation.TOUR_DB, tourNavigation.TOUR_DB_EMPLOYEEITEM);
          }
        }

        var
          item     = data.value,
          html_str = itemSettingManager.createItemHtmlString(item, $scope.$parent),
          $html    = $(html_str);

        //要素の置き換え
        $scope.draggable.replaceWith($html);

        $compile($html)($scope.$parent);

        ngDialog.close();

        //並び順の保存
        itemSettingManager.saveItemOrder(group_id, values.collection_name);
      });

    });
  };

  $scope.cancel = function(){

    $scope.draggable.remove();

    ngDialog.close();
  };

  $scope.init();
});

//項目編集
app.controller('ItemEditController', function($scope, $http, $state, $stateParams, $compile, ngDialog, constants, values, item_setting_constants, itemSettingManager) {

  $scope.init = function(){

    $scope.field_name   = $scope.$parent.selectedItem.field_name;

    $scope.display_name = $scope.$parent.selectedItem.display_name;

    $scope.type         = $scope.$parent.selectedItem.type;

    $scope.is_select    = ($scope.type == constants.TYPE_SELECT || $scope.type == constants.TYPE_MULTIPLE_SELECT);

    //if ($scope.is_select){
      itemSettingManager.createDivisionListGrid($scope, {mode: 'update'});
    //}
  };

  //区分の追加
  $scope.createDivision = function(){

    itemSettingManager.createDivision($scope);
  };

  $scope.deleteDivision = function(row){

    if (!confirm('選択肢を削除します。よろしいですか？')){
      return;
    }

    var
      key = row.entity.key;

    $.each($scope.division_list, function(i, v){
      if (v.key == key){
        $scope.division_list.splice(i, 1);
        return;
      }
    });
  };

  //項目の保存
  $scope.save = function(){

    var
      selected_item = $scope.$parent.selectedItem,
      field_name    = $scope.field_name,
      display_name  = $scope.display_name,
      _id           = selected_item._id.$id,
      type          = $scope.type,
      division_list = $scope.division_list,
      param         = {_id: _id, display_name: display_name, field_name: field_name, hidden_div: 0, collection_name: values.collection_name};

    if (!field_name){
      alert('フィールド名称を入力してください');
      return;
    }

    if (!display_name){
      alert('表示名称を入力してください');
      return;
    }

    //フィールド名称文字チェック
    if (field_name.search(/\W/) >= 0){
      alert('フィールド名称は英数字および_（アンダースコア）で記述してください。');
      return;
    }

    if (type == constants.TYPE_SELECT || $scope.type == constants.TYPE_MULTIPLE_SELECT){

      var result = itemSettingManager.checkDivisionList(division_list);

      if (result.is_error === true){
        alert(result.message);
        return;
      }

      division_list = itemSettingManager.sortDivisionList(division_list);

      param.division_list = division_list;
    }

    //フィールド名称存在チェック
    $http.post(
      '/organ_item/php/organ_item_field_name_check.php',
      {field_name: field_name, collection_name: values.collection_name, _id: _id}
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }

      var exists = data.value;

      if (exists){
        alert('このフィールド名称は既に利用されています。別のフィールド名称を指定してください');
        return;
      }

      //項目更新
      $http.post(
        '/organ_item/php/organ_item_update.php',
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }

        //親スコープに更新情報を設定する
        //$scope.$parent[field_name]['display_name'] = display_name;
        $scope.$parent[field_name] = data.value;

        ngDialog.close();
      });

    });
  };

  $scope.cancel = function(){

    ngDialog.close();
  };


  $scope.init();
});

//見込み客データの引継ぎ設定
app.controller('ProspectMappingController', function($scope, $http, $state, $stateParams, $compile, values, item_setting_constants, itemSettingManager) {

  //初期化処理
  $scope.init = function(){
    $scope.page_title = "見込客データの関連付け";
    var param = null;

    $scope.prospectlists = [];

    //設定データ及び設定項目の取得
    $http.post(
      '/item_setting/php/item_mapping_read.php',
      param
    ).success(
      function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        var list = null;
        list = data.value.list;

        //selectリストの設定(会社)
        if(list['companies_strings'] != null){
          $scope.companies_strings = list['companies_strings'];
        }
        if(list['companies_selects'] != null){
          $scope.companies_selects = list['companies_selects'];
        }
        if(list['companies_datetimes'] != null){
          $scope.companies_datetimes = list['companies_datetimes'];
        }
        if(list['companies_dates'] != null){
          $scope.companies_dates = list['companies_dates'];
        }
        if(list['companies_texts'] != null){
          $scope.companies_texts = list['companies_texts'];
        }
        if(list['companies_numbers'] != null){
          $scope.companies_numbers = list['companies_numbers'];
        }
        if(list['companies_multiple_selects'] != null){
          $scope.companies_multiple_selects = list['companies_multiple_selects'];
        }

        //selectリストの設定(担当者)
        if(list['customers_strings'] != null){
          $scope.customers_strings = list['customers_strings'];
        }
        if(list['customers_selects'] != null){
          $scope.customers_selects = list['customers_selects'];
        }
        if(list['customers_datetimes'] != null){
          $scope.customers_datetimes = list['customers_datetimes'];
        }
        if(list['customers_dates'] != null){
          $scope.customers_dates = list['customers_dates'];
        }
        if(list['customers_texts'] != null){
          $scope.customers_texts = list['customers_texts'];
        }
        if(list['customers_numbers'] != null){
          $scope.customers_numbers = list['customers_numbers'];
        }
        if(list['customers_multiple_selects'] != null){
          $scope.customers_multiple_selects = list['customers_multiple_selects'];
        }

        //selectリストの設定(商談)
        if(list['business_strings'] != null){
          $scope.business_strings = list['business_strings'];
        }
        if(list['business_selects'] != null){
          $scope.business_selects = list['business_selects'];
        }
        if(list['business_datetimes'] != null){
          $scope.business_datetimes = list['business_datetimes'];
        }
        if(list['business_dates'] != null){
          $scope.business_dates = list['business_dates'];
        }
        if(list['business_texts'] != null){
          $scope.business_texts = list['business_texts'];
        }
        if(list['business_numbers'] != null){
          $scope.business_numbers = list['business_numbers'];
        }
        if(list['business_multiple_selects'] != null){
          $scope.business_multiple_selects = list['business_multiple_selects'];
        }

        //見込客の項目・selectリストの選択項目の設定
        if(list['prospectlists'] != null){
          $scope.prospectlists = list['prospectlists'];
        } 
    });

  /** テストコード
  $scope.companies_strings = [
                    {field_name:"",display_name:"なし"},
                    {field_name:"company_name",display_name:"会社名"},
                    {field_name:"phone_no",display_name:"電話番号"},
                    {field_name:"fax_no",display_name:"FAX番号"},
                    {field_name:"email",display_name:"e-mail"},
                    {field_name:"site_url",display_name:"サイトURL"}];
  
  $scope.companies_selects = [
                    {field_name:"",display_name:"なし"},
                    {field_name:"prefecture_div",display_name:"都道府県"}];
  

  $scope.customers_strings = [
                    {field_name:"",display_name:"なし"},
                    {field_name:"company_name",display_name:"会社名"},
                    {field_name:"phone_no",display_name:"電話番号"},
                    {field_name:"fax_no",display_name:"FAX番号"},
                    {field_name:"email",display_name:"e-mail"},
                    {field_name:"site_url",display_name:"サイトURL"}];

  $scope.customers_selects = [
                    {field_name:"",display_name:"なし"},
                    {field_name:"prefecture_div",display_name:"都道府県"}];

  $scope.business_strings = [
                    {field_name:"",display_name:"なし"},
                    {field_name:"business_discussion_name",display_name:"商談名"},
                    {field_name:"item_001",display_name:"認知経路"}];

  $scope.business_selects = [
                    {field_name:"",display_name:"なし"},
                    {field_name:"situation_div",display_name:"商談状況"}];
  $scope.prospectlists = 
                   [ {"label":"会社名",
                      "companies":{"field_name":"company_name","type_string":true,"type_select":false},
                      "customers":{"field_name":"","type_string":true,"type_select":false},
                      "business":{"field_name":"","type_string":true,"type_select":false}}, 
                     {"label":"電話番号",
                      "companies":{"field_name":"phone_no","type_string":true,"type_select":false},
                      "customers":{"field_name":"phone_no","type_string":true,"type_select":false},
                      "business":{"field_name":"business_discussion_name","type_string":true,"type_select":false}}, 
                     {"label":"FAX番号",
                      "companies":{"field_name":"fax_no","type_string":true,"type_select":false},
                      "customers":{"field_name":"fax_no","type_string":true,"type_select":false},
                      "business":{"field_name":"item_001","type_string":true,"type_select":false}}, 
                     {"label":"e-mail",
                      "companies":{"field_name":"email","type_string":true,"type_select":false},
                      "customers":{"field_name":"email","type_string":true,"type_select":false},
                      "business":{"field_name":"","type_string":true,"type_select":false}}, 
                     {"label":"都道府県",
                      "companies":{"field_name":"prefecture_div","type_string":false,"type_select":true},
                      "customers":{"field_name":"prefecture_div","type_string":false,"type_select":true},
                      "business":{"field_name":"situation_div","type_string":false,"type_select":true}}];
  **/                  
  }

  $scope.update = function(){
    
    var prospectlists = [],
        param         = {prospectlists: prospectlists};

    param.prospectlists = $scope.prospectlists;
    //更新
    $http.post(
        '/item_setting/php/item_mapping_update.php',
        param
    ).success(function(data){
      if (data.has_error){
        alert(data.message);
        return;
      }
      //もとに戻る
　　　　　$state.go('item_settings');
    });

  }

  $scope.init();
});

})();
