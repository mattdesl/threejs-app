const noop = () => {
};

const isImage = (ext) => /\.(jpe?g|png|gif|bmp|tga|tif)$/i.test(ext);
const isSVG = (ext) => /\.svg$/i.test(ext);
const isAudio = (ext) => /\.(wav|mp3|ogg|mp4)$/i.test(ext);
const isJSON = (ext) => /\.json$/i.test(ext);
const isGLTF = (ext) => /\.(gltf|glb)$/i.test(ext);

const xhr = require('xhr');
const path = require('path');
const mapLimit = require('map-limit');

const loadTexture = require('./loadTexture');
const loadEnvMap = require('./loadEnvMap');
const loadImage = require('load-img');
const loadJSON = require('load-json-xhr');

class AssetManager {
  constructor (opt = {}) {
    this._cache = {};
    this._queue = [];
    this._renderer = opt.renderer;
    this._asyncLimit = 10;
    this._onProgressListeners = [];
    this._finishDelay = 0;
  }

  addProgressListener (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('onProgress must be a function');
    }
    this._onProgressListeners.push(fn);
  }

  // Add an asset to be queued, format: { url, ...options }
  queue (opt = {}) {
    if (!opt || typeof opt !== 'object') {
      throw new Error('First parameter must be an object!');
    }
    if (!opt.url) throw new TypeError('Must specify a URL or opt.url for AssetManager#queue()');
    opt = Object.assign({}, opt);
    opt.key = opt.key || opt.url;
    const queued = this._getQueued(opt.key);
    if (!queued) this._queue.push(opt);
    return opt.key;
  }

  // Fetch a loaded asset by key or URL
  get (key = '') {
    if (!key) throw new TypeError('Must specify a key or URL for AssetManager#get()');
    if (!(key in this._cache)) {
      throw new Error(`Could not find an asset by the key or URL ${key}`);
    }
    return this._cache[key];
  }

  isQueueEmpty () {
    return this._queue.length === 0;
  }

  // Loads all queued assets
  loadQueued (cb = noop) {
    const queue = this._queue.slice();
    this._queue.length = 0; // clear queue
    let count = 0;
    let total = queue.length;
    if (total === 0) {
      process.nextTick(() => {
        this._onProgressListeners.forEach(fn => fn(1));
        cb(null);
      });
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(`[assets] Loading ${total} queued items`);
    }
    mapLimit(queue, this._asyncLimit, (item, next) => {
      this.load(item, (err, result) => {
        const percent = total <= 1 ? 1 : (count / (total - 1));
        this._onProgressListeners.forEach(fn => fn(percent));
        if (err) {
          console.error(`[assets] Skipping ${item.key} from asset loading:`);
          console.error(err);
        }
        count++;
        next(null, result);
      });
    }, cb);
  }

  // Loads a single asset on demand, returning from
  // cache if it exists otherwise adding it to the cache
  // after loading.
  load (item, cb = noop) {
    const url = item.url;
    const ext = path.extname(url);
    const key = item.key || url;
    const cache = this._cache;
    const renderer = this._renderer;

    if (key in cache) {
      const ret = cache[key];
      process.nextTick(() => cb(null, ret));
      return ret;
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[assets] Loading ${url}`);
      }
      const done = (err, data) => {
        if (err) {
          delete cache[key];
        } else {
          cache[key] = data;
        }
        if (this._finishDelay) {
          setTimeout(() => {
            cb(err, data);
          }, this._finishDelay);
        } else {
          cb(err, data);
        }
      };
      if (isGLTF(ext)) {
        const loader = new THREE.GLTFLoader();
        return loader.load(url, (data) => {
          // get out of Promise land from GLTFLoader
          process.nextTick(() => done(null, data));
        }, noop, (err) => {
          process.nextTick(() => {
            console.error(err);
            done(new Error(`Could not load GLTF asset ${url}`));
          });
        });
      } else if (isJSON(ext)) {
        loadJSON(url, done);
        return;
      } else if (item.envMap) {
        const opts = Object.assign({renderer}, item);
        return loadEnvMap(opts, done);
      } else if (isSVG(ext) || isImage(ext)) {
        let ret;
        if (item.texture) {
          const opts = Object.assign({renderer}, item);
          ret = loadTexture(url, opts, done);
        } else {
          ret = loadImage(url, item, done);
        }
        cache[key] = ret;
        return ret;
      } else if (isAudio(ext)) {
        // instead of retaining audio objects in memory
        // (which isn't super helpful) and waiting for
        // them to finish loading (which can be a while
        // with long tracks) we will only XHR the resource
        // and mark the preload as immediately complete
        // so it warms up the cache.
        xhr({
          uri: url,
          responseType: 'arraybuffer'
        }, (err) => {
          if (err) {
            console.warn(`Audio file at ${url} could not load:`);
            console.warn(err);
          }
        });
        // Unlike other load events, we do not retain anything
        // in the asset cache...
        process.nextTick(() => {
          if (cb) cb(null);
        });
        return;
      } else {
        throw new Error(`Could not load ${url}, unknown file extension!`);
      }
    }
  }

  _getQueued (key) {
    for (let i = 0; i < this._queue.length; i++) {
      const item = this._queue[i];
      if (item.key === key) return item;
    }
    return null;
  }
}

module.exports = AssetManager;
