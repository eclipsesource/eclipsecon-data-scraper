const SessionAdapter = require('../src/SessionAdapter');
const {expect} = require('chai');
const set = require('lodash.set');
const get = require('lodash.get');

describe('SessionAdapter', () => {

  let sessionAdapter = new SessionAdapter();

  describe('adaptScheduleItem', () => {
    let adapter = sessionAdapter.adaptScheduleItem.bind(sessionAdapter);
    it('generated id', () => expect(adapter({}).id).not.to.be.empty);
    it('fixed type', () => expect(adapter({}).type).to.equal('schedule_item'));
    it('fixed category', () => expect(adapter({}).category).to.equal('schedule_item'));
    it('fixed session_type', () => expect(adapter({}).session_type).to.equal(''));
    it('missing room', () => expect(adapter({}).room).to.be.undefined);
    it('missing date', () => expect(adapter({}).date).to.be.undefined);
    itAdapts(adapter, 'nid');
    itAdapts(adapter, 'title');
    itAdapts(adapter, 'abstract');
    itAdapts(adapter, {'schedule_info.room_name': 'room'});
    itAdapts(adapter, {'schedule_info.date': 'date'}),
    itAdaptsTimes(adapter);
    itAdaptsPresenters(adapter);
  });

  describe('adaptSession', () => {
    let adapter = sessionAdapter.adaptSession.bind(sessionAdapter);
    it('generated id', () => expect(adapter({}).id).not.to.be.empty);
    it('fixed type', () => expect(adapter({}).type).to.equal('session'));
    it('title-cased session_type', () => expect(adapter({session_type: 'keynote'}).session_type).to.equal('Keynote'));
    it('missing session_type', () => expect(adapter({}).session_type).to.be.undefined);
    it('missing category', () => expect(adapter({}).category).to.be.undefined);
    itAdapts(adapter, 'nid');
    itAdapts(adapter, 'title');
    itAdapts(adapter, 'abstract');
    itAdapts(adapter, {'schedule_info.room_name': 'room'});
    itAdapts(adapter, {'schedule_info.date': 'date'}),
    itAdapts(adapter, {'track.name': 'category'});
    itAdaptsTimes(adapter);
    itAdaptsPresenters(adapter);
  });

  function itAdaptsPresenters(adapter) {
    for (let i = 0; i < 2; i++) {
      describe(`for presenter ${i}`, () => {
        it(`presenter${i}.fullname`, () => {
          let result = {};
          set(result, `speakers[${i}].first_name`, 'Foo');
          set(result, `speakers[${i}].last_name`, 'Bar');
          expect(adapter(result).presenter[i].fullname).to.equal('Foo Bar');
        });
        itAdapts(adapter, {[`speakers[${i}].uid`]: `presenter[${i}].id`});
        itAdapts(adapter, {[`speakers[${i}].twitter_handle`]: `presenter[${i}].twitter`});
        itAdapts(adapter, {[`speakers[${i}].picture`]: `presenter[${i}].picture`});
        itAdapts(adapter, {[`speakers[${i}].bio`]: `presenter[${i}].bio`});
        itAdapts(adapter, {[`speakers[${i}].job_title`]: `presenter[${i}].jobtitle`});
        itAdapts(adapter, {[`speakers[${i}].org`]: `presenter[${i}].organization`});
      })
    }
  }

  function itAdapts(adapterMethod, adaptation) {
    const FOO = 'foo';
    const adapter = adapterMethod.bind(sessionAdapter);
    let fromPath = typeof adaptation === 'string' ? adaptation : Object.keys(adaptation)[0];
    let toPath = typeof adaptation === 'string' ? adaptation : Object.values(adaptation)[0];
    let data = set({}, fromPath, FOO);
    let result = adapter(data);
    it(toPath, () => expect(get(result, toPath)).to.equal(FOO));
  }

  function itAdaptsTimes(adapterMethod) {
    itAdaptsTime(adapterMethod, {type: 'start'});
    itAdaptsTime(adapterMethod, {type: 'start', noTime: true});
    itAdaptsTime(adapterMethod, {type: 'start', noDate: true});
    itAdaptsTime(adapterMethod, {type: 'end'});
    itAdaptsTime(adapterMethod, {type: 'end', noTime: true});
    itAdaptsTime(adapterMethod, {type: 'end', noDate: true});
  }

  function itAdaptsTime(adapterMethod, {type, noTime = false, noDate = false}) {
    it(`${type} ${noTime ? 'without time' : ''}${noDate ? 'without date' : ''}`, () => {
      expect(adapterMethod.bind(sessionAdapter)({
        schedule_info: {
          date: noDate ? undefined : 'foo',
          [type + '_time']: noTime ? undefined : '10:00:00'
        }
      })[type]).to.equal(noTime || noDate ? undefined : 'foo 10:00');
    });
  }

});
