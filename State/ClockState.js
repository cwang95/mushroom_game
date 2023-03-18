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
            6: "1:00",
            7: "1:10",
            8: "1:20",
            9: "1:30",
            10: "1:40",
            11: "1:50",
            12: "2:00",
            13: "2:10",
            14: "2:20",
            15: "2:30",
            16: "2:40",
            17: "2:50",
            18: "3:00",
            19: "3:10",
            20: "3:20",
            21: "3:30",
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
    1: {
        events:[
            { 
                type: "chatMessage", 
                text: "Come to Toadstool now! Hurry!!!", 
                from: "Morel", 
                acknowledged: false
            }
        ]
    }
}