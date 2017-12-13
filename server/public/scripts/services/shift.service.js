myApp.service('ShiftService', function ($http, $location, $mdDialog) {
  console.log('ShiftService Loaded');
  var self = this;

  self.newShift = {
    shiftDate: [],
    urgent: '',
    shift: '',
    adl: false,
    mhw: false,
    nurse: false,
    comments: '',
    notify: ''
  }

  self.shiftsToDisplay = {data: []}
  //calls the addShift popup
  self.addShift = function (event) {
    console.log('add new shift button clicked');
    $mdDialog.show({
      controller: 'SupervisorDialogController as sd',
      templateUrl: '/views/templates/addShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  } //end addShift popup function
  //calls the shiftDetails popup
  self.shiftDetails = function (event) {
    console.log('shift details button clicked');
    $mdDialog.show({
      controller: 'SupervisorDialogController as sd',
      templateUrl: '/views/templates/shiftDetails.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  } //end shiftDetails popup function


  //addNewShift function and route
  self.addNewShift = function (shiftDate, urgent, shift, role, comments, notify, nurse, adl, mhw) {
    console.log('shiftDate', shiftDate);
    self.newShift.shiftDate = shiftDate;
    urgent = self.newShift.urgent;
    shift = self.newShift.shift;
    role = self.newShift.role;
    comments = self.newShift.comments;
    nurse = self.newShift.nurse;
    adl = self.newShift.adl;
    mhw = self.newShift.mhw;
    // notify = self.newShift.notify;
    console.log('newshift', self.newShift);
    return $http.post('/shifts/', self.newShift).then(function (response) {
      return response
    }).catch(function (err) {
      console.log('Error');
    });
  }; //end addNewShift function and route

  self.getShifts = function () {
    return $http.get('/shifts').then(function (response) {
      console.log('response', response.data)
      self.shiftsToDisplay.data = response.data;
      return response
    });
  };

  self.sendTextMessage = function () {

    
    //what is required for Plivo to deliver message;
    textParams ={
      src:'',
      dst:'',
      text:'',

    };
    $http.post('/message/text').then(function (response) {

      console.log(response);

    }).catch(function (response) {
      console.log('send textMessage did not work:', response);
    });
  };//end of sendTextMessage


  self.sendEmailMessage = function () {

    $http.post('/message/email').then(function (response) {
      // neccessary params for email transport object;
      emailParams = {
        to: '', // list of receivers
        subject: '', // Subject line
        text: '', // plain text body;
        html: '', // html body

      };
      console.log(response);

    }).catch(function (response) {
      console.log('send emailMessage did not work: ', response);
    });
  };//end of sendEmailMessage
});
