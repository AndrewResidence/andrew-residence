myApp.service('UserService', function($http, $location){
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};

  //GET user upon logging in
  self.getuser = function(){
    console.log('UserService -- getuser');
    $http.get('/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userName = response.data.username;
            console.log('UserService -- getuser -- User Data: ', self.userObject.userName);
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  }

   //GET unconfirmed users on admin view
   self.getUnconfirmed = function(){
    return $http.get('/user/unconfirmed').then(function(response) {
       return response;
     });
   }

  //GET supervisors on admin view
  self.getSupervisors = function(){
   return $http.get('/user/supervisors').then(function(response) {
      return response;
    });
  }

  //GET staff on admin view
  self.getStaff = function(){
    return $http.get('/user/staff').then(function(response) {
       return response;
     });
   }

  self.logout = function() {
    console.log('UserService -- logout');
    $http.get('/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
  }
});
