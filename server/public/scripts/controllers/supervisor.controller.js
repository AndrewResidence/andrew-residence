myApp.controller('SupervisorController', function (UserService, ShiftService, AvailabilityService, $mdDialog, calendarService) {
  console.log('SupervisorController created');
  var vm = this;
  vm.userService = UserService;
  vm.shiftService = ShiftService;
  vm.userObject = UserService.userObject;
  vm.shiftService = ShiftService;
  vm.shiftsToDisplay = [];
  vm.pendingShifts = ShiftService.pendingShifts;
  vm.filledByName = ShiftService.filledByName.data;


  vm.updatePayPeriodDates = function () {
    calendarService.updatePayPeriodDates().then(function (response) {
      console.log(response)
    }).catch(function(error){
      console.log('error in update pay periods')
    })
  };

  // //used for assigning month/day in the calendar header
  vm.month = calendarService.month;
  vm.year = calendarService.year;
  vm.today = moment();
  vm.dayList = calendarService.supervisorDayList;
  vm.scheduleDays = calendarService.scheduleDays;
  vm.payPeriodStartAndEnd = calendarService.payPeriodStartAndEnd;
  vm.currentSchedule = calendarService.currentSchedule.dates;

  //funciton to get the data for the calendar
  vm.getPayPeriodDates = function () {
    vm.month = moment(vm.today).format('MMMM');
    vm.year = moment(vm.today).format('YYYY');
    calendarService.getPayPeriodDates().then(function (response) {
      vm.getShifts(calendarService.payPeriodStart, calendarService.payPeriodEnd);
      vm.getPendingShifts();
    }).catch(function(error){
      console.log('error in get pay period dates')
    })
  };

  //checks to see if the pay period is current, if not, it updates the DB
  vm.checkPayPeriodCurrent = function () {
    calendarService.checkPayPeriodCurrent();
  }

  //kicks off the supervisor calendar
  vm.getPayPeriodDates();

  // gets the current pay period days for two weeks
  vm.currentPayPeriod = function () {
    calendarService.currentPayPeriod(vm.scheduleDays);
  }

  //function to pull prior two weeks of dates
  vm.prevTwoWeeks = function (date) {
    vm.currentSchedule = [];
    console.log('date in prev two weeks', date)
    var prevTwoWeeks = moment(date).subtract(14, 'days');
    vm.payPeriodStart = prevTwoWeeks;
    vm.payPeriodEnd = moment(date).subtract(1, 'days');
    for (var i = 0; i < vm.scheduleDays.length; i++) {
      vm.currentSchedule.push({ moment: moment(prevTwoWeeks._d).add(vm.scheduleDays[i], 'days'), shifts: [] });
    }
    vm.month = moment(prevTwoWeeks._d).format('MMMM');
    vm.year = moment(prevTwoWeeks._d).format('YYYY');
    vm.getShifts(vm.payPeriodStart, vm.payPeriodEnd);
  };

  //function to get next two weeks of dates
  vm.nextTwoWeeks = function (date) {
    vm.currentSchedule = [];
    var nextTwoWeeks = moment(date).add(14, 'days');
    vm.payPeriodEnd = moment(date).add(28, 'days');
    vm.payPeriodStart = nextTwoWeeks;
    for (var i = 0; i < vm.scheduleDays.length; i++) {
      vm.currentSchedule.push({ moment: moment(nextTwoWeeks._d).add(vm.scheduleDays[i], 'days'), shifts: [] });
    }
    vm.month = moment(nextTwoWeeks._d).format('MMMM');
    vm.year = moment(nextTwoWeeks._d).format('YYYY');
    console.log(vm.payPeriodStart, vm.payPeriodEnd)
    vm.getShifts(vm.payPeriodStart, vm.payPeriodEnd);
  };


  vm.shiftDetails = function (event, shift) {
    vm.filledByName = [];
    ShiftService.shiftDetails(event, shift).then(function (response) {
      vm.filledByName = response.data;
      $mdDialog.show({
        controller: 'SupervisorDialogController as sd',
        templateUrl: '/views/templates/shiftDetails.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
      });
    }).catch(function(error){
      console.log('eror in shift details')
    })
  };

  vm.addShift = function (event) {
    $mdDialog.show({
      controller: 'SupervisorDialogController as sd',
      templateUrl: '/views/templates/addShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  }; //end addShift popup function

  //get all shifts
  vm.getShifts = function (payPeriodStart, payPeriodEnd) {
    vm.shiftsToDisplay = [];
    var firstDayofShifts = moment(payPeriodStart);
    var lastDayofShifts = moment(payPeriodEnd)
    ShiftService.getShifts(firstDayofShifts, lastDayofShifts).then(function (response) {
      vm.shiftsToDisplay = response.data;
      for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentSchedule.length; j++) {
          if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentSchedule[j].moment).format('YYYY-MM-DD')) {
            vm.currentSchedule[j].shifts.push(vm.shiftsToDisplay[i]);
          }
        }
      }
    }).catch(function(error){
      console.log('error in getting shifts')
    })
  };

  //get pending shifts for supervisor page
  vm.getPendingShifts = function () {
    ShiftService.getPendingShifts().then(function (response) {
      console.log('pending shifts', vm.pendingShifts.data.length)
      for (var i = 0; i < vm.pendingShifts.data.length; i++) {
        vm.pendingShifts.data[i].date = moment(vm.pendingShifts.data[i].date).format('M/D');
      };
      for (var i = 0; i < vm.pendingShifts.data.length; i++) {
        for (var j = i+1; j < vm.pendingShifts.data.length; j++) {
          if (vm.pendingShifts.data[i].shift_id == vm.pendingShifts.data[j].shift_id) {
            vm.pendingShifts.data.splice(j, 1);
          };
        }
      }
    })
  }


  function checkShiftIds(array, id) {
    var result = false;
    for (var i = 0; i < array.length; i++) {
      if (array[i].shift_id == id) {
        console.log('true', array[i].shift_id)
        result = true;
      }
      return result;
    }
  }


  vm.click = function (shift) {
    console.log('clicked');
    console.log(shift);

  };
  //This is a pick-up shift dialog that WILL BE MOVED to the staff controller once the staff calendar is up and running.
  vm.showDetailsDialog = function (event, shift) {
    $mdDialog.show({
      controller: 'StaffDialogController as sc',
      templateUrl: '/views/dialogs/pickUpShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { shift: shift },
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  }

  //get supervisors 
  vm.getSupervisors = function () {
    UserService.getSupervisors().then(function (response) {
      vm.supervisors = response.data;
    }).catch(function(error){
      console.log('error in getting supervisors')
    })
  };

  vm.confirmShift = function (event, shift) {
    $mdDialog.show({
      controller: 'ConfirmShiftController as sc',
      templateUrl: '/views/dialogs/confirmShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { pendingShift: shift },
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    }).then(function() {
      vm.getPayPeriodDates();
    })
  } //end confirmShift

});
