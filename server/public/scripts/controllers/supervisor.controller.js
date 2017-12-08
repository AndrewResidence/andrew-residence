myApp.controller('SupervisorController', function(UserService, ShiftService, AvailabilityService) {
    console.log('SupervisorController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

    vm.eventCreatea = function(event) {
      console.log('create event clicked', event)
      
    }
  });
  