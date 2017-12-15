myApp.controller('StaffController', function (UserService, ShiftService, AvailabilityService) {
  console.log('StaffController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.displayMonth = '';
  vm.displayYear = '';
  vm.dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  vm.today = moment();
  vm.thisMonth = moment(vm.today).month();
  vm.currentYear = moment(vm.today).year();
  vm.numDaysInCurrentMonth = '';
  vm.currentMonth = {
    dates: []
  }

  //puts each day of the month in array
  vm.monthDays = {
    dates: []
  }

  vm.getNumDaysInCurrentMonth = function() {
    vm.numDaysInCurrentMonth = moment(vm.today).daysInMonth();
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth);
  }


  vm.putDaysinCurrentMonthArray = function (currentYear, currentMonth, numDaysInCurrentMonth) {
    vm.monthDays.dates = [];
    for (var i = 1; i <= numDaysInCurrentMonth; i++) {
      vm.monthDays.dates.push(i);
    }
    vm.getMonthDays(currentYear, currentMonth, vm.monthDays.dates);
  }

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
        shifts: []
      }
      vm.currentMonth.dates.push(eachDay);
    }
    var firstDayofMonth = moment(vm.currentMonth.dates[0].day._d).month();
    var currentYear = currentYear;
    vm.dayInWeek = moment(vm.currentMonth.dates[0].day._d).format('d')
    vm.checkFirstDayOfMonth(vm.dayInWeek, firstDayofMonth, currentYear);
    vm.displayMonth = moment(vm.currentMonth.dates[1]);
    vm.displayYear = moment(vm.currentMonth.dates[0]);
    console.log(vm.displayMonth, vm.displayYear)
    console.log(vm.currentMonth.dates);
  }

  vm.checkFirstDayOfMonth = function (dayInWeek, firstDayofMonth, currentYear) {
    var dayInWeek = parseInt(dayInWeek)
    if (dayInWeek != 0) {
      for (var i = 1; i <= dayInWeek; i++) {
        eachDay = {
          extra: i,
          month: firstDayofMonth,
          year: currentYear,
          dayNum: '_'
        }
        vm.currentMonth.dates.unshift(eachDay); 
      }
    }
  }

  vm.getNumDaysInCurrentMonth();

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
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth)
  }

  //function to get next two weeks of dates
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

});
