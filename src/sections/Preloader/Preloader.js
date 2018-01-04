/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

const Header = require('../../components/Header/Header');

class Preloader extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  animateIn () {
    return Promise.all([
      this.header.animateIn()
    ]);
  }

  animateOut () {
    return Promise.all([
      this.header.animateOut()
    ]);
  }

  render () {
    const classes = classnames({
      'Preloader': true
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <Header ref={ c => { this.header = c; } }>
          Preloader
        </Header>
      </div>
    );
  }
}

Preloader.defaultProps = {
};

module.exports = Preloader;
