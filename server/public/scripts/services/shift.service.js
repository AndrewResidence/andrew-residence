myApp.service('ShiftService', function ($http, $location, $mdDialog) {
  console.log('ShiftService Loaded');
  var self = this;
  self.shift = {};
  self.filledByName = { data: [] }
  self.newShift = {
    shiftDate: [],
    urgent: false,
    shift: '',
    adl: false,
    mhw: false,
    nurse: false,
    comments: '',
    notify: [],
    shift_status: '',
    floor: '',
    filled: null
  };

  self.updatedShift = {
    shiftDate: [],
    urgent: false,
    shift: '',
    adl: false,
    mhw: false,
    nurse: false,
    comments: '',
    // notify: 
    shift_status: ''
  };

  self.filledShift = {
    filledBy: '',
    shift_status: 'Filled'
  };

  self.shiftsToDisplay = { data: [] };
  self.filledByName = { data: [] };
  self.shiftDetails = function (event, shift) {
    self.shift = shift;
    return $http.get('/shifts/filled/who/' + shift.shift_id).then(function (response) {
      self.filledByName.data = response.data;
      return response;
    })
  }

  //addNewShift function and route
  self.addNewShift = function (staffId, selection, shiftDate, shiftStatus, urgent, shift, role, comments, notify, nurse, adl, mhw, floor) {
    console.log('filled by', staffId);
    console.log('the Selection', selection);
    console.log('shiftDate', shiftDate);
    staffId = self.newShift.filled;
    self.newShift.notify = selection;
    self.newShift.shiftDate = shiftDate;
    urgent = self.newShift.urgent;
    shift = self.newShift.shift;
    role = self.newShift.role;
    comments = self.newShift.comments;
    nurse = self.newShift.nurse;
    adl = self.newShift.adl;
    mhw = self.newShift.mhw;
    shiftStatus = self.newShift.shift_status;
    floor = self.newShift.floor;
    console.log('newshift', self.newShift);
    if (urgent) {
      $http.post('/message/urgent', self.newShift).then(function (response) {

        console.log(response);

      }).catch(function (response) {
        console.log('send urgent textMessage did not work:', response);
      });
    }

    return $http.post('/shifts/', self.newShift).then(function (response) {
      console.log('the response', response)
      self.newShift = {}
      return response;
    }).catch(function (err) {
      console.log('Error');
    });
  }; //end addNewShift function and route


  self.getShifts = function (firstDayofShifts, lastDayofShifts) {
    console.log('get shifts is running');
    console.log('first of month', firstDayofShifts);
    console.log('last Of Month', lastDayofShifts);
    var firstAndLastDays = {
      firstDayofShifts: firstDayofShifts, 
      lastDayofShifts: lastDayofShifts
    };
    self.shiftsToDisplay.data = [];
    // console.log('shifts to display service', self.shiftsToDisplay.data)
    return $http.put('/shifts', firstAndLastDays).then(function (response) {
      self.shiftsToDisplay.data = response.data;
      return response;
    });
  };

  
  self.pendingShifts = {
    data: []
  };

  self.getPendingShifts = function () {
    var today = moment().format('YYYY-MM-DD');
    return $http.get('/shifts/shiftbid/' + today).then(function (response) {
      self.pendingShifts.data = response.data;
      return response;
    }).catch(function(error){
      console.log('error in get pending shifts')
    })
  };

  self.getShiftsToConfirm = function (shiftId) {
    return $http.get('/shifts/shiftbidToConfirm/' + shiftId).then(function (response) {
      return response;
    }).catch(function(error){
      consoel.log('error in getting shifts to confirm')
    })
  };

  self.confirmShift = function(staffMember, allShifts) {
    return $http.post('/shifts/confirm', staffMember, allShifts).then(function (response) {
      return response;
    }).catch(function(error){
      console.log('error in confirming shifts')
    })
  };

  self.pickUpShift = function (shift, firstOfMonth, lastOfMonth) {
    return $http.post('/shifts/shiftBid', shift)
      return response;
  };

  self.myShifts = {
    data: []
  }
  self.getMyShifts = function (firstDayofShifts, lastDayofShifts) {
    var firstAndLastDays = {
        firstDayofShifts: firstDayofShifts, 
        lastDayofShifts: lastDayofShifts
    }
    return $http.put('/shifts/getmyshifts', firstAndLastDays).then(function (response) {
      self.myShifts.data = response.data;
      return response.data;
    }).catch(function(error){
      console.log('error in getting my shifts')
    })
  };


  /* for Message testing; see popUpTest Controller and message.html */
  self.sendTextMessage = function () {
    //what is required for Plivo to deliver message;
    textParams = {
      src: '',
      dst: '',
      text: '',

    };
    $http.post('/message/text').then(function (response) {

      console.log(response);

    }).catch(function (response) {
      console.log('send textMessage did not work:', response);
    });
  };//end of sendTextMessage

  self.sendEmailMessage = function () {
    $http.post('/message/email').then(function (response) {
      // neccessary params for email transport object;
      emailParams = {
        to: '', // list of receivers
        subject: '', // Subject line
        text: '', // plain text body;
        html: '', // html body
      };
      console.log(response);

    }).catch(function (response) {
      console.log('send emailMessage did not work: ', response);
    });
  };

  //start updateShift function
  self.updateShift = function (id, comments, shift, mhw, adl, nurse, date, floor) {
    self.updatedShift.shift_id = id;
    self.updatedShift.comments = comments;
    self.updatedShift.shift = shift;
    self.updatedShift.mhw = mhw;
    self.updatedShift.adl = adl;
    self.updatedShift.nurse = nurse;
    self.updatedShift.date = date;
    self.updatedShift.floor = floor;
    return $http.put('/shifts/update/' + id, self.updatedShift).then(function (response) {
      return response;
    }).catch(function (response) {
      console.log('Error updating shift');
    });
  };
  //end updateShift function

  //start deleteShift function
  self.deleteShift = function (shiftId) {
    return $http.delete('/shifts/delete' + shiftId).then(function (response) {
      return response;
    }).catch(function (response) {
      console.log('Error deleting shift');

    });
  };

  //start shiftFilled function
  self.shiftFilled = function (id, shiftId) {

    self.filledShift.filledBy = id;

    return $http.put('/shifts/filledBy/' + shiftId, self.filledShift)
      .then(function (response) {
        return response;
      }).catch(function (response) {
        console.log('Error filling shift');

      });
  };
  //end shiftFilled function

  self.showPickUpButton = true;
  self.showPickUpShift = function(shift) {
    self.showPickUpButton = true;
    if (shift.shift_status === 'Filled' || shift.shift_status === 'filled') {
      self.showPickUpButton = false;
    }
    for (var i = 0; i < self.myShifts.data.length; i++) {
      if (shift.shift_id === self.myShifts.data[i].shift_id) {
        self.showPickUpButton = false;
      }
    }
  };

});