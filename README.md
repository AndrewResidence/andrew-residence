# 

Shift Scheduler 
Andrew Residence requires a calendar/scheduling application to assist in sceduling on-call staff.  Shift Scheduler 

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

### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)
- [AngularJS](https://angularjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Express](http://expressjs.com/)
- [Angular Material](https://material.angularjs.org/latest/)
- [Moment](https://momentjs.com/docs/)
- [Plivo Helper Library](https://www.plivo.com/docs/helpers/node/)


### Installing

Steps to get the development environment running.

```sql
CREATE TABLE "users" (
  "id" serial primary key,
  "username" varchar(80) not null UNIQUE,
  "password" varchar(240) not null,
  "phone" numeric,
  "username" varchar(240),
  "confirmed" boolean
);
```

## Screen Shot

Include one or two screen shots of your project here (optional). Remove if unused.

## Documentation

Link to a read-only version of your scope document or other relevant documentation here (optional). Remove if unused.

### Completed Features

Supervisors
- [x] Post avaialble shifts
- [x] Confirm shifts
- [x] Schedule urgent shifts and notify staff with SMS
- [x] Send weekly shift reminder

On-call Staff
- [x] View available shifts and previously scheduled shifts
- [x] Place bids on available shifts
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

* Hat tip to anyone who's code was used
