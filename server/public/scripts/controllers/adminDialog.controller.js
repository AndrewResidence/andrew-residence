myApp.controller('AdminDialogController', function ($mdDialog, UserService, user) {
    var vm = this;
    vm.roles = ['Supervisor', 'MHW', 'ADL', 'Nurse', 'Social Worker', 'Therapeutic Recreation', 'Living Skills'];
    vm.userService = UserService;
    vm.user = user;

    //confirm user
    vm.confirmUser = function (user) {
        vm.userService.confirmUser(user).then(function (response) {
            // console.log('confirmed user', response);
            $mdDialog.hide();
        }).catch(function (error) {
            console.log('error in confirming user')
        })
    };

    //edit the user information
    vm.editUser = function (user) {

        let phoneValidation = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
        let phoneArray = vm.user.phone.match(phoneValidation)

        if (phoneArray === null) {
            vm.phoneMessage = "Please enter your phone number in the format (xxx)xxx-xxxx"
            return
        }
        vm.user.phone = "1" + phoneArray[1] + phoneArray[2] + phoneArray[3]
        vm.userService.editUser(user).then(function (response) {
            // console.log('edited user', response);
            $mdDialog.hide();
        }).catch(function (error) {
            console.log('error in editing the user')
        })
    };

    //closes dialog
    vm.cancel = function () {
        $mdDialog.cancel();
    };

});