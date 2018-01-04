# threejs-app

[Preact demo](http://test-webgl-preact.surge.sh/?gui)

(Preloader time has been inflated for demo purposes.)

My current organization for medium & large WebGL + UI apps (i.e. must scale to a large team and run the course of a few months).

> ⚛ This version includes [Preact](https://github.com/developit/preact) for scalable UI components and a simple way of communicating between Preact and WebGL. See the [master](https://github.com/mattdesl/threejs-app) branch for an easier boilerplate that does not include all the Preact/UI features.

This is by no means stable; you probably shouldn't just go cloning it and trying to build your own apps. It is really opinionated and has a lot of things that might seem odd or overkill (though I have found them necessary on most big projects). Instead, you may just want to study it to see if you can find anything of interest.

The core WebGL features:

- Basic ThreeJS setup with render loop, camera, resize events, controls, tap events, GLTF loader, etc.
- Budo for quick dev cycle, source maps, etc
- Babel + ES2015 + bound class functions
- A few optimizations thrown in for smaller output bundle size
- glslify + glslify-hex transform
- shader-reload for live shader reloading during dev
- global access to canvas, dat.gui, camera, app width & height, controls, etc
- an AssetManager & preloader to keep texture/GLTF/etc code clean and avoid promise/async hell
- include `NODE_ENV=production` or development
- a simple way to organize complex ThreeJS scenes:
  - build them out of smaller "components", where each component extends `THREE.Object3D`, `THREE.Group` or `THREE.Mesh`
  - functions like `update(dt, time)`, `onTouchStart(ev, pos)`, etc propagate through entire scene graph

In addition, this `preact` branch includes things such as:

- Preact, obviously
- Sets up a `Preloader` section before WebGL has loaded
- LESS with fast style updates (no browser reload)
- Example of handling reactive updates in WebGL land
  - See `onAppDidUpdate` in `src/webgl/scene/Honeycomb.js`
- Component animations and section transitions with GSAP + Promises ([gsap-promise](https://www.npmjs.com/package/@jam3/gsap-promise)) and [preact-transition-group](https://github.com/developit/preact-transition-group)
- A tool to scaffold new components/sections:
  - Run `npm run component MyComponent` to create the new component `MyComponent`
  - Run `npm run section MySection` to create a new section `MySection`

At some point many of these tools will be published on npm or as self-contained scripts, making this whole thing a bit more convenient. Until then... enjoy the mess! :)

## Usage

Clone, `npm install`, then:

```sh
# start development server
npm run start
```

Now open [localhost:9966](http://localhost:9966/) and start editing your source code. Edit the `honey.frag` or `honey.vert` to see it reloaded without losing application state.

You can launch [localhost:9966/?gui](http://localhost:9966/?gui) to open dat.gui.

For production:

```sh
# create a production bundle.js
npm run bundle

# deploy to a surge link for demoing
npm run deploy
```

For deploy to work, you will need to change the surge URL in `package.json` `"scripts" > "deploy"` field to something else.

## Confused?

Yeah, this "boilerplate" is *not* easy, and is much more challenging than the [master](https://github.com/mattdesl/threejs-app) branch (which is mostly just WebGL). Unfortunately I haven't found a smoother workflow with tools like Webpack, Parcel, Rollup, etc. Things like JSX, Babel, DOM animations, WebGL, CSS pre-processors, npm modules, etc is all really hard to get working together, and the result is lots of boilerplate code to get things up and runnning.

One day I hope frontend Web will be a little more like Processing GUI — just "code and go" — but until then I hope you find some ideas in this repo. :smile:

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/threejs-app/blob/master/LICENSE.md) for details.
