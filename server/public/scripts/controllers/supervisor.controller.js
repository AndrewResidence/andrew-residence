
myApp.controller('SupervisorController', function (UserService, ShiftService, AvailabilityService, $mdDialog) {
  console.log('SupervisorController created');
  var vm = this;
  vm.userService = UserService;
  vm.shiftService = ShiftService;
  vm.userObject = UserService.userObject;
  vm.shiftService = ShiftService;

  vm.shiftDetails = function (event) {
    ShiftService.shiftDetails(event)
  }

  vm.addShift = function (event) {
    ShiftService.addShift(event)
  }

  //used for assigning month/day in the calendar header
  vm.month = '';
  vm.year = '';
  vm.todayToday = moment();
  var scheduleDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  
  //pay period
  vm.payPeriodStart = moment('2017-11-30');
  // vm.payPeriodEnd = moment('2017-12-13');
  vm.currentPayPeriodArray = {
    dates: []
  }

  vm.currentPayPeriod = function(scheduleDays) {
    console.log('vm.payPeriodStart', vm.payPeriodStart._d);
    for (var i = 0; i < scheduleDays.length; i++) {
      vm.currentPayPeriodArray.dates.push(moment(vm.payPeriodStart._d).add(scheduleDays[i], 'days').format('MM-DD-YYYY'));
    }
    console.log('vm.currentPayPeriodArray.dates', vm.currentPayPeriodArray.dates)
    vm.findDayInCycle(vm.currentPayPeriodArray.dates);
  }

  vm.findDayInCycle = function(arrayofDates) {
    var dayInCycle;
    var dayToReview = moment(vm.todayToday).format('MM-DD-YYYY')
    console.log('vm.todayToday', dayToReview);
    for (var i = 0; i < arrayofDates.length; i++) {
      console.log(arrayofDates[i]);
      if (arrayofDates[i] == dayToReview) {
        dayInCycle = i;
      }
    }
    console.log('dayInCycle', dayInCycle);
  }

  vm.currentPayPeriod(scheduleDays);

  //array for for the next schedules function dates
  vm.currentSchedule = {
    dates: []
  };

  //gets the two week schedule
  //var scheduleDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  vm.today = parseInt(moment().format('d'));
  vm.nextSchedule = function (scheduleDays) {
    var priorDaystoGet;
    var priorDays = [];

    switch (vm.today) {
      case 0:
        priorDaystoGet = 3;
        break;
      case 1:
        priorDaystoGet = 4;
        break;
      case 2:
        priorDaystoGet = 5;
        break;
      case 3:
        priorDaystoGet = 6;
        break;
      case 4:
        priorDaystoGet = 0;
        break;
      case 5:
        priorDaystoGet = 1;
        break;
      case 6:
        priorDaystoGet = 2;
        break;
      default: console.log('boo')
        break;
    }
    priorDays = scheduleDays.map(function (v) {
      return v - priorDaystoGet;
    })

    for (var i = 0; i < priorDays.length; i++) {
      vm.currentSchedule.dates.push(moment().add(priorDays[i], 'days'));
    }

    vm.month = moment(vm.todayToday).format('MMMM');
    vm.year = moment(vm.todayToday).format('YYYY');
  }

  //functionc all to get schedule on page load
  vm.nextSchedule(scheduleDays);

  //function to pull prior two weeks of dates
  vm.prevMonth = function (date) {
    vm.currentSchedule.dates = [];
    var prevTwoWeeks = moment(date).subtract(14, 'days');

    for (var i = 0; i < scheduleDays.length; i++) {
      vm.currentSchedule.dates.push(moment(prevTwoWeeks._d).add(scheduleDays[i], 'days'));
    }

    vm.month = moment(prevTwoWeeks._d).format('MMMM');
    vm.year = moment(prevTwoWeeks._d).format('YYYY')
  }

  //function to get next two weeks of dates
  vm.nextMonth = function (date) {
    vm.currentSchedule.dates = [];
    var nextTwoWeeks = moment(date).add(14, 'days');

    for (var i = 0; i < scheduleDays.length; i++) {
      vm.currentSchedule.dates.push(moment(nextTwoWeeks._d).add(scheduleDays[i], 'days'));
    }
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

