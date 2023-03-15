// Keeps track of state
// Overall world of game
class Overworld {
 constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    //  this.width = config.width;
    //  this.height = config.height;
 }

 startGameLoop() {
    let lastTime = 0;
    const step = (timeStamp) => {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;

      // console.log(deltaTime);
      // Clear previous canvas 
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Establish camera person. Camera will follow this person
      const cameraPerson = this.map.withCameraPerson ? this.map.gameObjects.hero : null;

      // if (this.map.withCameraPerson)

      //  Update all objects before drawing
      // Object.values(this.map.gameObjects).forEach(object => {
      //   object.update({
      //     arrow: this.directionHandler.direction,
      //     map: this.map,
      //     deltaTime: deltaTime
      //   });
      // })

      this.map.updateObjects({
        map: this.map,
        arrow: this.directionHandler.direction,
        deltaTime: deltaTime
      })

      this.map.draw(this.ctx);

      requestAnimationFrame((ts)=>{ step(ts)})
   }
   step(lastTime);
 }

 bindActionHandlers() {
   new KeypressListener("Enter", ()=> {
     // Check for person
     this.map.checkForActionCutscene();
   });
 }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId==="hero") {
       this.map.checkForFootstepCutscene();
     }
   })
 }

 bindClockCheck() {
  document.addEventListener("TimePassed", e  => {
    this.map.checkForTimedCutscene();
  })
 }

 transitionMap(mapConfig, heroX, heroY) {
    const mapWithHero = {
      ...mapConfig,
      configObjects: {
        ...mapConfig.configObjects,
        hero: {
          ...mapConfig.configObjects.hero,
          x: heroX,
          y: heroY
        }
      }
    }
    console.log(mapWithHero);
    this.map = new OverworldMap(mapWithHero);
    this.map.overworld = this;
    this.map.mountObjects();
    this.map.playInitialScenes();
 }

 startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
    this.map.playInitialScenes();
 }

 init() {
    this.pda = new Pda();
    this.pda.init(document.querySelector(".game-container"));

    this.startMap(window.OverworldMaps.Bedroom);

    this.bindActionHandlers();
    this.bindHeroPositionCheck();
    this.bindClockCheck();

    this.directionHandler = new DirectionHandler();
    this.directionHandler.init();

    this.startGameLoop();
  }
}