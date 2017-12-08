myApp.controller('SupervisorController', function(UserService, ShiftService, AvailabilityService) {
    console.log('SupervisorController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
  });
  