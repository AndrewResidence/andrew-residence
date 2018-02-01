#Andrew Residence Shift Calendar

Andrew Residence requires a calendar/scheduling application to assist in sceduling on-call staff.  

## Built With

SQL
Express
AngularJS
Node.js
Nodemailer
MomentJS
Plivo API

## Getting Started

Fork repo from (https://github.com/Andrew-Residence/group-project)

Download or clone this repository
Get a [Plivo API Key and Phone Number](https://developers.plivo.com/);
Get [Google oAuth Credentials] (https://console.developers.google.com/)
Copy the example.env file and rename to .env add your Keys and Secrets
Create database using the Andrew Residence_postgres_create.sql document


### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)
- [AngularJS](https://angularjs.org/)
- [Express](http://expressjs.com/)
- [Angular Material](https://material.angularjs.org/latest/)
- [Moment](https://momentjs.com/docs/)
- [Plivo Helper Library](https://www.plivo.com/docs/helpers/node/)


### Installing

Run npm install


## Screen Shot

![Supervisor Calendar](server/public/styles/screenshot1.png)
![Supervisor Add Shift View](server/public/styles/screenshot2.png)
![On Call Staff Calendar](server/public/styles/screenshot3.png)


### Completed Features
Administrator features:
- [x] Confirm new users and indicate a new user's role (supervisor or on-call staff)
- [x] Edit users
- [x] Remove users

Communication features:
- [x] Weekly digest email is sent out to all on-call staff with all open upcoming shifts
- [x] When a supervisor posts an 'urgent' shift, an SMS is immediately sent out to all on-call staff with the role(s) that the supervisor marked when adding the shift.
- [x] When an on-call staff member picks up a shift, an email is sent to all supervisors to inform them
- [x] When a supervisor confirms an on-call staff member for a shift, an email is sent to that staff member letting them know they have been confirmed. If another on-call staff member has requested the same shift, an email will also be sent to that staff member letting them know someone else has been confirmed for the shift.

Supervisor features: 
- [x] View all open, pending and confirmed shifts in a calendar of the current pay-period
- [x] Post a new shift, including shift role(s), floor, shift time, shift date(s), and comments
- [x] Schedule urgent shifts and notify staff with SMS
- [x] Confirm on-call staff for shifts
- [x] Edit and delete an existing shift if the shift has not been confirmed

On-call Staff Features
- [x] View all open, pending and confirmed shifts in a calendar of the current month
- [x] Calendar view is mobile-responsive
- [x] View a 'My Shifts' tab that shows the shifts they have picked up, including both pending shifts and confirmed shifts
- [x] Pick up available shifts, with the option of adding comment 
- [x] Edit profile information


### Next Steps

- Receive schedule by texting keyword to Plivo Number

## Deployment

Add additional notes about how to deploy this on a live system

## Authors

* Sarah Harrington
* Marta Jopp
* Emma Stout
* Josh Nothum

## Acknowledgments

* Thank you to Chris Black and Kris Szafranski, our instructors at Prime Digital Academy.
* Thank you to instructors at Prime Digital Academy for providing the Passport architecture for this project.
