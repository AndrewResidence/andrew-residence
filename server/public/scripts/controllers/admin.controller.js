myApp.controller('AdminController', function (UserService) {
  console.log('AdminController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.supervisors = [];
  vm.staff = [];
  vm.unconfirmed = []; 

   // GET unconfirmed users route
   vm.getUnconfirmed = function () {
    vm.userService.getUnconfirmed().then(function (response) {
      vm.unconfirmed = response.data;
      console.log('got users', response.data);
    })
  }

  vm.getUnconfirmed();

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

  // Supervisor and staff PUT route (editing a specific user)

  // Supervisor and staff PUT route (editing a user's role)

  // Supervisor and staff DELETE route (removing a specific user)

});
