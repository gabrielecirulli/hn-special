// Settings management
load(function () {
  createMenu();
  
});

function createMenu() {
  // Replace the menu container with a div
  var container = replaceTag($(".pagetop")[1], "div");

  var button = document.createElement("div");
  button.classList.add("hnspecial-settings-button");
  
  var checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("hnspecial-settings-button-checkbox");
  button.appendChild(checkbox);

  var image = document.createElement("img");
  image.setAttribute("src", chrome.extension.getURL("gear.svg"));
  button.appendChild(image);

  var menu = document.createElement("div");
  menu.classList.add("hnspecial-settings-menu-container");
  
  var inner = document.createElement("div");
  inner.classList.add("hnspecial-settings-menu-inner");
  inner.textContent = "I'm a super cool menu";

  menu.appendChild(inner);
  button.appendChild(menu);

  container.insertBefore(button, container.children[0]);
}
