(function(){

  if (app){

    app.factory('constants', function() {
      var constants = {
        'TYPE_STRING'         : 'string',
        'TYPE_NUMBER'         : 'number',
        'TYPE_SELECT'         : 'select',
        'TYPE_MULTIPLE_SELECT': 'multiple_select',
        'TYPE_TABLE'          : 'table',
        'TYPE_EMAIL'          : 'email',
        'TYPE_DATE'           : 'date',
        'TYPE_DATETIME'       : 'datetime',
        'TYPE_TEXT'           : 'text',
        'TYPE_COLLECTION'     : 'collection',
        'RELATION_ONE_TO_MANY' : 'one_to_many',
        'RELATION_MANY_TO_MANY': 'many_to_many',
        'DATE_RANGE_LIST': [
          {key: 'custom'          , text: 'カスタム'},
          {key: 'today'           , text: '今日'},
          {key: 'yesterday'       , text: '昨日'},
          {key: 'tomorrow'        , text: '明日'},
          {key: 'this_week'       , text: '今週'},
          {key: 'last_week'       , text: '先週'},
          {key: 'next_week'       , text: '来週'},
          {key: 'this_month'      , text: '今月'},
          {key: 'last_month'      , text: '前月'},
          {key: 'next_month'      , text: '翌月'},
          {key: 'this_quarter'    , text: '当四半期'},
          {key: 'last_quarter'    , text: '前四半期'},
          {key: 'next_quarter'    , text: '翌四半期'},
          {key: 'this_year'       , text: '本年'},
          {key: 'last_year'       , text: '前年'},
          {key: 'next_year'       , text: '翌年'},
          {key: 'this_fiscal_year', text: '当会計年度'},
          {key: 'last_fiscal_year', text: '前会計年度'},
          {key: 'next_fiscal_year', text: '翌会計年度'},
          {key: 'past7days'       , text: '過去7日間'},
          {key: 'past14days'      , text: '過去14日間'},
          {key: 'past30days'      , text: '過去30日間'}
        ],
        'DATE_RANGE_CUSTOM'          : 'custom',
        'DATE_RANGE_TODAY'           : 'today',
        'DATE_RANGE_YESTERDAY'       : 'yesterday',
        'DATE_RANGE_TOMORROW'        : 'tomorrow',
        'DATE_RANGE_THIS_WEEK'       : 'this_week',
        'DATE_RANGE_LAST_WEEK'       : 'last_week',
        'DATE_RANGE_NEXT_WEEK'       : 'next_week',
        'DATE_RANGE_THIS_MONTH'      : 'this_month',
        'DATE_RANGE_LAST_MONTH'      : 'last_month',
        'DATE_RANGE_NEXT_MONTH'      : 'next_month',
        'DATE_RANGE_THIS_QUARTER'    : 'this_quarter',
        'DATE_RANGE_LAST_QUARTER'    : 'last_quarter',
        'DATE_RANGE_NEXT_QUARTER'    : 'next_quarter',
        'DATE_RANGE_THIS_YEAR'       : 'this_year',
        'DATE_RANGE_LAST_YEAR'       : 'last_year',
        'DATE_RANGE_NEXT_YEAR'       : 'next_year',
        'DATE_RANGE_THIS_FISCAL_YEAR': 'this_fiscal_year',
        'DATE_RANGE_LAST_FISCAL_YEAR': 'last_fiscal_year',
        'DATE_RANGE_NEXT_FISCAL_YEAR': 'next_fiscal_year',
        'DATE_RANGE_PAST7DAYS'       : 'past7days',
        'DATE_RANGE_PAST14DAYS'      : 'past14days',
        'DATE_RANGE_PAST30DAYS'      : 'past30days',
        'DATE_RANGE_OPERATOR_BETWEEN': 'between',
        'STRING_OPERATOR_LIST': [
          {key: 'cn', text: '含む'},
          {key: 'eq', text: '完全一致'},
          {key: 'bw', text: '先頭が一致'},
          {key: 'ew', text: '末尾が一致'},
          {key: 'nc', text: '含まない'},
          {key: 'ne', text: '完全一致しない'},
          {key: 'bn', text: '先頭が一致しない'},
          {key: 'en', text: '最後が一致しない'}
        ],
        'NUMBER_OPERATOR_LIST': [
          {key: 'eq', text: '=' },
          {key: 'ne', text: '<>'},
          {key: 'gt', text: '>' },
          {key: 'ge', text: '>='},
          {key: 'lt', text: '<' },
          {key: 'le', text: '<='}
        ],
        'DATE_OPERATOR_LIST': [
          {key: 'eq', text: '=' },
          {key: 'ne', text: '<>'},
          {key: 'gt', text: '>' },
          {key: 'ge', text: '>='},
          {key: 'lt', text: '<' },
          {key: 'le', text: '<='}
        ],
        'DATETIME_OPERATOR_LIST': [
          {key: 'eq', text: '=' },
          {key: 'ne', text: '<>'},
          {key: 'gt', text: '>' },
          {key: 'ge', text: '>='},
          {key: 'lt', text: '<' },
          {key: 'le', text: '<='}
        ],
        'SELECT_OPERATOR_LIST': [
          {key: 'eq', text: '='}
        ],
        'TABLE_OPERATOR_LIST': [
          {key: 'eq', text: '='}
        ],
        'COLLECTION_OPERATOR_LIST': [
          {key: 'cn', text: '含む'},
          {key: 'eq', text: '完全一致'},
          {key: 'bw', text: '先頭が一致'},
          {key: 'ew', text: '末尾が一致'},
          {key: 'nc', text: '含まない'},
          {key: 'ne', text: '完全一致しない'},
          {key: 'bn', text: '先頭が一致しない'},
          {key: 'en', text: '最後が一致しない'}
        ]
      };

      constants['RELATION_LIST'] = [
        {main: 'business_discussions', detail: 'activity_hitsories',   relation: constants.RELATION_ONE_TO_MANY },
        {main: 'customers',            detail: 'business_discussions', relation: constants.RELATION_MANY_TO_MANY },
        {main: 'business_discussions', detail: 'customers',            relation: constants.RELATION_MANY_TO_MANY }
        //{main: 'customers', detail: 'business_contracts',   relation: constants.RELATION_MANY_TO_MANY }
      ];

      return constants;
    });

    //検索結果再現用
    app.value('searchOptions', {
      pagingOptions: {},
      filterOptions: {},
      sortInfo     : {},
      scrollTop    : 0,
      reloadOption: false,
    });

    //共通サービス
    //共通関数
    app.factory('utils', ['$http', 'constants', 'values', function($http, constants, values){

      var utils = {};

      utils.putObject = function(path, object, value) {

        if (!path){
          return;
        }

        var
          modelPath = path.split('.');

        utils.fill(object, modelPath, 0, value);
      };

      utils.fill = function(object, elements, depth, value) {

        var hasNext = ((depth + 1) < elements.length);

        if(depth < elements.length && hasNext) {

          if(!object.hasOwnProperty(elements[depth])) {
            object[elements[depth]] = {};
          }

          utils.fill(object[elements[depth]], elements, ++depth, value);
        } else {
          object[elements[depth]] = value;
        }
      };
    /*
      utils.updateGridLayout = function (scope, grid) {

        if (!scope.$$phase) {
          scope.$apply(function(){
            services.DomUtilityService.RebuildGrid(scope, grid);
          });
        }
        else {
          // $digest or $apply already in progress
          services.DomUtilityService.RebuildGrid(scope, grid);
        }
      };
    */

      //桁埋め
      utils.pad = function (n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      };

      //月日0埋め
      utils.toDoubleDigits = function(num) {
        num += "";
        if (num.length === 1) {
          num = "0" + num;
        }
        return num;
      };

      //日付の加減算
      utils.computeDate = function(year, month, day, addDays) {
        var dt = new Date(year, month - 1, day);
        var baseSec = dt.getTime();
        var addSec = addDays * 86400000;//日数 * 1日のミリ秒数
        var targetSec = baseSec + addSec;
        dt.setTime(targetSec);
        return dt;
      }

      utils.addComma = function(num){

        num = String(num).replace(/,/, '');

        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      };

      utils.getRelation = function(query){

        if (!query){
          console.log('query not found!');
          return;
        }

        var
          main   = query.main,
          detail = query.detail,
          list   = constants.RELATION_LIST,
          result = constants.RELATION_ONE_TO_MANY;

        $.each(list, function(i, v){
          if (v['main'] == main && v['detail'] == detail){
            result = v['relation'];
          }
        });

        return result;
      };

      //データ作成時自動入力
      utils.setMyDataWhenCreate = function(scope, collection_name){

        if (values.user){
          utils.setUserData(scope, collection_name, values.user, {is_create: true});
        }else{
          $http.post(
            '/user/php/my_data_get.php'
          ).success(function(data){
            if (data.has_error){
              alert(data.message);
              return;
            }
            var
              user = data.value;

            values.user = user; //ユーザー情報をキャッシュする

            utils.setUserData(scope, collection_name, user, {is_create: true});
          });
        }
      };


      utils.setUserData = function(scope, collection_name, user, options){

        if (!scope[collection_name]){
          scope[collection_name] = {};
        }

        scope[collection_name]['sales_staff']      = user['user_id'];
        scope[collection_name][collection_name + '___' + 'sales_staff_name'] = user['last_name'] + user['first_name'];

        scope[collection_name]['responsible']      = user['user_id'];
        scope[collection_name]['responsible_name'] = user['last_name'] + user['first_name'];

        if (options && options.is_create === true){
          scope[collection_name]['created_by']       = user['user_id'];
          scope[collection_name]['created_by_name']  = user['last_name'] + user['first_name'];
        }
      };

      utils.inArray = function(value, list){
        var
          is_exists = false;

        if (!value || !list || ((list instanceof Array) !== true) || list.length == 0){
          return false;
        }

        $.each(list, function(i, v){
          if (value == v){
            is_exists = true;
            return;
          }
        });

        return is_exists;
      };

      utils.appendSearchDataToParam = function(param, filterOptions){

        if (!param){
          return;
        }else if (!filterOptions){
          return param;
        }

        var
          field_name   = filterOptions.fieldName,
          search_text  = filterOptions.searchText,
          search_value = filterOptions.searchValue;

        if (field_name){
          param.field_name  = field_name;

          if (search_text){
            param.search_text = search_text;
          }else if (search_value){
            param.search_value = search_value;
          }
        }

        return param;
      };

      utils.createMethodNameBase = function(singular_name){
        var
          ss     = null,
          result = '';

        if (singular_name.indexOf('_') >= 0){
          ss = singular_name.split('_');
        }else{
          ss = [singular_name];
        }

        $.each(ss, function(i, v){
          result += v.substring(0, 1).toUpperCase() + v.substring(1);
        })

        return result;
      };

      //関数存在確認
      utils.isFunction = function(func){
        if (func && (typeof func === 'function')){
          return true;
        }else{
          return false;
        }
      };

      //values関数実行
      utils.execFunction = function(path){

        if (!path){
          return;
        }

        var
          path_list = null,
          func      = null;

        if (path.indexOf('.') !== false){
          path_list = path.split('.');
        }else{
          path_list = [path];
        }

        func = utils.getByPathArray(path_list, 0, values);

        if (utils.isFunction(func) === true){
          //関数実行
          func();
        }
      };

      utils.getByPathArray = function(path_list, index, value){

        var
          key   = path_list[index],
          value = value[key];

        index += 1;

        if (path_list.length > index){
          value = utils.getByPathArray(path_list, index, value);
        }

        return value;
      };

      utils.getPrefDivList = function(){

        var
          list = [
            { key: '0',  value: '未選択' },
            { key: '1',  value: '北海道' },
            { key: '2',  value: '青森県' },
            { key: '3',  value: '岩手県' },
            { key: '4',  value: '宮城県' },
            { key: '5',  value: '秋田県' },
            { key: '6',  value: '山形県' },
            { key: '7',  value: '福島県' },
            { key: '8',  value: '茨城県' },
            { key: '9',  value: '栃木県' },
            { key: '10', value: '群馬県' },
            { key: '11', value: '埼玉県' },
            { key: '12', value: '千葉県' },
            { key: '13', value: '東京都' },
            { key: '14', value: '神奈川県' },
            { key: '15', value: '新潟県' },
            { key: '16', value: '富山県' },
            { key: '17', value: '石川県' },
            { key: '18', value: '福井県' },
            { key: '19', value: '山梨県' },
            { key: '20', value: '長野県' },
            { key: '21', value: '岐阜県' },
            { key: '22', value: '静岡県' },
            { key: '23', value: '愛知県' },
            { key: '24', value: '三重県' },
            { key: '25', value: '滋賀県' },
            { key: '26', value: '京都府' },
            { key: '27', value: '大阪府' },
            { key: '28', value: '兵庫県' },
            { key: '29', value: '奈良県' },
            { key: '30', value: '和歌山県' },
            { key: '31', value: '鳥取県' },
            { key: '32', value: '島根県' },
            { key: '33', value: '岡山県' },
            { key: '34', value: '広島県' },
            { key: '35', value: '山口県' },
            { key: '36', value: '徳島県' },
            { key: '37', value: '香川県' },
            { key: '38', value: '愛媛県' },
            { key: '39', value: '高知県' },
            { key: '40', value: '福岡県' },
            { key: '41', value: '佐賀県' },
            { key: '42', value: '長崎県' },
            { key: '43', value: '熊本県' },
            { key: '44', value: '大分県' },
            { key: '45', value: '宮崎県' },
            { key: '46', value: '鹿児島県' },
            { key: '47', value: '沖縄県' }
          ];

        return list;
      };

      utils.getMonths = function(){

        var
          months = [
            {key: '0',  value: '未選択'},
            {key: '1',  value: '1月'},
            {key: '2',  value: '2月'},
            {key: '3',  value: '3月'},
            {key: '4',  value: '4月'},
            {key: '5',  value: '5月'},
            {key: '6',  value: '6月'},
            {key: '7',  value: '7月'},
            {key: '8',  value: '8月'},
            {key: '9',  value: '9月'},
            {key: '10', value: '10月'},
            {key: '11', value: '11月'},
            {key: '12', value: '12月'}
          ];

        return months;
      };

      utils.showError = function(message){
        if (myObject && myObject.common){
          myObject.common.showError(message);
        }else{
          alert(message);
        }
      };

      utils.showInfo = function(message){
        if (myObject && myObject.common){
          myObject.common.showInfo(message);
        }else{
          alert(message);
        }
      };

      utils.formatDate = function(date_str, format){
        if (date_str == ''){
          return '';
        }

        if (!format){
          format = 'YYYY/MM/DD';
        }
        var date = new Date(date_str);
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        if (format.match(/S/g)) {
          var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
          var length = format.match(/S/g).length;
          for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
        }
        return format;
      }

      return utils;

    }]);

    //項目管理
    app.factory('itemManager', ['$http', 'utils', 'constants', function($http, utils, constants){

      var itemManager = {};

      itemManager.getItem = function(field_name, organ_item_list){

        var item_list = organ_item_list,
            res       = null;

        $.each(item_list, function(i, item){

          if (field_name == item['field_name']){
            res = item;
            return;
          }

        });

        return res;
      };

      //外部テーブル等に対応したオブジェクトの変換
      itemManager.convertObject = function(object, organ_item_list, options){

        $.each(object, function(field_name, field_value){
          var
            item             = itemManager.getItem(field_name, organ_item_list),
            type             = null,
            id_column_name   = null,
            name_column_name = null,
            name_list        = null,
            external_collection_name = null,
            external_field_name      = null,
            external_name_field_name = null,
            division_list            = null,
            value_list               = null,
            str                      = null;

          if (item){
            type = item.type;

            if (type == constants.TYPE_NUMBER){
              if (options && (options.is_list === true || options.is_detail === true)){
                object[field_name] = utils.addComma(object[field_name]);
              }
            }else if (type == constants.TYPE_TABLE){
              id_column_name   = item.column_name;
              name_column_name = item.name_column_name;

              if (name_column_name.indexOf('+') !== -1){
                name_list = name_column_name.split('+');
              }else{
                name_list = [name_column_name];
              }

              var table_data_list = item.list;

              $.each(table_data_list, function(ii, data){
                if (field_value == data[id_column_name]){
                  field_value = '';

                  $.each(name_list, function(iii, vvv){
                    field_value += data[vvv];
                  });

                  object[field_name] = field_value;
                }
              });
            }else if (type == constants.TYPE_SELECT || type == constants.TYPE_MULTIPLE_SELECT){
              //選択肢
              if (options && (options.is_list === true || options.is_detail === true)){
                division_list = item.division_list;

                if (division_list){

                  if ((object[field_name] instanceof Array) === true){
                    value_list = object[field_name];
                    str        = '';

                    $.each(division_list, function(i, v){
                      var
                        key   = v['key'],
                        value = v['value'];

                      $.each(value_list, function(ii, vv){
                        if (vv == key){
                          if (str.length > 0){
                            str += ', ';
                          }

                          str += value;
                        }
                      });
                    });

                    object[field_name] = str;
                  }else{
                    $.each(division_list, function(i, v){
                      var
                        key   = v['key'],
                        value = v['value'];

                      if (object[field_name] == key){
                        object[field_name] = value;
                        return;
                      }
                    });
                  }
                }
              }
            }else if (type == constants.TYPE_COLLECTION){
              //外部コレクション
              if (options && options.is_list === true){

                if (item.external_name_field_name.indexOf('+') >= 0){
                  /*var name_list = item.external_name_field_name.split('+');
                  object[field_name] = '';
                  $.each(name_list, function(i, v){
                    object[field_name] += object[v];
                  });*/
                  object[field_name] = object[item.collection_name + '___' + item.external_collection_singular_name + '_name'];
                }else{
                  object[field_name] = object[item.collection_name + '___' + item.external_name_field_name];
                }
              }
            }
          }
        });

        return object;
      };

      //gridDataをDBに対応したオブジェクトへ変換
      itemManager.convertDBObject = function(object, organ_item_list){
        $.each(object, function(field_name, field_value){
          var
            item             = itemManager.getItem(field_name, organ_item_list),
            type             = null,
            division_list            = null,
            value_list               = null,
            str                      = null;

          if (item){
            type = item.type;

            if (type == constants.TYPE_NUMBER){
              str = String(object[field_name]).replace(/,/g, '');
              object[field_name] = parseFloat(str);
//            }else if (type == constants.TYPE_TABLE){

            }else if (type == constants.TYPE_SELECT || type == constants.TYPE_MULTIPLE_SELECT){
              division_list = item.division_list;

              if (division_list){

                if ((object[field_name] instanceof Array) === true){
                  value_list = object[field_name];
                  str        = '';

                  $.each(division_list, function(i, v){
                    var
                      key   = v['key'],
                      value = v['value'];

                    $.each(value_list, function(ii, vv){
                      if (vv == value){
                        if (str.length > 0){
                          str += ', ';
                        }

                        str += String(key);
                      }
                    });

                  });

                  object[field_name] = str;
                }else{
                  $.each(division_list, function(i, v){
                    var
                      key   = v['key'],
                      value = v['value'];

                    if (object[field_name] == value){
                      object[field_name] = String(key);
                      return;
                    }
                  });
                }
              }
//            }else if (type == constants.TYPE_COLLECTION){

            }
          }
        });

        return object;
      }

      itemManager.getItemList = function(collection_name){
        return $http.post(
          '/my_item_list/php/my_item_list_read_single.php',
          {collection_name: collection_name}
        );
      };

      itemManager.getItemList = function(collection_name, options){
        if(options === undefined){
          return $http.post(
            '/my_item_list/php/my_item_list_read_single.php',
            {collection_name: collection_name}
          );
        }else{
          return $http.post(
            '/my_item_list/php/my_item_list_read_single.php',
            {collection_name: collection_name,
             options : options}
          );  
        }        
      };

      //グリッドカラム設定の作成
      itemManager.createColumnDefinisions = function(list, options){

        var
          columns = [];
        const cellEditableTemplate = '<input type="text" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-class="\'colt\' + col.index" >';
        const cellDateEditableTemplate = '<input id="row" type="text" datepicker="" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-class="\'colt\' + col.index" ng-focus="setDateData(row,col)" >';
        const cellNumberEditableTemplate = '<input type="number" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-class="\'colt\' + col.index" ng-focus="setNumData(row,col)" ng-blur="outNumData(row,col)">';

        $.each(list, function(index, value){

          var
            field_name   = value['field_name'],
            display_name = value['display_name'],
            list_div     = value['list_div'],
            type         = value['type'],
            visible      = value['visible'],
            width        = value['width'],
            edit_cell    = false,
            col          = null,
            editableTemplate = null,
            cellTemplate  = null;

          if (!options){
            options = {};
          }

          if (options.isMainList === true && list_div != 1){
            return;
          }

          if(options.edit_cell){
            edit_cell = options.edit_cell;
          }

          switch(type){
            case "number":
              editableTemplate = cellNumberEditableTemplate;
              break;
            case "date":
              editableTemplate = cellDateEditableTemplate;
              break;
            default:
              editableTemplate = cellEditableTemplate;
          }

          col = {field: field_name, displayName: display_name, width: 100,
           visible: (visible === false ? false: true),
           enableCellEdit: (edit_cell === true ? true: false),
           editableCellTemplate: editableTemplate,
           type : type};

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

      return itemManager;
    }]);

    //ディレクティブ
    //datepicker
    app.directive('datepicker', ['utils', function(utils) {
      return {
        restrict: 'EA',
        require : '^ngModel',
        scope   : {
          afterSelect: '&afterSelect'
        },
        link: function(scope, element, attrs, ctrl) {
          element.datepicker({
            inline  : true,
            onSelect: function(dateText){
              //var modelPath = $(this).attr('ng-model');
              //utils.putObject(modelPath, scope, dateText);
              //scope.$apply();
              ctrl.$setViewValue(dateText);

              if (utils.isFunction(scope.afterSelect) === true){
                scope.afterSelect();
              }
            }
          });
        }
      }
    }]);

    //datepicker:ng-modelなし
    app.directive('datepickerforjquery', ['utils', function(utils) {
      return {
        restrict: 'EA',
        scope   : {
          afterSelect: '&afterSelect'
        },
        link: function(scope, element, attrs, ctrl) {
          element.datepicker({
            inline  : true,
            onSelect: function(dateText){
              //var modelPath = $(this).attr('ng-model');
              //utils.putObject(modelPath, scope, dateText);
              //scope.$apply();
              element.val(dateText);

              if (utils.isFunction(scope.afterSelect) === true){
                scope.afterSelect();
              }
            }
          });
        }
      }
    }]);

    //datetimepicker
    app.directive('datetimepicker', ['utils', function(utils){
      return {
        restrict: 'EA',
        require : '^ngModel',
        scope   : {
          afterSelect: '&afterSelect'
        },
        link: function(scope, element, attrs, ctrl) {
          var options = {
            dateFormat   : 'yy/mm/dd',
            controlType  : 'select',
            timeFormat   : 'HH:mm',
            closeText    : '閉じる',
            currentText  : '現在日時',
            timeOnlyTitle: '日時を選択',
            timeText     : '時間',
            hourText     : '時',
            minuteText   : '分',
            inline       : true,
            onSelect     : function(dateText){
              //var
              //  modelPath = $(this).attr('ng-model');

              //utils.putObject(modelPath, scope, text);
              //scope.$apply();
              ctrl.$setViewValue(dateText);

              if (utils.isFunction(scope.afterSelect) === true){
                scope.afterSelect();
              }
            }
          };

          element.datetimepicker(options);
        }
      };
    }]);

    //datetimepicker:ng-modelなし
    app.directive('datetimepickerforjquery', ['utils', function(utils){
      return {
        restrict: 'EA',
        scope   : {
          afterSelect: '&afterSelect'
        },
        link: function(scope, element, attrs, ctrl) {
          var options = {
            dateFormat   : 'yy/mm/dd',
            controlType  : 'select',
            timeFormat   : 'HH:mm',
            closeText    : '閉じる',
            currentText  : '現在日時',
            timeOnlyTitle: '日時を選択',
            timeText     : '時間',
            hourText     : '時',
            minuteText   : '分',
            inline       : true,
            onSelect     : function(dateText){
              //var
              //  modelPath = $(this).attr('ng-model');

              //utils.putObject(modelPath, scope, text);
              //scope.$apply();
              element.val(dateText);

              if (utils.isFunction(scope.afterSelect) === true){
                scope.afterSelect();
              }
            }
          };

          element.datetimepicker(options);
        }
      };
    }]);

    //multipleselect
    app.directive('multipleselect', function(){
      return function(scope, element, attrs) {
        element.multiselect();
      }
    });

    //tooltip
    app.directive('tooltip', function(){
      return function(scope, element, attrs) {

        element.tooltip({
          placement: 'bottom',
          container: 'body'
        }).on('click',function(){
          $(this).tooltip('destroy');
        });
      }
    });

    //checkbox
    app.directive('upCheckbox', ['$compile', '$parse', 'utils', function($compile, $parse, utils){

      return {
        restrict: 'A',
        require : '^ngModel',
        template: '<label class="common-checkbox">' +
                    '<input type="checkbox" ng-model="ngModel" ng-init="checked=true">' +
                    '<label></label>' +
                  '</label>',
        replace : true,
        link    : function(scope, element, attrs, ctrl){

          scope.$watch('ngModel', function (value) {
            ctrl.$setViewValue(value);
          });

          scope.$parent.$watch(attrs.ngModel, function (value) {
            scope.ngModel = value;
          });

          var
            id        = attrs.id,
            caption   = attrs.caption,
            on_value  = attrs.onValue,
            off_value = attrs.offValue;

          if (!on_value){
            on_value = 1;
          }

          if (!off_value){
            off_value = 0;
          }

          $('input:checkbox', element).attr('id', id);

          $('label', element).attr('for', id).html(caption);

          element.removeAttr('id').removeAttr('caption');
        }
      };
    }]);

    //spinner
    app.directive('upSpinner', ['$compile', 'utils', function($compile, utils){

      return {
        restrict: 'AE',
        require : '^ngModel',
        template: '<div><input type="text" ng-model="ngModel" /></div>',
        //template: '<div><input type="text" /></div>',
        replace : true,
        scope   : {
          afterStop: '&afterStop',
        },
        link    : function(scope, element, attrs, ctrl){

/*
          scope.$watch('ngModel', function (value) {
            ctrl.$setViewValue(value);
          });
*/

          var
            watchParentNgModel = scope.$parent.$watch(attrs.ngModel, function (value) {
              scope.ngModel = value;
              //$('input', element).spinner('value', value);

              watchParentNgModel(); //1回のみ実行
            }),
            min        = 0,
            max        = 1000,
            ng_model   = null,
            value      = 0,
            after_stop = null,
            $input     = $('input', element);

          if (attrs.min){
            min = scope.$eval(attrs.min);
          }

          if (attrs.max){
            max = scope.$eval(attrs.max);
          }

          $input.spinner({
            min : min,
            max : max,
            change: function(e, ui){
              var
                value = $(this).val();

              if (!value){
                value = 0;
              }

              value = parseInt(value, 10);

              scope.ngModel = value;

              ctrl.$setViewValue(value);
            },
            stop: function(e, ui){

              var
                value = $(this).val();

              if (!value){
                value = 0;
              }

              value = parseInt(value, 10);

              value = value.toString();

              scope.ngModel = value;

              ctrl.$setViewValue(value);

              if (utils.isFunction(scope.afterStop) === true){
                scope.afterStop();
              }
            }
          });

        }
      };
    }]);

    //基底コントローラー
    app.controller('BaseController', function($scope){

      //区分リストの取得
      $scope.getDivisionList = function(division_code){

        if (!$scope.division_list){
          $scope.division_list = {};
        }

        return $scope.division_list[division_code];
      };

      //区分リストのセット
      $scope.setDivisionList = function(division_code, division_list){

        if (!$scope.division_list){
          $scope.division_list = {};
        }

        $scope.division_list[division_code] = division_list;
      };

      //テーブルデータリストの取得
      $scope.getTableDataList = function(table_name){

        if (!$scope.table_data_list){
          $scope.table_data_list = {};
        }

        return $scope.table_data_list[table_name];
      };

      //テーブルデータリストのセット
      $scope.setTableDataList = function(table_name, table_data_list){

        if (!$scope.table_data_list){
          $scope.table_data_list = {};
        }

        $scope.table_data_list[table_name] = table_data_list;
      };

      //ページサイズが指定された場合ページサイズをCookieに設定する
      $scope.setPageSize = function(pageKeyOption){
        //undefinedの場合、処理なし
        if(!$scope.pagingOptions.pageSize) {return;}

        var tag = "PAGESIZE"
        if(pageKeyOption != null){
          tag += "_";
          tag += pageKeyOption;
        }
        try{
          $.cookie(tag, $scope.pagingOptions.pageSize, { expires: 90 });
        }catch(e){
          //$.cookieが認識できない場合、
          //jquery.cookie.jsの指定がない可能性が高いので以下をログに表示
          console.log('cookie is not available.please import library');
        }
      };

      //ページサイズをCookieから取得して表示するグリッドに反映する
      $scope.initPageSize = function(pageKeyOption){
        //undefinedの場合、処理なし
        if(!$scope.pagingOptions.pageSize) {return;}

        var defpagesize = $scope.pagingOptions.pageSize;
        try{
          var tag = "PAGESIZE"
          if(pageKeyOption != null){
            tag += "_";
            tag += pageKeyOption;
          }
          if(isFinite($.cookie(tag))){
              defpagesize = $.cookie(tag);
              $scope.pagingOptions.pageSize = defpagesize;
              //保存期限を更新するため、再設定する
              $.cookie(tag, defpagesize, { expires: 90 });
          }
        }catch(e){
          //$.cookieが認識できない場合、
          //jquery.cookie.jsの指定がない可能性が高いので以下をログに表示
          console.log('cookie is not available.please import library');
        }
      }

    });

    //一覧表示コントローラー
    app.controller('ListController', function($scope, $http, $state, $controller, values, utils, itemManager, listManager, searchManager, searchOptions, ngDialog){

      $controller('BaseController', {$scope: $scope});

      $scope.filterOptions = {
      };

      $scope.sortInfo = {
        columns    : [],
        directions : [],
        fields     : []
      };

      $scope.totalServerItems = 0;

      $scope.pagingOptions = {
        pageSizes  : [10, 25, 50, 100, 500, 1000, 2500, 5000],
        pageSize   : 25,
        currentPage: 1
      };

      $scope.setPagingData = function(data, total, page, pageSize){

        $scope.myData           = data;
        $scope.totalServerItems = total;

        if($scope.sortInfo){
          if($scope.sortInfo.columns.length > 0 &&
            $scope.sortInfo.directions.length > 0 &&
            $scope.sortInfo.fields.length > 0 ){
            $scope.gridLayoutPlugin.sortGrid($scope.sortInfo, data);
          }
        }

        if (!$scope.$$phase){
          $scope.$apply();
        }
      };

      $scope.getPagedDataAsync = function (pageSize, page, filterOptions){

        setTimeout(function(){

          var
            list_id = $scope.list_id,
            param   = { rows: pageSize, page: page, list_id: list_id };

          if (!list_id){
            list_id = 1;
          }

          if (filterOptions){
            //検索オプション
            /*
            var
              field_name   = filterOptions.fieldName,
              search_text  = filterOptions.searchText,
              search_value = filterOptions.searchValue;

            if (field_name){
              param.field_name  = field_name;

              if (search_text){
                param.search_text = search_text;
              }else if (search_value){
                param.search_value = search_value;
              }
            }*/
            param = utils.appendSearchDataToParam(param, filterOptions);
            param['type'] = $('#searchSelect').find('option[value=' + $('#searchSelect').val() + ']' ).data('type');
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
          $scope.setPageSize(values.collection_name);//ページサイズの保存
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
        }
      }, true);

      $scope.columnDefs = [];

      $scope.gridLayoutPlugin = new ngGridLayoutPlugin();

      $scope.gridOptions = {
        data              : 'myData',
        enablePaging      : true,
        showFooter        : true,
        totalServerItems  : 'totalServerItems',
        pagingOptions     : $scope.pagingOptions,
        filterOptions     : $scope.filterOptions,
        sortInfo          : $scope.sortInfo,
        columnDefs        : 'columnDefs',
        enableRowSelection: false,
        enableColumnResize: true,
        i18n              : 'ja',
        rowHeight         : 50,
        headerRowHeight   : 50,
        footerRowHeight   : 50,
        plugins: [$scope.gridLayoutPlugin]
      };

      $scope.init = function(){

        var param = {'collection_name': values.collection_name };

        $scope.initPageSize(values.collection_name);//ページサイズの初期化

        listManager.setupListSelect($scope);

        searchManager.setupSearchSelect(values.organ_item_list, values.collection_name);

        //searchManager.setupSearchSelectが完了するまで待つ
        setTimeout(function() {
          $http.post(
            '/my_item_list/php/my_item_list_read_single.php',
            param
          ).success(
            function(data){

              var columns       = [],
                  my_item_list  = null;

              if (data.has_error){
                myObject.common.showError(data.message);
                return;
              }

              my_item_list = data.value.list;

              $scope.my_item_list = my_item_list;

              searchManager.initSearchElement(itemManager, $scope);
              //values.my_item_list = my_item_list;

              /*
              $.each(my_item_list, function(index, value){

                var field_name   = value['field_name'],
                    display_name = value['display_name'],
                    list_div     = value['list_div'];

                if (list_div != 1){
                  return;
                }

                //グリッドカラム設定の作成
                columns.push({field: field_name, displayName: display_name, width: 100});
              });
              */
              columns = itemManager.createColumnDefinisions(my_item_list, {isMainList: true});

              $scope.buttons = '<div class="common-buttons">'
                             +   '<button tooltip data-original-title="詳細" id="detailButton" type="button" class="common-detail-icon-button" ng-click="detail(row)">&nbsp;</button>&nbsp;'
                             +   '<button tooltip data-original-title="編集" id="editButton"   type="button" class="common-edit-icon-button"   ng-click="edit(row)">&nbsp;</button>&nbsp;'
                             +   '<button tooltip data-original-title="削除" id="deleteButton" type="button" class="common-delete-icon-button" ng-click="delete(row)">&nbsp;</button>'
                             + '</div>';

              columns.unshift({displayName:'操作', cellTemplate: $scope.buttons, width: 140});

              $scope.columnDefs = columns;

              if (searchOptions.reloadOption == true){
                setTimeout(function() {
                  $scope.pagingOptions.pageSize = searchOptions.pagingOptions.pageSize;
                  $scope.pagingOptions.currentPage = searchOptions.pagingOptions.currentPage;
                  $scope.filterOptions.fieldName   = searchOptions.filterOptions.fieldName,
                  $scope.filterOptions.searchText  = searchOptions.filterOptions.searchText,
                  $scope.filterOptions.searchValue = searchOptions.filterOptions.searchValue;
                  $scope.sortInfo                  = searchOptions.sortInfo;
                  if ($scope.filterOptions.fieldName){
                    $("#searchSelect").val(($scope.filterOptions.fieldName));
                    if ($scope.filterOptions.searchText){
                      $("#searchText").val(($scope.filterOptions.searchText));
                    }else if ($scope.filterOptions.searchValue){
                      $("#searchValueSelect").val(($scope.filterOptions.searchValue));
                    }
                  }
                  $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
                  setTimeout(function() {
                    $('#gridContainer').removeAttr('style');
                    searchOptions.reloadOption = false;
                    $scope.gridLayoutPlugin.setGridScrollTop(searchOptions.scrollTop);
                  }, 1800);
                }, 1800);
              }

              $scope.bulk_delete_div = myObject.common.selected_organ.bulk_delete_div;
            }
          );

        }, 500);

      };

      //リストセレクタの監視
      $scope.$watch('list_id', function(newVal, oldVal){
        if (newVal !== oldVal){
          values.list_id = newVal;

          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
          if (searchOptions.reloadOption == true){
            $('#gridContainer').attr('style', 'visibility:hidden;');
          }
        }
      }, true);

      //編集
      $scope.edit = function(row){

        var _id = row.entity._id.$id;

        $state.go('update', {id: _id});

        $scope.sortInfo             = $scope.gridOptions.ngGrid.config.sortInfo;
        searchOptions.sortInfo      = $scope.sortInfo;
        searchOptions.scrollTop     = $scope.gridLayoutPlugin.getGridScrollTop();

        searchOptions.pagingOptions = $scope.pagingOptions;
        searchOptions.filterOptions = $scope.filterOptions;
        searchOptions.reloadOption  = true;

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

        var _id = row.entity._id.$id;

        $state.go('detail', {id: _id});

        $scope.sortInfo             = $scope.gridOptions.ngGrid.config.sortInfo;
        searchOptions.sortInfo      = $scope.sortInfo;
        searchOptions.scrollTop     = $scope.gridLayoutPlugin.getGridScrollTop();

        searchOptions.pagingOptions = $scope.pagingOptions;
        searchOptions.filterOptions = $scope.filterOptions;
        searchOptions.reloadOption  = true;
      };

      //リスト編集
      $scope.editList = function(){

        listManager.editList($scope);
      };

      //リスト削除
      $scope.deleteList = function(){

        var
          result       = listManager.deleteList(),
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
      
      //一括削除用Dlgを表示する
      $scope.showDeleteDialog = function(){
        var result = "";
        $scope.user = {};
        $scope.dialog_title = values.title + "の一括削除";
        $.each($scope.lists, function(i, v){
          if (v['_id']['$id'] == $scope.list_id ){
            result = v['list_name'];
          }
        });
        $scope.delete_condition　= result;
        ngDialog.open({
          template: '/delete/template/bulk_delete_dialog.php',
          scope: $scope
        });

      };
      //一括削除用Dlgを閉じる
      $scope.closeDeleteDialog = function(){
        $scope.user　= undefined;
        ngDialog.close();
      };
      //一括削除
      $scope.doBulkDelete = function(){
        var password = $scope.user.txtPassword;

        if (!password||password==""){
          alert('ログインパスワードを入力してください');
          return;
        }
        $http.post(
          '/delete/php/check_password.php',
          {password: password}
        ).success(function(data){
          if (data.has_error){
            myObject.common.showError('パスワードが間違っています');
            return;
          }
          if (!confirm(values.title + 'を一括で削除してもよろしいですか？')){
            return;
          }

          $http.post(
            '/delete/php/bulk_delete.php',
            {collection_name:　values.collection_name, list_id: $scope.list_id}
          ).success(function(data){
            if (data.has_error){
              myObject.common.showError(data.message);
              return;
            }
            $scope.user　= undefined;
            ngDialog.close();
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
          });  
        });
      };

      $scope.init();

    });

    app.controller('CreateController', function($scope, $http, $state, $controller, ngDialog, values, utils, searchManager) {

      $controller('BaseController', {$scope: $scope});

      //初期化
      $scope.init = function(){

        //自分のユーザー情報をフィールドに格納する
        utils.setMyDataWhenCreate($scope, values.collection_name);
      };

      //保存
      $scope.create = function(callback){

        var
          param = {};

        $.each($scope[values.collection_name], function(i, v){
          if (v == null){
            $scope[values.collection_name][i] = '';
          }
        });

        param[values.collection_singular_name] = $scope[values.collection_name];

        $http.post(
          values.createUrl,
          param
        ).success(function(data){
          if (data.has_error){
            myObject.common.showError(data.message);
            return;
          }
          if(callback){
            callback(data.value);
          }
          $state.go('list');
        });
      };

      //検索ダイアログ
      $scope.openSearchDialog = function($event){

        searchManager.openSearchDialog($scope, $event);
      };

      //検索ダイアログ（テーブル）
      $scope.openTableSearchDialog = function($event){

        searchManager.openTableSearchDialog($scope, $event);
      };

      $scope.init();
    });

    app.controller('UpdateController', function($scope, $http, $state, $controller, $stateParams, $window, values, searchManager) {

      $controller('BaseController', {$scope: $scope});

      //初期化
      $scope.init = function(){

        var
         _id = $stateParams.id;

        $scope.currentId = _id;

        $http.post(
          values.singleReadUrl,
          {_id: _id}
        ).success(function(data){
          if (data.has_error){
            myObject.common.showError(data.message);
            return;
          }
          $scope[values.collection_name] = data.value;
        });
      };

      //更新
      $scope.update = function(callback){

        var
          param = {_id: $scope.currentId};

        $.each($scope[values.collection_name], function(i, v){
          if (v == null){
            $scope[values.collection_name][i] = '';
          }
        });

        //param[values.data_name] = $scope[values.collection_name];
        param[values.collection_singular_name] = $scope[values.collection_name];

        $http.post(
          values.updateUrl,
          param
        ).success(function(data){
          if (data.has_error){
            myObject.common.showError(data.message);
            return;
          }
          if(callback){
            callback();
          }
          //$state.go('list');

          $window.history.back();
        });

      };

      //検索ダイアログ
      $scope.openSearchDialog = function($event){

        searchManager.openSearchDialog($scope, $event);
      };

      //検索ダイアログ（テーブル）
      $scope.openTableSearchDialog = function($event){

        searchManager.openTableSearchDialog($scope, $event);
      };

      $scope.init();
    });

    app.controller('DetailController', function($scope, $http, $state, $controller, $stateParams, values, itemManager) {

      $controller('BaseController', {$scope: $scope});

      //初期化
      $scope.init = function(options){

        var
          title_field_names = options.title_field_names,
          _id               = $stateParams.id;

        $scope.currentId = _id;

        $http.post(
          values.singleReadUrl,
          {_id: _id}
        ).success(function(data){

          if (data.has_error){
            myObject.common.showError(data.message);
            return;
          }

          var
            value = data.value,
            title = '';

          if (title_field_names){
            $.each(title_field_names, function(i, v){
              var
                val = value[v];
              //title += value[v];
              if (val){
                title += val;
              }
            });

            $scope.page_title = title;

            //$scope.$parent.page_title = title;
          }else{
            $scope.page_title = '';
          }

          //if (values.my_item_list){
          if ($scope.my_item_list){
            //value                          = itemManager.convertObject(value, values.my_item_list, {is_detail: true});
            value                          = itemManager.convertObject(value, $scope.my_item_list, {is_detail: true});
            $scope[values.collection_name] = value;
            values.currentParent           = value;
          }else{
            $http.post(
              '/my_item_list/php/my_item_list_read_single.php',
              {collection_name: values.collection_name}
            ).success(
              function(data){
                if (data.has_error){
                  return;
                }
                var my_item_list = data.value.list;

                //values.my_item_list            = my_item_list;
                $scope.my_item_list            = my_item_list;
                value                          = itemManager.convertObject(value, my_item_list, {is_detail: true});
                if (typeof values.public_name_name !== 'undefined'){
                  var public_name_name = '';
                  $.each(values.name_name, function(i, v){
                    if (typeof value[v] !== 'undefined'){
                      public_name_name += value[v];
                    }
                  });
                  value[values.public_name_name] = public_name_name;
                }
                $scope[values.collection_name] = value;
                values.currentParent           = value;
              }
            );
          }

        });
      };

      //削除
      $scope.delete = function(){

        if (!confirm('このデータを削除します。よろしいですか？')){
          return;
        }

        $http.post(
          values.deleteUrl,
          {_id: $scope.currentId }
        ).success(function(data){

          if (data.has_error){
            myObject.common.showError(data.message);
            return;
          }

          $state.go('list');
          alert('削除処理が完了しました');
        });
      };

      //$scope.init();
    });

    //検索選択（コレクション）
    app.controller('SearchSelectController', function($scope, $http, $state, $controller, ngDialog, values, utils, itemManager, searchManager) {

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
            list_id = $scope.list_id,
            param   = { rows: pageSize, page: page, list_id: list_id };

          if (!list_id){
            list_id = 1;
          }

          if (filterOptions){
            //検索オプション
            /*var
              field_name  = filterOptions.fieldName,
              search_text = filterOptions.searchText;

            if (field_name && search_text){
              param.field_name  = field_name;
              param.search_text = search_text;
            }*/

            param = utils.appendSearchDataToParam(param, filterOptions);
          }

          var readUrl = '/' + $scope.singular_name + '/php/' + $scope.singular_name + '_read.php';

          $http.post(
            readUrl,
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

      $scope.init = function(){

        $scope.collection_name          = $scope.$parent.collection_name;
        $scope.field_name               = $scope.$parent.field_name;
        $scope.external_collection_name = $scope.$parent.external_collection_name;
        $scope.external_field_name      = $scope.$parent.external_field_name;
        $scope.external_name_field_name = $scope.$parent.external_name_field_name;
        $scope.singular_name            = $scope.$parent.singular_name;

        var param = {'collection_name': $scope.external_collection_name };

        $http.post(
          '/my_item_list/php/my_item_list_read_single.php',
          param
        ).success(
          function(data){

            var columns       = [],
                my_item_list  = null;

            if (data.has_error){
              myObject.common.showError(data.message);
              return;
            }

            my_item_list = data.value.list;

            $scope.my_item_list = my_item_list;

            //values.my_item_list = my_item_list;

            searchManager.setupSearchSelect(my_item_list, $scope.external_collection_name); //TODO

            /*
            $.each(my_item_list, function(index, value){

              var field_name   = value['field_name'],
                  display_name = value['display_name'],
                  list_div     = value['list_div'];

              if (list_div != 1){
                return;
              }

              //グリッドカラム設定の作成
              columns.push({field: field_name, displayName: display_name, width: 100});
            });
            */
            columns = itemManager.createColumnDefinisions(my_item_list);

            $scope.buttons = '<div class="common-buttons">'
                           //+   '<button tooltip data-original-title="選択" id="selectButton" type="button" class="common-select-icon-button" ng-click="select(row)">'
                           +   '<button id="selectButton" type="button" class="common-select-icon-button" ng-click="select(row)">'
                           +   '選択</button>&nbsp;'
                           + '</div>';

            columns.unshift({displayName:'操作', cellTemplate: $scope.buttons, width: 60});

            $scope.columnDefs = columns;

            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
          }
        );
      };

      //選択
      $scope.select = function(row){

        var
          entity    = row.entity,
          _id       = entity._id.$id,
          $parent   = $scope.$parent,
          name      = $scope.external_name_field_name,
          name_list = null;

        if (!$parent[$scope.collection_name]){
          $parent[$scope.collection_name] = {};
        }

        $parent[$scope.collection_name][$scope.field_name] = _id;

        if (name.indexOf('+') !== false){
          name_list = name.split('+');

          $parent[$scope.collection_name][$scope.collection_name + '___' + $scope.singular_name + '_name'] = '';

          $.each(name_list, function(i, v){
            if (typeof entity[v] !== 'undefined'){
              $parent[$scope.collection_name][$scope.collection_name + '___' + $scope.singular_name + '_name'] += entity[v];
            }else {
              $parent[$scope.collection_name][$scope.collection_name + '___' + $scope.singular_name + '_name'] = "";
            }
          });
        }else{
          if (typeof entity[name] !== 'undefined'){
            $parent[$scope.collection_name][$scope.collection_name + '___' + name] = entity[name];
          }else {
            $parent[$scope.collection_name][$scope.collection_name + '___' + name] = "";
          }
        }

        ngDialog.close();
      };

      $scope.init();
    });

    //検索選択（テーブル）
    app.controller('TableSearchSelectController', function($scope, $http, $state, $controller, $timeout, ngDialog, values, utils, itemManager, searchManager) {

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
            list_id = $scope.list_id,
            param   = { rows: pageSize, page: page, list_id: list_id };

          if (!list_id){
            list_id = 1;
          }

          if (filterOptions){
            //検索オプション
            /*var
              field_name  = filterOptions.fieldName,
              search_text = filterOptions.searchText;

            if (field_name && search_text){
              param.field_name  = field_name;
              param.search_text = search_text;
            }*/

            param = utils.appendSearchDataToParam(param, filterOptions);
          }

          var readUrl = '/' + $scope.singular_name + '/php/' + $scope.singular_name + '_read.php';

          $http.post(
            readUrl,
            param
          ).success(function(data){
            if (data.has_error){
              alert(data.message);
              return;
            }
            var list = null;

            if (data.list){
              list = data.list;
            }else{
              list = data.value.list;
            }

            $.each(list, function(i, v){

              v = itemManager.convertObject(v, $scope.my_item_list, {is_list: true});
            });

            $scope.setPagingData(list, data.total_count, page, pageSize);
          });
        }, 100);
      };

      $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal){
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

      $scope.init = function(){

        var
          item_list = null;

        $scope.collection_name  = $scope.$parent.collection_name;
        $scope.field_name       = $scope.$parent.field_name;
        $scope.table_name       = $scope.$parent.table_name;
        $scope.column_name      = $scope.$parent.column_name;
        $scope.name_column_name = $scope.$parent.name_column_name;
        $scope.singular_name    = $scope.$parent.singular_name;

        item_list = [
          //{display_name: 'ユーザーID',     collection_name: 'users', field_name: 'user_id',    type: 'string', display_order: 10},
          {display_name: '姓',             collection_name: 'users', field_name: 'last_name',  type: 'string', display_order: 20, width: 100},
          {display_name: '名',             collection_name: 'users', field_name: 'first_name', type: 'string', display_order: 30, width: 100},
          {display_name: 'メールアドレス', collection_name: 'users', field_name: 'email',      type: 'string', display_order: 40, width: 200}
        ];

        $scope.my_item_list = item_list;

        //searchManager.setupSearchSelect(item_list, $scope.table_name); //TODO

        columns = itemManager.createColumnDefinisions(item_list);

        $scope.buttons = '<div class="common-buttons">'
                       //+   '<button tooltip data-original-title="選択" id="selectButton" type="button" class="common-select-icon-button" ng-click="select(row)">'
                       +   '<button id="selectButton" type="button" class="common-select-icon-button" ng-click="select(row)">'
                       +   '選択</button>&nbsp;'
                       + '</div>';

        columns.unshift({displayName:'操作', cellTemplate: $scope.buttons, width: 60});

        $scope.columnDefs = columns;

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

        $timeout(function(){
          searchManager.createSearchSelect(item_list);
        }, 1000);

      };

      //選択
      $scope.select = function(row){

        var
          entity  = row.entity,
          //_id     = entity._id.$id,
          id      = entity[$scope.column_name],
          $parent = $scope.$parent,
          name_column_name = $scope.name_column_name;
          //name             = $scope.singular_name + '_name',
          name             = $scope.collection_name + '___' + $scope.field_name + '_name',
          name_list        = null,
          name_str         = '';

        if (!$parent[$scope.collection_name]){
          $parent[$scope.collection_name] = {};
        }

        $parent[$scope.collection_name][$scope.field_name] = id;


        if (name_column_name.indexOf('+') !== false){
          name_list = name_column_name.split('+');
        }else{
          name_list = [name_column_name];
        }

        $.each(name_list, function(i, v){
          name_str += entity[v];
        });

        $parent[$scope.collection_name][name] = name_str;

        ngDialog.close();
      };

      $scope.init();
    });

  }

  //詳細表示リスト
  app.controller('DetailListController', function($scope, $http, $state, $stateParams, constants, values, utils, itemManager) {

    $scope.setNumData = function(row,col){
      if(typeof row.entity[col.field] === "string"){
        var amount = row.entity[col.field].replace( /,/g, "" );
        row.entity[col.field] = Number(amount);
      }
    };

    $scope.outNumData = function(row,col){
      var amount = String(row.entity[col.field]).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      row.entity[col.field] = amount;
      if($scope.calcTotalAmount){
        $scope.calcTotalAmount();
      }
    };

    $scope.setDateData = function(row,col){
      $("#row").unbind("blur");
      var outDateData = function(){
        setTimeout(function() {
          $scope.$broadcast('ngGridEventEndCellEdit');
        }, 300);
      };
      $("#row").bind("blur",outDateData);
    };

    //ページサイズが指定された場合ページサイズをCookieに設定する
    $scope.setPageSize = function(pageKeyOption){
      var tag = "PAGESIZE"
      if(pageKeyOption != null){
        tag += "_";
        tag += pageKeyOption;
      }
      try{
        $.cookie(tag, $scope.pagingOptions.pageSize, { expires: 90 });
      }catch(e){
        console.log('cookie is not available.please import library');
      }
    };

    //ページサイズをCookieから取得して表示するグリッドに反映する
    $scope.initPageSize = function(pageKeyOption){
      var defpagesize = $scope.pagingOptions.pageSize;
      try{
        var tag = "PAGESIZE"
        if(pageKeyOption != null){
          tag += "_";
          tag += pageKeyOption;
        }
        if(isFinite($.cookie(tag))){
            defpagesize = $.cookie(tag);
            $scope.pagingOptions.pageSize = defpagesize;
            //保存期限を更新するため、再設定する
            $.cookie(tag, defpagesize, { expires: 90 });
        }
      }catch(e){
        console.log('cookie is not available.please import library');
      }
    }

    $scope.init = function(options,callback){

      var
        grid_base_name      = null,
        method_base_name    = null,
        detail_list_options = values.detail_list_options,
        edit_cell　= false,
        operation　= true,
        enablePaging = true,//ページングオプションの判定
        showError = true;//エラーメッセージ表示オプション

      if (options){
        $scope.collectionName   = options.collectionName;
        $scope.singularName     = options.singularName;
        $scope.listReadUrl      = options.listReadUrl;
        $scope.deleteUrl        = options.deleteUrl;
        $scope.releaseUrl       = options.releaseUrl;
        grid_base_name          = $scope.createGridNameBase($scope.singularName);
        $scope.gridName         = grid_base_name + 'Grid';
        method_base_name        = $scope.createMethodNameBase($scope.singularName);
        $scope.detailMethodName = 'detail' + method_base_name;
        $scope.updateMethodName = 'update' + method_base_name;
        $scope.hasDetail        = options.hasDetail;
        $scope.detailUrl        = options.detailUrl;
        $scope.afterDelete      = options.afterDelete;
        if(options.gridOption){
          edit_cell = options.gridOption.hasOwnProperty('edit_cell') ? options.gridOption.edit_cell : false;
          operation = options.gridOption.hasOwnProperty('operation') ? options.gridOption.operation : true;
          enablePaging = options.gridOption.hasOwnProperty('enablePaging') ? options.gridOption.enablePaging : true;
          showError = options.gridOption.hasOwnProperty('showError') ? options.gridOption.showError : true;
        }
      }

      if (!detail_list_options){
        detail_list_options = {};
      }

      if (!detail_list_options[$scope.singularName]){
        detail_list_options[$scope.singularName] = {mode: 'create'};
      }

      $scope.columnDefs = [];

      $scope.filterOptions = {
        filterText       : '',
        useExternalFilter: true
      };

      $scope.totalServerItems = 0;

      $scope.pagingOptions = {
        pageSizes  : [5, 10, 25, 50],
        pageSize   : 5,
        currentPage: 1
      };

      $scope.initPageSize(values.collection_name+"_"+$scope.gridName);//ページサイズの初期化

      $scope[$scope.gridName] = {
        data            : 'myData',
        enablePaging    : enablePaging,
        showFooter      : true,
        totalServerItems: 'totalServerItems',
        pagingOptions   : $scope.pagingOptions,
        filterOptions   : $scope.filterOptions,
        columnDefs      : 'columnDefs',
        enableRowSelection: false,
        enableColumnResize: true,
        i18n              : 'ja',
        rowHeight         : 50,
        headerRowHeight   : 50,
        footerRowHeight   : 50
      };

      var
        param = {'collection_name': $scope.collectionName};

      $http.post(
        '/my_item_list/php/my_item_list_read_single.php',
        param
      ).success(
        function(data){

          if (data.has_error){
            if(showError){
              myObject.common.showError(data.message);
            }
            return;
          }

          var columns = [],
              organ_item_list = data.value.list,
              buttons_obj     = null;

          $scope.organ_item_list = organ_item_list;

          columns = itemManager.createColumnDefinisions(organ_item_list,{edit_cell:edit_cell});

          $scope.buttons = '<div class="common-buttons">';

          if ($scope.hasDetail === true){
            $scope.buttons += '<button tooltip data-original-title="詳細" id="detailButton" type="button" class="common-detail-icon-button" ng-click="detail(row)">'
                           +  '&nbsp;</button>&nbsp;';
          }

          if (detail_list_options[$scope.singularName].mode == 'create'){
            $scope.buttons += '<button tooltip data-original-title="編集" id="editButton"   type="button" class="common-edit-icon-button"   ng-click="edit(row)">&nbsp;</button>&nbsp;'
                           +  '<button tooltip data-original-title="削除" id="deleteButton" type="button" class="common-delete-icon-button" ng-click="delete(row)">&nbsp;</button>';
          }else if (detail_list_options[$scope.singularName].mode == 'select'){
            $scope.buttons += '<button tooltip data-original-title="解除" id="releaseButton" type="button" class="common-release-icon-button" ng-click="release(row)">&nbsp;</button>&nbsp;';
          }else if (detail_list_options[$scope.singularName].mode == 'delete'){
            $scope.buttons += '<button tooltip data-original-title="削除" id="deleteButton" type="button" class="common-delete-icon-button" ng-click="delete(row)">&nbsp;</button>';
          }

          $scope.buttons += '</div>';

          buttons_obj = {displayName:'操作', cellTemplate: $scope.buttons, width: 100};

          if ($scope.hasDetail === true){
            if (detail_list_options[$scope.singularName].mode == 'create'){
              buttons_obj.width = 140;
            }else{
              buttons_obj.width = 100;
            }
          }
          if(operation){
            columns.unshift(buttons_obj);
          }
          $scope.columnDefs = columns;

          var
            _id = $stateParams.id;

          $scope.currentId = _id;

          $scope.parent    = values.currentParent;

          $scope.getPagedDataAsync(enablePaging === true ? $scope.pagingOptions.pageSize : null, $scope.pagingOptions.currentPage);

          if(callback){
            callback();
          }
        }
      );
    };

    $scope.createGridNameBase = function(singular_name){

      var
        ss     = null,
        result = '';

      if (singular_name.indexOf('_') === false){
        return singular_name;
      }else{
        ss = singular_name.split('_');
      }

      $.each(ss, function(i, v){

        if (i == 0){
          result += v;
        }else{
          result += v.substring(0, 1).toUpperCase() + v.substring(1);
        }
      });

      return result;
    };

    $scope.createMethodNameBase = function(singular_name){

      return utils.createMethodNameBase(singular_name);
/*
      var
        ss     = null,
        result = '';

      if (singular_name.indexOf('_') >= 0){
        ss = singular_name.split('_');
      }else{
        ss = [singular_name];
      }

      $.each(ss, function(i, v){
        result += v.substring(0, 1).toUpperCase() + v.substring(1);
      })

      return result;*/
    };

    $scope.setPagingData = function(data, total, page, pageSize){

      $scope.myData           = data;
      $scope.totalServerItems = total;

      if (!$scope.$$phase){
        $scope.$apply();
      }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText){

      var
        param = {
          rows: pageSize,
          page: page,
          id_name : values.id_name,
          id_value: $scope.currentId,
          relation: constants.RELATION_ONE_TO_MANY
        },
        relation = utils.getRelation({main: values.collection_name, detail: $scope.collectionName});

      if ((values.collection_name == "prospects" && $scope.collectionName =="activity_histories") ||
          (values.collection_name == "business_discussions" && $scope.collectionName =="opportunity_merchandises")
        ) {
        param.id_name  = $scope.collectionName + '___' + values.id_name;
      }
      if($scope.business_discussions && values.id_name !="business_discussion_id"){
        param.id_value = $stateParams.detail_list_data_id;
        $scope.detail_list_data_id = $stateParams.detail_list_data_id;
      }
      if (relation == constants.RELATION_MANY_TO_MANY){
        //コレクション間の関係が多対多の場合
        param.id_name  = $scope.collectionName + '___' + values.id_name + 's';
        param.relation = constants.RELATION_MANY_TO_MANY;
      }

      $http.post(
        $scope.listReadUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        var list = data.list;

        $.each(list, function(i, v){
          v = itemManager.convertObject(v, $scope.organ_item_list, {is_list: true});
        });

        $scope.setPagingData(list, data.total_count, page, pageSize);
      });
    };

    $scope.$watch('pagingOptions', function (newVal, oldVal) {

      if (newVal !== oldVal){
        $scope.setPageSize(values.collection_name+"_"+$scope.gridName);//ページサイズの保存
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    //詳細
    $scope.detail = function(row){

      var
        _id = row.entity._id.$id,
        url = null;

      url = $scope.detailUrl + '/' + _id;
      window.open(url, '_blank');
    };

    //編集
    $scope.edit = function(row){

      var _id = row.entity._id.$id;

      $state.go('detail.' + $scope.updateMethodName, {detail_list_data_id: _id});
    };

    //削除
    $scope.delete = function(row){

      if (!confirm('データを削除します。よろしいですか？')){
        return;
      }

      var
        _id   = row.entity._id.$id,
        param = {};

      param._id = _id;

      $http.post(
        $scope.deleteUrl,
        param
      ).success(function(data){
        if (data.has_error){
          //myObject.common.showError(data.message);
          alert(data.message);
          return;
        }

        alert('データの削除が完了しました');

        $scope.getPagedDataAsync();

        if ($scope.afterDelete){
          $scope.afterDelete();
        }
      });

    };

    //選択解除
    $scope.release = function(row){

      if (!confirm('データの選択を解除します。よろしいですか？')){
        return;
      }

      var
        _id   = row.entity._id.$id,
        param = {},
        id_name = values.id_name + 's';

      param._id      = _id;

      param[$scope.singularName] = {};

      param[$scope.singularName][id_name] = $scope.currentId;

      $http.post(
        $scope.releaseUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }

        var
          singular_name = values.collection_singular_name,
          release_url   = '/' + singular_name + '/php/' + singular_name + '_release.php',
          param         = {},
          id_name       = $scope.singularName + '_ids';

        param._id = $scope.currentId;

        param[singular_name] = {};

        param[singular_name][id_name] = _id;

        //編集元のデータも修正する
        $http.post(
          release_url,
          param
        ).success(function(data){
          if (data.has_error){
            alert(data.message);
            return;
          }

          alert('選択の解除が完了しました');
          $scope.getPagedDataAsync();
        });

     });

    };

  });

  app.controller('DetailListCreateController', function($scope, $http, $state, $stateParams, constants, values, utils, searchManager) {

    //初期化
    $scope.init = function(options){

      var
        _id      = $stateParams.id,
        relation = null;

      $scope.currentId = _id;

      $scope.parent    = values.currentParent;

      if (options){
        $scope.collectionName = options.collectionName;
        $scope.singularName   = options.singularName;
        $scope.createUrl      = options.createUrl;
      }else{
        console.log('オプションがありません');
        return;
      }

      $scope.relation = utils.getRelation({main: values.collection_name, detail: $scope.collectionName});

      if ($scope.parent){

        if ($scope.relation == constants.RELATION_ONE_TO_MANY && $scope.parent['_id']){
          //１対多の場合
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          //ID
          $scope[$scope.collectionName][values.id_name] = $scope.parent['_id']['$id'];

          //名称
          $.each(values.name_name, function(i, v){
            $scope[$scope.collectionName][$scope.collectionName + '___' + v] = $scope.parent[v];
          });

          if (typeof values.public_name_name !== 'undefined'){
            $scope[$scope.collectionName][$scope.collectionName + '___' + values.public_name_name] = $scope.parent[values.public_name_name];
          }
        }else if ($scope.relation == constants.RELATION_MANY_TO_MANY){
          //多対多の場合
        }

        //会社ID
        if ($scope.parent['company_id'] && $scope.parent[values.collection_name + '___company_name']){
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          $scope[$scope.collectionName]['company_id']   = $scope.parent['company_id'];
          $scope[$scope.collectionName][$scope.collectionName + '___company_name'] = $scope.parent[values.collection_name + '___company_name'];
        }

        //商談ID
        if ($scope.parent['business_discussion_id'] && $scope.parent[values.collection_name + '___business_discussion_name']){
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          $scope[$scope.collectionName]['business_discussion_id']   = $scope.parent['business_discussion_id'];
          $scope[$scope.collectionName][$scope.collectionName + '___business_discussion_name'] = $scope.parent[values.collection_name + '___business_discussion_name'];
        }

      }

      //自分のユーザー情報をフィールドに格納する
      utils.setMyDataWhenCreate($scope, $scope.collectionName);
    };

    //保存
    $scope.create = function(callback){

      var
        detail_list_data = $scope[$scope.collectionName];
        param            = {},
        id_name          = $scope.collectionName + '___' + values.id_name;

      if ($scope.relation == constants.RELATION_MANY_TO_MANY){
        id_name                   = $scope.collectionName + '___' + values.id_name + 's';
        detail_list_data[id_name] = [$scope.currentId];
      }else{
        if (!detail_list_data[id_name]){
          //親IDが無い場合は上書きする
          detail_list_data[id_name] = $scope.currentId;
        }
      }

      param[$scope.singularName] = detail_list_data;

      $http.post(
        $scope.createUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }
        if(callback){
          callback(data.value);
        }
        if ($scope.relation == constants.RELATION_MANY_TO_MANY){
          //リレーションが多対多の場合、相互にキーを持つ
          var
            object_id     = data.value,
            singular_name = values.collection_singular_name,
            update_url    = '/' + singular_name + '/php/' + singular_name + '_update.php',
            param         = {_id: $scope.currentId, relation: constants.RELATION_MANY_TO_MANY},
            ids_name      = values.collection_name + '___' + $scope.singularName + '_ids';

          param[singular_name] = {};

          param[singular_name][ids_name] = [object_id];

          $http.post(
            update_url,
            param
          ).success(function(data){
            if (data.has_error){
              alert(data.message);
              return;
            }

          });
        }

        $state.go('detail', {id: $scope.currentId});
      });
    };

    //検索ダイアログ
    $scope.openSearchDialog = function($event){

      searchManager.openSearchDialog($scope, $event);
    };

    //検索ダイアログ（テーブル）
    $scope.openTableSearchDialog = function($event){

      searchManager.openTableSearchDialog($scope, $event);
    };

  });

  app.controller('DetailListUpdateController', function($scope, $http, $state, $stateParams, values, searchManager) {

    $scope.init = function(options){

      var _id          = $stateParams.id;

      $scope.currentId = _id;

      $scope.detailListDataId = $stateParams.detail_list_data_id;

      if (options){
        $scope.collectionName = options.collectionName;
        $scope.singularName   = options.singularName;
        $scope.singleReadUrl  = options.singleReadUrl;
        $scope.updateUrl      = options.updateUrl;
      }

      $http.post(
        $scope.singleReadUrl,
        {_id: $scope.detailListDataId }
      ).success(function(data){
        if (data.has_error){
          //myObject.showError(data.message);
          alert(data.message);
          return;
        }
        $scope[$scope.collectionName] = data.value;
      });

    };

    //保存
    $scope.update = function(callback){

      var
        detail_list_data = $scope[$scope.collectionName],
        param            = {};

      param = {_id: $scope.detailListDataId};

      param[$scope.singularName] = detail_list_data;

      $http.post(
        $scope.updateUrl,
        param
      ).success(function(data){
        if (data.has_error){
          //myObject.common.showError(data.message);
          alert(data.message);
          return;
        }
        if(callback){
          callback();
        }
        $state.go('detail', {id: $scope.currentId});
      });
    };

    //検索ダイアログ
    $scope.openSearchDialog = function($event){

      searchManager.openSearchDialog($scope, $event);
    };

    //検索ダイアログ（テーブル）
    $scope.openTableSearchDialog = function($event){

      searchManager.openTableSearchDialog($scope, $event);
    };

  });

  app.controller('DetailListSelectController', function($scope, $http, $state, $stateParams, $window, constants, values, utils, searchManager, itemManager) {

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
          list_id = $scope.list_id,
          param   = { rows: pageSize, page: page, list_id: list_id };

        if (!list_id){
          list_id = 1;
        }

        if (filterOptions){
          //検索オプション
          param = utils.appendSearchDataToParam(param, filterOptions);
        }

        var readUrl = null;

        /*if ($scope.mode == 'create'){
          readUrl = '/' + $scope.create_singular_name + '/php/' + $scope.create_singular_name + '_read.php';
        }else{*/
        readUrl = '/' + $scope.external_singular_name + '/php/' + $scope.external_singular_name + '_read.php';
        //}
//console.log('readUrl => ' + readUrl);
        $http.post(
          readUrl,
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
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
      }
    }, true);

    $scope.columnDefs = [];

    var gridLayoutPlugin = new ngGridLayoutPlugin();

    $scope.init = function(options){

      var
        _id      = $stateParams.id,
        relation = null;

      $scope.collection_name          = values.collection_name;
      $scope.singular_name            = values.collection_singular_name;
      $scope.external_collection_name = options.collectionName;
      $scope.external_singular_name   = options.singularName;
      $scope.grid_name                = options.gridName;
      $scope.mode                     = options.mode;

      if (!$scope.mode){
        $scope.mode = 'update';
      }

      if ($scope.mode == 'create'){
        $scope.create_url             = options.createUrl;
        $scope.create_collection_name = options.createCollectionName;
        $scope.create_singular_name   = options.createSingularName;
      }

      $scope.currentId = _id;

      $scope[$scope.grid_name] = {
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
        plugins: [gridLayoutPlugin],
      };

      var
        param = {'collection_name': $scope.external_collection_name };

      $http.post(
        '/my_item_list/php/my_item_list_read_single.php',
        param
      ).success(
        function(data){

          var
            columns      = [],
            my_item_list = null,
            checkbox_id  = "{{row.entity._id[\'$id\']}}";

          if (data.has_error){
            myObject.common.showError(data.message);
            return;
          }

          my_item_list = data.value.list;

          $scope.my_item_list = my_item_list;

          //values.my_item_list = my_item_list;

          searchManager.setupSearchSelect(my_item_list, $scope.external_collection_name); //TODO

          columns = itemManager.createColumnDefinisions(my_item_list);

          $scope.buttons = '<div class="common-buttons">'
                         //+   '<label class="checkbox">'
                         +   '<div class="common-checkbox">'
                         +     '<input type="checkbox" name="selectCheck" id="' + checkbox_id + '" '
                         +       'ng-value="row.entity._id[\'$id\']" ng-checked="inSelectList(row.entity._id[\'$id\'])" />'
                         +     '<label for="' + checkbox_id + '"></label>'
                         //+     '<i></i>'
                         //+   '</label>'
                         +   '</div>'
                         + '</div>';

          columns.unshift({displayName:'選択', cellTemplate: $scope.buttons, width: 60});

          $scope.columnDefs = columns;

          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);

          $scope.select_list = [];

          //イベントのひもづけ
          $(document).on('click', 'input[name=selectCheck]', function(){
            var
              $this   = $(this),
              _id     = $this.val(),
              checked = $this.prop('checked');

            if (checked){
              $scope.addSelectList(_id);
            }else{
              $scope.removeSelectList(_id);
            }
          });
        }
      );
    };

    $scope.inSelectList = function(_id){

      var
        select_list = $scope.select_list;

      if (!_id){
        return false;
      }else if (!select_list){
        return false;
      }

      return utils.inArray(_id, select_list);
    };

    $scope.addSelectList = function(_id){

      if (!$scope.select_list){
        $scope.select_list = [];
      }

      var
        ret = utils.inArray(_id, $scope.select_list);

      if (!ret){
        $scope.select_list.push(_id);
      }

    };

    $scope.removeSelectList = function(_id){

      var
        ret = utils.inArray(_id, $scope.select_list);

      if (ret){
        $.each($scope.select_list, function(i, v){
          if (_id == v){
            $scope.select_list.splice(i, 1);
            return;
          }
        });
      }

    };

    //確認
    //mode=createの場合
    $scope.check = function(){

      var
        select_list = $scope.select_list,
        ids         = [],
        state_name  = 'detail.check' + utils.createMethodNameBase($scope.external_singular_name);
        //check_url   = '/' + $scope.create_singular_name + '/php/' + $scope.create_singular_name + '_list_check.php',

      if (!select_list || select_list.length == 0){
        console.log('選択されたデータがありません');
        return;
      }

      $.each(select_list, function(i, v){
        ids.push(v);
      });

      $state.go(state_name, {ids: ids});
    };

    //保存
    //mode=updateの場合
    $scope.save = function(){

      var
        select_list     = $scope.select_list,
        list_update_url = '/' + $scope.external_singular_name + '/php/' + $scope.external_singular_name + '_list_update.php',
        param           = {};

      if (!select_list || select_list.length == 0){
        console.log('選択されたデータがありません');
        return;
      }

      param.ids_name       = $scope.external_collection_name + '___' + $scope.singular_name + '_ids';
      param.ids_value      = $scope.currentId;
      param.update_id_list = select_list;

      $http.post(
        list_update_url,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }

        //完了後、修正元のデータにIDを反映させる。
        var
          update_url = '/' + $scope.singular_name + '/php/' + $scope.singular_name + '_update.php',
          param      = {},
          ids        = select_list,
          object     = {},
          ids_name   = $scope.collection_name + '___' + $scope.external_singular_name + '_ids',
          relation   = utils.getRelation({main: $scope.collection_name, detail: $scope.external_collection_name});

        object[ids_name] = ids;

        param['_id']                = $scope.currentId;
        param[$scope.singular_name] = object;
        param['relation']           = relation;

        $http.post(
          update_url,
          param
        ).success(function(data){
          if (data.has_error){
            alert(data.message);
            return;
          }


        });


      });

      $window.history.back();
    };

    //選択
    $scope.select = function(){

      var
        detail_list_data = $scope[$scope.collectionName];
        param            = {},
        id_name          = values.id_name;

      if ($scope.relation == constants.RELATION_MANY_TO_MANY){
        id_name                   = id_name + 's';
        detail_list_data[id_name] = [$scope.currentId];
      }else{
        if (!detail_list_data[id_name]){
          //親IDが無い場合は上書きする
          detail_list_data[id_name] = $scope.currentId;
        }
      }

      param[$scope.singularName] = detail_list_data;

      $http.post(
        $scope.updateUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }

        if ($scope.relation == constants.RELATION_MANY_TO_MANY){
          //リレーションが多対多の場合、相互にキーを持つ
          var
            object_id     = data.value,
            singular_name = values.collection_singular_name,
            update_url    = '/' + singular_name + '/php/' + singular_name + '_update.php',
            param         = {_id: $scope.currentId, relation: constants.RELATION_MANY_TO_MANY},
            ids_name      = $scope.singularName + '_ids';

          param[singular_name] = {};

          param[singular_name][ids_name] = [object_id];

          $http.post(
            update_url,
            param
          ).success(function(data){
            if (data.has_error){
              alert(data.message);
              return;
            }

          });
        }

        $state.go('detail', {id: $scope.currentId});
      });
    };

    //検索ダイアログ
    /*$scope.openSearchDialog = function($event){

      searchManager.openSearchDialog($scope, $event);
    };

    //検索ダイアログ（テーブル）
    $scope.openTableSearchDialog = function($event){

      searchManager.openTableSearchDialog($scope, $event);
    };*/

  });

  app.controller('MblSideMenuController', function($scope, $ionicModal, $timeout) {
    $scope.organ_id = 0;

    $scope.init = function() {
      var organ_select = $('#organSelect');

      //組織選択
      if($(organ_select).size() > 0){
        //valueが0の場合は組織作成フォーム起動
        //組織作成フォームからトライアル状態の組織作成phpへ通信
        $.post(
          '/organ/php/organ_read.php',
          function(data){
            if (data.has_error){
              $scope.showAlert({is_error: true, message: data.message, auto_remove: false, show_close_button: true});
              return;
            }
            $.each(data.value.list, function(i, v){
              /*if (data.value.organ_id == v['organ_id']){
                $('#organDefault').html(v['organ_name']);
              }*/
              //$('<li><a href="javascript:void(0);" data-organ-id="' + v['organ_id'] + '">' + v['organ_name'] + '</a></li>').appendTo($(organ_select));
              $('<option value="' + v['organ_id'] + '">' + v['organ_name'] + '</option>').appendTo($(organ_select));
            });
            $('<option value="' + '0' + '">' + '新しい組織を作成する' + '</option>').appendTo($(organ_select));
            $(organ_select).val(data.value.organ_id);
            $scope.organ_id = data.value.organ_id;
          }
        );
      }

      //組織選択
      $(document).on('change', '#organSelect', function(){

        var organ_id = $(this).val();

        if (organ_id == 0){
          $scope.showOrganDialog();
        } else {
          $scope.loadOrgan(organ_id);
          $scope.organ_id = organ_id;
        }

      });

      setTimeout(function() {
        $('#question_slider').remove();
      }, 1000);


    }

    $scope.loadOrgan = function(organ_id){
      $.post(
        '/organ/php/organ_change.php',
        {organ_id: organ_id},
        function(data){
          if (data.has_error){
            $scope.showAlert({is_error: true, message: data.message, show_close_button: true});
            return;
          }
          location.href = '/mobile/source/mbl_recent_view/mbl_recent_view.php';
        }
      );
    }

    $scope.showOrganDialog = function(){
      var
        organ_dialog     = $('#organ_dialog'),
        organ_dialog_str = '';

      if ($(organ_dialog).size() > 0){
        $(organ_dialog).remove();
      }

      organ_dialog_str = '<div id="organ_dialog" class="common-view">' +
  /*                         '<div class="row">' +
                             '<div class="col-md-12">' +
                               '<div class="row">' +
                                 '<div class="title">' +
                                   '<span>新しい組織を作成する</span>' +
                                 '</div>' +
                               '</div>' +
                             '</div>' +
                           '</div>' +*/
                           '<div class="row">' +
                             '<div class="col-md-12" style="margin-bottom: 15px;">' +
                               '<a id="createOrganBackBtn" class="back_button">戻る</a>' +
                               '<a id="createOrganSaveBtn" class="save_button" style="margin-left: 3px; color: white;">保存</a>' +
                             '</div>' +
                           '</div>' +
                           '<div class="row">' +
                             '<div class="col-md-12">' +
                               '<!--組織名称-->' +
                               '<div style="margin-bottom: 15px;">' +
                                 '<span>組織名称</span>&nbsp;' +
                                 '<input id="organNameText" type="text" class="common-text" />' +
                               '</div>' +
                             '</div>' +
                           '</div>' +
                         '</div>';

      organ_dialog = $(organ_dialog_str);

      $(organ_dialog).appendTo($('body'));

      $('#organ_dialog').dialog({
        title: '新しい組織を作成する',
        width: 900,
        modal: true,
        open:function(event, ui){ $(".ui-dialog-titlebar-close").hide();}
      });

    };


    //アラート表示
    $scope.showAlert = function(param){
      var messagePane   = $('#messagePane'),
          alert_tag     = null,
          alert_tag_str = null,
          class_name    = null,
          time          = null,
          is_error      = null,
          message       = null,
          auto_remove   = null,
          show_close_button = null;

      is_error    = param.is_error;
      message     = param.message;
      auto_remove = param.auto_remove;
      show_close_button = param.show_close_button;

      if (is_error !== true && is_error !== false){
        return;
      }
      if (!message){
        return;
      }

      if (is_error === true){
        class_name = 'alert alert-danger alert-dismissable fade in';
        time       = 5000;
      }else{
        class_name = 'alert alert-success alert-dismissable fade in';
        time       = 3000;
      }

      alert_tag_str = '<div class="' + class_name + '" style="position: fixed; top: 0px; left: 0px; width: 100%; z-index: 99999;">';
      if (show_close_button === true){
        alert_tag_str += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
      }
      alert_tag_str +=  message + '</div>';

      alert_tag = $(alert_tag_str);

      //messagePane.empty();

      //alert_tag.appendTo(messagePane);

      alert_tag.appendTo('body');

      if (auto_remove){
        $(".alert").delay(time).fadeOut('slow',
          function() {
            $(this).remove();
          }
        );
      }
    };

    $scope.init();

});

  app.controller('MblListController', function($scope, $http, $state, $controller, $compile, values, itemManager, listManager, searchManager, searchOptions, utils) {

    $scope.filterOptions = {
    };

    $scope.pagingOptions = {
      pageSize   : 10,
      currentPage: 1
    };

    $scope.init = function(){

      listManager.setupListSelect($scope);

      $(document).on('change', '#listSelect', function(){
        $scope.list_id = $('#listSelect').val();
      });

      var
        param          = {'collection_name': values.collection_name };

      searchManager.setupSearchSelect(values.organ_item_list, values.collection_name);

      //searchManager.setupSearchSelectが完了するまで待つ
      setTimeout(function() {
        $http.post(
          '/my_item_list/php/my_item_list_read_single.php',
          param
        ).success(
          function(data){

            var my_item_list  = null;

            if (data.has_error){
              myObject.common.showError(data.message);
              return;
            }

            my_item_list = data.value.list;

            $scope.my_item_list = my_item_list;

            searchManager.initSearchElement(itemManager, $scope);

          }
        );
      }, 500);

    }

    $scope.dataList = [];
    $scope.preFilterOptions = {};
    $scope.getPagedDataAsync = function (pageSize, page, filterOptions){

      setTimeout(function(){

        var
          list_id = $scope.list_id,
          param = { rows: pageSize, page: page, list_id: list_id};

        if (!list_id){
          list_id = 1;
        }

        if (filterOptions){
          param = utils.appendSearchDataToParam(param, filterOptions);
          param['type'] = $('#searchSelect').find('option[value=' + $('#searchSelect').val() + ']' ).data('type');
          if ($scope.preFilterOptions !== filterOptions){
            $scope.dataList = [];
            $scope.$broadcast('scroll.refreshComplete');
            $scope.pagingOptions.currentPage = 1;
            param['page'] = $scope.pagingOptions.currentPage;
          }
          $scope.preFilterOptions = filterOptions;

        }

        $http.post(
          values.listReadUrl,
          param
        ).success(function(data){
          if (data.has_error){
            alert(data.message);
            return;
          }
          $scope.list = data.list;

          $.each($scope.list, function(i, v){
            $scope.dataList.push(v);
          });
          $scope.pagingOptions.currentPage = $scope.pagingOptions.currentPage + 1;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });

      }, 100);
    }

    $scope.moreLoad =function(){
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
    }

    //リストセレクタの監視
    $scope.$watch('list_id', function(newVal, oldVal){
      if (newVal !== oldVal){
  //      $scope.list_id = newVal;
        $scope.dataList = [];
        $scope.$broadcast('scroll.refreshComplete');
        $scope.pagingOptions.currentPage = 1;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions);
      }
    }, true);


    $scope.detail = function($event){

      var
        _id = '',
        target = $event.target;

      if (typeof target.attributes._id !== 'undefined'){
        _id = target.attributes._id.value;
      } else {
        _id = target.parentNode.parentNode.parentNode.attributes._id.value;
      }

      $state.go(values.collection_singular_name + '.detail', {id: _id});

    }

    $scope.moveCreate = function(){

      $state.go(values.collection_singular_name + '.create');

    }

    $scope.init();

  });

  app.controller('MblDetailController', function($scope, $http, $state, $stateParams, $controller, $rootScope, $compile, $ionicScrollDelegate, values, itemManager, listManager) {

    $scope.init = function(){
      var _id = $stateParams.id;

      $scope.currentId = _id;

      if (!$scope.$$phase){
        $scope.$apply();
      }
      $scope.show_tab = true;
      $scope.show_footer_bar = false;
      $scope.positionCurrent = 0;

      $http.post(
        values.singleReadUrl,
        {_id: _id}
      ).success(function(data){

        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }

        var
          value = data.value,
          title = '';

        if ($scope.my_item_list){
          value                          = itemManager.convertObject(value, $scope.my_item_list, {is_detail: true});
          $scope[values.collection_name] = value;
          values.currentParent           = value;
        }else{
          $http.post(
            '/my_item_list/php/my_item_list_read_single.php',
            {collection_name: values.collection_name}
          ).success(
            function(data){
              if (data.has_error){
                return;
              }
              var my_item_list = data.value.list;

              $scope.my_item_list            = my_item_list;
              value                          = itemManager.convertObject(value, my_item_list, {is_detail: true});
              $scope[values.collection_name] = value;
              values.currentParent           = value;
            }
          );
        }

      });

    }


    $scope.show_detail = true;
    $scope.show_option_data = false;
    $scope.show_business_discussion_list = false;
    $scope.show_opportunity_merchandise_list  = false;
    $scope.show_customer_list = false;
    $scope.show_activity_history_list = false;


    $scope.tabClickAction = function($event){
      var parent    = $($event.target).parent(),
          tabs   = $(parent).find('a'),
          active_tab = '';

      $.each(tabs, function(i, v){
        if ($(v).hasClass('active')) {
          $(v).removeClass('active');
        } else {
          $(v).addClass('active');
          active_tab = $(v)[0].name;
        }
      });

      if (active_tab == 'detail_tab'){
        $scope.show_detail = true;
        $scope.showOptionData('')
      } else {
        $scope.show_detail = false;
        $scope.show_option_data = true;
      }

    }

    $scope.showOptionData = function(target){
      $scope.show_option_data = false;
      $scope.show_opportunity_merchandise_list = (target == 'opportunity_merchandise');
      $scope.show_customer_list = (target == 'customer');
      $scope.show_business_discussion_list = (target == 'business_discussion');
      $scope.show_activity_history_list = (target == 'activity_history');
    }

    $scope.optionCustomerClickAction = function(){
      $scope.show_option_target = 'customer';
      $scope.showOptionData('customer');
    }

    $scope.optionBusinessDiscussionClickAction = function(){
      $scope.show_option_target = 'business_discussion';
      $scope.showOptionData('business_discussion');
    }

    $scope.optionOpportunityMerchandiseClickAction = function(){
      $scope.show_option_target = 'opportunity_merchandise';
      $scope.showOptionData('opportunity_merchandise');
    }

    $scope.optionActivityHistoryClickAction = function(){
      $scope.show_option_target = 'activity_history';
      $scope.showOptionData('activity_history');
    }

    $scope.countPositionY = function(){
      $scope.positionCurrent = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
    }

    $scope.activity_history_scope = null;
    $scope.business_discussion_scope = null;
    $scope.customer_scope = null;
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name == values.collection_singular_name + '.detail'){
        if (fromState.name === values.collection_singular_name + '.list' ){
          if ($('#mblActivityHistories').length > 0){
            $scope.$activity_history_html = $('#mblActivityHistories').html();
          }
          if ($('#mblBusinessDiscussions').length > 0){
            $scope.$business_discussion_html = $('#mblBusinessDiscussions').html();
          }
          if ($('#mblCustomers').length > 0){
            $scope.$customer_html = $('#mblCustomers').html();
          }
        }else {
          if (typeof $rootScope.activity_history_scope !== 'undefined' && typeof $scope.$activity_history_html !== 'undefined'){
            $('#mblActivityHistories').html($scope.$activity_history_html);
            $compile($('#mblActivityHistories'))($scope);
            $rootScope.activity_history_scope.getPagedDataAsync(10,1);
          }
          if (typeof $rootScope.business_discussion_scope !== 'undefined' && typeof $scope.$business_discussion_html !== 'undefined'){
            $('#mblBusinessDiscussions').html($scope.$business_discussion_html);
            $compile($('#mblBusinessDiscussions'))($scope);
            $rootScope.business_discussion_scope.getPagedDataAsync(10,1);
          }
          if (typeof $rootScope.customer_scope !== 'undefined' && typeof $scope.$customer_html !== 'undefined'){
            $('#mblCustomers').html($scope.$customer_html);
            $compile($('#mblCustomers'))($scope);
            $rootScope.customer_scope.getPagedDataAsync(10,1);
          }
        }
      }
    });

    $scope.showFooterBar = function(){

      var
        positionDiff    = 0,
        positionCurrent = 0;

      positionCurrent = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
      positionDiff = $scope.positionCurrent - positionCurrent;

      $scope.positionCurrent = positionCurrent;

      if(positionDiff > 0 && positionCurrent > 0){
        if(!$scope.show_footer_bar){
          $scope.show_footer_bar = true;
        }
      }else if (positionDiff == 0){

      }else {
        $scope.show_footer_bar = false;
      }

      if (!$scope.$$phase){
        $scope.$apply();
      }

    }

    $scope.edit = function(){
      $state.go(values.collection_singular_name + '.update', {id: $scope.currentId});
    }

    $scope.delete = function(){
      if (!confirm('削除してもよろしいですか？')){
        return;
      }
      var _id = $scope.currentId;

      $http.post(
        values.deleteUrl,
        {_id: _id}
      ).success(function(data){
        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }
        alert('削除処理が完了しました');

        $state.go(values.collection_singular_name + '.list');
      });
    }

    $scope.init();
  });

  app.controller('MblCreateController', function($scope, $http, $state, $controller, ngDialog, values, utils, searchManager) {

    $controller('BaseController', {$scope: $scope});

    //初期化
    $scope.init = function(){
      if (!$scope.$$phase){
        $scope.$apply();
      }
      //自分のユーザー情報をフィールドに格納する
      utils.setMyDataWhenCreate($scope, values.collection_name);
    };

    //保存
    $scope.create = function(){

      var
        param = {};

      $.each($scope[values.collection_name], function(i, v){
        if (v == null){
          $scope[values.collection_name][i] = '';
        }
      });

      param[values.collection_singular_name] = $scope[values.collection_name];

      $http.post(
        values.createUrl,
        param
      ).success(function(data){
        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }

        $state.go(values.collection_singular_name + '.list');
      });
    };

    //キャンセル
    $scope.cancel = function(){
       $state.go(values.collection_singular_name + '.list');
    }

    $scope.openTableSearchDialog = function($event){
      searchManager.openTableSearchDialog($scope, $event);
    };

    $scope.init();
  });

  app.controller('MblUpdateController', function($scope, $http, $state, $controller, $stateParams, $window, ngDialog, values, searchManager) {

    $controller('BaseController', {$scope: $scope});

    //初期化
    $scope.init = function(){
      if (!$scope.$$phase){
        $scope.$apply();
      }
      var
       _id = $stateParams.id;

      $scope.currentId = _id;

      $http.post(
        values.singleReadUrl,
        {_id: _id}
      ).success(function(data){
        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }
        $scope[values.collection_name] = data.value;
      });
    };

    //更新
    $scope.update = function(){

      var
        param = {_id: $scope.currentId};

      $.each($scope[values.collection_name], function(i, v){
        if (v == null){
          $scope[values.collection_name][i] = '';
        }
      });

      param[values.collection_singular_name] = $scope[values.collection_name];

      $http.post(
        values.updateUrl,
        param
      ).success(function(data){
        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }

        $state.go(values.collection_singular_name + '.detail', {id: $scope.currentId});

      });

    };

    //キャンセル
    $scope.cancel = function(){
       $state.go(values.collection_singular_name+ '.detail', {id: $scope.currentId});
    }

    $scope.openTableSearchDialog = function($event){
      searchManager.openTableSearchDialog($scope, $event);
    };

    $scope.init();
  });

  app.controller('MblDetailListController', function($scope, $http, $state, $controller, $stateParams, $rootScope, values, itemManager, constants, utils) {

    $scope.pagingOptions = {
      pageSize   : 10,
      currentPage: 1
    };

    $scope.init = function(options){
      $scope.pagingOptions.currentPage = 1;
      if (!$scope.$$phase){
        $scope.$apply();
      }

      if (options){
        $scope.collectionName     = options.collectionName;
        $scope.singularName       = options.singularName;
        $scope.listReadUrl        = options.listReadUrl;
        $scope.labelFieldNameList = options.labelFieldNameList;
        $scope.createStateName    = options.createStateName;
        $scope.detailStateName    = options.detailStateName;
      }else{
        console.log('オプションがありません');
        return;
      }
      $scope.relation = utils.getRelation({main: values.collection_name, detail: $scope.collectionName});
      if ($scope.singularName == 'activity_history'){
        $rootScope.activity_history_scope = $scope;
      } else if ($scope.singularName == 'business_discussion'){
        $rootScope.business_discussion_scope = $scope;
      } else if ($scope.singularName == 'customer'){
        $rootScope.customer_scope = $scope;
      }

      if ($scope.parent){
        if ($scope.relation == constants.RELATION_ONE_TO_MANY && $scope.parent['_id']){
          //１対多の場合
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          //ID
          $scope[$scope.collectionName][values.id_name] = $scope.parent['_id']['$id'];

          //名称
          $.each(values.name_name, function(i, v){
            $scope[$scope.collectionName][v] = $scope.parent[v];
          });

          if (typeof values.public_name_name !== 'undefined'){
            $scope[$scope.collectionName][values.public_name_name] = $scope.parent[values.public_name_name];
          }
        }else if ($scope.relation == constants.RELATION_MANY_TO_MANY){
          //多対多の場合
        }

        //会社ID
        if ($scope.parent['company_id'] && $scope.parent['company_name']){
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          $scope[$scope.collectionName]['company_id']   = $scope.parent['company_id'];
          $scope[$scope.collectionName]['company_name'] = $scope.parent['company_name'];
        }

        //商談ID
        if ($scope.parent['business_discussion_id'] && $scope.parent['business_discussion_name']){
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          $scope[$scope.collectionName]['business_discussion_id']   = $scope.parent['business_discussion_id'];
          $scope[$scope.collectionName]['business_discussion_name'] = $scope.parent['business_discussion_name'];
        }

      }

      //自分のユーザー情報をフィールドに格納する
      utils.setMyDataWhenCreate($scope, $scope.collectionName);

      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    };

    $scope.dataList = [];
    $scope.getPagedDataAsync = function (pageSize, page){

      setTimeout(function(){
        var
          param = {
            id_name : values.id_name,
            id_value: $scope.currentId,
            relation: constants.RELATION_ONE_TO_MANY,
            rows: pageSize,
            page: page
          },
          relation = utils.getRelation({main: values.collection_name, detail: $scope.collectionName});

        if (relation == constants.RELATION_MANY_TO_MANY){
          //コレクション間の関係が多対多の場合
          param.id_name  = values.id_name + 's';
          param.relation = constants.RELATION_MANY_TO_MANY;
        }

        $http.post(
          $scope.listReadUrl,
          param
        ).success(function(data){
          if (data.has_error){
            alert(data.message);
            return;
          }
          var item = '';
          $scope.list = data.list;
          $scope.labelList = {};

          if ($scope.option_item_list){
            $.each($scope.list, function(i, v){

              v = itemManager.convertObject(v, $scope.option_item_list, {is_list: true});
              $scope.dataList.push(v);
            });

            $.each($scope.labelFieldNameList, function(i, v){

              item = itemManager.getItem(v, $scope.option_item_list);
              $scope.labelList[item.field_name + '_label'] = item.display_name;
            });
          } else {
            $http.post(
              '/my_item_list/php/my_item_list_read_single.php',
              {collection_name: $scope.collectionName}
            ).success(function(data){
              if (data.has_error){
                return;
              }
              var my_item_list = data.value.list;
              $scope.option_item_list = my_item_list;

              $.each($scope.list, function(i, v){

                v = itemManager.convertObject(v, $scope.option_item_list, {is_list: true});
                $scope.dataList.push(v);
              });


              $.each($scope.labelFieldNameList, function(i, v){

                item = itemManager.getItem(v, $scope.option_item_list);
                $scope.labelList[item.field_name + '_label'] = item.display_name;
              });
            });

          }

          $scope.pagingOptions.currentPage = $scope.pagingOptions.currentPage + 1;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });

      }, 100);
    }

    $scope.moreLoad =function(){
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    }

    $scope.detail = function ($event){
      var
        _id = '',
        target = $event.target;

      if (typeof target.attributes._id !== 'undefined'){
        _id = target.attributes._id.value;
      } else {
        _id = target.parentNode.attributes._id.value;
      }
      $state.go(values.collection_singular_name + $scope.detailStateName, {id: _id});
    }

    $scope.create = function ($event){
      var _id = $scope.currentId;

      $state.go(values.collection_singular_name + $scope.createStateName, {id: _id});
    }

  });

  app.controller('MblDetailDetailController', function($scope, $http, $state, $controller, $ionicScrollDelegate, $stateParams, values, itemManager) {
    $scope.init = function(options){
      if (options){
        $scope.collectionName     = options.collectionName;
        $scope.singleReadUrl      = options.singleReadUrl;
        $scope.deleteUrl          = options.deleteUrl;
        $scope.updateStateName    = options.updateStateName;
      }else{
        console.log('オプションがありません');
        return;
      }

      if (!$scope.$$phase){
        $scope.$apply();
      }

      var _id = $stateParams.id;

      $scope.currentId = _id;

      $scope.show_footer_bar = false;
      $scope.show_tab = false;
      $scope.show_detail = true;
      $scope.positionCurrent = 0;

      $http.post(
        $scope.singleReadUrl,
        {_id: _id}
      ).success(function(data){

        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }

        var
          value = data.value,
          title = '';

        if ($scope.my_item_list){
          value                          = itemManager.convertObject(value, $scope.my_item_list, {is_detail: true});
          $scope[$scope.collectionName] = value;
          values.currentParent           = value;
        }else{
          $http.post(
            '/my_item_list/php/my_item_list_read_single.php',
            {collection_name: $scope.collectionName}
          ).success(
            function(data){
              if (data.has_error){
                return;
              }
              var my_item_list = data.value.list;

              $scope.my_item_list            = my_item_list;
              value                          = itemManager.convertObject(value, my_item_list, {is_detail: true});
              $scope[$scope.collectionName] = value;
              values.currentParent           = value;
            }
          );
        }

      });

    }

    $scope.countPositionY = function(){
      $scope.positionCurrent = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
    }

    $scope.showFooterBar = function(){

      var
      positionDiff    = 0,
      positionCurrent = 0;

      positionCurrent = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
      positionDiff = $scope.positionCurrent - positionCurrent;

      $scope.positionCurrent = positionCurrent;

      if(positionDiff > 0 && positionCurrent > 0){
        if(!$scope.show_footer_bar){
          $scope.show_footer_bar = true;
          //$scope.positionCurrent = positionCurrent;
        }
      }else if (positionDiff == 0){

      }else {
        $scope.show_footer_bar = false;
      }

      if (!$scope.$$phase){
        $scope.$apply();
      }

    }

    $scope.edit = function(){
      $state.go(values.collection_singular_name + $scope.updateStateName, {detail_list_data_id: $scope.currentId});
    }

    $scope.delete = function(){
      if (!confirm('削除してもよろしいですか？')){
        return;
      }
      var _id = $scope.currentId;

      $http.post(
        $scope.deleteUrl,
        {_id: _id}
      ).success(function(data){
        if (data.has_error){
          myObject.common.showError(data.message);
          return;
        }
        alert('削除処理が完了しました');

        $state.go(values.collection_singular_name + '.detail', {id: _id});
      });
    }
  });

  app.controller('MblDetailCreateController', function($scope, $http, $state, $controller, $stateParams, $window, ngDialog, values, utils, constants) {
    //初期化
    $scope.init = function(options){
      if (options){
        $scope.collectionName = options.collectionName;
        $scope.singularName   = options.singularName;
        $scope.createUrl      = options.createUrl;
      }else{
        console.log('オプションがありません');
        return;
      }

      if (!$scope.$$phase){
        $scope.$apply();
      }

      var
        _id      = $stateParams.id,
        relation = null;

      $scope.currentId = _id;
      $scope.parent    = values.currentParent;
      $scope.relation = utils.getRelation({main: values.collection_name, detail: $scope.collectionName});

      if ($scope.parent){

        if ($scope.relation == constants.RELATION_ONE_TO_MANY && $scope.parent['_id']){
          //１対多の場合
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          //ID
          $scope[$scope.collectionName][values.id_name] = $scope.parent['_id']['$id'];

          //名称
          $.each(values.name_name, function(i, v){
            $scope[$scope.collectionName][v] = $scope.parent[v];
          });

          if (typeof values.public_name_name !== 'undefined'){
            $scope[$scope.collectionName][values.public_name_name] = $scope.parent[values.public_name_name];
          }
        }else if ($scope.relation == constants.RELATION_MANY_TO_MANY){
          //多対多の場合
        }

        //会社ID
        if ($scope.parent['company_id'] && $scope.parent['company_name']){
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          $scope[$scope.collectionName]['company_id']   = $scope.parent['company_id'];
          $scope[$scope.collectionName]['company_name'] = $scope.parent['company_name'];
        }

        //商談ID
        if ($scope.parent['business_discussion_id'] && $scope.parent['business_discussion_name']){
          if (!$scope[$scope.collectionName]){
            $scope[$scope.collectionName] = {};
          }

          $scope[$scope.collectionName]['business_discussion_id']   = $scope.parent['business_discussion_id'];
          $scope[$scope.collectionName]['business_discussion_name'] = $scope.parent['business_discussion_name'];
        }

      }

      //自分のユーザー情報をフィールドに格納する
      utils.setMyDataWhenCreate($scope, $scope.collectionName);
    };

    //保存
    $scope.create = function(){

      var
        detail_list_data = $scope[$scope.collectionName];
        param            = {},
        id_name          = values.id_name;

      if ($scope.relation == constants.RELATION_MANY_TO_MANY){
        id_name                   = id_name + 's';
        detail_list_data[id_name] = [$scope.currentId];
      }else{
        if (!detail_list_data[id_name]){
          //親IDが無い場合は上書きする
          detail_list_data[id_name] = $scope.currentId;
        }
      }

      param[$scope.singularName] = detail_list_data;

      $http.post(
        $scope.createUrl,
        param
      ).success(function(data){
        if (data.has_error){
          alert(data.message);
          return;
        }

        if ($scope.relation == constants.RELATION_MANY_TO_MANY){
          //リレーションが多対多の場合、相互にキーを持つ
          var
            object_id     = data.value,
            singular_name = values.collection_singular_name,
            update_url    = '/' + singular_name + '/php/' + singular_name + '_update.php',
            param         = {_id: $scope.currentId, relation: constants.RELATION_MANY_TO_MANY},
            ids_name      = $scope.singularName + '_ids';

          param[singular_name] = {};

          param[singular_name][ids_name] = [object_id];

          $http.post(
            update_url,
            param
          ).success(function(data){
            if (data.has_error){
              alert(data.message);
              return;
            }

          });
        }

        $state.go(values.collection_singular_name + '.detail', {id: $scope.currentId});
      });
    };

    //キャンセル
    $scope.cancel = function(){
       $state.go(values.collection_singular_name + '.detail', {id: $scope.currentId}, {reload: true});
    }

    $scope.openTableSearchDialog = function($event){
      searchManager.openTableSearchDialog($scope, $event);
    };
  });

  app.controller('MblDetailUpdateController', function($scope, $http, $state, $stateParams, ngDialog, values, searchManager) {

    $scope.init = function(options){
      if (options){
        $scope.collectionName = options.collectionName;
        $scope.singularName   = options.singularName;
        $scope.singleReadUrl  = options.singleReadUrl;
        $scope.updateUrl      = options.updateUrl;
      }else{
        console.log('オプションがありません');
        return;
      }

      if (!$scope.$$phase){
        $scope.$apply();
      }
      var _id          = $stateParams.id;

      $scope.currentId = _id;
      $scope.detailListDataId = $stateParams.detail_list_data_id;

      $http.post(
        $scope.singleReadUrl,
        {_id: $scope.detailListDataId }
      ).success(function(data){
        if (data.has_error){
          //myObject.showError(data.message);
          alert(data.message);
          return;
        }
        $scope[$scope.collectionName] = data.value;
      });

    };

    //保存
    $scope.update = function(){

      var
        detail_list_data = $scope[$scope.collectionName],
        param            = {};

      param = {_id: $scope.detailListDataId};

      param[$scope.singularName] = detail_list_data;

      $http.post(
        $scope.updateUrl,
        param
      ).success(function(data){
        if (data.has_error){
          //myObject.common.showError(data.message);
          alert(data.message);
          return;
        }

        $state.go(values.collection_singular_name + '.detail', {id: $scope.currentId});
      });
    };

    $scope.openTableSearchDialog = function($event){
      searchManager.openTableSearchDialog($scope, $event);
    };

  });

})();
