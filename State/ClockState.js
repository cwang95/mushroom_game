class ClockState {
    constructor() {
        this.time = 0;
        this.clockMap = {
            0: "12:00",
            1: "12:10",
            2: "12:20",
            3: "12:30",
            4: "12:40",
            5: "12:50",
        }
    }

    getTime() {
        return this.clockMap[this.time];
    }

    increaseTime() {
        this.time += 1;
    }
}
window.clockState = new ClockState();

window.timedEvents = {
    2: {
        events:[
            { 
                type: "chatMessage", 
                text: "Come to Toadstool now! Hurry!!!", 
                from: "Amethyst", 
                acknowledged: false
            }
        ]
    }
}