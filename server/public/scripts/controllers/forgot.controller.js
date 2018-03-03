myApp.controller('ForgotController', function ($http, $location) {
    console.log('ForgotController created');
    var vm = this;

    // Query parameter
    vm.searchObject = $location.search();

    vm.newPass = function (email) {
        console.log(email);
        
        var body = { email: email };
        $http.put('/forgot/check', body).then(function (response) {
            $location.path('/home');
        }).catch(function (response) {
            console.log('error in check', response);
        });
    };
    vm.resetPassword = function (email, password) {
        var body = { email: email, code: vm.searchObject.code, password: password };
        console.log(body);
        
        $http.put('/forgot/reset', body).then(function (response) {
            $location.search({});
            $location.path('/home');
        }).catch(function (response) {
            console.log('error in reset', response);
        
        });
    };

});