window.addEventListener('load', function() {
  // OVERWORLD LOAD
  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  });
  overworld.init();
})