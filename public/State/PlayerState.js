class PlayerState {
    constructor() {
        this.storyFlags = { "INTRO": true, "NO_CHECK": true };
        this.inbox = [];
    }

    addInboxItem(inboxItem) {
        this.inbox.push(inboxItem);
    }
  }
  window.playerState = new PlayerState();