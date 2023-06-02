delete process.env.GITHUB_ACTIONS;

const semanticRelease = require('semantic-release');
const core = require("@actions/core");

const plugins = [
    [
        '@semantic-release/commit-analyzer',
        {
            'releaseRules': [
                {
                    'type': 'build',
                    'scope': 'deps',
                    'release': 'patch'
                },
                {
                    'type': 'docs',
                    'scope': 'README',
                    'release': 'patch'
                }
            ]
        }
    ],
    [
        '@semantic-release/release-notes-generator',
        {
            'preset': 'conventionalCommits',
            'presetConfig': {
                'types': [
                    {
                        'type': 'feat',
                        'section': 'Features'
                    },
                    {
                        'type': 'feature',
                        'section': 'Features'
                    },
                    {
                        'type': 'fix',
                        'section': 'Bug Fixes'
                    },
                    {
                        'type': 'perf',
                        'section': 'Performance Improvements'
                    },
                    {
                        'type': 'revert',
                        'section': 'Reverts'
                    },
                    {
                        'type': 'docs',
                        'scope': 'README',
                        'section': 'Documentation'
                    },
                    {
                        'type': 'build',
                        'scope': 'deps',
                        'section': 'Build System'
                    },
                    {
                        'type': 'docs',
                        'section': 'Documentation',
                        'hidden': true
                    },
                    {
                        'type': 'style',
                        'section': 'Styles',
                        'hidden': true
                    },
                    {
                        'type': 'chore',
                        'section': 'Miscellaneous Chores',
                        'hidden': true
                    },
                    {
                        'type': 'refactor',
                        'section': 'Code Refactoring',
                        'hidden': true
                    },
                    {
                        'type': 'test',
                        'section': 'Tests',
                        'hidden': true
                    },
                    {
                        'type': 'build',
                        'section': 'Build System',
                        'hidden': true
                    },
                    {
                        'type': 'ci',
                        'section': 'Continuous Integration',
                        'hidden': true
                    }
                ]
            }
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
        } else {
            core.setFailed('no info regarding next release');
        }
    } catch (err) {
        core.setFailed(err)
        throw err;
    }
}

if (require.main === module) {
    main()
        .then(() => {
            console.log('main.js success');
            process.exit(0)
        })
        .catch(e => {
            console.log('main.js fail');
            console.error(e);
            process.exit(1);
        });
}

module.exports.main = main;

