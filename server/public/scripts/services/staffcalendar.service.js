myApp.service('StaffCalendarService', function ($http, $location, $mdDialog) {
    console.log('staff calendar service Loaded');
    var self = this;

    self.today = moment();
    self.numDaysInCurrentMonth = '';
    self.firstOfMonth = '';
    self.lastOfMonth = '';
    self.thisMonth = moment(vm.today).month();
    self.currentYear = moment(vm.today).year();
    self.monthDays = {
        dates: []
    };

    self.getNumDaysInCurrentMonth = function () {
        self.numDaysInCurrentMonth = moment(self.today).daysInMonth();
        self.firstOfMonth = moment().year(self.currentYear).month(self.thisMonth).date(1);
        self.lastOfMonth = moment().year(self.currentYear).month(self.thisMonth).date(self.numDaysInCurrentMonth);
        self.putDaysinCurrentMonthArray(self.currentYear, self.thisMonth, self.numDaysInCurrentMonth);
    };

    self.putDaysinCurrentMonthArray = function (currentYear, currentMonth, numDaysInCurrentMonth) {
        self.monthDays.dates = [];
        for (var i = 1; i <= numDaysInCurrentMonth; i++) {
            vm.monthDays.dates.push(i);
        }
        self.getMonthDays(currentYear, currentMonth, self.monthDays.dates);
    };

    self.dayInWeek = '';
    self.getMonthDays = function (currentYear, currentMonth, monthDays) {
        self.dayInWeek = '';
        for (var i = 1; i <= monthDays.length; i++) {
            eachDay = {
                day: moment().year(currentYear).month(currentMonth).date(i),
                dayNum: moment().date(i).format('D'),
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
        self.displayMonth = moment().month(currentMonth).format('MMMM');
        self.displayYear = moment(self.currentMonth.dates[0]);
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

});
