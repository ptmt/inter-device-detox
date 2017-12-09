const client = require('./crossdevice-detox/client');
const isItFirstInstanceApp = process.argv
  .slice(2)
  .find(c => c.indexOf('ios.sim.consumer') > -1);

function makeString(length: number) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

describe('Chat app', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should be able to send and receive messages and correctly update delivery statuses', async () => {
    await expect(element(by.id('SendButton'))).toBeVisible();
    await expect(element(by.id('ComposerTextInput'))).toBeVisible();
    await client.syncWithEvent('ReadyToStart');
    const message1 = makeString(50);
    await client.shareVar('message1', message1);
    if (isItFirstInstanceApp) {
      await element(by.id('ComposerTextInput')).tap();
      await element(by.id('ComposerTextInput')).typeText(message1);
    }
    await client.syncWithEvent('TypingStarted');
    if (!isItFirstInstanceApp) {
      await expect(element(by.id('TypingIndicator'))).toBeVisible();
    }
    await client.syncWithEvent('BeforeSending');
    if (isItFirstInstanceApp) {
      await element(by.id('SendButton')).tap();
      // expect tick
      // expect
    }
    await client.syncWithEvent('BeforeSending');
    if (!isItFirstInstanceApp) {
      await expect(element(by.id('TypingIndicator'))).toBeInvisible();
      const message = await client.getSharedVars().message1;
    }
  });
});
