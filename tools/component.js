const argv = require('minimist')(process.argv.slice(2), {
  boolean: [ 'section' ]
});

const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const maxstache = require('maxstache');
const chalk = require('chalk');

const type = argv.section ? 'section' : 'component';

let name = argv._[0];
if (!name) {
  console.error(chalk.red(`Error: Must give a ${type} name to create.`));
  process.exit(0);
}

name = name.charAt(0).toUpperCase() + name.slice(1);

const cwd = process.cwd();
const dir = path.resolve(__dirname, `../src/${type}s/` + name);
fs.stat(dir, (err, stat) => {
  if (err) {
    write();
  } else {
    console.log(chalk.red(`Path at ${path.relative(cwd, dir)} already exists!`));
  }
});

function write () {
  mkdirp(dir, err => {
    if (err) throw err;
    Promise.all([
      template(path.resolve(__dirname, 'template/Component.js'), path.resolve(dir, `${name}.js`)),
      template(path.resolve(__dirname, 'template/Component.less'), path.resolve(dir, `${name}.less`))
    ]).then(() => {
      console.log(`Created new ${name} ${type} at ${dir}`);
    }).catch(err => console.error(err));
  });
}

function template (input, output) {
  const data = {
    name: name
  };
  return new Promise((resolve, reject) => {
    fs.readFile(input, 'utf8', (err, str) => {
      if (err) return reject(err);
      str = maxstache(str, data);
      fs.writeFile(output, str, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}