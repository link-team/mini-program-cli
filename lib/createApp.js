const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const exec = require('child_process').exec;
const clui = require('clui');
const Spinner = clui.Spinner;

const TEMPLATE_MAP = {
  0: 'app',
  1: 'component'
};

const spinner = new Spinner('installing dependencies...', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);

module.exports = function(dir, type) {
  spinner.start();

  fs.mkdir(dir, (error) => {
    if (error) {
      if (error.code === 'EEXIST') {
        fsExtra.emptydirSync(dir);
        createApp(dir);
      } else {
        console.error(error);
      }
    } else {
      createApp(dir, type);
    }
  });
};

const createApp = function(dir, type) {
  const src = path.join(__dirname, '..', 'templates', TEMPLATE_MAP[type]);

  (function loop(dirPath) {
    const subDirs = fs.readdirSync(dirPath);

    subDirs.forEach(subDir => {
      const fromPath = path.resolve(dirPath, subDir);
      const stat = fs.statSync(fromPath);

      if (stat.isFile()) {
        const relativePath = path.relative(src, fromPath);
        const toPath = path.resolve(dir, relativePath).replace('gitignore', '.gitignore');
        fsExtra.copySync(fromPath, toPath);
      } else if (stat.isDirectory()) {
        loop(fromPath);
      }
    });
  })(src);

  const childProcess = exec(`cd ${dir} && git init && npm init --yes && yarn add mini-antui && yarn add eslint eslint-config-ali eslint-plugin-import pre-commit-eslint -D`);

  childProcess.stdout.on('data', () => {
    spinner.message('installing dependencies...');
  });

  childProcess.stderr.on('data', (error) => {
    // console.log(error);
  });

  childProcess.on('exit', () => {
    console.log('\n done!');
    process.exit(0);
  });
}
