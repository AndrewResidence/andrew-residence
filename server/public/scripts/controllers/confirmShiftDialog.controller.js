myApp.controller('ConfirmShiftController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService, pendingShift) {
    console.log('ConfirmShiftController created');
    var vm = this;
    vm.userService = UserService;
    vm.shiftService = ShiftService;
    vm.userObject = UserService.userObject;
    vm.pendingShift = pendingShift;
    vm.pendingShifts = ShiftService.pendingShifts;
    
    //closes dialog box
    vm.cancel = function () {
      $mdDialog.hide();
    }; //end close dialog
  
    //gets shifts
    vm.getShiftsToConfirm = function(shiftId) {
      vm.shiftService.getShiftsToConfirm(shiftId).then(function(response) {
        vm.theShifts = response.data;
      }).catch(function(error){
        console.log('error in get shifts to confirm')
      })
    };
  
    vm.getShiftsToConfirm(vm.pendingShift.shift_id);

    vm.showComments = function(staff) {
        if (staff.staff_comments) {
            return true;
        }
        return false;
    };

    //confirms users shift
    vm.confirmShift = function(staffMember, allShifts) {      
      vm.shiftService.confirmShift(staffMember, allShifts).then(function(response) {
        ShiftService.getPendingShifts();
      }).then(function() {
        $mdDialog.hide();
      }).catch(function(error){
        console.log('error in confirming shift')
      })
    }
    
    //gets pending shifts
    vm.getPendingShifts = function () {
      ShiftService.getPendingShifts()
      .then(function (response) {
        for (var i = 0; i < vm.pendingShifts.length; i++) {
          vm.pendingShifts[i].date = moment(vm.pendingShifts[i].date).format('M/D');
        }
        for (var i = 0; i < vm.pendingShifts.length; i++) {
          for (var j = i+1; j < vm.pendingShifts.length; j++) {
            if (vm.pendingShifts[i].shift_id == vm.pendingShifts[j].shift_id) {
              vm.pendingShifts.splice(j, 1);
            }
          }
        }
      }).catch(function(error){
        console.log('error getting pending shifts')
      })
    }
  
  });
  
  