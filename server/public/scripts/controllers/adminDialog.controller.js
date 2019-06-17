myApp.controller('AdminDialogController', function ($mdDialog, UserService, user) {
    var vm = this;
    vm.roles = ['Supervisor', 'MHW', 'ADL', 'Nurse', 'Social Worker', 'Therapeutic Recreation', 'Living Skills'];
    vm.userService = UserService;
    vm.user = user;

    //confirm user
    vm.confirmUser = function (user) {
        console.log('user', user.id, user.role);
        vm.userService.confirmUser(user).then(function (response) {
            console.log('confirmed user', response);
            $mdDialog.hide();
        }).catch(function (error) {
            console.log('error in confirming user')
        })
    };

    //edit the user information
    vm.editUser = function (user) {
        let tempPhoneNum = []
        for (let i = 0; i < user.phone.length; i++) {
            if (Number(user.phone[i])) {
                tempPhoneNum.push(user.phone[i]);
            }
        }

        if (tempPhoneNum.length > 11 || tempPhoneNum.length < 10) {
            vm.phoneMessage = "Please enter your phone number including area code";
            return
        }
        if (tempPhoneNum.length === 11) {
            if (parseInt(tempPhoneNum[0]) !== 1) {
                vm.phoneMessage = "Please enter your 10 digit phone number including area code";
                return
            }
            else {
                user.phone = tempPhoneNum.join('');
            }
        }
        if (tempPhoneNum.length === 10) {
            if (parseInt(tempPhoneNum[0]) === 1 || parseInt(tempPhoneNum[0]) === 0) {
                vm.phoneMessage = "Please enter your phone number including area code";
                return
            }
            else {
                tempPhoneNum.unshift('1');
                user.phone = tempPhoneNum.join('');
            }
        }

        vm.userService.editUser(user).then(function (response) {
            console.log('edited user', response);
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