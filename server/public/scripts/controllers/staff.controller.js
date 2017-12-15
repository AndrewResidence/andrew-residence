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
    console.log('year, month, days', currentYear, currentMonth, numDaysInCurrentMonth)
    vm.monthDays.dates = [];
    for (var i = 1; i <= numDaysInCurrentMonth; i++) {
      vm.monthDays.dates.push(i);
    }
    console.log('vm.monthDays.dates', vm.monthDays.dates)
    vm.getMonthDays(currentYear, currentMonth, vm.monthDays.dates);
  }

  //creates day object and pushes to array to get month days
  vm.dayInWeek = '';
  vm.getMonthDays = function (currentYear, currentMonth, monthDays) {
    vm.dayInWeek = '';
    console.log('get month days, current month and array', currentMonth, monthDays)
    for (var i = 1; i <= monthDays.length; i++) {
      eachDay = {
        day: moment().year(currentYear).month(currentMonth).date(i),
        dayNum: moment().date(i).format('D'),
        month: currentMonth,
        year: currentYear,
        shifts: []
      }
      vm.currentMonth.dates.push(eachDay);
    }
    console.log('getMonthDays vm.currentMonth.dates', vm.currentMonth.dates)
    var firstDayofMonth = moment(vm.currentMonth.dates[0].day._d).month();
    var currentYear = currentYear;
    vm.dayInWeek = moment(vm.currentMonth.dates[0].day._d).format('d')
    vm.checkFirstDayOfMonth(vm.dayInWeek, firstDayofMonth, currentYear);

    vm.displayMonth = moment(vm.currentMonth.dates[0]).format('MMMM');
    vm.displayYear = moment(vm.currentMonth.dates[0]).format('YYYY')
  }

  vm.checkFirstDayOfMonth = function (dayInWeek, firstDayofMonth, currentYear) {
    var dayInWeek = parseInt(dayInWeek)
    if (dayInWeek != 0) {
      console.log('in the if')
      for (var i = 1; i <= dayInWeek; i++) {
        eachDay = {
          extra: i,
          month: firstDayofMonth,
          year: currentYear
        }
        vm.currentMonth.dates.unshift(eachDay);
      }
      console.log('vm.currentMonth.dates', vm.currentMonth.dates);
    }
  }

  vm.getNumDaysInCurrentMonth();

  vm.prevMonth = function (currentDisplayMonth, currentYear) {
    vm.currentMonth.dates = [];
    console.log('currentDisplayMonth', currentDisplayMonth)
    console.log('currentyear', currentYear)
    if (currentDisplayMonth === 0) {
      vm.thisMonth = 11;
      vm.currentYear = currentYear - 1;
    }
    else {
      vm.thisMonth = currentDisplayMonth - 1;
    }
    vm.numDaysInCurrentMonth = moment().month(vm.thisMonth).daysInMonth();
    console.log('prev vm.currentMonth', vm.thisMonth)
    console.log('prev vm.numdaysincurrent month prev', vm.numDaysInCurrentMonth);
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth)
  }

  //function to get next two weeks of dates
  vm.nextMonth = function (currentDisplayMonth, currentYear) {
    console.log('next month clicked')
    vm.currentMonth.dates = [];
    console.log('cleared current month', vm.currentMonth.dates)
    console.log('currentMonth count', vm.currentMonth.dates.length)
    console.log('currentDisplayMonth', currentDisplayMonth)
    if (currentDisplayMonth === 11) {
      vm.thisMonth = 0
      vm.currentYear = currentYear + 1;
    }
    else {
      vm.thisMonth = currentDisplayMonth + 1;
    }
    vm.numDaysInCurrentMonth = moment().month(vm.thisMonth).daysInMonth();
    console.log('prev vm.currentMonth', vm.thisMonth)
    console.log('prev vm.numdaysincurrent month prev', vm.numDaysInCurrentMonth);
    vm.putDaysinCurrentMonthArray(vm.currentYear, vm.thisMonth, vm.numDaysInCurrentMonth)
    
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
