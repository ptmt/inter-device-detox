# Testing multiple devices interacting with each other using Detox

A simple approach to coordinate Detox tests across multiple instances of Detox, useful for chat applications or any multi clients applications (e.g. Taxi app for drivers vs Taxi app for consumers);

The flakiness is also increased, since the overall result now depends on N Detox sessions, but also network and servers, although in some cases it could be desired behavior since we test our app as a black box.

![dec-11-2017 17-47-25](https://user-images.githubusercontent.com/1004115/33836772-6e25f5a4-de9b-11e7-8fc4-7ec78d179b8b.gif)

This example contains a simple chat server which is able to do very basic things:

* Register a new user on a startup
* Emulate slow server responses
* Send a status when other user started typing
* Send a message to other user
* Get an status update when a message has been received on the server
* Get an status update when a message has been delivered to the end user

By using two or more instances of Detox e2e test processes interacting with each other we can try to repeat all stages of the process, which is useful not only for testing, but for an automation in general, getting right from the scratch app to the specific state when you need it.

## How it works

All we need is some soft of a locking mechanism. In this implementation, it's a node.js server that accepts certain commands and allows one device to wait for another, and share some information between them.

```js
it('should be able to send and receive messages and correctly update delivery statuses', async () => {
  // ...
  if (isItFirstInstanceApp) {
    await element(by.id('ComposerTextInput')).tap();
    await element(by.id('ComposerTextInput')).typeText(message1);
  }
  if (!isItFirstInstanceApp) {
    await waitFor(element(by.id('TypingIndicator'))).toBeVisible();
  }

  await client.syncWithEvent('BeforeSendingAMessage');
  // at this point both instances waiting each other before proceeding by using a server
  // ...
}
```

This is an experiment. And since Detox has its own server this features also could be incorporated there.

## Getting started

Since there are just a few small files with the approach that still has to be proven and polished, the recommended way is to vendor these files from `./e2e/inter-device-detox`. In case you willing to help building this library and ready to send pull requests, you can go with the usual way:

```
yarn add inter-device-detox --dev
```

also, add two or more configurations to your Detox `package.json` section and run your e2e tests with the convinient helper like this:

```json
  "scripts": {
    "e2e:instance1": "detox test -c ios.sim.instance1.debug",
    "e2e:instance2": "detox test -c ios.sim.instance2.debug",
    "e2e": "./node_modules/inter-device-detox/parallel_commands.sh \"yarn e2e:instance1\" \"yarn e2e:instance\""
  }
```

and then after building your app just `yarn e2e`

Detox also allows to reuse app binaries which is very handy in developement. See package.json for `yarn e2e:reuse`.

## API

```javascript
import client from 'inter-device-detox';

client.syncWithEvent(event: string) // make sure this events happened on every device, a simple locking mechanism
client.shareVar(name: string, var: any) // make a var available on other app instances
client.getSharedVars(): {[string]: any} // obtain all shared variables from other devices
```

```

```
```
