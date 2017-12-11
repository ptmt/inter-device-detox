const client = require('./inter-device-detox/client');
const isItFirstInstanceApp = process.argv
  .slice(2)
  .find(c => c.indexOf('ios.sim.consumer') > -1);

function makeString(length) {
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
    const message1 = makeString(10);
    await client.shareVar('message1', message1);
    if (isItFirstInstanceApp) {
      await element(by.id('ComposerTextInput')).tap();
      await element(by.id('ComposerTextInput')).typeText(message1);
    }
    if (!isItFirstInstanceApp) {
      await waitFor(element(by.id('TypingIndicator'))).toBeVisible();
    }

    await client.syncWithEvent('BeforeSendingAMessage');

    if (isItFirstInstanceApp) {
      await element(by.id('SendButton')).tap();
      // check optimistic update
      await waitFor(element(by.id('BlinkingIndicator')))
        .toBeVisible()
        .withTimeout(500);
      await expect(element(by.label(message1))).toBeVisible();
      await waitFor(element(by.id('SentButNotDeliveredIndicator')))
        .toBeVisible()
        .withTimeout(2000);
    }

    await client.syncWithEvent('MessageHasBeenSent');
    if (!isItFirstInstanceApp) {
      await waitFor(element(by.id('TypingIndicator'))).toNotExist();
      const shared = await client.getSharedVars();
      await expect(element(by.label(shared.message1))).toBeVisible();
    }
    if (isItFirstInstanceApp) {
      await waitFor(element(by.id('DeliveredIndicator')))
        .toBeVisible()
        .withTimeout(5000);
    }
  });
});
