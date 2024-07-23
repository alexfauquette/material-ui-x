"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergePromise = exports.getSpawnedPromise = void 0;
const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [property, Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
  for (const [property, descriptor] of descriptors) {
    // Starting the main `promise` is deferred to avoid consuming streams
    const value = typeof promise === 'function' ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
    Reflect.defineProperty(spawned, property, {
      ...descriptor,
      value
    });
  }
  return spawned;
};

// Use promises instead of `child_process` events
exports.mergePromise = mergePromise;
const getSpawnedPromise = spawned => new Promise((resolve, reject) => {
  spawned.on('exit', (exitCode, signal) => {
    resolve({
      exitCode,
      signal
    });
  });
  spawned.on('error', error => {
    reject(error);
  });
  if (spawned.stdin) {
    spawned.stdin.on('error', error => {
      reject(error);
    });
  }
});
exports.getSpawnedPromise = getSpawnedPromise;