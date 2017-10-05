# EventEmitterChain2

An event emitter built off of EventEmitterChain2 library. It is meant to allow proper ordered execution of any event handlers.

**NOTE: This library is experimental and not complete at all. The only functions expected to work are the following:**
  - `Emitter.on(...)`
  - `new Emitter(...)`
  - `Emitter.emit(...)`
  - `Emitter.setTerminator(...)`