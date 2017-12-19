myApp.controller('SupervisorDialogController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService) {
  console.log('SupervisorDialogController created');
  var vm = this;
  vm.userService = UserService;
  vm.shiftService = ShiftService;
  vm.userObject = UserService.userObject;
  vm.addShift = ShiftService.addShift;
  vm.newShift = ShiftService.newShift;
  vm.showStaff = false;
  vm.supervisors = [];
  vm.staff = [];
  vm.shifts = ['Day', 'Evening', 'ADL Evening', 'Night'];
  vm.shiftStatus = ['Open', 'Filled'];
  vm.shift = ShiftService.shift;

  vm.editShift = false;
  vm.myArrayOfDates = [];
  vm.updatedShift = ShiftService.updatedShift;
  vm.floors = ['2', '3', '4', '5', 'flt', 'N/A'];
  vm.editFill = false;

  $scope.$watch('myArrayOfDates', function (newValue, oldValue) {
    if (newValue) {
      console.log('my array changed, new size : ' + newValue.length);
      console.log('myArrayOfDates', newValue);
    }
  }, true);

  vm.getShifts = function () {
    ShiftService.getShifts();
  }

  vm.getSupervisors = function () {
    UserService.getSupervisors().then(function (response) {
      vm.supervisors = response.data;
      console.log('got supervisors', vm.supervisors);
    })
  }

  vm.getSupervisors()

  vm.getStaff = function () {
    vm.userService.getStaff().then(function (response) {
      vm.staff = response.data;
      console.log('got staff', vm.staff);
    });
  };
  vm.getStaff();


  //start newShift function
  vm.addNewShift = function (staffId, selection, shiftDate, shiftStatus, urgent, shift, role, comments, notify, nurse, adl, mhw) {
    ShiftService.addNewShift(staffId, selection, shiftDate, shiftStatus, urgent, shift, role, comments, notify, nurse, adl, mhw).then(function (response) {
      vm.getShifts();
      $mdDialog.hide();
      console.log('response', response);
      $mdToast.show(
        $mdToast.simple()
          .textContent('Shift(s) Created!')
          .hideDelay(2500)
      );
    });
  };
  //end add newShift

  //closes dialog box
  vm.cancel = function () {
    $mdDialog.hide();
  }; //end close dialog

  vm.editShiftDetails = function (event) {
    vm.editShift = true;
    console.log(vm.editShift);
  };

  vm.updateShift = function (id, comments, shift, mhw, adl, nurse, date, floor) {
    ShiftService.updateShift(id, comments, shift, mhw, adl, nurse, date, floor).then(function (response) {
      $mdDialog.hide();
      $mdToast.show(
        $mdToast.simple()
          .textContent('Shift Updated')
          .hideDelay(2500)
      )
    })
  }

  //show staff dropdown based on statusUpdate
  vm.statusUpdate = function (value) {
    vm.showStaff = !vm.showStaff;
    if (value === 'Filled') {
      vm.showStaff = true;
      console.log('true')
    }
    else {
      console.log('false')
    }
  }

  //start delete shift
  vm.deleteShift = function (shiftId) {
    console.log('delete', shiftId)
    var toast = $mdToast.simple()
      .textContent('Are you sure you want to delete?')
      .action('Cancel')
      .highlightAction(true)
      .highlightClass('md-accent');

    $mdToast.show(toast).then(function (response) {
      if (response == 'ok') {
        // alert ('Delete cancelled.')
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Cancel!')
            .textContent('You cancelled deleting the shift.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Thanks')
            .targetEvent(event)
        );
      }
      else {
        ShiftService.deleteShift(shiftId).then(function (response) {
          vm.getShifts()
          $mdDialog.hide();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Shift deleted!')
              .hideDelay(2500)
          );

        })

      }
    } //   
    ) // }
  } //end delete shift  

  vm.fillShift = function (event) {
    vm.editFill =! vm.editFill;
  }

  vm.shiftFilled = function (id, shiftId) {
console.log('clicked')
console.log('staff', id, shiftId)
ShiftService.shiftFilled(id, shiftId).then(function (response){
  vm.getShifts();

})
  }
});

