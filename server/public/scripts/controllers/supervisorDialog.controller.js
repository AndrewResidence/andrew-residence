
myApp.controller('SupervisorDialogController', function(UserService, ShiftService, $mdDialog) {
    console.log('SupervisorDialogController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
  });
  

myApp.controller('SupervisorDialogController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService) {
  console.log('SupervisorDialogController created');
  var vm = this;
  vm.userService = UserService;
  vm.shiftService = ShiftService;
  vm.userObject = UserService.userObject;
  vm.addShift = ShiftService.addShift;
  vm.newShift = ShiftService.newShift;
  //dummy data list of supervisors
  vm.supervisors = ['Dan', 'Blake', 'Emma', 'Sarah', 'Josh'];
  //possible shift types
  vm.shifts = ['Day', 'Evening', 'ADL Evening', 'Night'];

  vm.myArrayOfDates = []
  $scope.$watch('myArrayOfDates', function (newValue, oldValue) {
    if (newValue) {
      console.log('my array changed, new size : ' + newValue.length);
      console.log('myArrayOfDates', newValue);
    }
  }, true);


  vm.addNewShift = function (shiftDate, urgent, shift, role, comments, notify, nurse, adl, mhw) {
    ShiftService.addNewShift(shiftDate, urgent, shift, role, comments, notify, nurse, adl, mhw).then(function (response) {
      $mdDialog.hide();
      console.log('response', response)
      $mdToast.show(
        $mdToast.simple()
          .textContent('Shift(s) Created!')
          .hideDelay(2500)
      );
    })
  }
  //closes dialog box
  this.cancel = function () {
    $mdDialog.hide();
  } //end close dialog



});

