/** @jsx h */
import { h, Component } from 'preact';

// Adapted from:
// https://www.npmjs.com/package/react-element-container
// Allows us to just use a regular DOM element as a child
// without having to deal with updates/reactive things.

module.exports = class ElementContainer extends Component {
  shouldComponentUpdate (nextProps) {
    return this.props.child !== nextProps.child;
  }

  componentDidUpdate (prevProps) {
    this._updateChild(prevProps);
  }

  componentDidMount () {
    this._updateChild({});
  }

  _updateChild (prevProps) {
    const wrap = this.container;
    const next = this.props.child;
    const prev = prevProps.child;

    if (next) {
      wrap.appendChild(next);
    }

    if (prev && prev !== next && prev.parentNode === wrap) {
      wrap.removeChild(prev);
    }
  }

  render () {
    return (
      <div id={this.props.id} ref={c => { this.container = c; }} />
    );
  }
};
