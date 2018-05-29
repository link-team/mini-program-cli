const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const exec = require('child_process').exec;

module.exports = function(dir) {
  fs.mkdir(dir, (error) => {
    if (error) {
      if (error.code === 'EEXIST') {
        fsExtra.emptydirSync(dir);
        createApp(dir);
      } else {
        console.error(error);
      }
    } else {
      createApp(dir);
    }
  });
}

function createApp(dir) {
  const src = path.join(__dirname, '..', 'template');

  (function loop(dirPath) {
    const subDirs = fs.readdirSync(dirPath);

    subDirs.forEach(subDir => {
      const fromPath = path.resolve(dirPath, subDir);
      const stat = fs.statSync(fromPath);

      if (stat.isFile()) {
        const relativePath = path.relative(src, fromPath);
        const toPath = path.resolve(dir, relativePath);
        fsExtra.copySync(fromPath, toPath);
      } else if (stat.isDirectory()) {
        loop(fromPath);
      }
    });
  })(src);

  exec(`cd ${dir} && npm init --yes && npm install eslint eslint-config-ali eslint-plugin-import pre-commit-eslint -D`, (error, stdout, stderr) => {
    console.log(stdout);
  });
}
