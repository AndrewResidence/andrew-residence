myApp.service('calendarService', function ($http, $location, $mdDialog) {
    console.log('calendarService Loaded');
    var self = this;

    //**********      supervisor calendar      ****************//

    self.today = moment();
    self.supervisorDayList = ['THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY'];
    self.scheduleDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    self.payPeriodStartAndEnd = [];
    self.currentSchedule = {
        dates: []
    };

    //pay period
    self.payPeriodStart = '';
    self.payPeriodEnd = '';
    self.currentPayPeriodArray = {
        dates: []
    };

    //gets pay period dates for supervisor view
    self.getPayPeriodDates = function () {
        self.currentSchedule.dates.length = 0;
        return $http.get('/shifts/payperiod/getdates').then(function (response) {
            self.payPeriodStartAndEnd = response.data;
            self.payPeriodStart = moment(response.data[0].start);
            self.payPeriodEnd = moment(response.data[0].end);
            self.checkPayPeriodCurrent(self.payPeriodStart, self.payPeriodEnd)
        })
            .catch(function (err) {
                console.log('error in getting pay period dates')
            });
    };

    //verifies if it is the current pay period today
    self.checkPayPeriodCurrent = function (payPeriodStart, payPeriodEnd) {
        if (moment(self.today).format('YYYY-MM-DD') >= moment(payPeriodStart).format('YYYY-MM-DD')
            && moment(self.today).format('YYYY-MM-DD') <= moment(payPeriodEnd).format('YYYY-MM-DD')) {
            self.currentPayPeriod(self.scheduleDays);
        }
        else if (moment(self.today).format('YYYY-MM-DD') > moment(payPeriodEnd).format('YYYY-MM-DD')) {
            self.updatePayPeriodDates().then(function (response) {
                self.getPayPeriodDates();
            });
        }
    };

    //updates the pay period dates in the DB if needed
    self.updatePayPeriodDates = function () {
        var rowId = 1;
        return $http.put('/shifts/payperiod/updatedates/' + rowId).then(function (response) {
            return response.data;
        }).catch(function(error){
            console.log('error in updating pay period service')
        })
    };

    //gets current pay period and adds day objects to the array
    self.currentPayPeriod = function (scheduleDays) {

        for (var i = 0; i < scheduleDays.length; i++) {
            self.currentSchedule.dates.push(
                {
                    moment: moment(self.payPeriodStart).add(scheduleDays[i], 'days'),
                    shifts: []
                }
            );
        }
    };

});