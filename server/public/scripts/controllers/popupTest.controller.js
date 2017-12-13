myApp.controller('PopupTestController', function ($mdDialog, UserService, ShiftService) {

    console.log('popups');
    

    ptc = this;
    

    ptc.sendTextMessage = function () {
        
    ShiftService.sendTextMessage();
        
    };

    ptc.sendEmailMessage = function () {

        ShiftService.sendEmailMessage();
        
    };

});