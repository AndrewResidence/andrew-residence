myApp.controller('StaffController', function (UserService, ShiftService, AvailabilityService, $mdDialog) {
  console.log('StaffController created');
  var vm = this;
  
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.displayMonth = '';
  vm.displayYear = '';
  vm.dayList = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  vm.today = moment();
  vm.thisMonth = moment(vm.today).month();
  vm.currentYear = moment(vm.today).year();
  vm.numDaysInCurrentMonth = '';
  vm.currentMonth = {
    dates: []
  };

  //puts each day of the month in array
  vm.monthDays = {
    dates: []
  };

  vm.shiftsToDisplay = [];
  vm.pendingShifts = [];

  vm.showDetailsDialog = function(event) {
    console.log('pick up shift button clicked');
    $mdDialog.show({
      controller: 'StaffDialogController as sc',
      templateUrl: '/views/dialogs/pickUpShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  }

  //gets all shifts
  vm.getShifts = function () {
    // vm.shiftsToDisplay = [];
    ShiftService.getShifts().then(function (response) {
      vm.shiftsToDisplay = response.data;
      console.log('shifts', vm.shiftsToDisplay);
      // console.log('dates', vm.currentSchedule.dates);
      for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentMonth.dates.length; j++) {
          if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentMonth.dates[j].day).format('YYYY-MM-DD')) {
            // console.log('true');
            vm.currentMonth.dates[j].shifts.push(vm.shiftsToDisplay[i]);
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
  };


  vm.shiftDetails = function (event, shift) {
    $mdDialog.show({
      controller: 'StaffDialogController as sc',
      templateUrl: '/views/dialogs/pickUpShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { shift: shift },
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  };
  
  
  
  //gets number of days in month to display
  vm.getNumDaysInCurrentMonth = function () {
    vm.numDaysInCurrentMonth = moment(vm.today).daysInMonth();
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth);
  };

  //puts number of days in to array
  vm.putDaysinCurrentMonthArray = function (currentYear, currentMonth, numDaysInCurrentMonth) {
    vm.monthDays.dates = [];
    for (var i = 1; i <= numDaysInCurrentMonth; i++) {
      vm.monthDays.dates.push(i);
    }
    vm.getMonthDays(currentYear, currentMonth, vm.monthDays.dates);
  };

  //creates day object and pushes to array to get month days
  vm.dayInWeek = '';
  vm.getMonthDays = function (currentYear, currentMonth, monthDays) {
    console.log('currentMonth', currentMonth);
    vm.dayInWeek = '';
    for (var i = 1; i <= monthDays.length; i++) {
      eachDay = {
        day: moment().year(currentYear).month(currentMonth).date(i),
        dayNum: moment().date(i).format('D'),
        month: currentMonth,
        monthText: moment().month(currentMonth),
        year: currentYear,
        shifts: []
      }
      vm.currentMonth.dates.push(eachDay);
    }
    var firstDayofMonth = moment(vm.currentMonth.dates[0].day._d).month();
    var currentYear = currentYear;
    vm.dayInWeek = moment(vm.currentMonth.dates[0].day._d).format('d')
    vm.checkFirstDayOfMonth(vm.dayInWeek, firstDayofMonth, currentYear);
    vm.displayMonth = moment().month(currentMonth).format('MMMM');
    vm.displayYear = moment(vm.currentMonth.dates[0]);
  };

  //checks for the first day of the month and adds objects to push calendar start
  vm.checkFirstDayOfMonth = function (dayInWeek, currentMonth, currentYear) {
    var dayInWeek = parseInt(dayInWeek);
    // console.log('firstDayofMonth', firstDayofMonth)
    if (dayInWeek != 0) {
      for (var i = 1; i <= dayInWeek; i++) {
        eachDay = {
          day: '',
          extra: i,
          month: currentMonth,
          year: currentYear,
          dayNum: '.',
          shifts: []
        };
        vm.currentMonth.dates.unshift(eachDay);
      }
    }
    console.log('dates', vm.currentMonth.dates)
  };

  vm.getNumDaysInCurrentMonth();

  //function to get previous month
  vm.prevMonth = function (currentDisplayMonth, currentYear) {
    vm.currentMonth.dates = [];
    if (currentDisplayMonth === 0) {
      vm.thisMonth = 11;
      vm.currentYear = currentYear - 1;
      console.log('year, month', vm.currentYear, vm.thisMonth)
    }
    else {
      vm.thisMonth = currentDisplayMonth - 1;
      console.log('year, month', vm.currentYear, vm.thisMonth)
    }
    vm.numDaysInCurrentMonth = moment().year(vm.currentYear).month(vm.thisMonth).daysInMonth();
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth);
    vm.getShifts();
  }

  //function to get next month
  vm.nextMonth = function (currentDisplayMonth, currentYear) {
    vm.currentMonth.dates = [];
    if (currentDisplayMonth === 11) {
      vm.thisMonth = 0
      vm.currentYear = currentYear + 1;
      console.log('year, month', vm.currentYear, vm.thisMonth)
    }
    else {
      vm.thisMonth = currentDisplayMonth + 1;
      console.log('year, month', vm.currentYear, vm.thisMonth)
    }
    vm.numDaysInCurrentMonth = moment().year(vm.currentYear).month(vm.thisMonth).daysInMonth();
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth)
    vm.getShifts();
  }

  //shift details pop up
  // vm.showDetailsDialog = function(event) {
  //   console.log('pick up shift button clicked');
  //   $mdDialog.show({
  //     controller: 'StaffDialogController as sc',
  //     templateUrl: '/views/dialogs/pickUpShift.html',
  //     parent: angular.element(document.body),
  //     targetEvent: event,
  //     clickOutsideToClose: true,
  //     fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
  //   })
  // }

  // //gets all shifts
// };

  //shift details pop up
  vm.showDetailsDialog = function (event) {
    console.log('pick up shift button clicked');
    $mdDialog.show({
      controller: 'StaffDialogController as sc',
      templateUrl: '/views/dialogs/pickUpShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    });
  };

  //gets all shifts
  // vm.getShifts = function () {
  //   ShiftService.getShifts().then(function (response) {
  //     vm.shiftsToDisplay = response.data;
  //     console.log('shifts', vm.shiftsToDisplay);
  //     // console.log('dates', vm.currentSchedule.dates);
  //     for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
  //       for (var j = 0; j < vm.currentMonth.dates.length; j++) {
  //         if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentMonth.dates[j].day).format('YYYY-MM-DD')) {
  //           // console.log('true');
  //           vm.currentMonth.dates[j].shifts.push(vm.shiftsToDisplay[i]);
  //         }
  //       }
  //     }
  //   });
  // };

  // vm.getShifts();

  // vm.getPendingShifts = function () {
  //   ShiftService.getPendingShifts().then(function (response) {
  //     vm.pendingShifts = response.data;
  //     for (var i = 0; i < vm.pendingShifts.length; i++) {
  //       vm.pendingShifts[i].date = moment(vm.pendingShifts[i].date).format('l');
  //     }
  //     console.log(' pending shifts', vm.pendingShifts);
  //   });
  // };

  // vm.getPendingShifts();

  vm.click = function (shift) {
    console.log('clicked');
    console.log(shift);
  };


  vm.shiftDetails = function (event, shift) {
    $mdDialog.show({
      controller: 'StaffDialogController as sc',
      templateUrl: '/views/dialogs/pickUpShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { shift: shift },
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    });
  };

  vm.getMyShifts = function() {
    ShiftService.getMyShifts();
  }
  // vm.showDetailsDialog = function(event) {
  //   console.log('pick up shift button clicked');
  //   $mdDialog.show({
  //     controller: 'StaffDialogController as sc',
  //     templateUrl: '/views/dialogs/pickUpShift.html',
  //     parent: angular.element(document.body),
  //     targetEvent: event,
  //     clickOutsideToClose: true,
  //     fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
  //   })
  // }

  // //gets all shifts
  // vm.getShifts = function () {
  //   ShiftService.getShifts().then(function (response) {
  //     vm.shiftsToDisplay = response.data;
  //     console.log('shifts', vm.shiftsToDisplay);
  //     // console.log('dates', vm.currentSchedule.dates);
  //     for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
  //       for (var j = 0; j < vm.currentMonth.dates.length; j++) {
  //         if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentMonth.dates[j].day).format('YYYY-MM-DD')) {
  //           // console.log('true');
  //           vm.currentMonth.dates[j].shifts.push(vm.shiftsToDisplay[i]);
  //         }
  //       }
  //     }
  //   });
  // };

  // vm.getShifts();

  // vm.getPendingShifts = function () {
  //   ShiftService.getPendingShifts().then(function (response) {
  //     vm.pendingShifts = response.data;
  //     for (var i = 0; i < vm.pendingShifts.length; i++) {
  //       vm.pendingShifts[i].date = moment(vm.pendingShifts[i].date).format('l');
  //     }
  //     console.log(' pending shifts', vm.pendingShifts);
  //   })
  // }

  // vm.getPendingShifts();

  // vm.click = function (shift) {
  //   console.log('clicked');
  //   console.log(shift);
  // };


  // vm.shiftDetails = function (event, shift) {
  //   $mdDialog.show({
  //     controller: 'StaffDialogController as sc',
  //     templateUrl: '/views/dialogs/pickUpShift.html',
  //     parent: angular.element(document.body),
  //     targetEvent: event,
  //     clickOutsideToClose: true,
  //     locals: { shift: shift },
  //     fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
  //   })
  // };

});
