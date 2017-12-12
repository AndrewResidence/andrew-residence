
myApp.controller('SupervisorController', function(UserService, ShiftService, AvailabilityService, $mdDialog) {
    console.log('SupervisorController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.shiftService = ShiftService;


    vm.today = moment();
    console.log(vm.today);

    vm.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
    
    vm.currentSchedule = {
      dates: []
    };
    var scheduleDays = [1, 2, 3, 4, 5, 6, 7]
    vm.nextWeek = function(scheduleDays) {
      for (let i = 0; i < scheduleDays.length; i++) {
        vm.currentSchedule.dates.push(moment().add(scheduleDays[i], 'days'));
      }
    }
    
    vm.nextWeek(scheduleDays);

    console.log((moment().day(4).format('dddd')));
    

  vm.shiftDetails = function (event) {
    ShiftService.shiftDetails(event)
  }

  vm.addShift = function (event) {
    ShiftService.addShift(event)
  }

  vm.getShifts = function () {
    ShiftService.getShifts().then(function (response){
      console.log('shifts')
    })
  }
  vm.getShifts();
});

