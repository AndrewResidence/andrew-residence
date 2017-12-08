myApp.controller('InfoController', function(UserService, $filter, $http, $q) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;

  // vm.dayFormat = "d";
  
  //     // To select a single date, make sure the ngModel is not an array.
  //     vm.selectedDate = null;
  
  //     // If you want multi-date select, initialize it as an array.
  //     vm.selectedDate = [];
  
  //     vm.firstDayOfWeek = 0; // First day of the week, 0 for Sunday, 1 for Monday, etc.
  //     vm.setDirection = function(direction) {
  //       vm.direction = direction;
  //       vm.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
  //     };
  
  //     vm.dayClick = function(date) {
  //       vm.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
  //     };
  
  //     vm.prevMonth = function(data) {
  //       vm.msg = "You clicked (prev) month " + data.month + ", " + data.year;
  //     };
  
  //     vm.nextMonth = function(data) {
  //       vm.msg = "You clicked (next) month " + data.month + ", " + data.year;
  //     };
  
  //     vm.tooltips = true;
  //     vm.setDayContent = function(date) {
  
  //         // You would inject any HTML you wanted for
  //         // that particular date here.
  //         return "<p></p>";
  
  //         // You could also use an $http function directly.
  //         return $http.get("/some/external/api");
  
  //         // You could also use a promise.
  //         var deferred = $q.defer();
  //         $timeout(function() {
  //             deferred.resolve("<p></p>");
  //         }, 1000);
  //         return deferred.promise;
  //     };
});
