/**
 * @author: abhishek goswami ( Hiro )
 *
 * Gives you the unused js files in the project using webpack --json
*/

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

async function getLocalFiles(modules) {
  modules.filter((module) => {
    console.log(module.name);
  })
}

(async () => {
  let data = await readWebpackDataInput();

  let modules = data.modules;
  let localFiles = await getLocalFiles(modules);
})();
