myApp.controller('StaffController', function($mdDialog, UserService, ShiftService, AvailabilityService) {
    console.log('StaffController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

  vm.dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  vm.today = moment();
  vm.currentMonth = moment(vm.today).month();
  console.log('currentMonth', vm.currentMonth)
  vm.daysinCurrentMonth = moment(vm.today).daysInMonth();
  console.log('daysinCurrentMonth', vm.daysinCurrentMonth)

  vm.currentMonthArray = [];
  vm.putDaysinCurrentMonthArray = function(daysinCurrentMonth) {
    for (var i = 1; i <= daysinCurrentMonth; i++) {
      vm.currentMonthArray.push(i);
    }
    console.log('currentMonthArray', vm.currentMonthArray)
  }
  vm.putDaysinCurrentMonthArray(vm.daysinCurrentMonth);

  vm.monthDaysArray = [];
  vm.getMonthDays = function(currentMonthArray) {
    for (var i = 1; i <= currentMonthArray.length; i++) {
      eachDay = {
        day: moment().date(i),
        dayInWeek: moment().date(i).format('d'),
        dayNum: moment().date(i).format('D'),
        shifts: []
      }
      vm.monthDaysArray.push(eachDay);
    }
  }

  vm.checkFirstDayOfMonth = function(array) {
    var firstDayOfMonth = array[0].dayInWeek;
    console.log('firstdayofMonth', firstDayOfMonth)
    for(var i = 1; i <= firstDayOfMonth; i++) {
      eachDay = {
        day: 0
      }
      vm.monthDaysArray.unshift(eachDay);
    }
  }

  vm.getMonthDays(vm.currentMonthArray);
  console.log('vm.monthDaysArray', vm.monthDaysArray);

  vm.checkFirstDayOfMonth(vm.monthDaysArray);

  //function to pull prior two weeks of dates
  vm.prevMonth = function (date) {
    vm.month = moment(prevTwoWeeks._d).format('MMMM');
    vm.year = moment(prevTwoWeeks._d).format('YYYY')
  }

  //function to get next two weeks of dates
  vm.nextMonth = function (date) {
    vm.month = moment(nextTwoWeeks._d).format('MMMM');
    vm.year = moment(nextTwoWeeks._d).format('YYYY');
  }

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

  vm.getShifts = function () {
    ShiftService.getShifts().then(function (response) {
      console.log('shifts')
    })
  }

  vm.getShifts();



  });
  