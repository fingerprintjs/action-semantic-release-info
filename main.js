delete process.env.GITHUB_ACTIONS;

const semanticRelease = require('semantic-release');
const core = require("@actions/core");

const plugins = [
    [
        '@semantic-release/commit-analyzer',
        {
            "config": "@fingerprintjs/conventional-changelog-dx-team",
            "releaseRules": "@fingerprintjs/conventional-changelog-dx-team/release-rules"
        }
    ],
    [
        '@semantic-release/release-notes-generator',
        {
            "config": "@fingerprintjs/conventional-changelog-dx-team"
        }
    ],
];

async function main() {
    try {
        const currentBranch = process.env.GITHUB_HEAD_REF;
        const result = await semanticRelease({
            noCi: true, dryRun: true, branches: [currentBranch, 'main'],
            "plugins": plugins
        });
        if (result) {
            const {nextRelease} = result;
            core.setOutput("type", nextRelease.type);
            core.setOutput("channel", nextRelease.channel);
            core.setOutput("git_head", nextRelease.gitHead);
            core.setOutput("version", nextRelease.version);
            core.setOutput("git_tag", nextRelease.gitTag);
            core.setOutput("name", nextRelease.name);
            core.setOutput("notes", nextRelease.notes);
            core.setOutput("no_release", false);
        } else {
            core.setOutput("no_release", true);
            core.setFailed('no info regarding next release');
        }
    } catch (err) {
        core.setFailed(err)
        throw err;
    }
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
}

module.exports.main = main;

