
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

  vm.updatePayPeriodDates = function() {
    ShiftService.updatePayPeriodDates().then(function(response){
      console.log(response)
    })
  }
  //used for assigning month/day in the calendar header
  vm.month = '';
  vm.year = '';
  vm.todayToday = moment();
  vm.dayInCycle = '';
  vm.scheduleDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  vm.payPeriodStartAndEnd = [];
  vm.currentSchedule = {
    dates: []
  };
  console.log('vm.payperiodstartandend', vm.payPeriodStartAndEnd)
  
  //pay period
  vm.payPeriodStart = '';
  vm.payPeriodEnd = '';
  vm.currentPayPeriodArray = {
    dates: []
  }

  vm.getPayPeriodDates = function() {
    ShiftService.getPayPeriodDates().then(function(response){
      vm.payPeriodStartAndEnd = response;
      vm.payPeriodStart = vm.payPeriodStartAndEnd[0].start;
      vm.payPeriodEnd = vm.payPeriodStartAndEnd[0].end;
      console.log('start and end', vm.payPeriodStart, vm.payPeriodEnd)
      if (moment(vm.todayToday).format('MM-DD-YYYY') > moment(vm.payPeriodStart).format('MM-DD-YYYY') 
        && moment(vm.todayToday).format('MM-DD-YYYY') < moment(vm.payPeriodEnd).format('MM-DD-YYYY')) {
        vm.currentPayPeriod(vm.scheduleDays);
      } else if (moment(vm.todayToday).format('MM-DD-YYYY') > moment(vm.payPeriodEnd).format('MM-DD-YYYY')) {
        //do an update to adjust start and end
        vm.updatePayPeriodDates();
        vm.getPayPeriodDates();
        console.log('today is greater than start date')
      }
    })
  }
  vm.getPayPeriodDates();
  //gets the current pay period days for two weeks
  vm.currentPayPeriod = function(scheduleDays) {
      for (var i = 0; i < scheduleDays.length; i++) {
        vm.currentPayPeriodArray.dates.push(moment(vm.payPeriodStart).add(scheduleDays[i], 'days'));
        //vm.currentSchedule.dates.push({ moment: moment(nextTwoWeeks._d).add(scheduleDays[i], 'days'), shifts: [] });
      }
    vm.currentSchedule.dates = vm.currentPayPeriodArray.dates;
    vm.month = moment(vm.payPeriodStart).format('MMMM');
    vm.year = moment(vm.payPeriodStart).format('YYYY');
    // vm.findDayInCycle(vm.currentPayPeriodArray.dates);
    console.log('vm.currentPayPeriodArray.dates', vm.currentPayPeriodArray.dates)
  }

  // vm.findDayInCycle = function(arrayofDates) {
  //   var dayToReview = moment(vm.todayToday).format('MM-DD-YYYY');
  //   console.log('vm.todayToday', dayToReview);
  //   for (var i = 0; i < arrayofDates.length; i++) {
  //     if (moment(arrayofDates[i]._d).format('MM-DD-YYYY') == dayToReview) {
  //       vm.dayInCycle = i;
  //     }
  //   }
  //   console.log('dayInCycle', vm.dayInCycle);
  // }

  //function to pull prior two weeks of dates
  vm.prevTwoWeeks = function (date) {
    vm.currentSchedule.dates = [];
    var prevTwoWeeks = moment(vm.payPeriodStart).subtract(14, 'days');
    vm.payPeriodStart = prevTwoWeeks;
    for (var i = 0; i < vm.scheduleDays.length; i++) {
      vm.currentSchedule.dates.push(moment(prevTwoWeeks._d).add(vm.scheduleDays[i], 'days'));
    }
    vm.month = moment(prevTwoWeeks._d).format('MMMM');
    vm.year = moment(prevTwoWeeks._d).format('YYYY')
  }

  //function to get next two weeks of dates
  vm.nextTwoMonths = function (date) {
    vm.currentSchedule.dates = [];
    var nextTwoWeeks = moment(vm.payPeriodStart).add(14, 'days');
    vm.payPeriodStart = nextTwoWeeks;
    for (var i = 0; i < vm.scheduleDays.length; i++) {
      vm.currentSchedule.dates.push(moment(nextTwoWeeks._d).add(vm.scheduleDays[i], 'days'));
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

