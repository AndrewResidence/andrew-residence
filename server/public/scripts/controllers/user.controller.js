myApp.controller('UserController', function ($mdToast, UserService, $mdDialog) {
  // console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.showName = true;
  vm.editUserMode = false;
  vm.notifications = UserService.notifications

  vm.showEditDialogStaff = function (event, user) {
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
    // console.log(vm.service);

    vm.userService.editUser(user).then(function (response) {
      // console.log('edited user', response);
      $mdDialog.hide();
    });
  };
  vm.toggleEdit = function () {
    vm.showName = !vm.showName;
  };

  vm.editProfile = {};

  vm.updateUserInfo = function (userName, phone) {

    // console.log(vm.userService);
    let phoneValidation = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
    let phoneArray = phone.match(phoneValidation)

    if (phoneArray === null) {
      vm.phoneMessage = "Please enter your phone number in the format (xxx)xxx-xxxx"
      return
    }

    phone = "1" + phoneArray[1] + phoneArray[2] + phoneArray[3]

    vm.userService.sendProfile(userName, phone).then(function () {
      $mdToast.show(
        $mdToast.simple()
          .textContent('User has been edited!')
          .position('bottom left')
          .hideDelay(2500)
      );
    }).then(function () {
      vm.toggleEdit();
      vm.userService.getuser();
    });
  };

  vm.createNotification = function (event) {
    $mdDialog.show({
      controller: 'NotificationController as nc',
      templateUrl: '/views/templates/createMessage.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  } //end shiftDetails popup function    

  vm.createUrgentText = function (event) {
    $mdDialog.show({
      controller: 'NotificationController as nc',
      templateUrl: '/views/templates/createAllStaffText.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  }

  vm.getNotifications = function () {
    UserService.getNotifications()
  //   .then(function (response) {
  //     vm.notifications = response.data;
  //   }).catch(function (error) {
  //   console.log('get notification error');

  // });
  }

  vm.getNotifications();

  vm.deleteNotification = function (id) {
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
          vm.getNotifications()
          $mdDialog.hide();
          $mdToast.show(
            $mdToast.simple()
              .textContent('Message deleted!')
              .hideDelay(2500)
          );

        });
      }
    });
  }; //end delete message
});
