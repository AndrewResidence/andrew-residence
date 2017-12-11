myApp.controller('SupervisorController', function(UserService, ShiftService, AvailabilityService, $mdDialog) {
    console.log('SupervisorController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

    vm.eventCreatea = function(event) {
      console.log('create event clicked', event)
      
    }

    vm.events = [
      {
      title: "Nurse, Day",
      start: new Date(' Mon Dec 11 2017 14:00:00 GMT-0600 (CST)'),
      end: new Date(' Mon Dec 11 2017 15:00:00 GMT-0600 (CST)'),
      allDay: true

      },
      {
        title: 'another event', 
        start: new Date(),
        end: new Date(),
        allDay: true
      },
      {
        title: 'MHW, Night',
        start: new Date ('12/14/17'), 
        end: new Date('12/14/17'),
        allDay: true,
        shift: 'Night',
        role: 'MHW'
      }
    ];

    vm.eventClicked = function(event) {
      console.log('button clicked', event);
      $mdDialog.show({
        controller: 'SupervisorDialogController as sdc',
        templateUrl: '/views/dialogs/shiftDetails.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
      })
    }

  });
  