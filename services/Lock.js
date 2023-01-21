const { EventEmitter } = require('events');

class Lock {
  constructor() {
    this.locked = false;
    this.currentEvent = new EventEmitter();
  }

  acquire() {
    return new Promise(resolve => {
      // if not acquired already 
      
      if (this.locked === false) {
        this.locked = true;
        return resolve();
      }

      // else wait....
      
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