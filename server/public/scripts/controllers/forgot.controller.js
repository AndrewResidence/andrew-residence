myApp.controller('ForgotController', function ($http, $location) {
    console.log('ForgotController created');
    var vm = this;

    // Query parameter
    vm.searchObject = $location.search();
    console.log(vm.searchObject);

    

    vm.newPass = function (email) {
        console.log(email);
        
        var body = { email: email };
        $http.put('/forgot/check', body).then(function (response) {
            $location.path('/home');
        }).catch(function (response) {
            // show an error
        });
    };

    vm.resetPassword = function (email, password) {
        var body = { email: email, code: vm.searchObject.code, password: password };
        console.log(body);
        
        $http.put('/forgot/reset', body).then(function (response) {
            // Clear query params
            $location.search({});
            // Redirect back to home
            $location.path('/home');
        }).catch(function (response) {
            // show an error
        });
    };

});