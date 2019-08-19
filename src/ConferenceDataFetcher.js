const fetch = require('node-fetch').default;
const Link = require('./Link');

module.exports = class ConferenceDataFetcher {

  async fetchConferenceData(event) {
    let attempts = 0;
    let sessions;
    let scheduleItems;
    while (++attempts <= 5) {
      try {
        sessions = await this._fetchPages(`https://www.eclipsecon.org/api/sessions?event=${event}&status=accepted`);
        scheduleItems = await this._fetchPages(`https://www.eclipsecon.org/api/schedule_items?event=${event}&status=accepted&scheduled=1`);
        break;
      } catch(e) {
        console.error('Error fetching data: ' + e.stack);
        if (attempts < 5) {
          console.log('Retrying in 10 seconds...');
          await this._wait(10000);
        } else {
          throw e;
        }
      }
    }
    return {sessions, scheduleItems};
  }

  async _fetchPages(url) {
    let allPages = [];
    let currentLink = {nextUrl: url};
    do {
      let {link, body} = await this._fetchPage(currentLink.nextUrl);
      currentLink = link;
      allPages = allPages.concat(body);
    } while (currentLink.nextUrl);
    return allPages;
  }

  async _fetchPage(url) {
    console.log('Fetching ' + url + '...');
    let response = await fetch(url);
    let link = new Link(response.headers.get('Link'));
    return {link, body: await response.json()};
  }

  async _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
