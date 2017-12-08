myApp.controller('StaffController', function(UserService, ShiftService, AvailabilityService) {
    console.log('StaffController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
  });
  