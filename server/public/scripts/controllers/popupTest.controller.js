myApp.controller('PopupTestController', function ($mdDialog, UserService, ShiftService) {

    console.log('popups');
    ptc = this;
    ptc.userService = UserService;
    ptc.userObject = UserService.userObject;

    // ptc.notifications = []
    ptc.sendTextMessage = function () {
    ShiftService.sendTextMessage();
    };
    ptc.sendEmailMessage = function () {
console.log('made it to sendEmail');
        ShiftService.sendEmailMessage();
    };

    ptc.createNotification = function () {
        $mdDialog.show({
            controller: 'NotificationController as nc',
            templateUrl: '/views/templates/createMessage.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
        });
     } //end shiftDetails popup function    

     ptc.getNotifications = function () {
         UserService.getNotifications().then(function (response){
ptc.notifications = response.data;
console.log(ptc.notifications)
         })
     }

     ptc.getNotifications();



});