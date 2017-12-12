
myApp.controller('SupervisorController', function (UserService, ShiftService, AvailabilityService, $mdDialog) {
  console.log('SupervisorController created');
  var vm = this;
  vm.userService = UserService;
  vm.shiftService = ShiftService;
  vm.userObject = UserService.userObject;
  vm.shiftService = ShiftService;
  vm.shiftsToDisplay = [];



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

  //array for for the next schedules function dates
  vm.currentSchedule = {
    dates: []
  };

  //gets the two week schedule
  var scheduleDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
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
      vm.currentSchedule.dates.push({moment: moment().add(priorDays[i], 'days'), shifts: []});
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
      vm.currentSchedule.dates.push({ moment: moment(prevTwoWeeks._d).add(scheduleDays[i], 'days'), shifts: [] });
    }

    vm.month = moment(prevTwoWeeks._d).format('MMMM');
    vm.year = moment(prevTwoWeeks._d).format('YYYY')
    vm.getShifts();
  }

  //function to get next two weeks of dates
  vm.nextMonth = function (date) {
    vm.currentSchedule.dates = [];
    var nextTwoWeeks = moment(date).add(14, 'days');

    for (var i = 0; i < scheduleDays.length; i++) {
      vm.currentSchedule.dates.push({ moment: moment(nextTwoWeeks._d).add(scheduleDays[i], 'days'), shifts: [] });
    }
    vm.month = moment(nextTwoWeeks._d).format('MMMM');
    vm.year = moment(nextTwoWeeks._d).format('YYYY');
    vm.getShifts();
  }

  vm.shiftDetails = function (event) {
    ShiftService.shiftDetails(event)
  }

  vm.addShift = function (event) {
    ShiftService.addShift(event)
  }

  vm.showShift = false;
  vm.getShifts = function () {
    ShiftService.getShifts().then(function (response) {
      vm.shiftsToDisplay = response.data;
      console.log('shifts', vm.shiftsToDisplay);
      console.log('dates', vm.currentSchedule.dates);
      for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
        for (var j = 0; j < vm.currentSchedule.dates.length; j++) {
          if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentSchedule.dates[j].moment).format('YYYY-MM-DD')) {
            console.log('true');
            vm.currentSchedule.dates[j].shifts.push(vm.shiftsToDisplay[i]);
            //vm.showShift = true;
            // console.log('show', vm.showShift);
            //return vm.showShift;
          }
        }
      }
    })
  }



  vm.getShifts();

  vm.click = function (index) {
    console.log(index);
    console.log('this', this)
    console.log('this.date', this.currentSchedule.dates[index]);

  }

});

