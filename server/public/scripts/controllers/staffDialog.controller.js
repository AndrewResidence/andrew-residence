myApp.controller('StaffDialogController', function(UserService, ShiftService, AvailabilityService) {
    console.log('StaffDialogController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

    vm.pickUpShift = function() {
      console.log('pick up shift');
    }
  });
  