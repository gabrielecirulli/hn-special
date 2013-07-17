function toArray(collection) {
  return [].slice.call(collection);
}

function $(selector) {
    return toArray(document.querySelectorAll(selector));
}
