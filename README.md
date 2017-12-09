# Testing two devices interacting with each other using Detox

* Example screenshot

## How it works

A node.js server that accepts certain commands and allows one device waiting for another, and share some information between them.

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

## API

```javascript
connect
wait
share
get shared
```
