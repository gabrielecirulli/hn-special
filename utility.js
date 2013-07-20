(function () {
  var _ = {};

  _.toArray = function(collection) {
    return [].slice.call(collection);
  };

  _.$ = function(selector) {
      return _.toArray(document.querySelectorAll(selector));
  };

  _.load = function(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);  
    } else {
      callback.call(document);
    }    
  };

  _.replaceTag = function(container, tag) {
    var parent = container.parentElement;
    var newContainer = document.createElement(tag);
    _.toArray(container.classList).forEach(function (name) {
      newContainer.classList.add(name);
    });
    while (container.firstChild) {
      newContainer.appendChild(container.firstChild);
    }
    parent.replaceChild(newContainer, container);

    return newContainer;
  };

  _.request = function(url, method, callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        callback(request.responseText);
      }
    }

    request.send();
  };

  _.makeElement = function(type, options) {
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
  };

  _.naturalWords = function(key) {
    return key.replace(/_/g, " ").replace(/^\S/, function (char) { return char.toUpperCase() });
  };

  _.clone = function(object) {
    return JSON.parse(JSON.stringify(object));
  };

  this._ = _;
}).call(this);
