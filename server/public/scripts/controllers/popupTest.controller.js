myApp.controller('PopupTestController', function ($mdDialog, UserService, ShiftService) {

    ptc = this;
    

    ptc.sendText = function () {
        console.log('we are here in popup');
        
    ShiftService.sendTextMessage();
        
    };


});