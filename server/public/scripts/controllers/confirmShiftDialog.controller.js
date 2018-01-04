myApp.controller('ConfirmShiftController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService, pendingShift) {
    console.log('ConfirmShiftController created');
    var vm = this;
    vm.userService = UserService;
    vm.shiftService = ShiftService;
    vm.userObject = UserService.userObject;
    vm.pendingShift = pendingShift;
    vm.pendingShifts = ShiftService.pendingShifts.data;
    
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
        // ShiftService.pendingShifts = [];
        vm.getPendingShifts();
      }).then(function() {
        $mdDialog.hide();
      })
    }

    vm.getPendingShifts = function () {
      ShiftService.getPendingShifts().then(function (response) {
        // console.log('HHHHHHFDSLJSDFLJKSDFLJKSDFLJKSLDFLJKSDF')
        console.log('pending shifts', vm.pendingShifts)
        for (var i = 0; i < vm.pendingShifts.data.length; i++) {
          vm.pendingShifts.data[i].date = moment(vm.pendingShifts.data[i].date).format('M/D');
        }
        for (var i = 0; i < vm.pendingShifts.data.length; i++) {
          for (var j = i+1; j < vm.pendingShifts.data.length; j++) {
            if (vm.pendingShifts.data[i].shift_id == vm.pendingShifts.data[j].shift_id) {
              vm.pendingShifts.data.splice(j, 1);
            }
          }
        }
        console.log('pending shifts', vm.pendingShifts.data);
      })
    }
  
  });
  
  