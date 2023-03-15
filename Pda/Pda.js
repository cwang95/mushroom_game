class Pda {
    constructor() {
        this.openMap = false;
        this.openInbox = false;
        this.openChat = false;

        this.hasNewMessages = false;
    }

    update() {
        const { clockState, playerState } = window;
        const clockElement = this.pdaElement.querySelector(".Pda_clock");
        clockElement.innerText = clockState.getTime();
        const inboxElement = this.pdaElement.querySelector(".Pda_inbox");
  
        console.log(inboxElement)
        // const inbox = [...playerState.inbox];
        inboxElement.innerText = `${playerState.inbox.length}`;
    }

    createElement() {
        this.pdaElement = document.createElement("div");
        this.pdaElement.classList.add("Pda");
        this.pdaElement.innerHTML = (`
          <p class="Pda_title">PDA</p>
          <button class="Pda_button" data-button="showMap">Map</button>
          <button class="Pda_button" data-button="showInbox">Inbox</button>
          <p class="Pda_clock">${clockState.getTime()}</p>
          <p class="Pda_inbox"></p>
        `);

        this.pdaElement.querySelectorAll("button").forEach(button => {
          button.addEventListener("click", () => {
            // const chosenOption = this.options[ Number(button.dataset.button) ];
            const chosen = button.dataset.button;
            this.overlayElement.show(chosen);
          })
        })

        const updateHandler = e => {
            this.update();
        }

        // Attach the complete handler to PersonWalkingComplete dispatch event
        document.addEventListener("TimePassed", updateHandler);
        document.addEventListener("NewInboxItem", updateHandler);
    }



    init(container) {
        this.createElement();
        this.overlayElement = new Overlay();
        this.overlayElement.init(container);
        container.appendChild(this.pdaElement);
        // container.appendChild(this.mapOverlay);
        // container.appendChild(this.chatOverlay);
        // this.update();
    }
}