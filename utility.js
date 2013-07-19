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

function request(url, method, callback) {
  var request = new XMLHttpRequest();
  request.open(method, url, true);

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      callback(request.responseText);
    }
  }

  request.send();
}

function makeElement(type, options) {
  var elem = document.createElement(type);
  if (options.content) elem.innerHTML = options.content;
  if (options.classes) {
    options.classes.forEach(function (name) {
      elem.classList.add(name);
    });
  }
  if (options.attributes) {
    for (var attr in options.attributes) {
      elem.setAttribute(attr, options.attributes[attr]);
    }
  }

  return elem;
}

function naturalWords (key) {
  return key.replace(/_/g, " ").replace(/^\S/, function (char) { return char.toUpperCase() });
}
