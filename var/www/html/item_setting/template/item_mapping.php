    <div class="common-view">
      <div class="row">
        <div class="col-md-12">
          <div class="title">
            <span>{{page_title}}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div style="padding: 0; margin-bottom: 15px;" class="col col-md-3">
          <a ui-sref="item_settings" class="back_button">戻る</a>
          <a href="#" ng-click="update()" class="save_button">保存</a>
        </div>
      </div>

      <div>
        <table class="table input-table">
          <tbody>
            <tr>
              <th style="text-align: left; border-top: none;">見込客の項目</th>
              <th style="text-align: left; border-top: none;">会社の項目</th>
              <th style="text-align: left; border-top: none;">担当者の項目</th>
              <th style="text-align: left; border-top: none;">商談の項目</th>
            </tr> 
            <tr ng-repeat="prospectlist in prospectlists">
              <td>
                {{prospectlist.label}}
              </td>
              <td>
                <label class="common-select" ng-show="prospectlist.companies.type_string">
                  <select ng-model="prospectlist.companies.field_name" ng-options="companies_string.field_name as companies_string.display_name for companies_string in companies_strings"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.companies.type_select">
                  <select ng-model="prospectlist.companies.field_name" ng-options="companies_select.field_name as companies_select.display_name for companies_select in companies_selects"></select>
                  <i></i>
                </label>

                <label class="common-select" ng-show="prospectlist.companies.type_datetime">
                  <select ng-model="prospectlist.companies.field_name" ng-options="companies_datetime.field_name as companies_datetime.display_name for companies_datetime in companies_datetimes"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.companies.type_date">
                  <select ng-model="prospectlist.companies.field_name" ng-options="companies_date.field_name as companies_date.display_name for companies_date in companies_dates"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.companies.type_text">
                  <select ng-model="prospectlist.companies.field_name" ng-options="companies_text.field_name as companies_text.display_name for companies_text in companies_texts"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.companies.type_number">
                  <select ng-model="prospectlist.companies.field_name" ng-options="companies_number.field_name as companies_number.display_name for companies_number in companies_numbers"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.companies.type_multiple_select">
                  <select ng-model="prospectlist.companies.field_name" ng-options="companies_multiple_select.field_name as companies_multiple_select.display_name for companies_multiple_select in companies_multiple_selects"></select>
                  <i></i>
                </label>
              </td>
              <td>
                <label class="common-select" ng-show="prospectlist.customers.type_string">
                  <select ng-model="prospectlist.customers.field_name" ng-options="customers_string.field_name as customers_string.display_name for customers_string in customers_strings"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.customers.type_select">
                  <select ng-model="prospectlist.customers.field_name" ng-options="customers_select.field_name as customers_select.display_name for customers_select in customers_selects"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.customers.type_datetime">
                  <select ng-model="prospectlist.customers.field_name" ng-options="customers_datetime.field_name as customers_datetime.display_name for customers_datetime in customers_datetimes"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.customers.type_date">
                  <select ng-model="prospectlist.customers.field_name" ng-options="customers_date.field_name as customers_date.display_name for customers_date in customers_dates"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.customers.type_text">
                  <select ng-model="prospectlist.customers.field_name" ng-options="customers_text.field_name as customers_text.display_name for customers_text in customers_texts"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.customers.type_number">
                  <select ng-model="prospectlist.customers.field_name" ng-options="customers_number.field_name as customers_number.display_name for customers_number in customers_numbers"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.customers.type_multiple_select">
                  <select ng-model="prospectlist.customers.field_name" ng-options="customers_multiple_select.field_name as customers_multiple_select.display_name for customers_multiple_select in customers_multiple_selects"></select>
                  <i></i>
                </label>
              </td>
              <td>
                <label class="common-select" ng-show="prospectlist.business_discussions.type_string">
                  <select ng-model="prospectlist.business_discussions.field_name" ng-options="business_string.field_name as business_string.display_name for business_string in business_strings"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.business_discussions.type_select">
                  <select ng-model="prospectlist.business_discussions.field_name" ng-options="business_select.field_name as business_select.display_name for business_select in business_selects"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.business_discussions.type_datetime">
                  <select ng-model="prospectlist.business_discussions.field_name" ng-options="business_datetime.field_name as business_datetime.display_name for business_datetime in business_datetimes"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.business_discussions.type_date">
                  <select ng-model="prospectlist.business_discussions.field_name" ng-options="business_date.field_name as business_date.display_name for business_date in business_dates"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.business_discussions.type_text">
                  <select ng-model="prospectlist.business_discussions.field_name" ng-options="business_text.field_name as business_text.display_name for business_text in business_texts"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.business_discussions.type_number">
                  <select ng-model="prospectlist.business_discussions.field_name" ng-options="business_number.field_name as business_number.display_name for business_number in business_numbers"></select>
                  <i></i>
                </label>
                <label class="common-select" ng-show="prospectlist.business_discussions.type_multiple_select">
                  <select ng-model="prospectlist.business_discussions.field_name" ng-options="business_multiple_select.field_name as business_multiple_select.display_name for business_multiple_select in business_multiple_selects"></select>
                  <i></i>
                </label>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
