myApp.controller('AdminDialogController', function ($mdDialog, UserService, user) {
    var vm = this;
    vm.roles = ['Supervisor', 'Nurse', 'MHW', 'ADL'];
    vm.userService = UserService;
    vm.user = user;

    vm.confirmUser = function (user) {
        console.log('user', user.id, user.role);
        vm.userService.confirmUser(user).then(function (response) {
            console.log('confirmed user', response);
            $mdDialog.hide();
        });
    };

    vm.editUser = function (user) {
        console.log(user);
        
        vm.userService.editUser(user).then(function (response) {
            console.log('edited user', response);
            $mdDialog.hide();
        });
    };
    vm.cancel = function () {
        $mdDialog.cancel();
    };

});