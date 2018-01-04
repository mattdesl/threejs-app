/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

class MaterialButton extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  animateIn (opt = {}) {
    return Promise.all([
      animate.fromTo(this.container, 1.0, {
        autoAlpha: 0
      }, {
        ...opt,
        autoAlpha: 1
      })
    ]);
  }

  animateOut (opt = {}) {
    return Promise.all([
      animate.to(this.container, 1.0, {
        ...opt,
        autoAlpha: 0
      })
    ]);
  }

  render () {
    const classes = classnames({
      'MaterialButton': true
    });
    return (
      <div 
        onClick={this.props.onClick}
        className={classes}
        ref={ c => { this.container = c; } }>
        { this.props.children }
      </div>
    );
  }
}

MaterialButton.defaultProps = {
  onClick: () => {}
};

module.exports = MaterialButton;
