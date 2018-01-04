// A base level component that all our components/sections
// will extend from. In this case we handle animation
// functions by default.

const { Component } = require('preact');

class BaseComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
    this.__isAnimatingIn = false;
    this.__isAnimatingOut = false;
  }

  isAnimating () {
    return this.__isAnimatingIn || this.__isAnimatingOut;
  }

  isAnimatingOut () {
    return this.__isAnimatingOut;
  }

  isAnimatingIn () {
    return this.__isAnimatingIn;
  }

  componentWillAppear (done) {
    this.__handleAnimateIn(done);
  }

  componentWillEnter (done) {
    this.__handleAnimateIn(done);
  }

  __handleAnimateIn (done) {
    done();
    if (typeof this.animateIn === 'function') {
      this.__isAnimatingIn = true;
      const p = this.animateIn();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          this.__isAnimatingIn = false;
        });
      } else {
        this.__isAnimatingIn = false;
      }
    }
  }

  componentWillLeave (done) {
    const next = () => {
      this.__isAnimatingOut = false;
      if (done) done();
    };
    if (typeof this.animateOut === 'function') {
      this.__isAnimatingOut = true;
      const promise = this.animateOut();
      if (promise && typeof promise.then === 'function') {
        promise.then(next);
      } else {
        next();
      }
    } else {
      next();
    }
  }
}

module.exports = BaseComponent;
