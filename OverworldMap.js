const MAP_TOP_X = 6.5;
const MAP_TOP_Y = 3.5

class OverworldMap {
    constructor(config) {
        this.overworld = null;
        
        // Live Objects are in here
        this.gameObjects = {};

        // Configs for live objects live here
        this.configObjects = config.configObjects;


        // Collisions
        this.walls = config.walls || {};

        this.withCameraPerson = config.withCameraPerson || false;
        // this.cameraPerson = this.withCameraPerson ? this.gameObjects.hero : null;
        
        // Floor
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc; // floor

        // Rooftop/sky
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc; // rooftops, sky

        this.isCutscenePlaying = false;
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        this.initialEvents = config.initialEvents || {};
    }

    updateObjects(state) {
        Object.values(this.gameObjects).forEach(object => {
          object.update({
            arrow: state.arrow,
            map: state.map,
            deltaTime: state.deltaTime
          });
        })
    }

    draw(ctx) {
        const xOffset = this.withCameraPerson ? utils.withGrid(MAP_TOP_X*2) - this.gameObjects.hero.x :  utils.withGrid(MAP_TOP_X);
        const yOffset = this.withCameraPerson ? utils.withGrid(MAP_TOP_Y*2) - this.gameObjects.hero.y :  utils.withGrid(MAP_TOP_Y);

        this.drawLower(ctx, xOffset, yOffset);
        //  Draw game objects
        Object.values(this.gameObjects)
            .sort((a,b)=> {
            return a.y-b.y;
            }).forEach(object => {
            object.sprite.draw(ctx, xOffset, yOffset);
        })
        this.drawUpper(ctx, xOffset, yOffset);
    }

    drawLower(ctx, x, y) {
        ctx.drawImage(
            this.lowerImage, 
            x, 
            y
        );
    }

    drawUpper(ctx, x, y) {
        ctx.drawImage(
            this.upperImage, 
            x, 
            y
        );
    }

    drawObj(ctx, xOffset, yOffset) {
        Object.values(this.gameObjects)
          .sort((a,b)=> {
            return a.y-b.y;
          }).forEach(object => {
            object.sprite.drawWithCameraPerson(ctx, xOffset, yOffset);
        })
    }

    drawLowerImage(ctx) {
        ctx.drawImage(
            this.lowerImage, 
            utils.withGrid(MAP_TOP_X), 
            utils.withGrid(MAP_TOP_Y)
        );
    }
    
    drawUpperImage(ctx) {
        ctx.drawImage(
            this.upperImage, 
            utils.withGrid(MAP_TOP_X), 
            utils.withGrid(MAP_TOP_Y)
        );
    }

    drawLowerImageWithCameraPerson(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage, 
            utils.withGrid(MAP_TOP_X*2) - cameraPerson.x, 
            utils.withGrid(MAP_TOP_Y*2) - cameraPerson.y
        );
    }
    
    drawUpperImageWithCameraPerson(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage, 
            utils.withGrid(MAP_TOP_X*2) - cameraPerson.x, 
            utils.withGrid(MAP_TOP_Y*2) - cameraPerson.y
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    playInitialScenes() {
        if (this.initialEvents.length) {
            this.startCutscene(this.initialEvents);
        }
    }

    mountHero() {

    }

    mountObjects() {
        Object.keys(this.configObjects).forEach(key => {
            let object = this.configObjects[key];
            object.id = key;

            let instance;

            if (object.type === "Person") {
                instance = new Person(object);
            }

            this.gameObjects[key] = instance;
            this.gameObjects[key].id = key;

            instance.mount(this);
        })
    }

    unmountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key];
            object.id = key;

            // Can add logic mounting objects here
            object.unmount(this);
        })
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        // Start async loop and await each
        for (let i = 0; i<events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        // console.log(this.gameObjects);

        // Reset NPCs 
        Object.values(this.gameObjects).forEach(obj => obj.doBehaviorEvent(this));
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(obj => {
            return `${obj.x},${obj.y}` === `${nextCoords.x},${nextCoords.y}`
        })
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events);
        }
    }

    checkForTimedCutscene() {
        const { clockState, timedEvents } = window;
        const match = timedEvents[clockState.time];
        console.log("Checking for timed cutscene");
        
        if (match) {
            console.log("Message found!")
            this.startCutscene(match.events);
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events);
        }
    }

    // addWall(x, y) {
    //     this.walls[`${x},${y}`] = true;
    // }

    // removeWall(x, y) {
    //     delete this.walls[`${x},${y}`];
    // }

    // moveWall(wasX, wasY, direction) {
    //     this.removeWall(wasX,wasY);
    //     const {x,y} = utils.nextPosition(wasX, wasY, direction);
    //     this.addWall(x,y);
    // }
}

