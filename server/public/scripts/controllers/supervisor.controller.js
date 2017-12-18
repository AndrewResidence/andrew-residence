myApp.controller('SupervisorController', function (UserService, ShiftService, AvailabilityService, $mdDialog, calendarService) {
  console.log('SupervisorController created');
  var vm = this;
  vm.userService = UserService;
  vm.shiftService = ShiftService;
  vm.userObject = UserService.userObject;
  vm.shiftService = ShiftService;
  vm.shiftsToDisplay = [];
  vm.pendingShifts = [];

  vm.shiftDetails = function (event, shift) {
    ShiftService.shiftDetails(event, shift)
  }
  vm.addShift = function (event) {
    ShiftService.addShift(event)
  }

  vm.updatePayPeriodDates = function () {
    calendarService.updatePayPeriodDates().then(function (response) {
      console.log(response)
    });
  };
  // //used for assigning month/day in the calendar header
  vm.month = calendarService.month;
  vm.year = calendarService.year;
  vm.today = moment();
  vm.dayList = calendarService.supervisorDayList;
  vm.scheduleDays = calendarService.scheduleDays;
  vm.payPeriodStartAndEnd = calendarService.payPeriodStartAndEnd;
  vm.currentSchedule = calendarService.currentSchedule.dates;
  vm.payPeriodStart = '';
  vm.payPeriodEnd = '';

  //funciton to get the data for the calendar
  vm.getPayPeriodDates = function () {
    vm.month = moment(vm.today).format('MMMM');
    vm.year = moment(vm.today).format('YYYY');
    calendarService.getPayPeriodDates();
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
    var prevTwoWeeks = moment(date).subtract(14, 'days');
    vm.payPeriodStart = prevTwoWeeks;
    for (var i = 0; i < vm.scheduleDays.length; i++) {
      vm.currentSchedule.push({ moment: moment(prevTwoWeeks._d).add(vm.scheduleDays[i], 'days'), shifts: [] });
    }
    vm.month = moment(prevTwoWeeks._d).format('MMMM');
    vm.year = moment(prevTwoWeeks._d).format('YYYY')
    vm.getShifts();
  };

  //function to get next two weeks of dates
  vm.nextTwoWeeks = function (date) {
    vm.currentSchedule= [];
    var nextTwoWeeks = moment(date).add(14, 'days');
    vm.payPeriodStart = nextTwoWeeks;
    for (var i = 0; i < vm.scheduleDays.length; i++) {
      vm.currentSchedule.push({ moment: moment(nextTwoWeeks._d).add(vm.scheduleDays[i], 'days'), shifts: [] });

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
      // console.log('shifts', vm.shiftsToDisplay);
      // console.log('dates', vm.currentSchedule);
      for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentSchedule.length; j++) {
          if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentSchedule[j].moment).format('YYYY-MM-DD')) {
            // console.log('true');
            vm.currentSchedule[j].shifts.push(vm.shiftsToDisplay[i]);
          }
        }
      }
    });
  };

  vm.getShifts();

  vm.getPendingShifts = function () {
    ShiftService.getPendingShifts().then(function (response) {
      vm.pendingShifts = response.data;
      for (var i = 0; i < vm.pendingShifts.length; i++) {
        vm.pendingShifts[i].date = moment(vm.pendingShifts[i].date).format('l');
      }
      console.log(' pending shifts', vm.pendingShifts);
    })
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
});

