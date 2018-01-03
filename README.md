# threejs-app

[demo](http://test-webgl.surge.sh/?gui)

My current organization for medium & large WebGL apps (i.e. must scale to a large team and run the course of a few months).

This is by no means stable; you probably shouldn't just go cloning it and trying to build your own apps. It is really opinionated and has a lot of things that might seem odd or overkill (though I have found them necessary on most big projects). Instead, you may just want to study it to see if you can find anything of interest.

Some things it tries to do:

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

At some point many of these tools will be published on npm or as self-contained scripts, making this whole thing a bit more convenient. Until then... enjoy the mess! :)

## Usage

Clone, `npm install`, then:

```sh
# start development server
npm run start
```

Now open [localhost:9966](http://localhost:9966/) and start editing your source code. Edit the `honey.frag` or `honey.vert` to see it re-reloaded without losing application state.

You can launch [localhost:9966/?gui](http://localhost:9966/?gui) to open dat.gui.

For production:

```sh
# create a production bundle.js
npm run bundle

# deploy to a surge link for demoing
npm run deploy
```

For deploy to work, you will need to change the surge URL in `package.json` `"scripts" > "deploy"` field to something else.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/threejs-app/blob/master/LICENSE.md) for details.
