class PlayerState {
    constructor() {
        this.storyFlags = {};
        this.inbox = [];
    }

    addInboxItem(inboxItem) {
        this.inbox.push(inboxItem);
    }
  }
  window.playerState = new PlayerState();