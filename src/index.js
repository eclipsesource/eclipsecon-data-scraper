const ConferenceDataFetcher = require('./ConferenceDataFetcher');
const SessionAdapter = require('./SessionAdapter');
const fs = require('fs');

(async () => {
  let event = process.argv[2];
  if (!event) {
    console.error('Usage: node index.js <event> (e.g. europe2019)');
    process.exit(1);
  }
  let fetcher = new ConferenceDataFetcher();
  let adapter = new SessionAdapter();
  let {sessions, scheduleItems} = await fetcher.fetchConferenceData(event);
  let output = [
    ...sessions.map(session => adapter.adaptSession(session)),
    ...scheduleItems.map(item => adapter.adaptScheduleItem(item))
  ];
  if (!fs.existsSync('output')){
    fs.mkdirSync('output');
  }
  fs.writeFileSync('output/eclipsecon_scheduled_sessions.json', JSON.stringify(output), 'utf-8');
})().catch(console.error);
