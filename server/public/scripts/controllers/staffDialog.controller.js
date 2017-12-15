myApp.controller('StaffDialogController', function($mdToast, $mdDialog, UserService, ShiftService, AvailabilityService, shift) {
    console.log('StaffDialogController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.shiftService = ShiftService;
    vm.shift = {
      user: vm.userService.userObject.userId,
      id: shift.shift_id,
      date: moment(shift.date).format('l'),
      shift: shift.shift,
      comments: shift.shift_comments,
      adl: shift.adl,
      mhw: shift.mhw,
      nurse: shift.nurse,
      status: shift.shift_status
    }

    console.log('userObject', vm.userService.userObject);

    vm.adl = false;
    vm.mhw = false;
    vm.nurse = false;

    vm.role = function() {
      if (shift.adl) {
        vm.adl = true;
      }
      if (shift.mhw) {
        vm.mhw = true;
      }
      if (shift.nurse) {
        vm.nurse = true;
      }
    }

    vm.role();


    vm.pickUpShift = function(shift) {
      console.log('pick up shift', vm.shift);
      vm.shiftService.pickUpShift(shift).then(function (response) {
        $mdDialog.hide();
        console.log('response', response);
        $mdToast.show(
          $mdToast.simple()
            .textContent('You\'ve signed up for a shift. Shift is pending until confirmed.')
            .hideDelay(2500)
        );
      });
    }

      //closes dialog box
  vm.cancel = function () {
    $mdDialog.hide();
  } //end close dialog

  });
  