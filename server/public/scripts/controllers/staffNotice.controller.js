myApp.controller('NotificationController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService, calendarService) {
    console.log('NotificationController created');
    var vm = this;
    // vm.notifications = UserService.notifications;
    vm.UserService = UserService;
    vm.notifications = UserService.notifications;
    //closes dialog box
    vm.cancel = function () {
        $mdDialog.hide();
    }; //end close dialog


    vm.getNotifications = function () {
        vm.notifications = [];
        UserService.getNotifications().then(function (response) {
            vm.notifications = response.data;
            console.log('here it is', vm.notifications)
        }).catch(function(error){
            console.log('error in getting notifications')
        })
    };


    //create message for staff
    vm.createMessage = function (messageBody, headline) {
        UserService.createMessage(messageBody, headline).then(function (response) {
            vm.cancel()
            UserService.getNotifications();
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Notification Created')
                    .hideDelay(2500)
            );
        }).catch(function(error){
            console.log('error in creating a message')
        })
    };




})
