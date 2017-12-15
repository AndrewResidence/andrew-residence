myApp.controller('StaffController', function (UserService, ShiftService, AvailabilityService) {
  console.log('StaffController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  vm.today = moment();
  vm.thisMonth = moment(vm.today).month();
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
    vm.putDaysinCurrentMonthArray(vm.thisMonth, vm.numDaysInCurrentMonth);
  }


  vm.putDaysinCurrentMonthArray = function (currentMonth, numDaysInCurrentMonth) {
    console.log(currentMonth, numDaysInCurrentMonth)
    vm.monthDays.dates = [];
    for (var i = 1; i <= numDaysInCurrentMonth; i++) {
      vm.monthDays.dates.push(i);
    }
    // console.log('vm.monthDays.dates', vm.monthDays.dates)
    vm.getMonthDays(currentMonth, vm.monthDays.dates);
  }

  //creates day object and pushes to array to get month days
  vm.dayInWeek = '';
  vm.getMonthDays = function (currentMonth, monthDays) {
    vm.dayInWeek = '';
    console.log('get month days, current month and array', currentMonth, monthDays)
    for (var i = 1; i <= monthDays.length; i++) {
      eachDay = {
        day: moment().month(currentMonth).date(i),
        dayNum: moment().date(i).format('D'),
        month: currentMonth,
        shifts: []
      }
      vm.currentMonth.dates.push(eachDay);
    }
    console.log('getMonthDays vm.currentMonth.dates', vm.currentMonth.dates)
    var firstDayofMonth = moment(vm.currentMonth.dates[0].day._d).month();
    vm.dayInWeek = moment(vm.currentMonth.dates[0].day._d).format('d')
    console.log('dayinweek', vm.dayInWeek)
    console.log('firstdayof month number', firstDayofMonth);
    vm.checkFirstDayOfMonth(vm.dayInWeek, firstDayofMonth);
  }

  vm.checkFirstDayOfMonth = function (dayInWeek, firstDayofMonth) {
    
    // var month = firstDayofMonth.month;
    var dayInWeek = parseInt(dayInWeek)
    // console.log('firstdayofmonth number and month', firstDayofMonthNum, month)
    if (dayInWeek != 0) {
      console.log('in the if')
      for (var i = 1; i <= dayInWeek; i++) {
        eachDay = {
          extra: i,
          month: firstDayofMonth
        }
        vm.currentMonth.dates.unshift(eachDay);
      }
      console.log('vm.currentMonth.dates', vm.currentMonth.dates);
    }
  }

  vm.getNumDaysInCurrentMonth();

  vm.prevMonth = function (currentDisplayMonth) {
    vm.currentMonth.dates = [];
    console.log('cleared current month', vm.currentMonth.dates)
    console.log('currentMonth count', vm.currentMonth.dates.length)
    console.log('currentDisplayMonth', currentDisplayMonth)
    if (currentDisplayMonth === 0) {
      vm.thisMonth = 11
    }
    else {
      vm.thisMonth = currentDisplayMonth - 1;
    }
    vm.numDaysInCurrentMonth = moment().month(vm.thisMonth).daysInMonth();
    console.log('prev vm.currentMonth', vm.thisMonth)
    console.log('prev vm.numdaysincurrent month prev', vm.numDaysInCurrentMonth);
    vm.putDaysinCurrentMonthArray(vm.thisMonth, vm.numDaysInCurrentMonth)
  }

  //function to get next two weeks of dates
  vm.nextMonth = function (date) {
    console.log('next month clicked')
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
