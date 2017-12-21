myApp.controller('UserController', function (UserService, $mdDialog, $mdToast) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.showName = true;
  vm.editUserMode = false;

  vm.showEditDialogStaff = function (event, user) {
    console.log('button clicked');
    $mdDialog.show({
      controller: 'UserPageDialogController as upc',
      templateUrl: '/views/dialogs/editUserPageInfo.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      locals: { user: user }
    }).then(function () {
      vm.showEditToast();
    });
  };
  vm.showEditToast = function () {
    $mdToast.show(
      $mdToast.simple()
        .textContent('User has been edited!')
        .position('bottom left')
        .hideDelay(2500)
    );
  };
  vm.editUser = function (user) {
    console.log(vm.service);

    vm.userService.editUser(user).then(function (response) {
      console.log('edited user', response);
      $mdDialog.hide();
    });
  };
  vm.toggleEdit = function () {
    vm.showName = !vm.showName;
  };

  vm.editProfile = {};

  vm.joshEdit = function (name, phone) {

    console.log('here');

    console.log(vm.userService);


    vm.userService.sendProfile(name, phone).then(function () {
      $mdToast.show(
        $mdToast.simple()
          .textContent('User has been edited!')
          .position('bottom left')
          .hideDelay(2500)
      );
    }).then(function () {
     vm.toggleEdit();
      
    });


  };
});
