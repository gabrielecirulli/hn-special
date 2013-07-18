function toArray(collection) {
  return [].slice.call(collection);
}

function $(selector) {
    return toArray(document.querySelectorAll(selector));
}

function load(callback) {
  document.addEventListener("DOMContentLoaded", callback);
}

function replaceTag(container, tag) {
  var parent = container.parentElement;
  var newContainer = document.createElement(tag);
  toArray(container.classList).forEach(function (name) {
    newContainer.classList.add(name);
  });
  while (container.firstChild) {
    newContainer.appendChild(container.firstChild);
  }
  parent.replaceChild(newContainer, container);
  
  return newContainer;
}
