const filed = require('filed');
const url = require('url');
const less = require('less-css-stream');
const Prefix = require('less-plugin-autoprefix');
const once = require('once');
const path = require('path');
const fs = require('fs');
const globPlugin = require('less-plugin-glob');

const lessFile = path.resolve(__dirname, '../src/style/main.less');
const outputFile = path.resolve(__dirname, '../app/style.css');
const cssUrl = 'style.css';

module.exports.write = function (opt = {}) {
  const fileOut = fs.createWriteStream(outputFile);
  const stream = createLessStream(opt);
  fileOut.on('close', () => {
    console.log('Finished writing style to', path.basename(outputFile));
  });
  return fs.createReadStream(lessFile).pipe(stream).pipe(fileOut);
};

module.exports.getCSSURL = function () {
  return cssUrl;
};

module.exports.isLessFile = function (file) {
  return path.resolve(file) === path.resolve(lessFile);
};

module.exports.middleware = function lessMiddleware (opts = {}) {
  var middleware = function (req, res, next) {
    if (typeof next !== 'function') {
      next = function (err) {
        if (err) {
          res.statusCode = 400;
          res.end(err.message);
        }
      };
    }

    if (url.parse(req.url).pathname === '/' + cssUrl) {
      res.setHeader('Content-Type', 'text/css');

      var onError = once(function onError (err) {
        var msg = err.message;
        err.message = 'ERROR ' + lessFile + ':\n  ' + msg;
        console.error(err);
        next(err);
      });

      filed(lessFile).on('error', onError)
        .pipe(createLessStream(opts)).on('error', onError)
        .pipe(res);
    } else {
      next();
    }
  };
  return middleware;
};

function createLessStream (opts = {}) {
  var autoprefix = opts.autoprefix;
  if (typeof autoprefix === 'string') {
    autoprefix = autoprefix.replace(/\s*,\s*/g, ',').split(',');
  }

  const plugins = [ globPlugin ];
  if (autoprefix) {
    plugins.push(new Prefix({ browsers: autoprefix }));
  }

  var lessOpts = {
    paths: opts.paths,
    compress: opts.compress,
    plugins: plugins
  };
  return less(lessFile, lessOpts);
}

if (!module.parent) {
  module.exports.write({ compress: true });
}
