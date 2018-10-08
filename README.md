# EclipseCon Data Scraper

Scrapes data from https://www.eclipsecon.org/api/sessions and https://www.eclipsecon.org/api/schedule_items and aggregates it into a .json file compatible with format of the legacy 'api/1.0/eclipsecon_scheduled_sessions' endpoint supported by [Tabris Con](https://github.com/eclipsesource/tabris-con).

## Compatibility

Tested with Node.js 8 and 10.

## Build

```sh
npm install
npm run build
```

## Run

```sh
node dist/index.js
```

This will generate `output/eclipsecon_scheduled_sessions.json` relative to the working directory of the script.

## Test

```sh
npm test
```
