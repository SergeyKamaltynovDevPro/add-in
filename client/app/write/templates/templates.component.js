import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './templates.routes';
export class TemplatesController {
  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope, ngToast) {
    this.$http = $http;
    this.socket = socket;
    this.template = null;
    this.ngToast = ngToast;
    this.item = Office.context.mailbox.item;
    $scope.$on('$destroy', function () {

    });
  }

  insertTemplate() {
    let self = this;
    $.get(this.file).then((doc) => {
      let html = jade.compile(doc);
      this.item.to.getAsync(callback);
      function callback(asyncResult) {
        if (!asyncResult.value.length) {
          self.ngToast.danger({
            content: 'Cant get a sender'
          });
          return
        }
        let displayName = asyncResult.value[0].displayName;
        let emailAddress = asyncResult.value[0].emailAddress;
        let locals = {
          name: displayName,
          mail: emailAddress
        };
        let result = html(locals);
        self.setItemBody(result);
      }

    });
  }

  setItemBody(body) {
    let self = this;
    this.item.body.getTypeAsync(
      (result) => {
        if (result.status == Office.AsyncResultStatus.Failed) {
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
            this.item.body.setSelectedDataAsync(
              body,
              {
                coercionType: Office.CoercionType.Html,
                asyncContext: {var3: 1, var4: 2}
              },
              function (asyncResult) {
                if (asyncResult.status ==
                  Office.AsyncResultStatus.Failed) {
                  self.ngToast.danger({
                    content: 'Cant get a sender'
                  });

                }
                else {
                  self.ngToast.create('Template added to mail body');
                }
              });
          }
          else {
            // Body is of text type.
            this.item.body.setSelectedDataAsync(
              ' Kindly note we now open 7 days a week.',
              {
                coercionType: Office.CoercionType.Text,
                asyncContext: {var3: 1, var4: 2}
              },
              function (asyncResult) {
                if (asyncResult.status ==
                  Office.AsyncResultStatus.Failed) {
                  self.ngToast.danger({
                    content: 'Cant get a sender'
                  });
                }
                else {
                  self.ngToast.create('Template added to mail body');
                }
              });
          }
        }
      });
  }

  $onInit() {
    let self = this;
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
