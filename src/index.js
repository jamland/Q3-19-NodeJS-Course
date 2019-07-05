const path = require("path");
const Promise = require("bluebird");
const fs = require("fs");

const directoryPath = path.join(__dirname);
const readdir = Promise.promisify(fs.readdir);
const stat = Promise.promisify(fs.stat);

const args = process.argv.slice(2);
const ifShowReverseOrder = args.some(arg => arg === "reverse-order");

const getFiles = async dirPath => {
  const dirs = await readdir(dirPath);
  const files = await Promise.all(
    dirs.map(async dir => {
      const result = path.resolve(dirPath, dir);
      const isDirectory = (await stat(result)).isDirectory();

      if (isDirectory) return getFiles(result);
      // return path.basename(result);
      return result;
    })
  );

  return files.reduce((a, f) => a.concat(f), []);
};

getFiles(directoryPath)
  .then(files => {
    const sortedList = ifShowReverseOrder ? files.reverse() : files;
    console.log(`\n📂  There are ${sortedList.length} files: `);
    sortedList.forEach((file, index) => {
      console.log(index + 1 + ". " + file);
    });
    console.log("\n");
  })
  .catch(e => console.error(e));
