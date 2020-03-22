myApp.controller('AdminDialogController', function ($mdDialog, UserService, user) {
    var vm = this;
    vm.roles = ['Supervisor', 'MHW', 'ADL', 'Nurse', 'Social Worker', 'Therapeutic Recreation', 'Living Skills', 'Support Staff'];
    vm.userService = UserService;
    vm.user = user;

    //confirm user
    vm.confirmUser = function (user) {
        vm.userService.confirmUser(user).then(function (response) {
            console.log('confirmed user', response);
            $mdDialog.hide();
        }).catch(function (error) {
            console.log('error in confirming user') 
        })
    };

    //edit the user information
    vm.editUser = function (user) {
        let phoneValidation = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
        let tempPhone
        if (user.phone.charAt(0) === '1') {
            console.log('the first number is one')
            tempPhone = user.phone.slice(1)
        } else {
            tempPhone = user.phone
        }
        let phoneArray = tempPhone.match(phoneValidation)
        console.log('phoneArray', phoneArray)
        if (phoneArray === null) {
            vm.phoneMessage = "Please enter your phone number in the format (xxx)xxx-xxxx"
            return
        }
        user.phone = "1" + phoneArray[1] + phoneArray[2] + phoneArray[3]
        console.log('the user phone before service', user.phone)
        vm.userService.editUser(user).then(function (response) {
            console.log('edited user - in controller', response);
            $mdDialog.hide();
        }).catch(function (error) {
            console.log('error in editing the user', error)
        })
    };

    //closes dialog
    vm.cancel = function () {
        $mdDialog.cancel();
    };

});