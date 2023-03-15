class ChatMessage {
    constructor({ from, text, onComplete}) {
        this.from = from;
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        // Create element
        this.element = document.createElement("div");
        this.element.classList.add("ChatMessage");

        this.element.innerHTML =[`
            <h1 class="From">New chat</h1>
            <p class="From">${this.from}: </p>
            <p class="ChatMessage_p">${this.text}</p>
            <button class="Chat_exit" data-button="Close_chat">Close</button>
        `]

        this.element.querySelector("button").addEventListener("click", ()=> {
            // Close message
            this.done();
        })

        this.actionListener = new KeypressListener("Enter", ()=> {
            this.done();
        })
    }

    done() {
        this.actionListener.unbind();
        this.element.remove();
        this.onComplete();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}