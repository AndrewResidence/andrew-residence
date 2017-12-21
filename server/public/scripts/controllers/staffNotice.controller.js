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
        ptc.getNotifications();
        $mdToast.show(
            $mdToast.simple()
                .textContent('Notification Created')
                .hideDelay(2500)
        )
        
    })
}
    

    vm.getNotifications = function () {
        UserService.getNotifications().then(function (response) {
            vm.notifications = response.data;
        })
    }

})