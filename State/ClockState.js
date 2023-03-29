class ClockState {
    constructor() {
        this.time = 0;
        this.clockMap = {
            0: "12:00 PM",
            1: "12:10 PM",
            2: "12:20 PM",
            3: "12:30 PM",
            4: "12:40 PM",
            5: "12:50 PM",
            6: "1:00 PM",
            7: "1:10 PM",
            8: "1:20 PM",
            9: "1:30 PM",
            10: "1:40 PM",
            11: "1:50 PM",
            12: "2:00 PM",
            13: "2:10 PM",
            14: "2:20 PM",
            15: "2:30 PM",
            16: "2:40 PM",
            17: "2:50 PM",
            18: "3:00 PM",
            19: "3:10 PM",
            20: "3:20 PM",
            21: "3:30 PM",
            22: "3:40 PM",
            23: "3:50 PM",
            24: "4:00 PM",
            25: "4:10 PM",
            26: "4:20 PM",
            27: "4:30 PM",
            28: "4:40 PM",
            29: "4:50 PM",
            30: "5:00 PM",
            31: "5:10 PM",
            32: "5:20 PM",
            33: "5:30 PM",
            34: "5:40 PM",
            35: "5:50 PM",
            36: "6:00 PM",
            37: "6:10 PM",
            38: "6:20 PM",
            39: "6:30 PM",
            40: "6:40 PM",
            41: "6:50 PM",
            42: "7:00 PM",
            43: "7:10 PM",
            44: "7:20 PM",
            45: "7:30 PM",
            46: "7:40 PM",
            47: "7:50 PM",
            48: "8:00 PM",
            49: "8:10 PM",
            50: "8:20 PM",
            51: "8:30 PM",
            52: "8:40 PM",
            53: "8:50 PM",
            54: "9:00 PM",
            55: "9:10 PM",
            56: "9:20 PM",
            57: "9:30 PM",
            58: "9:40 PM",
            59: "9:50 PM",
            60: "10:00 PM",
            61: "10:10 PM",
            62: "10:20 PM",
            63: "10:30 PM",
            64: "10:40 PM",
            65: "10:50 PM",
            66: "11:00 PM",
            67: "11:10 PM",
            68: "11:20 PM",
            69: "11:30 PM",
            70: "11:40 PM",
            71: "11:50 PM",
        };
    }

    getTime() {
        return this.clockMap[this.time];
    }

    increaseTime() {
        this.time += 1;
        return this.getTime();
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
    },
    6: {
        events:[
            { 
                type: "chatMessage", 
                text: "Hamanita your check is ready... Come to ice cream store. I have bad news", 
                from: "The Boss Man", 
                acknowledged: false
            },
            { type: "addStoryFlag", flag: "KANDI_MSG"}
            // KANDI_MSG
        ]

    }
}