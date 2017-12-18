myApp.service('calendarService', function ($http, $location, $mdDialog) {
    console.log('calendarService Loaded');
    var self = this;
    //staff calendar
    // self.displayMonth = '';
    // self.displayYear = '';
    // self.StaffDayList = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    // self.today = moment();
    // self.thisMonth = moment(self.today).month();
    // self.currentYear = moment(self.today).year();
    // self.numDaysInCurrentMonth = '';
    // self.currentMonth = {
    //     dates: []
    // }

    // //puts each day of the month in array
    // self.monthDays = {
    //     dates: []
    // }

    // //gets number of days in month to display
    // self.getNumDaysInCurrentMonth = function () {
    //     console.log('get number days function happening')
    //     self.numDaysInCurrentMonth = moment(self.today).daysInMonth();
    //     console.log('self.numDaysInCurrentMonth')
    //     self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth);
    // }

    // //puts number of days in to array
    // self.putDaysinCurrentMonthArray = function (currentYear, currentMonth, numDaysInCurrentMonth) {
    //     self.monthDays.dates = [];
    //     for (var i = 1; i <= numDaysInCurrentMonth; i++) {
    //         self.monthDays.dates.push(i);
    //     }
    //     self.getMonthDays(currentYear, currentMonth, self.monthDays.dates);
    //     console.log('self.monthDays.dates', self.monthDays.dates)
    // }

    // self.dayInWeek = '';
    // self.getMonthDays = function (currentYear, currentMonth, monthDays) {
    //     console.log('currentMonth', currentMonth)
    //     self.dayInWeek = '';
    //     for (var i = 1; i <= monthDays.length; i++) {
    //         eachDay = {
    //             day: moment().year(currentYear).month(currentMonth).date(i),
    //             dayNum: moment().date(i).format('D'),
    //             month: currentMonth,
    //             monthText: moment().month(currentMonth),
    //             year: currentYear,
    //             shifts: []
    //         }
    //         self.currentMonth.dates.push(eachDay);
    //     }
    //     var firstDayofMonth = moment(self.currentMonth.dates[0].day._d).month();
    //     var currentYear = currentYear;
    //     self.dayInWeek = moment(self.currentMonth.dates[0].day._d).format('d')
    //     self.checkFirstDayOfMonth(self.dayInWeek, firstDayofMonth, currentYear);
    //     self.displayMonth = moment().month(currentMonth).format('MMMM');
    //     self.displayYear = moment(self.currentMonth.dates[0]);
    //     console.log('current list of days', self.currentMonth.dates)
    //     console.log('month and year for display', self.displayMonth, self.displayYear)
    // }

    // //checks for the first day of the month and adds objects to push calendar start
    // self.checkFirstDayOfMonth = function (dayInWeek, currentMonth, currentYear) {
    //     var dayInWeek = parseInt(dayInWeek);
    //     // console.log('firstDayofMonth', firstDayofMonth)
    //     if (dayInWeek != 0) {
    //         for (var i = 1; i <= dayInWeek; i++) {
    //             eachDay = {
    //                 day: '',
    //                 extra: i,
    //                 month: currentMonth,
    //                 year: currentYear,
    //                 dayNum: '.',
    //                 shifts: []
    //             }
    //             self.currentMonth.dates.unshift(eachDay);
    //         }
    //     }
    //     console.log('dates', self.currentMonth.dates)
    // }

    // function to get previous month
    // self.prevMonth = function (currentDisplayMonth, currentYear) {
    //     console.log('previous month clicked')
    //     self.currentMonth.dates = [];
    //     if (currentDisplayMonth === 0) {
    //         console.log('in the if')
    //         self.thisMonth = 11;
    //         self.currentYear = currentYear - 1;
    //         console.log('year, month', self.currentYear, self.thisMonth)
    //     }
    //     else {
    //         console.log('in the else')
    //         self.thisMonth = currentDisplayMonth - 1;
    //         console.log('year, month', self.currentYear, self.thisMonth)
    //     }
    //     self.numDaysInCurrentMonth = moment().year(self.currentYear).month(self.thisMonth).daysInMonth();
    //     console.log(self.numDaysInCurrentMonth)
    //     self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth)
    // }

    // //function to get next month
    // self.nextMonth = function (currentDisplayMonth, currentYear) {
    //     console.log('next month clicked')
    //     self.currentMonth.dates = [];
    //     if (currentDisplayMonth === 11) {
    //         self.thisMonth = 0
    //         self.currentYear = currentYear + 1;
    //         console.log('year, month', self.currentYear, self.thisMonth)
    //     }
    //     else {
    //         self.thisMonth = currentDisplayMonth + 1;
    //         console.log('year, month', self.currentYear, self.thisMonth)
    //     }
    //     self.numDaysInCurrentMonth = moment().year(self.currentYear).month(self.thisMonth).daysInMonth();
    //     self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth)
    // }

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
        return $http.get('/shifts/payperiod/getdates').then(function (response) {
            self.payPeriodStartAndEnd = response.data;
            self.payPeriodStart = moment(response.data[0].start);
            self.payPeriodEnd = moment(response.data[0].end);
            self.checkPayPeriodCurrent(self.payPeriodStart, self.payPeriodEnd)
        })
            .catch(function (err) {
                console.log('error')
            })
    }

    //verifies if it is the current pay period today
    self.checkPayPeriodCurrent = function (payPeriodStart, payPeriodEnd) {
        if (moment(self.today).format('MM-DD-YYYY') >= moment(payPeriodStart).format('MM-DD-YYYY')
            && moment(self.today).format('MM-DD-YYYY') <= moment(payPeriodEnd).format('MM-DD-YYYY')) {
            self.currentPayPeriod(self.scheduleDays);
        }
        else if (moment(self.today).format('MM-DD-YYYY') > moment(payPeriodEnd).format('MM-DD-YYYY')) {
            self.updatePayPeriodDates();
            self.getPayPeriodDates();
        }
    }

    //updates the pay period dates in the DB if needed
    self.updatePayPeriodDates = function () {
        var rowId = 1;
        return $http.put('/shifts/payperiod/updatedates/' + rowId).then(function (response) {
            return response.data;
        })
    }

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