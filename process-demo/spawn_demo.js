let spawn = require('child_process').spawn;

if(process.argv[2] === 'child') {
    console.log('I am in the child!');
}
else {
    var child = spawn(process.execPath, [__filename, 'child'])
    child.stdout.pipe(process.stdout);
}

