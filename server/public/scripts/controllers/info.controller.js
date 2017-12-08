// import { log } from "util";

myApp.controller('InfoController', function(UserService) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;

  vm.eventCreatea = function(event) {
    console.log('create event clicked', event)
    
  }



});
