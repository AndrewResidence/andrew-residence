
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

    vm.today = moment().format('d');

    console.log('today', vm.today);

    vm.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    
    vm.currentSchedule = {
      dates: []
    };
  
    var scheduleDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    vm.nextSchedule = function(scheduleDays) {
      for (let i = 0; i < scheduleDays.length; i++) {
        vm.currentSchedule.dates.push(moment().add(scheduleDays[i], 'days'));
      }
    }
    console.log((moment().day(4).format('d')));
    
    vm.nextSchedule(scheduleDays);

    vm.checkToday = function() {
      if (vm.today === 4) {
        for (let i = 0; i < scheduleDays.length; i++) {
          vm.currentSchedule.dates.push(moment().add(scheduleDays[i], 'days'));
        }
      }
      else if (vm.today < 4) {
        var priorDaystoGet = 5 - vm.today
        console.log('priorDaystoGet', priorDaystoGet);

      }
      else if (vm.today > 4) {
        
      }
    }

    vm.checkToday();
    
  })


