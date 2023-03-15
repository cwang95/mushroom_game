class PlayerState {
    constructor() {
        this.storyFlags = {};
        this.inbox = [
            { text: "Come quick!", from: "Amethyst", time: "0", acknowledged: false },
            { text: "Call me", from: "Dad", time: "0", acknowledged: false }
        ];
    }

    addInboxItem(inboxItem) {
        this.inbox.push(inboxItem);
    }
  }
  window.playerState = new PlayerState();