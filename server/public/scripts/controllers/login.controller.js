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
    let tempPhoneNum = []
    for (let i = 0; i < vm.user.phone.length; i++) {
      if (Number(vm.user.phone[i])) {
        tempPhoneNum.push(vm.user.phone[i]);
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
        vm.user.phone = tempPhoneNum.join('');
      }
    }
    if (tempPhoneNum.length === 10) {
      if (parseInt(tempPhoneNum[0]) === 1 || parseInt(tempPhoneNum[0]) === 0) {
        vm.phoneMessage = "Please enter your phone number including area code";
        return
      }
      else {
        tempPhoneNum.unshift('1');
        vm.user.phone = tempPhoneNum.join('');
      }
    }
    if (vm.user.username === '' || vm.user.password === '') {
      vm.phoneMessage = "Please choose a username and password";
    }
    else {
      $http.post('/register', vm.user).then(function (response) {
        $location.path('/home');
      }).catch(function (response) {
        vm.message = "Please try again."
      });
    }
  };
    
});
