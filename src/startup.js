const { render, h } = require('preact');
const App = require('./framework/App');

module.exports = function () {
  // Start rendering, this will handle WebGL loading and routing
  const appContainer = document.querySelector('#app');
  render(<App />, appContainer);
};
