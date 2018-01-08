myApp.controller('ForgotController', function ($http, $location, $mdDialog, UserService) {
    console.log('ForgotController created');
    var vm = this;

    // Query parameter
    var searchObject = $location.search();
    console.log(searchObject);

    vm.newPass = function (email) {
        var body = { email: email };
        $http.put('/forgot/check', body).then(function (response) {
            $location.path('/home');
        }).catch(function (response) {
            // show an error
        });
    };

    vm.resetPassword = function (email, password) {
        var body = { email: email, code: searchObject.code, password: password };
        $http.put('/auth/reset', body).then(function (response) {
            // Clear query params
            $location.search({});
            // Redirect back to home
            $location.path('/home');
        }).catch(function (response) {
            // show an error
        });
    };

});