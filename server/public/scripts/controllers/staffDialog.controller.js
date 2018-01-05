myApp.controller('StaffDialogController', function ($mdToast, $mdDialog, UserService, ShiftService, AvailabilityService, shift, firstOfMonth, lastOfMonth) {
  console.log('StaffDialogController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.shiftService = ShiftService;
  vm.edit = false;
  vm.shift = {
    user: vm.userService.userObject.userId,
    id: shift.shift_id,
    date: moment(shift.date).format('l'),
    shift: shift.shift,
    shift_comments: shift.shift_comments,
    adl: shift.adl,
    mhw: shift.mhw,
    nurse: shift.nurse,
    shift_status: shift.shift_status
  };
  vm.firstOfMonth = firstOfMonth;
  vm.lastOfMonth = firstOfMonth;
  
  vm.titleDate = moment(vm.shift.date).format('MM/DD');
  vm.showShiftComment = function(shift) {
    if (shift.shift_comments) {
      return true;
    }
    return false;
  }
  vm.showPickUpButton = ShiftService.showPickUpButton;
  console.log('userObject', vm.userService.userObject);
  vm.adl = false;
  vm.mhw = false;
  vm.nurse = false;
  vm.role = function () {
    if (shift.adl) {
      vm.adl = true;
    }
    if (shift.mhw) {
      vm.mhw = true;
    }
    if (shift.nurse) {
      vm.nurse = true;
    }
    // vm.showPickUpButton = ShiftService.showPickUpButton;
    // vm.showPickUpShift = function() {
    //   console.log('shift in staff dialog controller', vm.shift.id)
    //   console.log('myShifts', ShiftService.myShifts.data)
    //   if (vm.shift.shift_status === 'Filled' || vm.shift.shift_status === 'filled') {
    //     vm.showPickUpButton = false;
    //     console.log('vm.showPickUpButton', vm.showPickUpButton)
    //   }
    //   for (var i = 0; i < ShiftService.myShifts.length; i++) {
    //     console.log('in the for loop')
    //     if (parseInt(vm.shift.id) === parseInt(ShiftService.myShifts.data[i].shift_id)) {
    //       vm.showPickUpButton = false;
    //     }
    //   }
    // };

      //closes dialog box
  };
  vm.role();
  // vm.showPickUpShift();
  // vm.showPickUpShift = function() {
  //   vm.showComments = true;
  // }

  vm.pickUpShift = function (shift) {
    vm.shiftService.pickUpShift(shift).then(function (response) {
      $mdDialog.hide();
      console.log('response', response);
      $mdToast.show(
        $mdToast.simple()
          .textContent('You\'ve signed up for a shift. Shift is pending until confirmed.')
          .hideDelay(2500)
      );
    });
  };


  //closes dialog box
  vm.cancel = function () {
    $mdDialog.hide();
  }; //end close dialog
});
