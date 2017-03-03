import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './templates.routes';
export class TemplatesController {
  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope, ngToast) {
    this.$http = $http;
    this.socket = socket;
    this.template =null;
    this.ngToast =ngToast;
    $scope.$on('$destroy', function() {

    });
  }

  insertTemplate(){
    let self =this;
    $.get(this.file).then(function(doc) {
      var html = jade.compile(doc);
      Office.context.mailbox.item.to.getAsync(callback);
      function callback(asyncResult) {
        if(!asyncResult.value.length){
          self.ngToast.danger({
            content: 'Cant get a sender'
          });
          return
        }
        var displayName = asyncResult.value[0].displayName;
        var emailAddress = asyncResult.value[0].emailAddress;
        var locals = {
          name: displayName,
          mail: emailAddress
        };
        var result = html(locals);
        self.setItemBody(result);
      }

    });
  }

  setItemBody(body) {
    let self = this;
    item.body.getTypeAsync(
      function (result) {
        if (result.status == Office.AsyncResultStatus.Failed){
          self.ngToast.danger({
            content: 'Cant get a sender'
          });
        }
        else {
          // Successfully got the type of item body.
          // Set data of the appropriate type in body.
          if (result.value == Office.MailboxEnums.BodyType.Html) {
            // Body is of HTML type.
            // Specify HTML in the coercionType parameter
            // of setSelectedDataAsync.
            item.body.setSelectedDataAsync(
              body,
              { coercionType: Office.CoercionType.Html,
                asyncContext: { var3: 1, var4: 2 } },
              function (asyncResult) {
                if (asyncResult.status ==
                  Office.AsyncResultStatus.Failed){
                  self.ngToast.danger({
                    content: 'Cant get a sender'
                  });

                }
                else {
                  // Successfully set data in item body.
                  // Do whatever appropriate for your scenario,
                  // using the arguments var3 and var4 as applicable.
                }
              });
          }
          else {
            // Body is of text type.
            item.body.setSelectedDataAsync(
              ' Kindly note we now open 7 days a week.',
              { coercionType: Office.CoercionType.Text,
                asyncContext: { var3: 1, var4: 2 } },
              function (asyncResult) {
                if (asyncResult.status ==
                  Office.AsyncResultStatus.Failed){
                  self.ngToast.danger({
                    content: 'Cant get a sender'
                  });
                }
                else {
                  // Successfully set data in item body.
                  // Do whatever appropriate for your scenario,
                  // using the arguments var3 and var4 as applicable.
                }
              });
          }
        }
      });
  }

  $onInit() {
    var self =this;
    this.$http.get('/api/templates')
      .then(response => {
        this.templates = response.data;
      });

  }


}

export default angular.module('angularStartApp.templates', [uiRouter])
  .config(routing)
  .component('templates', {
    template: require('./templates.pug'),
    controller: TemplatesController,
    controllerAs: 'vm'
  })
  .name;
