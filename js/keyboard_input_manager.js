function KeyboardInputManager() {
  this.events = {};

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart    = "MSPointerDown";
    this.eventTouchmove     = "MSPointerMove";
    this.eventTouchend      = "MSPointerUp";
  } else {
    this.eventTouchstart    = "touchstart";
    this.eventTouchmove     = "touchmove";
    this.eventTouchend      = "touchend";
  }

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  let callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  let self = this;

  let map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
  };

  // Respond to direction keys
  document.addEventListener("keydown", function (event) {
    let modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    let mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }
    }

    // R key restarts the game
    if (!modifiers && event.which === 82) {
      self.restart.call(self, event);
    }
  });
  
  document.querySelector('.retry-button').addEventListener('click', goToLeaderboard);

  function goToLeaderboard(event) {
      event.preventDefault();
      window.location.href = 'leaderboard.html';
  }

  
  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restartWithConfirmation);
  this.bindButtonPress(".undo-button", this.undoWithConfirmation);    
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);
  this.bindButtonPress(".undo-move-button", this.undoMove);
  this.bindButtonPress(".confirm-button", this.restart);    
  this.bindButtonPress(".cancel-button", this.keepPlaying);

  // Respond to swipe events
  let touchStartClientX, touchStartClientY;
  let gameContainer = document.getElementsByClassName("container")[0];

  gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches > 1) {
      return; // Ignore if touching with more than 1 finger
    }

    if (window.navigator.msPointerEnabled) {
      touchStartClientX = event.pageX;
      touchStartClientY = event.pageY;
    } else {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    }

    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchmove, function (event) {
    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchend, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches > 0) {
      return; // Ignore if still touching with one or more fingers
    }

    let touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    let dx = touchEndClientX - touchStartClientX;
    let absDx = Math.abs(dx);

    let dy = touchEndClientY - touchStartClientY;
    let absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    }
  });
};

KeyboardInputManager.prototype.undoMove = function (event) {
  event.preventDefault();
  this.emit("undoMove");
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.restartWithConfirmation = function (event) {
  event.preventDefault();
  this.emit("restartWithConfirmation");
};

KeyboardInputManager.prototype.undoWithConfirmation = function (event) {
  event.preventDefault();
  this.emit("undoWithConfirmation");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  let button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};
