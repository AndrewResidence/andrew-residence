
myApp.controller('SupervisorController', function(UserService, ShiftService, AvailabilityService, $mdDialog) {
    console.log('SupervisorController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;


    vm.today = moment();
    console.log(vm.today);

    vm.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    
    vm.currentSchedule = {
      dates: []
    };
    var scheduleDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    vm.nextSchedule = function(scheduleDays) {
      for (let i = 0; i < scheduleDays.length; i++) {
        vm.currentSchedule.dates.push(moment().add(scheduleDays[i], 'days'));
      }
    }
    console.log((moment().day(4).format('d')));
    
    vm.checkToday = function() {
      if (vm.today === 4) {
        for (let i = 0; i < scheduleDays.length; i++) {
          vm.currentSchedule.dates.push(moment().add(scheduleDays[i], 'days'));
        }
      }
      else if (vm.today < 4) {

      }
      else if (vm.today > 4) {
        
      }
    }
    
    })

myApp.controller('SupervisorController', function ($mdDialog, UserService, ShiftService, AvailabilityService) {
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
});

