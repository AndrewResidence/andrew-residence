myApp.controller('SupervisorDialogController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService, calendarService) {
  console.log('SupervisorDialogController created');
  var vm = this;
  vm.userService = UserService;
  vm.shiftService = ShiftService;
  vm.calendarService = calendarService;
  vm.userObject = UserService.userObject;
  vm.addShift = ShiftService.addShift;
  vm.newShift = ShiftService.newShift;
  vm.showStaff = false;
  vm.supervisors = [];
  vm.staff = [];
  vm.shifts = ['Day', 'Evening', 'ADL Evening', 'Night'];
  vm.shiftStatus = ['Open', 'Filled'];
  vm.shift = ShiftService.shift;
  vm.myArrayOfSupervisors = [];
  
  vm.shiftsToDisplay = [];
  vm.currentSchedule = calendarService.currentSchedule.dates;

  vm.editShift = false;
  vm.myArrayOfDates = [];
  vm.updatedShift = ShiftService.updatedShift;
  vm.floors = ['2', '3', '4', '5', 'flt', 'N/A'];
  vm.editFill = false;

  vm.filledByName = ShiftService.filledByName;

  vm.shiftsToDisplay = [];
  vm.currentSchedule = calendarService.currentSchedule.dates;


  $scope.$watch('myArrayOfDates', function (newValue, oldValue) {
    if (newValue) {
      console.log('my array changed, new size : ' + newValue.length);
      console.log('myArrayOfDates', newValue);
    }
  }, true);
  
  vm.getShifts = function (payPeriodStart, payPeriodEnd) {
    // vm.getPayPeriodDates();
    var firstDayofShifts = moment(payPeriodStart);
    var lastDayofShifts = moment(payPeriodEnd)
    ShiftService.getShifts(firstDayofShifts, lastDayofShifts).then(function(response){
      vm.shiftsToDisplay = response.data;
      console.log('shifts to display', vm.shiftsToDisplay)
      for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentSchedule.length; j++) {
          // vm.currentSchedule[j].shifts = [];
          if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentSchedule[j].moment).format('YYYY-MM-DD')) {
            vm.currentSchedule[j].shifts.push(vm.shiftsToDisplay[i]);
          }
        }
      }
    }).catch(function(error){
      console.log('error in getting shifts')
    })
  }

  vm.getSupervisors = function () {
    UserService.getSupervisors().then(function (response) {
      vm.supervisors = response.data;
    }).catch(function(error){
      console.log('error in getting supervisors')
    })
  };

  vm.getSupervisors();

  vm.getStaff = function () {
    vm.userService.getStaff().then(function (response) {
      vm.staff = response.data;
    }).catch(function(error){
      console.log('error getting staff')
    })
  };

  vm.getStaff();

  vm.getPayPeriodDates = function() {
    calendarService.getPayPeriodDates();
  };

  // //start newShift function
  vm.addNewShift = function (staffId, selection, shiftDate, shiftStatus, urgent, shift, role, comments, notify, nurse, adl, mhw) {
    ShiftService.addNewShift(staffId, selection, shiftDate, shiftStatus, urgent, shift, role, comments, notify, nurse, adl, mhw).then(function (response) {
      vm.getPayPeriodDates();
      $mdDialog.hide();
      $mdToast.show(
        $mdToast.simple()
          .textContent('Shift(s) Created!')
          .hideDelay(2500)
      );
    }).catch(function(error){
      console.log('error in adding new shift')
    })
  };
  //end add newShift

  //closes dialog box
  vm.cancel = function () {
    $mdDialog.hide();
  }; //end close dialog

  vm.editShiftDetails = function (event) {
    vm.editShift = true;
    console.log(vm.editShift);
  };

  vm.updateShift = function (id, comments, shift, mhw, adl, nurse, date, floor) {
    ShiftService.updateShift(id, comments, shift, mhw, adl, nurse, date, floor).then(function (response) {
      $mdDialog.hide();
      vm.getPayPeriodDates();
      $mdToast.show(
        $mdToast.simple()
          .textContent('Shift Updated')
          .hideDelay(2500)
      )
    }).catch(function(error){
      console.log('error in updating the shift')
    })
  }

  //show staff dropdown based on statusUpdate
  vm.statusUpdate = function (value) {
    if (value === 'Filled') {
      vm.showStaff = true;
      console.log('true')
    }
    else {
      vm.showStaff = false;
      console.log('false')
    }
  };

  //start delete shift
  vm.deleteShift = function (shiftId) {
    var toast = $mdToast.simple()
      .textContent('Are you sure you want to delete?')
      .action('Cancel')
      .highlightAction(true)
      .highlightClass('md-accent');

    $mdToast.show(toast).then(function (response) {
      if (response == 'ok') {
        // alert ('Delete cancelled.')
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Cancel!')
            .textContent('You cancelled deleting the shift.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Thanks')
            .targetEvent(event)
        );
      }
      else {
        ShiftService.deleteShift(shiftId).then(function (response) {
          $mdDialog.hide();
          vm.getPayPeriodDates();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Shift deleted!')
              .hideDelay(2500)
          );
        });
      }
    }).catch(function(error){
      console.log('error in deleting the shift')
    })
  }; //end delete shift  

  vm.fillShift = function (event) {
    vm.editFill = !vm.editFill;
  };

  vm.shiftFilled = function (id, shiftId) {
    ShiftService.shiftFilled(id, shiftId).then(function (response) {
      vm.getPayPeriodDates();
      $mdDialog.hide();
    }).catch(function(error){
      console.log('error in shift filled')
    })
  };

vm.getPayPeriodDates = function() {
    calendarService.getPayPeriodDates().then(function(response){
      vm.getShifts(calendarService.payPeriodStart, calendarService.payPeriodEnd);
    }).catch(function(error){
      console.log('error in getting pay period dates')
    })
  }
});

