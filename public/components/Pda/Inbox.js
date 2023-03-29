import OverlayComponent from "../OverlayComponent";

class InboxMessage {
    constructor({ text, from, time }) {
        this.text = text;
        this.from = from;
        this.time = time;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Inbox_message");
        this.element.innerHTML = (`
            <div class="Header">${this.from}:</div>
            <div class="Text">${this.text}</div>
        `);
    }
}

export default class Inbox extends OverlayComponent {
    constructor(config) {
        super(config)
        this.messages = [];
        this.id = "Inbox";
    }

    update(e) {
        const msg = new InboxMessage({
            text: e.detail.text,
            from: e.detail.from,
            time: 0
        });
        msg.createElement();
        this.messages.push(msg);
        this.element.appendChild(msg.element);
    }


    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Inbox");
        this.element.innerHTML = (`
            <h1 class="Inbox_title">Inbox</h1>
        `);
        const { playerState } = window;
        playerState.inbox.forEach((message) => {
        //   const pizza = playerState.pizzas[key];
            // const {text, from, time} = message;
            const msg = new InboxMessage(message);
            msg.createElement();
            this.messages.push(msg);
            this.element.appendChild(msg.element);
        })

        const updateHandler = e => {
            this.update(e);
        }
        document.addEventListener("NewInboxItem", updateHandler);
    }
}