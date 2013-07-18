// Settings management
load(function () {
  createMenu();
  
});

function createMenu() {
  // Replace the menu container with a div
  var container = replaceTag($(".pagetop")[1], "div");

  var button = document.createElement("div");
  button.classList.add("hnspecial-settings-button");

  container.insertBefore(button, container.children[0]);
}
