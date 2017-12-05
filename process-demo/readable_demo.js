process.stdin.on('readable', () => {
    console.log(d);
    process.stdin.on('end', () => {
        console.log('done!');
    });
});
