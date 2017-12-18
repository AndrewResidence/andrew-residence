myApp.controller('SupervisorController', function (UserService, ShiftService, AvailabilityService, $mdDialog) {
  console.log('SupervisorController created');
  var vm = this;
  vm.userService = UserService;
  vm.shiftService = ShiftService;
  vm.userObject = UserService.userObject;
  vm.shiftService = ShiftService;
  vm.shiftsToDisplay = [];
  vm.pendingShifts = [];
  vm.realPendingShifts = [];

  vm.shiftDetails = function (event, shift) {
    ShiftService.shiftDetails(event, shift)
  }
  vm.addShift = function (event) {
    ShiftService.addShift(event)
  }

  vm.updatePayPeriodDates = function () {
    ShiftService.updatePayPeriodDates().then(function (response) {
      console.log(response)
    });
  };
  //used for assigning month/day in the calendar header
  vm.month = '';
  vm.year = '';
  vm.today = moment();
  vm.dayInCycle = '';
  vm.dayList = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
  vm.scheduleDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  vm.payPeriodStartAndEnd = [];
  vm.currentSchedule = {
    dates: []
  };

  //pay period
  vm.payPeriodStart = '';
  vm.payPeriodEnd = '';
  vm.currentPayPeriodArray = {
    dates: []
  };

  vm.getPayPeriodDates = function () {
    ShiftService.getPayPeriodDates().then(function (response) {
      vm.payPeriodStartAndEnd = response;
      vm.payPeriodStart = vm.payPeriodStartAndEnd[0].start;
      vm.payPeriodEnd = vm.payPeriodStartAndEnd[0].end;
      if (moment(vm.today).format('MM-DD-YYYY') >= moment(vm.payPeriodStart).format('MM-DD-YYYY')
        && moment(vm.today).format('MM-DD-YYYY') <= moment(vm.payPeriodEnd).format('MM-DD-YYYY')) {
        vm.currentPayPeriod(vm.scheduleDays);
      }
      else if (moment(vm.today).format('MM-DD-YYYY') > moment(vm.payPeriodEnd).format('MM-DD-YYYY')) {
        vm.updatePayPeriodDates();
        // vm.getPayPeriodDates();
        console.log('today is greater than start date');
      }
    });
  };

  vm.getPayPeriodDates();
  //gets the current pay period days for two weeks
  vm.currentPayPeriod = function (scheduleDays) {
    for (var i = 0; i < scheduleDays.length; i++) {
      vm.currentSchedule.dates.push(
        {
          moment: moment(vm.payPeriodStart).add(scheduleDays[i], 'days'),
          shifts: []
        }
      );
    }
    console.log('vm.currentSchedule.dates', vm.currentSchedule.dates)
    vm.month = moment(vm.payPeriodStart).format('MMMM');
    vm.year = moment(vm.payPeriodStart).format('YYYY');
  };
  //function to pull prior two weeks of dates
  vm.prevTwoWeeks = function (date) {
    vm.currentSchedule.dates = [];
    var prevTwoWeeks = moment(vm.payPeriodStart).subtract(14, 'days');
    vm.payPeriodStart = prevTwoWeeks;
    for (var i = 0; i < vm.scheduleDays.length; i++) {
      vm.currentSchedule.dates.push({ moment: moment(prevTwoWeeks._d).add(vm.scheduleDays[i], 'days'), shifts: [] });
    }
    vm.month = moment(prevTwoWeeks._d).format('MMMM');
    vm.year = moment(prevTwoWeeks._d).format('YYYY')
    vm.getShifts();
  };

  //function to get next two weeks of dates
  vm.nextTwoWeeks = function (date) {
    vm.currentSchedule.dates = [];
    var nextTwoWeeks = moment(vm.payPeriodStart).add(14, 'days');
    vm.payPeriodStart = nextTwoWeeks;
    for (var i = 0; i < vm.scheduleDays.length; i++) {
      vm.currentSchedule.dates.push({ moment: moment(nextTwoWeeks._d).add(vm.scheduleDays[i], 'days'), shifts: [] });

    }
    vm.month = moment(nextTwoWeeks._d).format('MMMM');
    vm.year = moment(nextTwoWeeks._d).format('YYYY');
    vm.getShifts();
  };

  
  vm.shiftDetails = function (event, shift) {
    ShiftService.shiftDetails(event, shift)
  };

  vm.addShift = function (event) {
    ShiftService.addShift(event)
  };

  vm.getShifts = function () {
    ShiftService.getShifts().then(function (response) {
      vm.shiftsToDisplay = response.data;
      console.log('shifts', vm.shiftsToDisplay);
      console.log('dates', vm.currentSchedule.dates);
      for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentSchedule.dates.length; j++) {
          if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentSchedule.dates[j].moment).format('YYYY-MM-DD')) {
            // console.log('true');
            vm.currentSchedule.dates[j].shifts.push(vm.shiftsToDisplay[i]);
          }
        }
      }
    });
  };

  vm.getShifts();

  //Where I left off: I'm trying to set things up in a way that will allow me to view all of the shift requests for a particular shift. So, the first thing I'm trying to do is match up all shift requests for the same shift. But I'm running into trouble with my for loop.

  vm.getPendingShifts = function () {
    ShiftService.getPendingShifts().then(function (response) {
      vm.pendingShifts = response.data;
      for (var i = 0; i < vm.pendingShifts.length; i++) {
        vm.pendingShifts[i].date = moment(vm.pendingShifts[i].date).format('M/D');
      }
      for (var i = 0; i < vm.pendingShifts.length; i++) {
        for (var j = i+1; j < vm.pendingShifts.length; j++) {
          if (vm.pendingShifts[i].shift_id == vm.pendingShifts[j].shift_id) {
            vm.pendingShifts.splice(j, 1);
            // vm.realPendingShifts.push(vm.pendingShifts[i]);
            console.log('matching shift', vm.pendingShifts[i].shift_id);
          }
        }
      }

      // for (var k=0; k<vm.pendingShifts.length; k++) {
      //   if (!checkShiftIds(vm.realPendingShifts, vm.pendingShifts[k].shift_id)) {
      //     vm.realPendingShifts.push(vm.pendingShifts[k]);
      //   }
      // }
      console.log(' pending shifts', vm.pendingShifts);

    })
  }

  function checkShiftIds(array, id) {
    var result = false;
    for (var i=0; i < array.length; i++) {
      if (array[i].shift_id == id) {
        console.log('true', array[i].shift_id)
        result = true;
      }
      return result;
    }
  }

  vm.getPendingShifts();

  vm.click = function (shift) {
    console.log('clicked');
    console.log(shift);
    // console.log('this', this)
    // console.log('this.date', this.currentSchedule.dates[index]);
  };

  //This is a pick-up shift dialog that WILL BE MOVED to the staff controller once the staff calendar is up and running.
  vm.showDetailsDialog = function (event, shift) {
    console.log('pick up shift button clicked');
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

  // IF there are two pending shifts that have the same date, display them in the same dialog box AND only show one button


  vm.confirmShift = function(event, shift) {
    $mdDialog.show({
      controller: 'SupervisorDialogController as sc',
      templateUrl: '/views/dialogs/confirmShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { pendingShift: shift },
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  }
});

