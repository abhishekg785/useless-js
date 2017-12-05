let exec = require('child_process').exec;

exec('echo "vkfnvlkfnlvn"', (err, stdout, stderr) => {
    console.log('done');
    console.log('output', stdout);
});
