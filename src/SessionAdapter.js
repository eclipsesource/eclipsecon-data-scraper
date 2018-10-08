const get = require('lodash.get');
const omitBy = require('lodash.omitby');

module.exports = class SessionAdapter {

  adaptScheduleItem(scheduleItem) {
    return {
      id: uuidv4(),
      nid: scheduleItem.nid,
      title: scheduleItem.title,
      abstract: scheduleItem.abstract,
      type: 'schedule_item',
      category: 'schedule_item',
      session_type: '',
      room: get(scheduleItem, 'schedule_info.room_name'),
      presenter: this._adaptSpeakers(scheduleItem.speakers),
      ...this._adaptDayTimes(scheduleItem)
    };
  }

  adaptSession(session) {
    return {
      id: uuidv4(),
      nid: session.nid,
      title: session.title,
      abstract: session.abstract,
      type: 'session',
      category: get(session, 'track.name'),
      room: get(session, 'schedule_info.room_name'),
      session_type: this._capitalizeFirstLetter(session.session_type),
      presenter: this._adaptSpeakers(session.speakers),
      ...this._adaptDayTimes(session)
    };
  }

  _adaptDayTimes(item) {
    let date = get(item, 'schedule_info.date');
    let startTime = get(item, 'schedule_info.start_time');
    let endTime = get(item, 'schedule_info.end_time');
    return {
      date,
      start: this._adaptTime(date, startTime),
      end: this._adaptTime(date, endTime)
    }
  }

  _capitalizeFirstLetter(text) {
    if (typeof text !== 'string') return;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  _adaptSpeakers(speakers) {
    if (!speakers) return;
    return speakers.map(({uid, name, twitter_handle, picture, bio, job_title, org}) => omitBy({
      id: uid,
      fullname: name,
      twitter: twitter_handle,
      picture,
      bio,
      jobtitle: job_title,
      organization: org
    }, isUndefined));
  }

  _adaptTime(date, time) {
    return date && time ? `${date} ${time.replace(/:\d+$/, '')}` : undefined;
  }

};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let isUndefined = val => val === undefined;
