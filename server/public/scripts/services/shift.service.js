myApp.service('ShiftService', function ($http, $location, $mdDialog) {
  console.log('ShiftService Loaded');
  var self = this;
self.shift = {}
  self.newShift = {
    shiftDate: [],
    urgent: false,
    shift: '',
    adl: false,
    mhw: false,
    nurse: false,
    comments: '',
    notify: ''
  }

  self.updatedShift = {
    shiftDate: [],
    urgent: false,
    shift: '',
    adl: false,
    mhw: false,
    nurse: false,
    comments: '',
    // notify: '{"basketball", "baseball"}',
    shift_status: ''
  }

  self.shiftsToDisplay = {data: []};
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
  self.shiftDetails = function (event, shift) {
    console.log('shift details button clicked', shift);
    self.shift=shift;
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
    self.shiftsToDisplay.data = [];
    console.log('shifts to display service', self.shiftsToDisplay.data)
    return $http.get('/shifts').then(function (response) {
      // console.log('response', response.data)
      // self.shiftsToDisplay.data = response.data;
      console.log('shifts to display in service, after query', self.shiftsToDisplay.data)
      return response;
    });
  };

  self.getPendingShifts = function () {
    return $http.get('/shifts/shiftbid').then(function (response) {
      // console.log('response', response.data);
      return response;
    });
  };

  self.getShiftsToConfirm = function (shiftId) {
    console.log('shift id in service', shiftId);
    return $http.get('/shifts/shiftbidToConfirm/' + shiftId).then(function (response) {
      console.log('response', response.data);
      return response;
    });
  };

  self.pickUpShift = function(shift) {
    return $http.post('/shifts/shiftBid', shift).then(function(response) {
      console.log('posted shift bid', response);
      return response;
    })
  }

  // self.getPayPeriodDates = function() {
  //   return $http.get('/shifts/payperiod/getdates').then(function(response){
  //     console.log('response', response.data)
  //     // self.payPeriodStartAndEnd.data = response.data;
  //     return response.data;
  //   })
  //   .catch(function(err){
  //     console.log('error')
  //   })
  // }

  // self.updatePayPeriodDates = function() {
  //   var rowId = 1;
  //   return $http.put('/shifts/payperiod/updatedates/' + rowId).then(function(response){
  //     console.log('response', response.data)
  //     return response.data;
  //   })
  // }
  self.sendTextMessage = function () {


    //what is required for Plivo to deliver message;
    textParams = {
      src: '',
      dst: '',
      text: '',

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
  };
});
