    <div class="common-view">
      <div class="row">
        <div class="col-md-12">
          <div class="title">
            <span>{{page_title}}</span>
          </div>
        </div>
      </div>
      <!--<div class="row" style="margin-bottom: 15px;">
        <div class="col-md-12">
          <button class="save_button">保存</button>
        </div>
      </div>-->
      <div style="margin: 5px 0 30px 0;" class="row">
<!--        <div class="col-md-3" style="border: 1px solid #eee; padding: 0;">-->
        <div class="col-md-3">
          <div style="border: 1px solid #eee; padding: 0;">
            <ul id="items" style="list-style-type: none; padding: 0;"></ul>
          </div>
          <div style="padding-top: 10px; padding-bottom: 10px;">
            <button id="hiddenItemsViewBtn" class="common-button" ng-click="displayHiddenItems()">非表示項目を表示する</button>
          </div>
          <div style="border: 1px solid #eee; padding: 0;" ng-show="hiddenItemsView">
            <ul id="hiddenItems" style="list-style-type: none; padding: 0;"></ul>
          </div>
        </div>
        <div class="col-md-1"></div>
        <div id="itemGroupBasePane" class="col-md-8">
          <!--<div class="row">
            <div class="col-md-12">
              <div class="itemGroupPane">基本情報</div>
              <ul name="organItems"></ul>
            </div>
          </div>-->
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <button class="create_button" ng-click="createItemGroup()" style="float: right;">項目グループを追加する</button>
        </div>
      </div>
    </div>
