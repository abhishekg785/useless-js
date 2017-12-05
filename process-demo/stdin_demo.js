let questions = [
    'what is your name ?',
    'what is your fav superhero ?'
];

let answers = [];

function ask(i) {
    process.stdout.write(`\n\n\n ${questions[i]}`);
    process.stdout.write(' > ');
}

process.stdin.on('data', (d) => {
    answers.push(d.toString().trim());

    if (answers.length < questions.length) {
        ask(answers.length);
    }
    else {
        process.exit();
    }
})

process.on('exit', () => {
    process.stdout.write(`\n\n\n ${answers}`);
});

ask(0);
