myApp.service('UserService', function ($http, $location) {
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};
  self.notifications = {data: []}
  //GET user upon logging in
  self.getuser = function () {
    console.log('UserService -- getuser');
    $http.get('/user').then(function (response) {
      if (response.data.username) {
        // user has a curret session on the server
        self.userObject.userName = response.data.username;
        self.userObject.userId = response.data.userId;
        self.userObject.name = response.data.name;
        self.userObject.phone = response.data.phone;
        self.userObject.role = response.data.role;
        console.log('user id', self.userObject.userId);
        console.log('user', response.data);
        console.log('UserService -- getuser -- User Data: ', self.userObject.userName);
      } else {
        console.log('UserService -- getuser -- failure');
        // user has no session, bounce them back to the login page
        $location.path("/home");
      }
    }, function (response) {
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  };

  //GET unconfirmed users on admin view
  self.getUnconfirmed = function () {
    return $http.get('/user/unconfirmed').then(function (response) {
      return response;
    });
  };

  //Users PUT route to confirm users and define their role (supervisor, nurse, MHW or ADL) 
  self.confirmUser = function (user) {
    console.log('user in service', user.id, user.role);
    var userToSend = {
      role: user.role
    };
    return $http.put('/user/confirm/' + user.id, userToSend).then(function (response) {
      return response;
    });
  };

  //GET supervisors on admin view
  self.getSupervisors = function () {
    return $http.get('/user/supervisors').then(function (response) {
      return response;
    });
  };

  //GET staff on admin view
  self.getStaff = function () {
    return $http.get('/user/staff').then(function (response) {
      return response;
    });
  };

  //Users PUT route to edit individual user
  self.editUser = function (user) {
    console.log('user in service', user.id, user.role, user.userName, user.phone);
    var userToSend = user;
    return $http.put('/user/edit/' + user.id, userToSend).then(function (response) {
      return response;
    });
  };

  //Users PUT route to edit individual user
  self.deleteUser = function (user) {
    console.log('user in service', user.id, user.role);
    return $http.delete('/user/' + user.id).then(function (response) {
      return response;
    });
  };

  self.logout = function () {
    console.log('UserService -- logout');
    $http.get('/user/logout').then(function (response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
  };

  self.message = {
    messageBody: '',
    headline: ''
  };

  self.createMessage = function (messageBody, headline) {
    self.message.messageBody = messageBody;
    self.message.headline = headline;
      return $http.post('/user/message/', self.message).then(function (response){
      return response
    })
  }

  self.getNotifications = function (){
    $http.get('/user/messages/').then(function (response){
      console.log('here in service')
      console.log('response', response.data)
      self.notifications.data = response.data
    })
  }

  self.deleteNotifcation = function (id) {
    return $http.delete('/user/messages/delete/' + id).then(function(response) {
      return response;
    })
  }



  self.sendProfile = function (newEmail, newPhone) {

    var editProfile = {
      username: newEmail,
      phone: newPhone,
    };

    console.log(editProfile);

    return $http.put('/user/profile/', editProfile)
      .then(function (response) {
        return response;
      }).catch(function (response) {
        console.log('error making edit');
      });

  };

});

