myApp.controller('SupervisorDialogController', function(UserService, ShiftService, $mdDialog) {
    console.log('SupervisorDialogController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
  });
  