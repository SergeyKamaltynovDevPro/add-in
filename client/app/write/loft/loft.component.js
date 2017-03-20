import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './loft.routes';
export class LoftController {
  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope, ngToast, $timeout) {
    this.$http = $http;
    this.$timeout = $timeout;
    this.socket = socket;
    this.lofttext =null;
    this.ngToast =ngToast;
    $scope.$on('$destroy', function() {

    });
  }

  insertLoft(){
    let self =this;
    function doDialog() {
      var url = 'https://172.17.2.254:3000/write/loft/';
      var dialogOptions = { width: 425, height: 425, displayInIframe:false};

      Office.context.ui.displayDialogAsync(url, dialogOptions, function(result) {
        // In the callback, save the dialog object
        var dialog = result.value;


      });
    }
    doDialog();


  }

  setItemBody(body) {
    let self = this;
    Office.context.mailbox.item.body.getTypeAsync(
      function (result) {
        if (result.status == Office.AsyncResultStatus.Failed){
          self.$timeout(()=>{self.ngToast.danger({
            content: 'Cant get a sender'
          })});
        }
        else {
          // Successfully got the type of item body.
          // Set data of the appropriate type in body.
          if (result.value == Office.MailboxEnums.BodyType.Html) {
            // Body is of HTML type.
            // Specify HTML in the coercionType parameter
            // of setSelectedDataAsync.
            Office.context.mailbox.item.body.setSelectedDataAsync(
              body,
              { coercionType: Office.CoercionType.Html,
                asyncContext: { var3: 1, var4: 2 } },
              function (asyncResult) {
                if (asyncResult.status ==
                  Office.AsyncResultStatus.Failed){
                  self.$timeout(()=>{self.ngToast.danger({
                    content: 'Cant get a sender'
                  })});


                }
                else {
                  self.$timeout(()=>{self.ngToast.create('Code added to mail body')});
                }
              });
          }
          else {
            // Body is of text type.
            Office.context.mailbox.item.body.setSelectedDataAsync(
              ' Kindly note we now open 7 days a week.',
              { coercionType: Office.CoercionType.Text,
                asyncContext: { var3: 1, var4: 2 } },
              function (asyncResult) {
                if (asyncResult.status ==
                  Office.AsyncResultStatus.Failed){
                  self.$timeout(()=>{self.ngToast.danger({
                    content: 'Cant get a sender'
                  })});
                }
                else {
                  self.$timeout(()=>{self.ngToast.create('Code added to mail body')});
                }
              });
          }
        }
      });
  }

  $onInit() {

    var self =this;
    $.get('/mail/loft.pug').then(function(doc) {
      var html = jade.compile(doc);
      self.template = html;
    });

  }


}

export default angular.module('angularStartApp.loft', [uiRouter])
  .config(routing)
  .component('loft', {
    template: require('./loft.pug'),
    controller: LoftController,
    controllerAs: 'vm'
  })
  .name;
