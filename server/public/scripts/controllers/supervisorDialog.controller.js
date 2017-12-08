myApp.controller('SupervisorDialogController', function(UserService, ShiftService) {
    console.log('SupervisorDialogController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
  });
  