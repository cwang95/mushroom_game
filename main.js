window.addEventListener('load', function() {
  // OVERWORLD LOAD
  const overworld = new Overworld({
    element: document.querySelector(".game-container"),
    controllerElement: document.querySelector(".controller-container")
  });
  overworld.init();
})