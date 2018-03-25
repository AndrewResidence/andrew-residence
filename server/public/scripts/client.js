var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'multipleDatePicker', 'angularMoment', 'checklist-model']);

/// Routes ///
myApp.config(function ($routeProvider, $locationProvider, $mdThemingProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config');
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController as ic',
    })
    .when('/admin', {
      templateUrl: '/views/templates/admin.html',
      controller: 'AdminController as ac',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/supervisor', {
      templateUrl: '/views/templates/supervisor.html',
      controller: 'SupervisorController as sc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/staff', {
      templateUrl: '/views/templates/staff.html',
      controller: 'StaffController as sc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    }).when('/message', {
      templateUrl: '/views/templates/message.html',
      controller: 'PopupTestController as pop',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    }).when('/forgot', {
      templateUrl: '/views/templates/forgot.html',
      controller: 'ForgotController as fc',
    })
    .when('/update', {
      templateUrl: '/views/templates/update.html',
      controller: 'ForgotController as fc',
    })
    .otherwise({
      redirectTo: 'home'
    });

  $mdThemingProvider.theme('default')
    .primaryPalette('amber', {
    })

    .accentPalette('amber', {

    });
});

