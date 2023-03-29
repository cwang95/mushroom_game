class PlayerState {
    constructor() {
        this.storyFlags = { "INTRO": true };
        this.inbox = [];
    }

    addInboxItem(inboxItem) {
        this.inbox.push(inboxItem);
    }
  }
  window.playerState = new PlayerState();