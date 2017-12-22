myApp.controller('PopupTestController', function ($mdDialog, $mdToast, UserService, ShiftService) {

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

    ptc.deleteNotification = function(id) {
        var toast = $mdToast.simple()
            .textContent('Are you sure you want to delete?')
            .action('Cancel')
            .highlightAction(true)
            .highlightClass('md-accent');

        $mdToast.show(toast).then(function (response) {
            if (response == 'ok') {
                // alert ('Delete cancelled.')
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Cancel!')
                        .textContent('You cancelled deleting the message.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Thanks')
                        .targetEvent(event)
                );
            }
            else {
                UserService.deleteNotifcation(id).then(function (response) {
                    ptc.getNotifications()
                    $mdDialog.hide();
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Message deleted!')
                            .hideDelay(2500)
                    );

                });
            }
        })
    } //end delete message

});