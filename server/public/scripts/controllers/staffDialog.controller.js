//, firstOfMonth, lastOfMonth
myApp.controller('StaffDialogController', function ($mdToast, $mdDialog, UserService, ShiftService, AvailabilityService, StaffCalendarService, shift) {
  console.log('StaffDialogController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.shiftService = ShiftService;
  vm.edit = false;
  vm.shift = {
    user: vm.userService.userObject.userId,
    id: shift.shift_id,
    date: moment(shift.date),
    shift: shift.shift,
    shift_comments: shift.shift_comments,
    adl: shift.adl,
    mhw: shift.mhw,
    nurse: shift.nurse,
    shift_status: shift.shift_status,
    floor: shift.floor
  };

  // vm.userShiftsToDisplay = ShiftService.userShiftsToDisplay;
  vm.shiftsToDisplay = ShiftService.shiftsToDisplay.data;
  // vm.currentMonth = StaffCalendarService.currentMonth;
  // vm.firstOfMonth = firstOfMonth;
  // vm.lastOfMonth = lastOfMonth;
  
  
  vm.titleDate = moment(vm.shift.date);//where's this going?
  vm.showShiftComment = function(shift) {
    if (shift.shift_comments) {
      return true;
    }
    return false;
  }
  vm.showPickUpButton = ShiftService.showPickUpButton;
  console.log('userObject', vm.userService.userObject);
  vm.adl = false;
  vm.mhw = false;
  vm.nurse = false;
  vm.role = function () {
    if (shift.adl) {
      vm.adl = true;
    }
    if (shift.mhw) {
      vm.mhw = true;
    }
    if (shift.nurse) {
      vm.nurse = true;
    }
  };

  vm.role();

  vm.pickUpShift = function (shift) {
    console.log('shift being picked up', shift.date)
    var shiftDate = shift.date;
    var currentYear = moment(shiftDate).year();
    var currentMonth = moment(shiftDate).month();
    var numDaysInCurrentMonth = moment(shift.date).daysInMonth();
    var firstOfMonth = moment().year(currentYear).month(currentMonth).day(1);
    var lastOfMonth = moment().year(currentYear).month(currentMonth).day(numDaysInCurrentMonth);
    console.log('dates details', shiftDate, currentYear, currentMonth, numDaysInCurrentMonth)
    vm.shiftService.pickUpShift(shift).then(function (response) {
      StaffCalendarService.putDaysinCurrentMonthArray(currentYear, currentMonth, numDaysInCurrentMonth);
      ShiftService.getShifts(firstOfMonth, lastOfMonth);
      for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentMonth.dates.length; j++) {
          if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentMonth.dates[j].day).format('YYYY-MM-DD')) {
            vm.currentMonth.dates[j].shifts.push(vm.shiftsToDisplay[i]);
          }
        }
      }
      console.log('current month dates in staff dialog', vm.currentMonth.dates)
      $mdDialog.hide();
      console.log('response', response);
      $mdToast.show(
        $mdToast.simple()
          .textContent('You\'ve signed up for a shift. Shift is pending until confirmed.')
          .hideDelay(2500)
      );
    }).catch(function(error){
      console.log('error in pick up shift')
    })
  };


  //closes dialog box
  vm.cancel = function () {
    $mdDialog.hide();
  }; //end close dialog
});
