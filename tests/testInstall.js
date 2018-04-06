const expect = require('chai').expect;
const sinon = require('sinon');
const _ = require('lodash');
const config = { refocusUrl : 'zzz', token : 'dummy' };
// const config = { refocusUrl : 'localhost:3000', token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbm5hbWUiOiJhcyIsInVzZXJuYW1lIjoidGVzdCIsInRpbWVzdGFtcCI6MTUxNzE2MDk4NDIzMSwiUHJvZmlsZU5hbWUiOiJSZWZvY3VzVXNlciIsIklzQWRtaW4iOmZhbHNlLCJpYXQiOjE1MTcxNjA5ODR9.vobNbHJWHqQ3O7eaA-tJVBbB9DsVf723EQuCSl8mPjs' };
const bdk = require('../refocus-bdk-server')(config);
const { bot, botWithUI } = require('./utils');

describe('New Bot Installation: ', () => {
  beforeEach(() => {
    sinon.stub(bdk, 'installBot');
  });

  afterEach(() => {
    bdk.installBot.restore();
  });

  it('Ok, Bot Installed (No UI)', (done) => {
    const botWithId = _.clone(bot);
    botWithId.id = 'botId';

    bdk.installBot.resolves({ body: botWithId });

    bdk.installBot(bot)
      .then((res) => {
        const installedBot = res.body;
        expect(installedBot).to.have.property('id');
        expect(installedBot.name).to.equal(bot.name);
        expect(installedBot.url).to.equal(bot.url);
        expect(installedBot.version).to.equal(bot.version);
        expect(installedBot.actions).to.deep.equal(bot.actions);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Ok, Bot Installed (With UI)', (done) => {
    const botWithId = _.clone(botWithUI);
    botWithId.id = 'botId';

    bdk.installBot.resolves({ body: botWithId });

    bdk.installBot(botWithUI)
      .then((res) => {
        const installedBot = res.body;
        expect(installedBot).to.have.property('id');
        expect(installedBot).to.have.property('ui');
        expect(installedBot.name).to.equal(botWithUI.name);
        expect(installedBot.url).to.equal(botWithUI.url);
        expect(installedBot.version).to.equal(botWithUI.version);
        expect(installedBot.actions).to.deep.equal(botWithUI.actions);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Fail, Attempt to install the same Bot twice', (done) => {
    const error = 'duplicate';

    bdk.installBot.rejects(error);

    bdk.installBot(bot)
      .then(done)
      .catch(err => {
        // err object is returned by sinon
        if (err.name && (err.name === 'duplicate')) {
          done();
        } else if (err === 'duplicate') { // refocus returns string
          done();
        } else { // if none of the errors were returned fail test
          done(err);
        }
      });
  });
});
