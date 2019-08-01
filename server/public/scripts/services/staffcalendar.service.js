myApp.service('StaffCalendarService', function ($http, $location, $mdDialog) {
    // console.log('staff calendar service Loaded');
    var self = this;

    self.today = moment();
    self.numDaysInCurrentMonth = '';
    self.firstOfMonth = moment();
    self.lastOfMonth = moment();
    self.displayMonth = moment();
    self.displayYear = moment();
    self.thisMonth = moment(self.today).month();
    self.currentYear = moment(self.today).year();
    self.monthDays = {
        dates: []
    };
    self.currentMonth = {
        dates: []
    };

    self.getNumDaysInCurrentMonth = function () {
        self.currentMonth.dates = [];
        self.numDaysInCurrentMonth = moment(self.today).daysInMonth();
        self.firstOfMonth.year(self.currentYear).month(self.thisMonth).date(1);
        self.lastOfMonth.year(self.currentYear).month(self.thisMonth).date(self.numDaysInCurrentMonth);
        self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth);
    };

    self.putDaysinCurrentMonthArray = function (currentYear, currentMonth, numDaysInCurrentMonth) {
        self.monthDays.dates = [];
        for (var i = 1; i <= numDaysInCurrentMonth; i++) {
            self.monthDays.dates.push(i);
        }
        self.getMonthDays(currentYear, currentMonth, self.monthDays.dates);
    };

    self.dayInWeek = '';
    self.getMonthDays = function (currentYear, currentMonth, monthDays) {
        self.dayInWeek = '';
        for (var i = 1; i <= monthDays.length; i++) {
            eachDay = {
                day: moment().year(currentYear).month(currentMonth).date(i),
                dayNum: moment().year(currentYear).month(currentMonth).date(i).format('D'),
                month: currentMonth,
                monthText: moment().month(currentMonth),
                year: currentYear,
                shifts: [],
                usershifts: []
            }
            self.currentMonth.dates.push(eachDay);
        }
        var firstDayofMonth = moment(self.currentMonth.dates[0].day._d).month();
        var currentYear = currentYear;
        self.dayInWeek = moment(self.currentMonth.dates[0].day._d).format('d')
        self.checkFirstDayOfMonth(self.dayInWeek, firstDayofMonth, currentYear);
        self.displayMonth.month(currentMonth);
        self.displayYear.year(currentYear);
    };

    self.checkFirstDayOfMonth = function (dayInWeek, currentMonth, currentYear) {
        var dayInWeek = parseInt(dayInWeek);
        if (dayInWeek != 0) {
            for (var i = 1; i <= dayInWeek; i++) {
                eachDay = {
                    day: '',
                    extra: i,
                    month: currentMonth,
                    year: currentYear,
                    dayNum: '.',
                    shifts: [],
                    usershifts: []
                };
                self.currentMonth.dates.unshift(eachDay);
            }
        }
    };

    //function to get previous month days and display for calendar
    self.prevMonth = function (currentDisplayMonth, currentYear) {
        self.currentMonth.dates = [];
        if (currentDisplayMonth === 0) {
            self.thisMonth = 11;
            self.currentYear = currentYear - 1;
        }
        else {
            self.thisMonth = currentDisplayMonth - 1;
        }
        self.firstOfMonth.year(self.currentYear).month(self.thisMonth).date(1);
        self.lastOfMonth.year(self.currentYear).month(self.thisMonth).date(self.numDaysInCurrentMonth);
        self.numDaysInCurrentMonth = moment().year(self.currentYear).month(self.thisMonth).daysInMonth();
        self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth);
        // vm.getShifts(vm.firstOfMonth, vm.lastOfMonth);
    }

    //function to get next month days and display for calendar
    self.nextMonth = function (currentDisplayMonth, currentYear) {
        self.currentMonth.dates = [];
        if (currentDisplayMonth === 11) {
            self.thisMonth = 0
            self.currentYear = currentYear + 1;
        }
        else {
            self.thisMonth = currentDisplayMonth + 1;
        }
        self.firstOfMonth.year(self.currentYear).month(self.thisMonth).date(1);
        self.lastOfMonth.year(self.currentYear).month(self.thisMonth).date(self.numDaysInCurrentMonth);
        self.numDaysInCurrentMonth = moment().year(self.currentYear).month(self.thisMonth).daysInMonth();
        self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth)
        // self.getShifts(self.firstOfMonth, self.lastOfMonth);
    }

});
