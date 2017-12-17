myApp.service('calendarService', function ($http, $location, $mdDialog) {
    console.log('calendarService Loaded');
    var self = this;
    //staff calendar
    self.displayMonth = '';
    self.displayYear = '';
    self.StaffDayList = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    self.today = moment();
    self.thisMonth = moment(self.today).month();
    self.currentYear = moment(self.today).year();
    self.numDaysInCurrentMonth = '';
    self.currentMonth = {
        dates: []
    }

    //puts each day of the month in array
    self.monthDays = {
        dates: []
    }

    //gets number of days in month to display
    self.getNumDaysInCurrentMonth = function () {
        console.log('get number days function happening')
        self.numDaysInCurrentMonth = moment(self.today).daysInMonth();
        self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth);
    }

    //puts number of days in to array
    self.putDaysinCurrentMonthArray = function (currentYear, currentMonth, numDaysInCurrentMonth) {
        self.monthDays.dates = [];
        for (var i = 1; i <= numDaysInCurrentMonth; i++) {
            self.monthDays.dates.push(i);
        }
        self.getMonthDays(currentYear, currentMonth, self.monthDays.dates);
    }

    self.dayInWeek = '';
    self.getMonthDays = function (currentYear, currentMonth, monthDays) {
        console.log('currentMonth', currentMonth)
        self.dayInWeek = '';
        for (var i = 1; i <= monthDays.length; i++) {
            eachDay = {
                day: moment().year(currentYear).month(currentMonth).date(i),
                dayNum: moment().date(i).format('D'),
                month: currentMonth,
                monthText: moment().month(currentMonth),
                year: currentYear,
                shifts: []
            }
            self.currentMonth.dates.push(eachDay);
        }
        var firstDayofMonth = moment(self.currentMonth.dates[0].day._d).month();
        var currentYear = currentYear;
        self.dayInWeek = moment(self.currentMonth.dates[0].day._d).format('d')
        self.checkFirstDayOfMonth(self.dayInWeek, firstDayofMonth, currentYear);
        self.displayMonth = moment().month(currentMonth).format('MMMM');
        self.displayYear = moment(self.currentMonth.dates[0]);
    }

    //checks for the first day of the month and adds objects to push calendar start
    self.checkFirstDayOfMonth = function (dayInWeek, currentMonth, currentYear) {
        var dayInWeek = parseInt(dayInWeek);
        // console.log('firstDayofMonth', firstDayofMonth)
        if (dayInWeek != 0) {
            for (var i = 1; i <= dayInWeek; i++) {
                eachDay = {
                    day: '',
                    extra: i,
                    month: currentMonth,
                    year: currentYear,
                    dayNum: '.',
                    shifts: []
                }
                self.currentMonth.dates.unshift(eachDay);
            }
        }
        console.log('dates', self.currentMonth.dates)
    }

    //function to get previous month
    self.prevMonth = function (currentDisplayMonth, currentYear) {
        self.currentMonth.dates = [];
        if (currentDisplayMonth === 0) {
            self.thisMonth = 11;
            self.currentYear = currentYear - 1;
            console.log('year, month', self.currentYear, self.thisMonth)
        }
        else {
            self.thisMonth = currentDisplayMonth - 1;
            console.log('year, month', self.currentYear, self.thisMonth)
        }
        self.numDaysInCurrentMonth = moment().year(self.currentYear).month(self.thisMonth).daysInMonth();
        self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth)
    }

    //function to get next month
    self.nextMonth = function (currentDisplayMonth, currentYear) {
        self.currentMonth.dates = [];
        if (currentDisplayMonth === 11) {
            self.thisMonth = 0
            self.currentYear = currentYear + 1;
            console.log('year, month', self.currentYear, self.thisMonth)
        }
        else {
            self.thisMonth = currentDisplayMonth + 1;
            console.log('year, month', self.currentYear, self.thisMonth)
        }
        self.numDaysInCurrentMonth = moment().year(self.currentYear).month(self.thisMonth).daysInMonth();
        self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth)
    }

    //**********supervisor calendar****************//

    //used for assigning month/day in the calendar header
    self.month = '';
    self.year = '';
    self.today = moment();
    self.dayInCycle = '';
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


    self.getPayPeriodDates = function () {



        return $http.get('/shifts/payperiod/getdates').then(function (response) {
            console.log('response', response.data)
            self.payPeriodStartAndEnd = response.data;
            return response.data;
            
        })
            .catch(function (err) {
                console.log('error')
            })
    }

    self.updatePayPeriodDates = function () {
        var rowId = 1;
        return $http.put('/shifts/payperiod/updatedates/' + rowId).then(function (response) {
            console.log('response', response.data)
            return response.data;
        })
    }

    self.currentPayPeriod = function (scheduleDays) {
        console.log('scheduledays', scheduleDays)
        console.log('self.payperiodstart', self.payPeriodStart)
        for (var i = 0; i < scheduleDays.length; i++) {
            self.currentSchedule.dates.push(
                {
                    moment: moment(self.payPeriodStart).add(scheduleDays[i], 'days'),
                    shifts: []
                }
            );
        }
        console.log('self.currentSchedule.dates', self.currentSchedule.dates)
        self.month = moment(self.payPeriodStart).format('MMMM');
        self.year = moment(self.payPeriodStart).format('YYYY');
    };
    //function to pull prior two weeks of dates
    self.prevTwoWeeks = function (date) {
        self.currentSchedule.dates = [];
        var prevTwoWeeks = moment(self.payPeriodStart).subtract(14, 'days');
        self.payPeriodStart = prevTwoWeeks;
        for (var i = 0; i < self.scheduleDays.length; i++) {
            self.currentSchedule.dates.push({ moment: moment(prevTwoWeeks._d).add(self.scheduleDays[i], 'days'), shifts: [] });
        }
        self.month = moment(prevTwoWeeks._d).format('MMMM');
        self.year = moment(prevTwoWeeks._d).format('YYYY')
        self.getShifts();
    };

    //function to get next two weeks of dates
    self.nextTwoWeeks = function (date) {
        self.currentSchedule.dates = [];
        var nextTwoWeeks = moment(self.payPeriodStart).add(14, 'days');
        self.payPeriodStart = nextTwoWeeks;
        for (var i = 0; i < self.scheduleDays.length; i++) {
            self.currentSchedule.dates.push({ moment: moment(nextTwoWeeks._d).add(self.scheduleDays[i], 'days'), shifts: [] });

        }
        self.month = moment(nextTwoWeeks._d).format('MMMM');
        self.year = moment(nextTwoWeeks._d).format('YYYY');
        self.getShifts();
    };
});