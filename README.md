# after-uber-app

Demo app for working with Uber API

## Installation

At first, make sure that you have `Node.JS` and `Bower` installed.
Then, resolve dependencies:

```
npm i
```

## Configuration

To configure app, please edit the `config.json` file

`uber` - Uber Application Credentials (you can find them in your developer console)

**NOTE** Make sure, that you application setup for authorization redirect URL: http://localhost:3000/api/callback (or port that you selected)

`google` - Google Maps API key (used for geolocation)

`discount` - Uber Discount (20% by default)

`app.port` - Port, where application will be launched

## Run

To run application, just execute

`npm start`
