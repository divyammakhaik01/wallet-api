const { EventEmitter } = require('events');

class Lock {
  constructor() {
    this.locked = false;
    this.currentEvent = new EventEmitter();
  }

  acquire() {
    return new Promise(resolve => {
      if (this.locked === false) {
        this.locked = true;
        return resolve();
      }

      const acquireLock = () => {
        if (this.locked === false) {
          this.locked = true;
          this.currentEvent.removeListener('release', acquireLock);
          return resolve();
        }
      };
      this.currentEvent.on('release', acquireLock);
    });
  }

  release() {
    this.locked = false;
    setImmediate(() => this.currentEvent.emit('release'));
  }

}

module.exports = Lock ;