const { executeCommand } = require("./exec");

async function main() {
    const currentBranch = process.env.GITHUB_HEAD_REF;
    await executeCommand(`git checkout ${currentBranch}`);
    await executeCommand('yarn install --frozen-lockfile --production', __dirname);
    await require('./main').main();
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
}

