/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

class Header extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  animateIn (opt = {}) {
    return Promise.all([
      animate.fromTo(this.container, 1, {
        autoAlpha: 0
      }, {
        ...opt,
        autoAlpha: 1
      }),
      animate.fromTo(this.container, 2, {
        y: 20
      }, {
        ...opt,
        ease: Expo.easeOut,
        y: 0
      })
    ]);
  }

  animateOut (opt = {}) {
    return Promise.all([
      animate.to(this.container, 1, {
        ...opt,
        autoAlpha: 0
      }),
      animate.to(this.container, 2, {
        ...opt,
        ease: Expo.easeOut,
        y: 20
      })
    ]);
  }

  render () {
    const classes = classnames({
      'Header': true
    });
    return (
      <header className={classes} ref={ c => { this.container = c; } }>
        { this.props.children }
      </header>
    );
  }
}

Header.defaultProps = {
  text: ''
};

module.exports = Header;
