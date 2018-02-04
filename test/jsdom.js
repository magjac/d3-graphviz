var jsdom = require("jsdom");

module.exports = function(html, options) {
  return (new jsdom.JSDOM(html, options)).window;
};
