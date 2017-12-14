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
  vm.shift = ShiftService.shift
  
  vm.editShift = false;

  vm.myArrayOfDates = []
  $scope.$watch('myArrayOfDates', function (newValue, oldValue) {
    if (newValue) {
      console.log('my array changed, new size : ' + newValue.length);
      console.log('myArrayOfDates', newValue);
    }
  }, true);

//start newShift function
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
//end add newShift

  //closes dialog box
  vm.cancel = function () {
    $mdDialog.hide();
  } //end close dialog

  vm.editShiftDetails=function(event) {
vm.editShift=true;
console.log(vm.editShift)
  }



});

