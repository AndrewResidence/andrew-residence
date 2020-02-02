myApp.controller('LoginController', function ($http, $location, $mdDialog, UserService) {
  // console.log('LoginController created');
  var vm = this;
  vm.user = {
    name: '',
    username: '',
    password: '',
    phone: ''
  };
  vm.message = '';
  vm.phoneMessage = '';
  vm.login = function () {
    // console.log('LoginController -- login');
    if (vm.user.username === '' || vm.user.password === '') {
      vm.message = "Please enter your username and password.";
    } else {
      // console.log('LoginController -- login -- sending to server...', vm.user);
      vm.user.username = vm.user.username.toLowerCase();
      $http.post('/', vm.user).then(function (response) {
        // console.log(response)
        if (response.data.username) {
          // location works with SPA (ng-route)
          $location.path('/user');
        } else {
          vm.message = "The username or password you entered is incorrect, please try again.";
        }
      }).catch(function (response) {
        // console.log(response)
        vm.message = "The username or password you entered is incorrect, please try again";
      });
    }
  };

  vm.logBackIn = function(){
    $location.path('/home');
  };

  vm.registerUser = function () {
    // console.log('LoginController -- registerUser', vm.user.phone);
    let tempPhoneNum = vm.user.phone
    let phoneValidation = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
    console.log(`phoneValidation ${tempPhoneNum.match(phoneValidation)}`)


    // if (tempPhoneNum.match(phoneValidation)) {
    //   vm.user.phone = "1" + tempPhoneNum
    // } else {
    //   vm.phoneMessage = "Please enter your phone number in the format (xxx)xxx-xxxx"
    //   return
    // }
    // if (vm.user.username === '' || vm.user.password === '') {
    //   vm.phoneMessage = "Please choose a username and password";
    //   return
    // }
    // else {
    //   $http.post('/register', vm.user).then(function (response) {
    //     $location.path('/home');
    //   }).catch(function (response) {
    //     vm.message = "Please try again."
    //   });
    // }
  };
    
});
