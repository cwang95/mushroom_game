class RevealingText {
    constructor(config) {
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 50;

        this.timeout = null;
        this.isDone = false;
    }

    revealChar(charList) {
        const next = charList.splice(0,1)[0];
        next.span.classList.add("revealed");
        if (charList.length > 0) {
            this.timeout = setTimeout(()=> {
                this.revealChar(charList)
            }, next.delayAfter);
        } else {
            this.isDone = true;
        }
    }

    warpToDone() {
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll("span").forEach(s => {
            s.classList.add("revealed");
        })
    }

    init() {
        let characters = [];
        this.text.split("").forEach(char => {
            // Create each span, add to DOM
            let span = document.createElement("span");
            span.textContent = char;
            this.element.appendChild(span);

            // Add span to internal state

            characters.push({
                span,
                delayAfter: char === " " ? 0 : this.speed,
            })
        })
        this.revealChar(characters);
    }
}