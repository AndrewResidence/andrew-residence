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
