/** @jsx h */
const { h } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const { canvas } = require('../../context');
const ElementContainer = require('./ElementContainer');

// We warn the developer when the canvas renders & re-mounts/re-renders
// as it may have performance implications.
let hasRendered = false;
let hasMounted = false;

// The WebGLCanvas element is just a div that holds a canvas
class WebGLCanvas extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {
    if (!hasMounted) {
      hasMounted = true;
    } else {
      console.warn('Re-mounting WebGLCanvas.');
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return false;
  }

  render () {
    if (hasRendered) {
      console.warn('Re-rendering WebGLCanvas component.');
    } else {
      if (process.env.NODE_ENV === 'development') console.log('[WebGL] Rendering canvas');
    }
    hasRendered = true;
    return (
      <ElementContainer id='WebGLCanvas' child={canvas} />
    );
  }
}

WebGLCanvas.defaultProps = {
  autoResize: false
};

module.exports = WebGLCanvas;
