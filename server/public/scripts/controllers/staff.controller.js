myApp.controller('StaffController', function (UserService, ShiftService, calendarService, StaffCalendarService, $mdDialog) {
  // console.log('StaffController created');
  var vm = this;
  vm.shiftService = ShiftService;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.displayMonth = StaffCalendarService.displayMonth;
  vm.displayYear = StaffCalendarService.displayYear;
  vm.dayList = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  vm.thisMonth = StaffCalendarService.thisMonth;
  vm.currentYear = StaffCalendarService.currentYear;
  vm.firstOfMonth = StaffCalendarService.firstOfMonth;
  vm.lastOfMonth = StaffCalendarService.lastOfMonth;
  vm.currentMonth = StaffCalendarService.currentMonth;
  vm.currentSchedule = calendarService.currentSchedule.dates;
  vm.payPeriodStart = '';
  vm.payPeriodEnd = '';

  vm.getPayPeriodDates = function() {
    calendarService.getPayPeriodDates();
  }

  vm.getPayPeriodDates();
  vm.userShiftsToDisplay = [];
  vm.shiftsToDisplay = [];
  
  //gets all shifts from the server for display on the staff calendar
  vm.getShifts = function (firstOfMonth, lastOfMonth) {
    vm.shiftsToDisplay = [];
    ShiftService.getShifts(firstOfMonth, lastOfMonth).then(function (response) {
      vm.shiftsToDisplay = response.data;
      vm.getMyShifts(vm.firstOfMonth, vm.lastOfMonth);
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
    ShiftService.showPickUpShift(shift);
    $mdDialog.show({
      controller: 'StaffDialogController as sc',
      templateUrl: '/views/dialogs/pickUpShift.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { shift: shift, refreshFN: vm.refreshCalendar },
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    }); 
  };
  
  //gets number of days in month
  vm.getNumDaysInCurrentMonth = function () {
    StaffCalendarService.getNumDaysInCurrentMonth()//.then(function(response){
    vm.getShifts(vm.firstOfMonth, vm.lastOfMonth);
  };

  vm.refreshCalendar = function(shiftDate) {
    var currentYear = moment(shiftDate).year();
    var currentMonth = moment(shiftDate).month();
    var numDaysInCurrentMonth = moment(shiftDate).daysInMonth();
    var firstOfMonth = moment().year(currentYear).month(currentMonth).day(1);
    var lastOfMonth = moment().year(currentYear).month(currentMonth).day(numDaysInCurrentMonth);
    vm.shiftsToDisplay = [];
    vm.currentMonth.dates = [];
    vm.getNumDaysInCurrentMonth();
    ShiftService.getShifts(firstOfMonth, lastOfMonth);
    for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
      for (var j = 0; j < vm.currentMonth.dates.length; j++) {
        if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentMonth.dates[j].day).format('YYYY-MM-DD')) {
          vm.currentMonth.dates[j].shifts.push(vm.shiftsToDisplay[i]);
        }
      }
    }
  }

  //starts process to get days for month
  vm.getNumDaysInCurrentMonth();

  //function to get previous month days and display for calendar
  vm.prevMonth = function (currentDisplayMonth, currentYear) {
    // vm.currentMonth = [];

    // console.log('controller month and year', currentDisplayMonth, currentYear)
    StaffCalendarService.prevMonth(currentDisplayMonth, currentYear);
    vm.getShifts(vm.firstOfMonth, vm.lastOfMonth);
  }

  //function to get next month days and display for calendar
  vm.nextMonth = function (currentDisplayMonth, currentYear) {
    StaffCalendarService.nextMonth(currentDisplayMonth, currentYear)
      vm.getShifts(vm.firstOfMonth, vm.lastOfMonth);
  }

  //gets logged in user shifts for on-call staff
  vm.getMyShifts = function(firstOfMonth, lastOfMonth) {
    ShiftService.getMyShifts(firstOfMonth, lastOfMonth).then(function(response){
      vm.userShiftsToDisplay = response;
      // console.log('user shifts', vm.userShiftsToDisplay);
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
