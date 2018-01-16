myApp.controller('StaffController', function (UserService, ShiftService, AvailabilityService, calendarService, $mdDialog) {
  console.log('StaffController created');
  var vm = this;
  vm.shiftService = ShiftService;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.displayMonth = '';
  vm.displayYear = '';
  vm.dayList = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  vm.today = moment();
  vm.thisMonth = moment(vm.today).month();
  vm.currentYear = moment(vm.today).year();
  vm.firstOfMonth = '';
  vm.lastOfMonth = '';
  vm.numDaysInCurrentMonth = '';
  vm.currentMonth = {
    dates: []
  };
  vm.currentSchedule = calendarService.currentSchedule.dates;
  vm.payPeriodStart = '';
  vm.payPeriodEnd = '';

  vm.getPayPeriodDates = function() {
    calendarService.getPayPeriodDates();
  }

  vm.getPayPeriodDates();
  //puts each day of the month in array
  vm.monthDays = {
    dates: []
  };

  vm.userShiftsToDisplay = [];
  vm.shiftsToDisplay = [];
  // vm.pendingShifts = [];

  vm.showDetailsDialog = function(event) {
    // console.log('pick up shift button clicked');
    $mdDialog.show({
      controller: 'StaffDialogController as sc',
      templateUrl: '/views/dialogs/pickUpShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  }

  //gets all shifts from the server for display on the staff calendar
  vm.getShifts = function (firstOfMonth, lastOfMonth) {
    ShiftService.getShifts(firstOfMonth, lastOfMonth).then(function (response) {
      vm.shiftsToDisplay = response.data;
      vm.getMyShifts(vm.firstOfMonth, vm.lastOfMonth);
      // console.log('dates', vm.currentSchedule.dates);
      for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentMonth.dates.length; j++) {
          if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentMonth.dates[j].day).format('YYYY-MM-DD')) {
            vm.currentMonth.dates[j].shifts.push(vm.shiftsToDisplay[i]);
          }
        }
      }
    }).catch(function(error){
      console.log('error in get shifts')
    })
  };

  //gets pending shifts
  vm.getPendingShifts = function () {
    ShiftService.getPendingShifts().then(function (response) {
      vm.pendingShifts = response.data;
      for (var i = 0; i < vm.pendingShifts.length; i++) {
        vm.pendingShifts[i].date = moment(vm.pendingShifts[i].date).format('l');
      }
    }).catch(function(error){
      console.log('error in get pending shifts')
    })
  };

  vm.getPendingShifts();

  //displays shift details when shift is clicked on from calendar view
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
  
  //gets number of days in month
  vm.getNumDaysInCurrentMonth = function () {
    vm.numDaysInCurrentMonth = moment(vm.today).daysInMonth();
    vm.firstOfMonth = moment().year(vm.currentYear).month(vm.thisMonth).date(1);
    vm.lastOfMonth = moment().year(vm.currentYear).month(vm.thisMonth).date(vm.numDaysInCurrentMonth);
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth);
    vm.getShifts(vm.firstOfMonth, vm.lastOfMonth);
  };

  //puts each day in to an array for the total number of days
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
    vm.dayInWeek = '';
    for (var i = 1; i <= monthDays.length; i++) {
      eachDay = {
        day: moment().year(currentYear).month(currentMonth).date(i),
        dayNum: moment().date(i).format('D'),
        month: currentMonth,
        monthText: moment().month(currentMonth),
        year: currentYear,
        shifts: [],
        usershifts: []
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

  //checks for the first day of the month and adds objects to push calendar start to align with day header
  vm.checkFirstDayOfMonth = function (dayInWeek, currentMonth, currentYear) {
    var dayInWeek = parseInt(dayInWeek);
    if (dayInWeek != 0) {
      for (var i = 1; i <= dayInWeek; i++) {
        eachDay = {
          day: '',
          extra: i,
          month: currentMonth,
          year: currentYear,
          dayNum: '.',
          shifts: [],
          usershifts: []
        };
        vm.currentMonth.dates.unshift(eachDay);
      }
    }
  };

  //starts process to get days for month
  vm.getNumDaysInCurrentMonth();

  //function to get previous month days and display for calendar
  vm.prevMonth = function (currentDisplayMonth, currentYear) {
    vm.currentMonth.dates = [];
    if (currentDisplayMonth === 0) {
      vm.thisMonth = 11;
      vm.currentYear = currentYear - 1;
    }
    else {
      vm.thisMonth = currentDisplayMonth - 1;
    }
    vm.firstOfMonth = moment().year(vm.currentYear).month(vm.thisMonth).date(1);
    vm.lastOfMonth = moment().year(vm.currentYear).month(vm.thisMonth).date(vm.numDaysInCurrentMonth);
    vm.numDaysInCurrentMonth = moment().year(vm.currentYear).month(vm.thisMonth).daysInMonth();
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth);
    vm.getShifts(vm.firstOfMonth, vm.lastOfMonth);
  }

  //function to get next month days and display for calendar
  vm.nextMonth = function (currentDisplayMonth, currentYear) {
    vm.currentMonth.dates = [];
    if (currentDisplayMonth === 11) {
      vm.thisMonth = 0
      vm.currentYear = currentYear + 1;
    }
    else {
      vm.thisMonth = currentDisplayMonth + 1;
    }
      vm.firstOfMonth = moment().year(vm.currentYear).month(vm.thisMonth).date(1);
      vm.lastOfMonth = moment().year(vm.currentYear).month(vm.thisMonth).date(vm.numDaysInCurrentMonth);
      vm.numDaysInCurrentMonth = moment().year(vm.currentYear).month(vm.thisMonth).daysInMonth();
      vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth)
      vm.getShifts(vm.firstOfMonth, vm.lastOfMonth);
  }

  //shift details pop up
  vm.showDetailsDialog = function (event) {
    $mdDialog.show({
      controller: 'StaffDialogController as sc',
      templateUrl: '/views/dialogs/pickUpShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    });
  };

  //pick up shift dialog function
  vm.shiftDetails = function (event, shift) {
    ShiftService.showPickUpShift(shift);
    $mdDialog.show({
        controller: 'StaffDialogController as sc',
        templateUrl: '/views/dialogs/pickUpShift.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        locals: { 
        shift: shift,
        firstOfMonth: vm.firstOfMonth, 
        lastOfMonth: vm.lastOfMonth
      },
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    });
  };

  //gets logged in user shifts for on-call staff
  vm.getMyShifts = function(firstOfMonth, lastOfMonth) {
    ShiftService.getMyShifts(firstOfMonth, lastOfMonth).then(function(response){
      vm.userShiftsToDisplay = response;
      for (var i = 0; i < vm.userShiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentMonth.dates.length; j++) {
          if (moment(vm.userShiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentMonth.dates[j].day).format('YYYY-MM-DD')) {
            vm.currentMonth.dates[j].usershifts.push(vm.userShiftsToDisplay[i]);
          }
        }
      }
    }).catch(function(error){
      console.log('error in get my shifts')
    })
  }

});
