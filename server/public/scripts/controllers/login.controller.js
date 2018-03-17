myApp.controller('LoginController', function ($http, $location, $mdDialog, UserService) {
  console.log('LoginController created');
  var vm = this;
  vm.user = {
    name: '',
    username: '',
    password: '',
    phone: ''
  };
  vm.message = '';
  vm.login = function () {
    console.log('LoginController -- login');
    if (vm.user.username === '' || vm.user.password === '') {
      vm.message = "Please enter your username and password.";
    } else {
      console.log('LoginController -- login -- sending to server...', vm.user);
      vm.user.username = vm.user.username.toLowerCase();
      $http.post('/', vm.user).then(function (response) {
        if (response.data.username) {
          console.log('LoginController -- login -- success: ', response.data);
          // location works with SPA (ng-route)
          $location.path('/user'); // http://localhost:5000/#/user 
        } else {
          console.log('LoginController -- login -- failure: ', response);
          vm.message = "The username or password you entered is incorrect, please try again.";
        }
      }).catch(function (response) {
        console.log('LoginController -- registerUser -- failure: ', response);
        vm.message = "The username or password you entered is incorrect, please try again";
      });
    }
  };
  vm.registerUser = function () {
    console.log('LoginController -- registerUser');
    if (vm.user.username === '' || vm.user.password === '') {
      vm.message = "Please choose a username and password";
    } else {
      console.log('LoginController -- registerUser -- sending to server...', vm.user);
      $http.post('/register', vm.user).then(function (response) {
        console.log('LoginController -- registerUser -- success');
        $location.path('/home');
      }).catch(function (response) {
        console.log('LoginController -- registerUser -- error');
        vm.message = "Please try again."
      });
    }
  };
  // vm.showPopup = function (event) {
  //   console.log('button clicked');
  //   $mdDialog.show({
  //     controller: 'PopupTestController as pt',
  //     templateUrl: '/views/templates/popupTest.html',
  //     parent: angular.element(document.body),
  //     targetEvent: event,
  //     clickOutsideToClose: true,
  //     fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
  //   });
  // };

});
