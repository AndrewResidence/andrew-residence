myApp.controller('AdminController', function (UserService, $mdDialog, $mdToast) {
  console.log('AdminController created');

  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.supervisors = [];
  vm.staff = [];
  vm.unconfirmed = []; 

  var show = false;

   // GET unconfirmed users route
   vm.getUnconfirmed = function () {
    vm.userService.getUnconfirmed().then(function (response) {
      vm.unconfirmed = response.data;
      console.log('got users', response.data);
    })
  }

  vm.getUnconfirmed();

  //Show dialog for confirm user
  vm.showConfirmDialog = function(event, user) {
      console.log('button clicked');
      $mdDialog.show({
        controller: 'AdminDialogController as ac',
        templateUrl: '/views/dialogs/confirmUser.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        locals: { user: user }
      }).then(function() {
        vm.getStaff();
        vm.getSupervisors();
        vm.getUnconfirmed();
        vm.showConfirmToast();
      })
    };

  //Users PUT route to confirm users and define their role (supervisor, nurse, MHW or ADL) 
  vm.confirmUser = function(user) {
    vm.userService.confirmUser(user).then(function(response){
      console.log('changed user', response);
    })
  }


  // GET supervisors route (GET users where role = supervisor)
  vm.getSupervisors = function () {
    vm.userService.getSupervisors().then(function (response) {
      vm.supervisors = response.data;
    })
  }

  vm.getSupervisors();


  // GET staff route (GET users where role = nurse, MHW or ADL)
  vm.getStaff = function () {
    vm.userService.getStaff().then(function (response) {
      vm.staff = response.data;
    })
  }

  vm.getStaff();

    //Show dialog for edit individual user
    vm.showEditDialog = function(event, user) {
      console.log('button clicked');
      $mdDialog.show({
        controller: 'AdminDialogController as ac',
        templateUrl: '/views/dialogs/editUser.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        locals: { user: user }
      }).then(function() {
        vm.getStaff();
        vm.getSupervisors();
        vm.getUnconfirmed();
        vm.showEditToast();
      })
    };


  vm.showEditToast= function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('User has been edited!')
        .position('bottom left')
        .hideDelay(2500)
    );
  };

  vm.showConfirmToast= function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('User has been confirmed!')
        .position('bottom left')
        .hideDelay(2500)
    );
  };
  


  // Supervisor and staff PUT route (editing a specific user)

  // Supervisor and staff PUT route (editing a user's role)

  // Supervisor and staff DELETE route (removing a specific user)

});
