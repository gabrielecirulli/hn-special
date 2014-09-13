var self = require('sdk/self');

// a dummy function, to show how tests work. 
// to see how to test this function, look at ../test/test-main.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;
