const exec = require('child_process').exec;
const path = require('path');

function executeCommand(cmd, workingDirectory = null) {
    return new Promise((resolve, reject) => {
        let options = {};
        if (workingDirectory) {
            options.cwd = path.resolve(workingDirectory);
        }
        let p = exec(cmd, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });

        p.stdout.pipe(process.stdout);
        p.stderr.pipe(process.stderr);
    });
}

async function main() {
    const currentBranch = process.env.GITHUB_HEAD_REF;
    await executeCommand(`git checkout ${currentBranch}`);
    await executeCommand('npm ci --only=prod', __dirname);
    const mainRes =  await require('./main').main();
    console.log('mainRes', mainRes);
    return mainRes;
}

if (require.main === module) {
    main()
        .then((res) => {
            console.log('index.js success', res, this);
            process.exit(0)
        })
        .catch(e => {
            console.log('index.js fail');
            console.error(e);
            process.exit(1);
        });
}

