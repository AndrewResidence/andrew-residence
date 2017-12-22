myApp.controller('NotificationController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService, calendarService) {
    console.log('NotificationController created');
    var vm = this;
    vm.notifications = [];
    //closes dialog box
    vm.cancel = function () {
        $mdDialog.hide();
    }; //end close dialog

    vm.getNotifications = function () {
        UserService.getNotifications().then(function (response) {
            vm.notifications = response.data;
            console.log('here it is', vm.notifications)
        });
    };

    //create message for staff
    vm.createMessage = function (messageBody, headline) {
        UserService.createMessage(messageBody, headline).then(function (response) {
            vm.getNotifications();
            vm.cancel()
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Notification Created')
                    .hideDelay(2500)
            );
        });
    };




})
