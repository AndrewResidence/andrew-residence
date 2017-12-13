myApp.controller('StaffController', function(UserService, ShiftService, AvailabilityService) {
    console.log('StaffController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

  vm.today = moment();
  console.log('today', vm.today);  
  vm.currentMonth = moment(vm.today).month();
  console.log('currentMonth', vm.currentMonth)
  vm.currentWeekinMonth = moment(vm.today).week();
  console.log('currentWeekinMonth', vm.currentWeekinMonth)
  vm.weeksInYear = moment(vm.today).weeksInYear();
  console.log('weeksInYear', vm.weeksInYear);
  vm.daysinCurrentMonth = moment(vm.today).daysInMonth();
  console.log('daysinCurrentMonth', vm.daysinCurrentMonth)

  vm.currentMonthArray = [];
  vm.putDaysinCurrentMonthArray = function(daysinCurrentMonth) {
    for (var i = 1; i <= daysinCurrentMonth; i++) {
      vm.currentMonthArray.push({day: i});
    }
    console.log('currentMonthArray', vm.currentMonthArray)
  }
  vm.putDaysinCurrentMonthArray(vm.daysinCurrentMonth);

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

  // vm.shiftDetails = function (event) {
  //   ShiftService.shiftDetails(event)
  // }

  // vm.addShift = function (event) {
  //   ShiftService.addShift(event)
  // }

  // vm.getShifts = function () {
  //   ShiftService.getShifts().then(function (response) {
  //     console.log('shifts')
  //   })
  // }

  // vm.getShifts();

  });
  