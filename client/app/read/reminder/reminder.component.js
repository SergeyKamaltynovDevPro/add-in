import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './reminder.routes';

export class ReminderController {
  /*@ngInject*/
  constructor($http, $scope, socket, $rootScope, $timeout, ngToast, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.$timeout= $timeout;
    this.ngToast= ngToast;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  sendReminder = function(){
    let data = this.eventdata();
    this.$http
      .post('https://graph.microsoft.com/v1.0/me/calendar/events', JSON.stringify(data), {})
      .then(this.successCallback.apply(this),
            this.errorCallback.apply(this));
  };
  eventdata = function(){
    let data = {
      startDate : this.reminderDate,
      userProfile:  Office.context.mailbox.userProfile,
      from: item.from,
      subject: item.subject
    };
    // let data = {
    //   startDate : this.reminderDate,
    //   userProfile:{
    //     displayName : 'sergey',
    //     emailAddress : 'zlobnuygres@gmail.com'
    //   },
    //   from: {
    //     displayName : 'sergey',
    //     emailAddress : 'zlobnuygres@gmail.com'
    //   },
    //   subject: 'TEst subject'
    // }
    return {
      "Subject": "Don't forget to reply to " + data.from.displayName + " about '"+ data.subject+"'",
      "Body": {
        "ContentType": "HTML",
        "Content": "Reply"
      },
      "Start": {
        "DateTime": data.startDate+"T18:00:00",
        "TimeZone": "Pacific Standard Time"
      },
      "End": {
        "DateTime": data.startDate+"T19:00:00",
        "TimeZone": "Pacific Standard Time"
      },
      "Attendees": [
        {
          "EmailAddress": {
            "Address": data.userProfile.emailAddress,
            "Name": data.userProfile.displayName
          },
          "Type": "Required"
        }
      ]
    };
  };

  $onInit() {
  }
  successCallback(data){
    this.ngToast.create('Reminder created');
  }
  errorCallback(){

  }

}

export default angular.module('angularStartApp.reminder', [uiRouter])
  .config(routing)
  .component('reminder', {
    template: require('./reminder.pug'),
    controller: ReminderController,
    controllerAs: 'vm'
  })
  .name;
