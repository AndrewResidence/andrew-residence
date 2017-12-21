myApp.controller('NotificationController', function ($scope, $mdDialog, $mdToast, UserService, ShiftService, calendarService) {
    console.log('NotificationController created');
var vm = this;

    //closes dialog box
    vm.cancel = function () {
        $mdDialog.hide();
    }; //end close dialog

    //create message for staff
vm.createMessage = function (messageBody, headline ){
    UserService.createMessage(messageBody, headline).then(function (response) {
        vm.cancel();
        $mdToast.show(
            $mdToast.simple()
                .textContent('Notification Created')
                .hideDelay(2500)
        )
        ptc.getNotifications();
    })
}
    ptc.getNotifications = function () {
        UserService.getNotifications
    }

})