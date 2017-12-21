myApp.controller('ConfirmShiftController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService, pendingShift) {
    console.log('ConfirmShiftController created');
    var vm = this;
    vm.userService = UserService;
    vm.shiftService = ShiftService;
    vm.userObject = UserService.userObject;
    vm.pendingShift = pendingShift;
    vm.pendingShifts = [];
    
    //closes dialog box
    vm.cancel = function () {
      $mdDialog.hide();
    }; //end close dialog
  
    vm.getShiftsToConfirm = function(shiftId) {
      console.log('shift id in dialog', shiftId);
      vm.shiftService.getShiftsToConfirm(shiftId).then(function(response) {
        console.log('got shifts', response.data);
        vm.pendingShifts = response.data;
        console.log('shifts here', vm.pendingShifts);
      });
    };
  
    vm.getShiftsToConfirm(vm.pendingShift.shift_id);

    vm.showComments = function(staff) {
        if (staff.staff_comments) {
            return true;
        }
        return false;
    }

    vm.confirmShift = function(staffMember, allShifts) {
      vm.shiftService.confirmShift(staffMember, allShifts).then(function(response) {
        console.log('confirmed!', response);
      }).then(function() {
        $mdDialog.hide();
      })
    }
  
  });
  
  