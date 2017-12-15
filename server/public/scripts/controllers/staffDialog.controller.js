myApp.controller('StaffDialogController', function($mdDialog, UserService, ShiftService, AvailabilityService, shift) {
    console.log('StaffDialogController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.shiftService = ShiftService;
    vm.shift = {
      date: moment(shift.date).format('l'),
      shift: shift.shift,
      comments: shift.shift_comments,
      adl: shift.adl,
      mhw: shift.mhw,
      nurse: shift.nurse,
      status: shift.shift_status
    }
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
      console.log('vm', shift.adl, vm.adl);
      console.log('vm', shift.mhw, vm.mhw);
      console.log('vm', shift.nurse, vm.nurse);
    }

    vm.role();


    vm.pickUpShift = function(shift) {
      console.log('pick up shift', vm.shift);
      vm.shiftService.pickUpShift(shift);
    }

      //closes dialog box
  vm.cancel = function () {
    $mdDialog.hide();
  } //end close dialog

  });
  