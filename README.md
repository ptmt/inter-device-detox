# Testing multiple devices interacting with each other using Detox

A simple approach to coordinate Detox tests across multiple instances of Detox, useful for chat applications or any multi clients applications (e.g. Taxi app for drivers vs Taxi app for consumers);

The flakiness is also increased dramatically, since it's now depends on N devices, network and servers, but in some cases it could be desired since we test our app as a black box.

* Example screenshot

This example contains a simple chat server which is able to do very basic things:

* Register a new user on a startup
* Send a status when other user started typing
* Send a message to other user
* Get an status update when a message has been received on the server
* Get an status update when a message has been delivered to the end user

By using two or more instances of Detox e2e test processes that can interact with each other we can try to repeat all stages of the process.

## How it works

All we need is a locking mechanism. In this implementation, it's a node.js server that accepts certain commands and allows one device to wait for another, and share some information between them.

-- device1 -- [server] --- device 2 --

This is an experiment. And since Detox has its own server this features also could be incorporated there.

## Getting started

Since there are just a few small files with the approach that still has to be proven and polished, the recommended way is to vendor these files from `./e2e/crossdevice-detox`. In case you willing to help building this library and ready to send pull requests, you can go with the usual way:

```
yarn add crossdevice-detox --dev
```

also, add two or more configurations to your Detox `package.json` section and run your e2e tests with the convinient helper like this:

```json
  "scripts": {
    "e2e:instance1": "detox test -c ios.sim.instance1.debug",
    "e2e:instance2": "detox test -c ios.sim.instance2.debug",
    "e2e": "./node_modules/crossdevice-detox/parallel_commands.sh \"yarn e2e:instance1\" \"yarn e2e:instance\""
  }
```

and then after building your app just

```
yarn e2e
```

Detox also allows to reuse apps, and that is very handy in developement. See package.json.

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

```
