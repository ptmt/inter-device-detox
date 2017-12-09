const fetch = require('node-fetch');

const port = require('./server');
const configuration = process.argv
  .slice(2)
  .find(c => c.indexOf('ios.sim.') > -1);

async function request(action, event) {
  try {
    const res = await fetch(
      `http://localhost:${port}/?action=${action}&configuration=${configuration}&payload=${event}`
    );
    return await res.text();
  } catch (e) {
    throw e;
  }
}

function delay(duration) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), duration);
  });
}

// Register this configuration
request('register');

module.exports = {
  async waitUntilEventHappensOnTheOtherSide(eventName) {
    // Since it's not expensive to spam our local server, we will do it
    // Let's wait until it happens on both sides
    let attempts = 0;
    const check = async () => {
      const res = await request('check', eventName);
      if (res === 'true') {
        console.log(`=> ${eventName}  Synced `);
        return true;
      }
      console.log(`=> ${eventName} Not synced yet. Waiting 2 sec to repeat`);
      if (attempts < 10) {
        await delay(2000);
        attempts++;
        return check();
      }
      throw new Error("Couldn't sync after 10 attempts");
    };

    return await check();
  },
  async reportThatEventJustHappened(eventName) {
    return request('report', eventName);
  },
  async syncWithEvent(eventName) {
    await this.reportThatEventJustHappened(eventName);
    await this.waitUntilEventHappensOnTheOtherSide(eventName);
  },
  shareVar(name, value) {
    return request('share', encodeURIComponent(`{"${name}":"${value}"}`));
  },
  async getSharedVars() {
    const text = await request('get_shared');
    return JSON.parse(text);
  },
};
