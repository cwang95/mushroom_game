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

class Inbox {
    constructor() {
        this.messages = [];
    }

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }

    update(e) {
        console.log("Inbox message should update");
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

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}