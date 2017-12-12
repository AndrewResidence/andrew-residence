
myApp.controller('SupervisorController', function(UserService, ShiftService, AvailabilityService, $mdDialog) {
    console.log('SupervisorController created');
    var vm = this;
    vm.userService = UserService;
    vm.shiftService = ShiftService;
    vm.userObject = UserService.userObject;

    vm.shiftDetails = function (event) {
      ShiftService.shiftDetails(event)
    }
  
    vm.addShift = function (event) {
      ShiftService.addShift(event)
    }

    vm.month = moment().format('MMMM');
    console.log(vm.month)
    vm.today = parseInt(moment().format('d'));
    console.log('today', vm.today);

    vm.currentSchedule = {
      dates: []
    };
  
    var scheduleDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    console.log((moment().day(4).format('d')));

    vm.nextSchedule = function(scheduleDays) {
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
      priorDays = scheduleDays.map(function(v) {
        return v - priorDaystoGet;
      })
      console.log('priorDays', priorDays)
      for (var i = 0; i < priorDays.length; i++) {
        vm.currentSchedule.dates.push(moment().add(priorDays[i], 'days'));
      }
    }
    vm.nextSchedule(scheduleDays);

    //function to pull prior two weeks of dates
    vm.prevMonth = function(date) {
      vm.currentSchedule.dates = [];
      var prevTwoWeeks = moment(date).subtract(14, 'days');
      console.log('previous two weeks', prevTwoWeeks._d)
      
      for (var i = 0; i < scheduleDays.length; i++) {
        console.log('in the for loop')
        vm.currentSchedule.dates.push(moment(prevTwoWeeks._d).add(scheduleDays[i], 'days'));
      }
      console.log('prev two weeks array', vm.currentSchedule.dates)
    }

    vm.nextMonth = function(date) {
      vm.currentSchedule.dates = [];
      console.log('next month clicked', date)
      var nextTwoWeeks = moment(date).add(14, 'days');
      console.log('next two weeks', nextTwoWeeks._d);

      for (var i = 0; i < scheduleDays.length; i++) {
        vm.currentSchedule.dates.push(moment(nextTwoWeeks._d).add(scheduleDays[i], 'days'));
      }
    }
  })


