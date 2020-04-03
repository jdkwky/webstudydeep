// const { exec } = require('child_process');

// exec("ls -a", { maxBuffer: 2 }, (err, stdout, stderr) => {
//     if (err) {
//         console.log(err, 'err');
//         return;
//     }
//     console.log(`data is \n ${stdout}`);
//     console.log(`stderr is  ${stderr}`);

// });

const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
    console.log(`子进程退出，退出码 ${code}`);
});
