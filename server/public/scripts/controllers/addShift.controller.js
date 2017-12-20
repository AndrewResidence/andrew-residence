// myApp.controller('AddShiftController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService, calendarService) {
//     console.log('AddShiftController created');
//     var vm = this;
//     vm.userService = UserService;
//     vm.shiftService = ShiftService;
//     vm.calendarService = calendarService;
//     vm.userObject = UserService.userObject;
//     vm.addShift = ShiftService.addShift;
//     vm.newShift = ShiftService.newShift;
//     vm.showStaff = false;
//     vm.supervisors = [];
//     vm.staff = [];
//     vm.shifts = ['Day', 'Evening', 'ADL Evening', 'Night'];
//     vm.shiftStatus = ['Open', 'Filled'];
//     vm.shift = ShiftService.shift;
//     vm.floors = ['2', '3', '4', '5', 'flt', 'N/A'];
//     vm.shiftsToDisplay = [];
//     vm.currentSchedule = calendarService.currentSchedule.dates;

//     $scope.$watch('myArrayOfDates', function (newValue, oldValue) {
//         if (newValue) {
//             console.log('my array changed, new size : ' + newValue.length);
//             console.log('myArrayOfDates', newValue);
//         }
//     }, true);



//     vm.getSupervisors = function () {
//         UserService.getSupervisors().then(function (response) {
//             vm.supervisors = response.data;
//             console.log('got supervisors', vm.supervisors);
//         })
//     }

//     vm.getSupervisors()

//     vm.getStaff = function () {
//         vm.userService.getStaff().then(function (response) {
//             vm.staff = response.data;
//             console.log('got staff', vm.staff);
//         });
//     };
//     vm.getStaff();

//     //start newShift function
//     vm.addNewShift = function (staffId, selection, shiftDate, shiftStatus, urgent, shift, role, comments, notify, nurse, adl, mhw) {
//         ShiftService.addNewShift(staffId, selection, shiftDate, shiftStatus, urgent, shift, role, comments, notify, nurse, adl, mhw).then(function (response) {
//             calendarService.getPayPeriodDates();

//             $mdDialog.hide();
//             console.log('response', response);
//             $mdToast.show(
//                 $mdToast.simple()
//                     .textContent('Shift(s) Created!')
//                     .hideDelay(2500)
//             );
//         });
//     };
//     //end add newShift

//     vm.cancel = function () {
//         $mdDialog.hide();
//     }; //end close dialog

//     vm.getShifts = function () {
//         vm.getPayPeriodDates();
//         ShiftService.getShifts().then(function (response) {
//             vm.shiftsToDisplay = response.data;
//             console.log('shifts to display', vm.shiftsToDisplay)
//             for (var i = 0; i < vm.shiftsToDisplay.length; i++) {
//                 for (var j = 0; j < vm.currentSchedule.length; j++) {
//                     // vm.currentSchedule[j].shifts = [];
//                     if (moment(vm.shiftsToDisplay[i].date).format('YYYY-MM-DD') === moment(vm.currentSchedule[j].moment).format('YYYY-MM-DD')) {
//                         vm.currentSchedule[j].shifts.push(vm.shiftsToDisplay[i]);
//                     }
//                 }
//             }
//         })
//     }

//     vm.getPayPeriodDates = function () {
//         calendarService.getPayPeriodDates();
//     }

// })