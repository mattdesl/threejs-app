/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

class {{name}} extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  animateIn (opt = {}) {
    return Promise.all([
    ]);
  }

  animateOut (opt = {}) {
    return Promise.all([
    ]);
  }

  render () {
    const classes = classnames({
      '{{name}}': true
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
      </div>
    );
  }
}

{{name}}.defaultProps = {
};

module.exports = {{name}};
