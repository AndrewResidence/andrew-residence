myApp.controller('AdminController', function(UserService) {
  console.log('AdminController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.supervisors = [];
  vm.staff = [];

// GET supervisors route (GET users where role = supervisor)
  vm.getSupervisors = function(){
    vm.userService.getSupervisors().then(function(response) {
      vm.supervisors = response.data;
    })
  }

  vm.getSupervisors();


// GET staff route (GET users where role = nurse, MHW or ADL)


// Supervisor and staff PUT route (editing a specific user)

// Supervisor and staff PUT route (editing a user's role)

// Supervisor and staff DELETE route (removing a specific user)

});
