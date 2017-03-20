import angular from 'angular';
import uiRouter from 'angular-ui-router';
import moment from 'moment';
import routing from './read.routes';

export class ReadController {
  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope, $filter, $state) {
    this.$http = $http;
    this.socket = socket;
    this.$filter = $filter;
    this.$state = $state;
    this.lofts = [];
  }

  $onInit() {
    this.item = Office.context.mailbox.item;
    this.getUser();

    function getSoapEnvelope(request) {
      // Wrap an Exchange Web Services request in a SOAP envelope.
      var result =

        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
        '               xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
        '               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
        '               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
        '  <soap:Header>' +
        '  <t:RequestServerVersion Version="Exchange2013"/>' +
        '  </soap:Header>' +
        '  <soap:Body>' +

        request +

        '  </soap:Body>' +
        '</soap:Envelope>';

      return result;
    };

    function getSubjectRequest(id) {
      console.info(id);
      // Return a GetItem EWS operation request for the subject of the specified item.
      var result =

        '    <GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">' +
        '      <ItemShape>' +
        '        <t:BaseShape>IdOnly</t:BaseShape>' +
        '        <t:AdditionalProperties>' +
        '            <t:FieldURI FieldURI="item:Subject"/>' +
        '        </t:AdditionalProperties>' +
        '      </ItemShape>' +
        '      <ItemIds><t:ItemId Id="' + id + '"/></ItemIds>' +
        '    </GetItem>';

      return result;
    };

// Send an EWS request for the message's subject.
    function sendRequest() {
      // Create a local variable that contains the mailbox.
      var mailbox = Office.context.mailbox;
      debugger;
      var request = getSubjectRequest(mailbox.item.itemId);
      var envelope = getSoapEnvelope(request);

      mailbox.makeEwsRequestAsync(envelope, callback);
    };

// Function called when the EWS request is complete.
    function callback(asyncResult) {
      var response = asyncResult.value;
      var context = asyncResult.context;
      console.info(response, context)
      // Process the returned response here.
      // var responseSpan = document.getElementById("response");
      // responseSpan.innerText = response;
    };
    sendRequest();
  }

  getUser() {
    if (this.item.sender !== undefined && this.item.sender.emailAddress) {
      this.$http.get('/api/users/', {}).then((data) => {
        let user = this.$filter('filter')(data.data, {
          email: this.item.sender.emailAddress
        });
        if (user.length) {
          this.user = user[0];
          this.user.created = moment(this.user.createdAt).toNow();
          this.getLofts();
        } else {
          this.$state.go('user');
        }

      }, function () {
      });
    }
  }

  getLofts() {

    this.$http({
      url: '/api/pixel/show',
      method: "GET",
      params: {
        email: this.item.sender.emailAddress
      }
    }).then(response => {
        this.lofts = response.data.pxl;
    });
  }
}

export default angular.module('angularStartApp.read', [uiRouter])
  .config(routing)
  .component('read', {
    template: require('./read.pug'),
    controller: ReadController,
    controllerAs: 'vm'
  })
  .name;
