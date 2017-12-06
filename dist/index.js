/**
 * @author: abhishek goswami ( Hiro )
 *
 * Gives you the unused js files in the project using webpack --json
*/

const path = require('path');
const glob = require('glob');

const cwd = process.cwd();

const argv = require('yargs')
  .alias('s', 'src')
  .describe('s', 'Source Directory of the files')
  .default('s', '.')
  .argv;

const srcDir = path.resolve(argv.src);

function readWebpackDataInput() {

  return new Promise((resolve, reject) => {
    let combData = '';
    process.stdin.setEncoding('utf8');

    // using 'readable' instead of 'data' due
    // to large expected data from webpack --json
    // readable deals with the streams and this it is cool !
    process.stdin.on('readable', () => {
      let data = process.stdin.read();

      if (data === null && data === '') {
        throw new Error('No data input from webpack found!');
        process.exit();
      }

      combData += data;
    });

    process.stdin.on('end', () => {
      try{
         resolve(JSON.parse(combData));
      } catch (e) {
        console.error('Not a Valid json! Trying to make valid json :P');
        const startPos = combData.indexOf('{');
        const lastPos = combData.lastIndexOf('}');
        if (startPos === -1 || lastPos === -1) {
          throw new Error('No JSON');
        }

        try {
          let requiredData = combData.slice(startPos, lastPos + 1);
          let parsedData = JSON.parse(requiredData);
          resolve(parsedData);
        } catch (e) {
          throw new Error('Nothing can be done with this data!');
        }
      }
    });
  });
}

// get only the local files
const isFileLocal = (filePath) => {
  return (filePath.indexOf('./') === 0 && filePath.indexOf('./~/') === -1);
}

async function getUsedFiles(modules) {
  return modules.filter(module => isFileLocal(module.name)).map(module => path.join(cwd, module.name));
}

function getDirFiles() {
  return new Promise((resolve, reject) => {
    glob('!(node_modules)/**/*.*', {
      cwd: srcDir
    }, (err, files) => {
      if(err) {
        reject(err);
      }
      resolve(files.map(file => path.join(srcDir, file)));
    });
  });
}

function getUnusedFiles(usedFilesArr, dirFilesArr) {
  return new Promise((resolve, reject) => {
    resolve(dirFilesArr.filter(file => usedFilesArr.indexOf(file) === -1));
  });
}

(async () => {
  let data = await readWebpackDataInput();

  let modules = data.modules;
  let usedFilesArr = await getUsedFiles(modules);
  let dirFilesArr = await getDirFiles();

  // we have the used files arr and dir file arr,
  // now we can simply compare here
  let unused = await getUnusedFiles(usedFilesArr, dirFilesArr);

  console.log('****************************** Here are your unused file! I maybe wrong :P ******************************\n');
  console.log(unused.join('\n'));
})();