window.OverworldMaps = {
    Bedroom: {
        lowerSrc: "./images/maps/BedroomLower.png",
        upperSrc: "./images/maps/bedroom_3_upper.PNG",
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(6),
                y: utils.withGrid(2)
            }
        },
        gameObjects: {

        },
        // Use object for walls for quick lookup
        walls: {

            // top wall
            [utils.asGridCoord(0,1)]: true,
            [utils.asGridCoord(1,1)]: true,
            [utils.asGridCoord(3,1)]: true,
            [utils.asGridCoord(2,1)]: true,
            [utils.asGridCoord(5,1)]: true,
            [utils.asGridCoord(4,1)]: true,
            [utils.asGridCoord(6,1)]: true,
            [utils.asGridCoord(7,1)]: true,

            // left wall
            [utils.asGridCoord(-1,0)]: true,
            [utils.asGridCoord(-1,1)]: true,
            [utils.asGridCoord(-1,2)]: true,
            [utils.asGridCoord(-1,3)]: true,
            [utils.asGridCoord(-1,4)]: true,
            [utils.asGridCoord(-1,5)]: true,
            [utils.asGridCoord(-1,6)]: true,
            [utils.asGridCoord(-1,7)]: true,
            [utils.asGridCoord(-1,8)]: true,

            // right wall
            [utils.asGridCoord(8,0)]: true,
            [utils.asGridCoord(8,1)]: true,
            [utils.asGridCoord(8,2)]: true,
            [utils.asGridCoord(8,4)]: true,
            [utils.asGridCoord(8,5)]: true,
            [utils.asGridCoord(8,6)]: true,
            [utils.asGridCoord(8,7)]: true,
            [utils.asGridCoord(8,8)]: true,

            // bed frame
            [utils.asGridCoord(6,3)]: true,
            [utils.asGridCoord(7,3)]: true,

            // dresser
            [utils.asGridCoord(6,5)]: true,
            [utils.asGridCoord(6,6)]: true,
            [utils.asGridCoord(6,7)]: true,
            [utils.asGridCoord(7,5)]: true,
            [utils.asGridCoord(7,6)]: true,
            [utils.asGridCoord(7,7)]: true,


            [utils.asGridCoord(0,8)]: true,
            [utils.asGridCoord(1,8)]: true,
            // [utils.asGridCoord(3,8)]: true,
            [utils.asGridCoord(2,8)]: true,
            [utils.asGridCoord(5,8)]: true,
            [utils.asGridCoord(4,8)]: true,
            [utils.asGridCoord(6,8)]: true,
            [utils.asGridCoord(7,8)]: true,


            // desk
            // [utils.asGridCoord(0,3)]: true,
            [utils.asGridCoord(0,4)]: true,
            [utils.asGridCoord(0,5)]: true,
            [utils.asGridCoord(0,6)]: true,

            // [utils.asGridCoord(1,3)]: true,
            [utils.asGridCoord(1,4)]: true,
            [utils.asGridCoord(1,5)]: true,
            [utils.asGridCoord(1,6)]: true,
            
        },
        cutsceneSpaces: {
            [utils.asGridCoord(3,8)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "LivingRoom" },
                    ]
                }
            ]
        }
    },
    LivingRoom: {
        lowerSrc: "./images/maps/LivingRoomLower.png",
        upperSrc: "./images/maps/LivingRoomUpper.png",
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(1),
                y: utils.withGrid(2)
            }
        },
        gameObjects: {

        },
        // Use object for walls for quick lookup
        walls: {

            // top wall
            [utils.asGridCoord(0,1)]: true,
            [utils.asGridCoord(1,1)]: true,
            [utils.asGridCoord(2,1)]: true,
            [utils.asGridCoord(3,2)]: true,
            [utils.asGridCoord(4,2)]: true,
            [utils.asGridCoord(5,2)]: true,
            [utils.asGridCoord(6,2)]: true,
            [utils.asGridCoord(7,2)]: true,
            [utils.asGridCoord(8,2)]: true,
            [utils.asGridCoord(9,2)]: true,
            [utils.asGridCoord(10,2)]: true,
            [utils.asGridCoord(11,2)]: true,

            // left wall
            [utils.asGridCoord(-1,0)]: true,
            [utils.asGridCoord(-1,1)]: true,
            [utils.asGridCoord(-1,2)]: true,
            [utils.asGridCoord(-1,3)]: true,
            [utils.asGridCoord(-1,4)]: true,
            [utils.asGridCoord(-1,5)]: true,
            [utils.asGridCoord(-1,6)]: true,
            [utils.asGridCoord(-1,7)]: true,
            [utils.asGridCoord(-1,8)]: true,

            // right wall
            [utils.asGridCoord(12,0)]: true,
            [utils.asGridCoord(12,1)]: true,
            [utils.asGridCoord(12,2)]: true,
            [utils.asGridCoord(12,4)]: true,
            [utils.asGridCoord(12,5)]: true,
            [utils.asGridCoord(12,6)]: true,
            [utils.asGridCoord(12,7)]: true,
            [utils.asGridCoord(12,8)]: true,


            // Lower wall
            [utils.asGridCoord(0,8)]: true,
            [utils.asGridCoord(1,8)]: true,
            // Exit point to outside
            // [utils.asGridCoord(3,8)]: true,
            [utils.asGridCoord(2,8)]: true,
            [utils.asGridCoord(5,8)]: true,
            [utils.asGridCoord(4,8)]: true,
            [utils.asGridCoord(6,8)]: true,
            [utils.asGridCoord(7,8)]: true,

            // dining table
            [utils.asGridCoord(5,4)]: true,
            [utils.asGridCoord(6,4)]: true,
            [utils.asGridCoord(7,4)]: true,
            [utils.asGridCoord(5,5)]: true,
            [utils.asGridCoord(6,5)]: true,
            [utils.asGridCoord(7,5)]: true,

            
            // Green table
            [utils.asGridCoord(0,5)]: true,
            [utils.asGridCoord(1,5)]: true,
            
        },
        cutsceneSpaces: {
            [utils.asGridCoord(3,8)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "Outside" },
                    ]
                }
            ]
        }

    },
    DemoRoom: {
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        withCameraPerson: true,
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(8)
            },
            npcB:{
                type: "Person",
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: "./images/characters/people/npc2.png",
                // behaviorLoop: [
                //     { type: "walk", direction: "left"},
                //     { type: "stand", direction: "up", time: 800 },
                //     { type: "walk", direction: "up"},
                //     { type: "walk", direction: "right"},
                //     { type: "walk", direction: "down"},
                // ]
            },
            npcC: {
                type: "Person",
                x: utils.withGrid(2),
                y: utils.withGrid(7),
                src: "./images/characters/people/amethyst.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 200 },
                    { type: "stand", direction: "up", time: 200 },
                    { type: "stand", direction: "right", time: 200 },
                    { type: "stand", direction: "down", time: 200 },
                ],
            }
        },
        gameObjects: {

        },
        // Use object for walls for quick lookup
        walls: {
            // "16,16": true,
            // Brackets are for dynamic keys, inside [] will eval to str
            [utils.asGridCoord(7,6)]: true,
            [utils.asGridCoord(8,6)]: true,
            [utils.asGridCoord(7,7)]: true,
            [utils.asGridCoord(8,7)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoord(7,4)]: [
                {
                    events: [
                        { who: "npcB", type: "walk", direction: "left" },
                        { who: "npcB", type: "stand", direction: "up", time: 100 },
                        { type: "textMessage", text: "Don't go there"},
                        { who: "npcB", type: "walk", direction: "right" },
                        { who: "npcB", type: "stand", direction: "down", time: 5 },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "left" }
                    ]
                }
            ],
            [utils.asGridCoord(5,10)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "Outside" },
                    ]
                }
            ]
        }
    },
    Outside: {
        lowerSrc: "./images/maps/OutsideWorldTopLeft.png",
        // lowerSrc: "./images/maps/LivingRoom.png",
        upperSrc: "./images/maps/OutsideUpper.png",
        withCameraPerson: true,
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(3),
                y: utils.withGrid(7)
            }
        },
        walls: {
            // Invisible wall left
            [utils.asGridCoord(-1, 5)]: true,
            [utils.asGridCoord(-1, 6)]: true,
            [utils.asGridCoord(-1, 7)]: true,
            [utils.asGridCoord(-1, 8)]: true,
            [utils.asGridCoord(-1, 9)]: true,
            [utils.asGridCoord(-1, 10)]: true,
            [utils.asGridCoord(-1, 11)]: true,


            // Invisible wall right
            [utils.asGridCoord(32, 5)]: true,
            [utils.asGridCoord(32, 6)]: true,
            [utils.asGridCoord(32, 7)]: true,
            // Exit point to  Outside10
            [utils.asGridCoord(32, 8)]: true,
            [utils.asGridCoord(32, 9)]: true,
            [utils.asGridCoord(32, 10)]: true,
            [utils.asGridCoord(32, 11)]: true,
            [utils.asGridCoord(32,12)]: true,
            [utils.asGridCoord(32,13)]: true,
            [utils.asGridCoord(32,14)]: true,
            [utils.asGridCoord(32,15)]: true,

            [utils.asGridCoord(19,16)]: true,
            // Exit point to Outside01
            // [utils.asGridCoord(20,16)]: true,
            // [utils.asGridCoord(21,16)]: true,
            // [utils.asGridCoord(22,16)]: true,
            [utils.asGridCoord(23,16)]: true,
            [utils.asGridCoord(24,16)]: true,
            [utils.asGridCoord(25,16)]: true,
            [utils.asGridCoord(26,16)]: true,
            [utils.asGridCoord(27,16)]: true,
            [utils.asGridCoord(28,16)]: true,
            [utils.asGridCoord(29,16)]: true,
            [utils.asGridCoord(30,16)]: true,
            [utils.asGridCoord(31,16)]: true,
            
            // fence upper
            [utils.asGridCoord(0, 4)]: true,
            [utils.asGridCoord(1,4)]: true,
            [utils.asGridCoord(2,4)]: true,
            [utils.asGridCoord(3,4)]: true,
            [utils.asGridCoord(4,4)]: true,
            [utils.asGridCoord(5,4)]: true,
            [utils.asGridCoord(6,4)]: true,
            [utils.asGridCoord(7,4)]: true,
            [utils.asGridCoord(8,4)]: true,
            [utils.asGridCoord(9,4)]: true,
            [utils.asGridCoord(10,4)]: true,
            [utils.asGridCoord(11,4)]: true,
            [utils.asGridCoord(12,4)]: true,
            [utils.asGridCoord(13,4)]: true,
            [utils.asGridCoord(14,4)]: true,
            [utils.asGridCoord(15,4)]: true,
            [utils.asGridCoord(16,4)]: true,
            [utils.asGridCoord(17,4)]: true,
            [utils.asGridCoord(18,4)]: true,
            [utils.asGridCoord(19,4)]: true,
            [utils.asGridCoord(20,4)]: true,
            [utils.asGridCoord(21,4)]: true,
            [utils.asGridCoord(22,4)]: true,
            [utils.asGridCoord(23,4)]: true,
            [utils.asGridCoord(24,4)]: true,
            [utils.asGridCoord(25,4)]: true,
            [utils.asGridCoord(26,4)]: true,
            [utils.asGridCoord(27,4)]: true,
            [utils.asGridCoord(28,4)]: true,
            [utils.asGridCoord(29,4)]: true,
            [utils.asGridCoord(30,4)]: true,
            [utils.asGridCoord(31,4)]: true,
            // fence lower top
            [utils.asGridCoord(0, 12)]: true,
            [utils.asGridCoord(1,12)]: true,
            [utils.asGridCoord(2,12)]: true,
            [utils.asGridCoord(3,12)]: true,
            [utils.asGridCoord(4,12)]: true,
            [utils.asGridCoord(5,12)]: true,
            [utils.asGridCoord(6,12)]: true,
            [utils.asGridCoord(7,12)]: true,
            [utils.asGridCoord(8,12)]: true,
            [utils.asGridCoord(9,12)]: true,
            [utils.asGridCoord(10,12)]: true,
            [utils.asGridCoord(11,12)]: true,
            [utils.asGridCoord(12,12)]: true,
            [utils.asGridCoord(13,12)]: true,
            [utils.asGridCoord(14,12)]: true,
            [utils.asGridCoord(15,12)]: true,
            [utils.asGridCoord(16,12)]: true,
            [utils.asGridCoord(17,12)]: true,
            // fence right
            [utils.asGridCoord(18,12)]: true,
            [utils.asGridCoord(18,13)]: true,
            [utils.asGridCoord(18,14)]: true,
            [utils.asGridCoord(18,15)]: true,
            [utils.asGridCoord(18,12)]: true,


            // Mushroom tree trunk
            [utils.asGridCoord(21,6)]: true,
            [utils.asGridCoord(22,6)]: true,
            [utils.asGridCoord(23,6)]: true,
            [utils.asGridCoord(21,7)]: true,
            [utils.asGridCoord(22,7)]: true,
            [utils.asGridCoord(23,7)]: true,

            // Pine trees
            [utils.asGridCoord(23,13)]: true,
            // [utils.asGridCoord(24,13)]: true,

            [utils.asGridCoord(28,14)]: true,
            // [utils.asGridCoord(29,14)]: true,

            // House
            [utils.asGridCoord(1,5)]: true,
            [utils.asGridCoord(1,6)]: true,
            [utils.asGridCoord(2,5)]: true,
            [utils.asGridCoord(2,6)]: true,
            [utils.asGridCoord(3,5)]: true,
            [utils.asGridCoord(3,6)]: true,
            [utils.asGridCoord(4,5)]: true,
            [utils.asGridCoord(4,6)]: true,
            [utils.asGridCoord(5,5)]: true,
            [utils.asGridCoord(5,6)]: true,


            // House
            [utils.asGridCoord(10,6)]: true,
            [utils.asGridCoord(11,6)]: true,
            [utils.asGridCoord(12,6)]: true,
            [utils.asGridCoord(13,6)]: true,
            [utils.asGridCoord(14,6)]: true,

            [utils.asGridCoord(10,7)]: true,
            [utils.asGridCoord(11,7)]: true,
            [utils.asGridCoord(12,7)]: true,
            [utils.asGridCoord(13,7)]: true,
            [utils.asGridCoord(14,7)]: true,



        },
        cutsceneSpaces: {
            // Exit to Outside01
            [utils.asGridCoord(20, 15)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "Outside01" },
                    ]
                }
            ],
            [utils.asGridCoord(21, 15)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "Outside01" },
                    ]
                }
            ],
            [utils.asGridCoord(22, 15)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "Outside01" },
                    ]
                }
            ]
        },

    },
    Outside01: {
        lowerSrc: "./images/maps/OutsideWorld01.png",
        // lowerSrc: "./images/maps/LivingRoom.png",
        upperSrc: "./images/maps/OutsideWorld01_Upper.png",
        withCameraPerson: true,
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(20),
                y: utils.withGrid(1)
            }
        },
        walls: {
            // Invisible wall left
            [utils.asGridCoord(-1, 10)]: true,
            [utils.asGridCoord(-1, 11)]: true,
            [utils.asGridCoord(-1, 12)]: true,
            [utils.asGridCoord(-1, 13)]: true,
            [utils.asGridCoord(-1, 14)]: true,
            [utils.asGridCoord(-1, 15)]: true,
            [utils.asGridCoord(-1, 16)]: true,
            [utils.asGridCoord(-1, 17)]: true,


            // Invisible wall right
            [utils.asGridCoord(32, 0)]: true,
            [utils.asGridCoord(32, 1)]: true,
            [utils.asGridCoord(32, 2)]: true,
            [utils.asGridCoord(32, 3)]: true,
            [utils.asGridCoord(32, 4)]: true,
            [utils.asGridCoord(32, 5)]: true,
            [utils.asGridCoord(32, 6)]: true,
            [utils.asGridCoord(32, 7)]: true,
            [utils.asGridCoord(32, 8)]: true,
            [utils.asGridCoord(32, 9)]: true,
            [utils.asGridCoord(32, 10)]: true,
            [utils.asGridCoord(32, 11)]: true,
            // Exit point to Outside12
            // [utils.asGridCoord(32,12)]: true,
            // [utils.asGridCoord(32,13)]: true,
            // [utils.asGridCoord(32,14)]: true,
            [utils.asGridCoord(32,15)]: true,

            // Invisible wall up
            [utils.asGridCoord(19,-1)]: true,
            // Exit point to Outside00
            // [utils.asGridCoord(20,-1)]: true,
            // [utils.asGridCoord(21,-1)]: true,
            // [utils.asGridCoord(22,-1)]: true,
            [utils.asGridCoord(23,-1)]: true,
            [utils.asGridCoord(24,-1)]: true,
            [utils.asGridCoord(25,-1)]: true,
            [utils.asGridCoord(26,-1)]: true,
            [utils.asGridCoord(27,-1)]: true,
            [utils.asGridCoord(28,-1)]: true,
            [utils.asGridCoord(29,-1)]: true,
            [utils.asGridCoord(30,-1)]: true,
            [utils.asGridCoord(31,-1)]: true,

            // Invisible wall bottom
            [utils.asGridCoord(0, 16)]: true,
            [utils.asGridCoord(1,16)]: true,
            [utils.asGridCoord(2,16)]: true,
            [utils.asGridCoord(3,16)]: true,
            [utils.asGridCoord(4,16)]: true,
            [utils.asGridCoord(5,16)]: true,
            [utils.asGridCoord(6,16)]: true,
            [utils.asGridCoord(7,16)]: true,
            [utils.asGridCoord(8,16)]: true,
            [utils.asGridCoord(9,16)]: true,
            [utils.asGridCoord(10,16)]: true,
            [utils.asGridCoord(11,16)]: true,
            [utils.asGridCoord(12,16)]: true,
            [utils.asGridCoord(13,16)]: true,
            [utils.asGridCoord(14,16)]: true,
            [utils.asGridCoord(15,16)]: true,
            [utils.asGridCoord(16,16)]: true,
            [utils.asGridCoord(17,16)]: true,
            [utils.asGridCoord(18,16)]: true,
            [utils.asGridCoord(19,16)]: true,
            // Exit point
            // [utils.asGridCoord(20,16)]: true,
            // [utils.asGridCoord(21,16)]: true,
            // [utils.asGridCoord(22,16)]: true,
            [utils.asGridCoord(23,16)]: true,
            [utils.asGridCoord(24,16)]: true,
            [utils.asGridCoord(25,16)]: true,
            [utils.asGridCoord(26,16)]: true,
            [utils.asGridCoord(27,16)]: true,
            [utils.asGridCoord(28,16)]: true,
            [utils.asGridCoord(29,16)]: true,
            [utils.asGridCoord(30,16)]: true,
            [utils.asGridCoord(31,16)]: true,

            
            // fence lower
            [utils.asGridCoord(0,9)]: true,
            [utils.asGridCoord(1,9)]: true,
            [utils.asGridCoord(2,9)]: true,
            [utils.asGridCoord(3,9)]: true,
            [utils.asGridCoord(4,9)]: true,
            [utils.asGridCoord(5,9)]: true,
            [utils.asGridCoord(6,9)]: true,
            [utils.asGridCoord(7,9)]: true,
            [utils.asGridCoord(8,9)]: true,
            [utils.asGridCoord(9,9)]: true,
            [utils.asGridCoord(10,9)]: true,
            [utils.asGridCoord(11,9)]: true,
            [utils.asGridCoord(12,9)]: true,
            [utils.asGridCoord(13,9)]: true,
            [utils.asGridCoord(14,9)]: true,
            [utils.asGridCoord(15,9)]: true,
            [utils.asGridCoord(16,9)]: true,
            [utils.asGridCoord(17,9)]: true,
            [utils.asGridCoord(18,9)]: true,

            // fence left
            [utils.asGridCoord(18,0)]: true,
            [utils.asGridCoord(18,1)]: true,
            [utils.asGridCoord(18,2)]: true,
            [utils.asGridCoord(18,3)]: true,
            [utils.asGridCoord(18,4)]: true,
            [utils.asGridCoord(18,5)]: true,
            [utils.asGridCoord(18,6)]: true,
            [utils.asGridCoord(18,7)]: true,
            [utils.asGridCoord(18,8)]: true,
            [utils.asGridCoord(18,9)]: true,
            // [utils.asGridCoord(19,10)]: true,
            // [utils.asGridCoord(20,10)]: true,
            // [utils.asGridCoord(21,10)]: true,
            // [utils.asGridCoord(22,10)]: true,
            // [utils.asGridCoord(23,10)]: true,
            // [utils.asGridCoord(24,10)]: true,
            // [utils.asGridCoord(25,10)]: true,
            // [utils.asGridCoord(26,10)]: true,
            // [utils.asGridCoord(27,10)]: true,
            // [utils.asGridCoord(28,10)]: true,
            // [utils.asGridCoord(29,10)]: true,
            // [utils.asGridCoord(30,10)]: true,
            // [utils.asGridCoord(31,10)]: true,

            // // fence lower top
            // [utils.asGridCoord(0, 12)]: true,
            // [utils.asGridCoord(1,12)]: true,
            // [utils.asGridCoord(2,12)]: true,
            // [utils.asGridCoord(3,12)]: true,
            // [utils.asGridCoord(4,12)]: true,
            // [utils.asGridCoord(5,12)]: true,
            // [utils.asGridCoord(6,12)]: true,
            // [utils.asGridCoord(7,12)]: true,
            // [utils.asGridCoord(8,12)]: true,
            // [utils.asGridCoord(9,12)]: true,
            // [utils.asGridCoord(10,12)]: true,
            // [utils.asGridCoord(11,12)]: true,
            // [utils.asGridCoord(12,12)]: true,
            // [utils.asGridCoord(13,12)]: true,
            // [utils.asGridCoord(14,12)]: true,
            // [utils.asGridCoord(15,12)]: true,
            // [utils.asGridCoord(16,12)]: true,
            // [utils.asGridCoord(17,12)]: true,

            // // fence right
            // [utils.asGridCoord(18,12)]: true,
            // [utils.asGridCoord(18,13)]: true,
            // [utils.asGridCoord(18,14)]: true,
            // [utils.asGridCoord(18,15)]: true,
            // [utils.asGridCoord(18,12)]: true,

            // // Pine trees
            // [utils.asGridCoord(23,13)]: true,
            // // [utils.asGridCoord(24,13)]: true,

            // [utils.asGridCoord(28,14)]: true,
            // // [utils.asGridCoord(29,14)]: true,
        },
        cutsceneSpaces: {
            // Exit to Outside00
            [utils.asGridCoord(20, 0)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside", heroX: utils.withGrid(20), heroY: utils.withGrid(14)},
                    ]
                }
            ],
            [utils.asGridCoord(21, 0)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside", heroX: utils.withGrid(20), heroY: utils.withGrid(14)},
                    ]
                }
            ],
            //[utils.asGridCoord(21, 15)
            [utils.asGridCoord(22, 0)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside", heroX: utils.withGrid(20), heroY: utils.withGrid(14)},
                    ]
                }
            ],
            // [utils.asGridCoord(32,12)]: true,
            // [utils.asGridCoord(32,13)]: true,
            // [utils.asGridCoord(32,14)]: true,
            [utils.asGridCoord(31,12)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "right" },
                        { type: "changeMap", map: "TownSquare"},
                    ]
                }
            ],
            [utils.asGridCoord(31,13)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "right" },
                        { type: "changeMap", map: "TownSquare"},
                    ]
                }
            ],
            [utils.asGridCoord(31,14)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "right" },
                        { type: "changeMap", map: "TownSquare"},
                    ]
                }
            ],
            [utils.asGridCoord(20,16)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "Toadstool"},
                    ]
                }
            ],
            [utils.asGridCoord(21,16)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "Toadstool"},
                    ]
                }
            ],
            [utils.asGridCoord(22,16)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "down" },
                        { type: "changeMap", map: "Toadstool"},
                    ]
                }
            ],
        },
    },
    Outside02: {
        lowerSrc: "./images/maps/Outside02.png",
        // lowerSrc: "./images/maps/LivingRoom.png",
        upperSrc: "./images/maps/OutsideWorld01_Upper.png",
        withCameraPerson: true,
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(20),
                y: utils.withGrid(1)
            }
        },
        walls: {
        },
        cutsceneSpaces: {},
    },
    Toadstool: {
        lowerSrc: "./images/maps/ToadstoolLower.png",
        // lowerSrc: "./images/maps/LivingRoom.png",
        upperSrc: "./images/maps/ToadstoolUpper.png",
        withCameraPerson: true,
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(14),
                y: utils.withGrid(4)
            }
        },
        walls: {
            // invisible wall upper
            [utils.asGridCoord(0, 4)]: true,
            [utils.asGridCoord(1,4)]: true,
            [utils.asGridCoord(2,4)]: true,
            [utils.asGridCoord(3,4)]: true,
            [utils.asGridCoord(4,4)]: true,
            [utils.asGridCoord(5,4)]: true,
            [utils.asGridCoord(6,4)]: true,
            [utils.asGridCoord(7,4)]: true,
            [utils.asGridCoord(8,4)]: true,
            [utils.asGridCoord(9,4)]: true,
            [utils.asGridCoord(10,4)]: true,
            [utils.asGridCoord(11,4)]: true,
            // Exit point to Outside 01
            // [utils.asGridCoord(12,4)]: true,
            // [utils.asGridCoord(13,4)]: true,
            // [utils.asGridCoord(14,4)]: true,
            // [utils.asGridCoord(15,4)]: true,
            // [utils.asGridCoord(16,4)]: true,
            [utils.asGridCoord(17,4)]: true,
            [utils.asGridCoord(18,4)]: true,
            [utils.asGridCoord(19,4)]: true,
            [utils.asGridCoord(20,4)]: true,
            [utils.asGridCoord(21,4)]: true,
            [utils.asGridCoord(22,4)]: true,
            [utils.asGridCoord(23,4)]: true,
            [utils.asGridCoord(24,4)]: true,
            [utils.asGridCoord(25,4)]: true,
            [utils.asGridCoord(26,4)]: true,
            [utils.asGridCoord(27,4)]: true,
            [utils.asGridCoord(28,4)]: true,
            [utils.asGridCoord(29,4)]: true,
            [utils.asGridCoord(30,4)]: true,
            [utils.asGridCoord(31,4)]: true,

            // River
            [utils.asGridCoord(0, 17)]: true,
            [utils.asGridCoord(1,17)]: true,
            [utils.asGridCoord(2,17)]: true,
            [utils.asGridCoord(3,17)]: true,
            [utils.asGridCoord(4,17)]: true,
            [utils.asGridCoord(5,17)]: true,
            [utils.asGridCoord(6,17)]: true,
            [utils.asGridCoord(7,17)]: true,
            [utils.asGridCoord(8,17)]: true,
            [utils.asGridCoord(9,17)]: true,
            [utils.asGridCoord(10,17)]: true,
            [utils.asGridCoord(11,17)]: true,
            [utils.asGridCoord(12,17)]: true,
            [utils.asGridCoord(13,17)]: true,
            [utils.asGridCoord(14,17)]: true,
            [utils.asGridCoord(15,17)]: true,
            [utils.asGridCoord(16,17)]: true,
            [utils.asGridCoord(17,17)]: true,
            [utils.asGridCoord(18,17)]: true,
            [utils.asGridCoord(19,17)]: true,
            [utils.asGridCoord(20,17)]: true,
            [utils.asGridCoord(21,17)]: true,
            [utils.asGridCoord(22,17)]: true,
            [utils.asGridCoord(23,17)]: true,
            [utils.asGridCoord(24,17)]: true,
            [utils.asGridCoord(25,17)]: true,
            [utils.asGridCoord(26,17)]: true,
            [utils.asGridCoord(27,17)]: true,
            [utils.asGridCoord(28,17)]: true,
            [utils.asGridCoord(29,17)]: true,
            [utils.asGridCoord(30,17)]: true,
            [utils.asGridCoord(31,17)]: true,

            // Ice cream building bottom
            [utils.asGridCoord(0,8)]: true,
            [utils.asGridCoord(1,8)]: true,
            [utils.asGridCoord(2,8)]: true,
            [utils.asGridCoord(3,8)]: true,
            [utils.asGridCoord(4,8)]: true,
            [utils.asGridCoord(5,8)]: true,
            [utils.asGridCoord(6,8)]: true,
            [utils.asGridCoord(7,8)]: true,
            [utils.asGridCoord(8,8)]: true,
            // Ice cream building right
            [utils.asGridCoord(10,0)]: true,
            [utils.asGridCoord(10,1)]: true,
            [utils.asGridCoord(10,2)]: true,
            [utils.asGridCoord(10,3)]: true,
            [utils.asGridCoord(10,4)]: true,
            [utils.asGridCoord(10,5)]: true,
            [utils.asGridCoord(10,6)]: true,
            [utils.asGridCoord(10,7)]: true,
            [utils.asGridCoord(10,8)]: true,

            // Toadsstool building
            [utils.asGridCoord(20,8)]: true,
            [utils.asGridCoord(21,8)]: true,
            [utils.asGridCoord(22,8)]: true,
            [utils.asGridCoord(23,8)]: true,
            [utils.asGridCoord(24,8)]: true,
            [utils.asGridCoord(25,8)]: true,
            [utils.asGridCoord(26,8)]: true,
            [utils.asGridCoord(27,8)]: true,
            [utils.asGridCoord(28,8)]: true,
            [utils.asGridCoord(29,8)]: true,
            // toad building right
            [utils.asGridCoord(18,0)]: true,
            [utils.asGridCoord(18,1)]: true,
            [utils.asGridCoord(18,2)]: true,
            [utils.asGridCoord(18,3)]: true,
            [utils.asGridCoord(18,4)]: true,
            [utils.asGridCoord(18,5)]: true,
            [utils.asGridCoord(18,6)]: true,
            [utils.asGridCoord(18,7)]: true,

            // toadstool sign
            [utils.asGridCoord(19,6)]: true,
            [utils.asGridCoord(19,7)]: true,
            [utils.asGridCoord(19,8)]: true,

        },
        cutsceneSpaces: {

            // Up to outside01
            [utils.asGridCoord(12,3)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside01", heroX: utils.withGrid(21), heroY: utils.withGrid(13)},
                    ]
                }
            ],
            [utils.asGridCoord(13,3)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside01", heroX: utils.withGrid(21), heroY: utils.withGrid(13)},
                    ]
                }
            ],
            [utils.asGridCoord(14,3)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside01", heroX: utils.withGrid(21), heroY: utils.withGrid(13)},
                    ]
                }
            ],
            [utils.asGridCoord(15,3)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside01", heroX: utils.withGrid(21), heroY: utils.withGrid(13)},
                    ]
                }
            ],
        },
    },
    TownSquare: {
        lowerSrc: "./images/maps/TownSquareLower2.png",
        // lowerSrc: "./images/maps/LivingRoom.png",
        upperSrc: "./images/maps/TownSquareUpper.png",
        withCameraPerson: true,
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(8),
                y: utils.withGrid(8)
            }
        },
        walls: {
            // invisible wall upper
            [utils.asGridCoord(0, 1)]: true,
            [utils.asGridCoord(1,1)]: true,
            [utils.asGridCoord(2,1)]: true,
            [utils.asGridCoord(3,1)]: true,
            [utils.asGridCoord(4,1)]: true,
            [utils.asGridCoord(5,1)]: true,
            [utils.asGridCoord(6,1)]: true,
            [utils.asGridCoord(7,1)]: true,
            [utils.asGridCoord(8,1)]: true,
            [utils.asGridCoord(9,1)]: true,
            [utils.asGridCoord(10,1)]: true,
            [utils.asGridCoord(11,1)]: true,
            [utils.asGridCoord(12,1)]: true,
            [utils.asGridCoord(13,1)]: true,
            [utils.asGridCoord(14,1)]: true,
            [utils.asGridCoord(15,1)]: true,
            [utils.asGridCoord(16,1)]: true,
            [utils.asGridCoord(17,1)]: true,
            [utils.asGridCoord(18,1)]: true,
            [utils.asGridCoord(19,1)]: true,
            [utils.asGridCoord(20,1)]: true,
            [utils.asGridCoord(21,1)]: true,
            [utils.asGridCoord(22,1)]: true,
            [utils.asGridCoord(23,1)]: true,
            [utils.asGridCoord(24,1)]: true,
            [utils.asGridCoord(25,1)]: true,
            [utils.asGridCoord(26,1)]: true,
            [utils.asGridCoord(27,1)]: true,
            [utils.asGridCoord(28,1)]: true,
            [utils.asGridCoord(29,1)]: true,
            [utils.asGridCoord(30,1)]: true,
            [utils.asGridCoord(31,1)]: true,

            // Bottom
            [utils.asGridCoord(0, 15)]: true,
            [utils.asGridCoord(1,15)]: true,
            [utils.asGridCoord(2,15)]: true,
            [utils.asGridCoord(3,15)]: true,
            [utils.asGridCoord(4,15)]: true,
            [utils.asGridCoord(5,15)]: true,
            [utils.asGridCoord(6,15)]: true,
            [utils.asGridCoord(7,15)]: true,
            [utils.asGridCoord(8,15)]: true,
            [utils.asGridCoord(9,15)]: true,
            [utils.asGridCoord(10,15)]: true,
            [utils.asGridCoord(11,15)]: true,
            [utils.asGridCoord(12,15)]: true,
            [utils.asGridCoord(13,15)]: true,
            [utils.asGridCoord(14,15)]: true,
            [utils.asGridCoord(15,15)]: true,
            [utils.asGridCoord(16,15)]: true,
            [utils.asGridCoord(17,15)]: true,
            [utils.asGridCoord(18,15)]: true,
            [utils.asGridCoord(19,15)]: true,
            [utils.asGridCoord(20,15)]: true,
            [utils.asGridCoord(21,15)]: true,
            [utils.asGridCoord(22,15)]: true,
            [utils.asGridCoord(23,15)]: true,
            [utils.asGridCoord(24,15)]: true,
            [utils.asGridCoord(25,15)]: true,
            [utils.asGridCoord(26,15)]: true,
            [utils.asGridCoord(27,15)]: true,
            [utils.asGridCoord(28,15)]: true,
            [utils.asGridCoord(29,15)]: true,
            [utils.asGridCoord(30,15)]: true,
            [utils.asGridCoord(31,15)]: true,

        },
        cutsceneSpaces: {

            // Up to outside01
            [utils.asGridCoord(12,3)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside01", heroX: utils.withGrid(21), heroY: utils.withGrid(13)},
                    ]
                }
            ],
            [utils.asGridCoord(13,3)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside01", heroX: utils.withGrid(21), heroY: utils.withGrid(13)},
                    ]
                }
            ],
            [utils.asGridCoord(14,3)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside01", heroX: utils.withGrid(21), heroY: utils.withGrid(13)},
                    ]
                }
            ],
            [utils.asGridCoord(15,3)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "Outside01", heroX: utils.withGrid(21), heroY: utils.withGrid(13)},
                    ]
                }
            ],
        },
    },
    Kitchen: {
        lowerSrc: "./images/maps/OutsideWorldTopLeft.png",
        // lowerSrc: "./images/maps/LivingRoom.png",
        upperSrc: "./images/maps/OutsideUpper.png",
        // Use object for walls for quick lookup
        walls: {
            // Brackets are for dynamic keys, inside [] will eval to str
            [utils.asGridCoord(0,3)]: true,
            [utils.asGridCoord(1,3)]: true,
            [utils.asGridCoord(2,3)]: true,
            [utils.asGridCoord(3,3)]: true,
            [utils.asGridCoord(4,3)]: true,
            [utils.asGridCoord(5,3)]: true,
            [utils.asGridCoord(6,3)]: true,
            [utils.asGridCoord(7,3)]: true,
            [utils.asGridCoord(8,3)]: true,
            // [utils.asGridCoord(9,3)]: true,
            [utils.asGridCoord(10,3)]: true,
            [utils.asGridCoord(11,3)]: true,
            [utils.asGridCoord(12,3)]: true,
        },
        configObjects: {
            hero: {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(9),
                y: utils.withGrid(4)
            },
            npcD: {
                type: "Person",
                x: utils.withGrid(10),
                y: utils.withGrid(8),
                src: "./images/characters/people/amethyst.png",
                talking: [
                    {
                    events: [
                        { type: "textMessage", text: "You made it!", faceHero:"npcB" },
                    ]
                    }
                ]
            },
            npcF:{
                type: "Person",
                x: utils.withGrid(7),
                y: utils.withGrid(6),
                src: "./images/characters/people/pixie.png",
                talking: [
                    {
                    events: [
                        { type: "textMessage", text: "You made it!", faceHero:"npcD" },
                    ]
                    }
                ]
            }
        },
        initialEvents:[{ who: "hero", type: "walk", direction: "down" } ]
        ,
        cutsceneSpaces: {
            [utils.asGridCoord(9,4)]: [
                {
                    events: [
                        { who: "hero", type: "walk", direction: "up" },
                        { type: "changeMap", map: "DemoRoom" },
                    ]
                }
            ]
        }
    },
    // Street: {

    // }
}