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
    shift_status: shift.shift_status,
    floor: shift.floor
  };
  vm.firstOfMonth = firstOfMonth;
  vm.lastOfMonth = lastOfMonth;
  
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
  };

  vm.role();

  vm.pickUpShift = function (shift, firstOfMonth, lastOfMonth) {
    vm.shiftService.pickUpShift(shift).then(function (response) {
      // console.log('start and end dates', vm.firstOfMonth, vm.lastOfMonth)
      $mdDialog.hide();
      console.log('response', response);
      $mdToast.show(
        $mdToast.simple()
          .textContent('You\'ve signed up for a shift. Shift is pending until confirmed.')
          .hideDelay(2500)
      );
    }).catch(function(error){
      console.log('error in pick up shift')
    })
  };


  //closes dialog box
  vm.cancel = function () {
    $mdDialog.hide();
  }; //end close dialog
});
