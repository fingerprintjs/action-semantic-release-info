# GitHub Action - Get Next Semantic Release Info
This GitHub Action gets next semantic release info, does not publish. export the info as output variables.

## Usage

Add this step in your workflow file
```yaml
- name: Gets semantic release info
  id: semantic_release_info
  uses: fingerprintjs/action-semantic-release-info@v1
```

### Output Variables

- `type` - The part of the version incremented - major/minor/patch
- `channel` - The distribution channel on which the last release was initially made available
- `git_head` - The sha of the last commit being part of the release
- `version` - The version of the release
- `git_tag` - The Git tag associated with the release
- `name` - The name of the release
- `notes` - The release notes of the release (a summary of git commits)
- `no_release` - If true, new release will not generated after merging the pr

output variables can be accessed after the step is completed via 
```
${{ steps.semantic_release_info.outputs.<variable name> }}
```

### Full Example
In this example I get changelog for the future release and add a comment to the pr with it.  

```yaml

name: Add release info comment

on: [pull_request]

jobs:
  release-comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Collect semantic-release-info
        id: semantic_release_info
        uses: fingerprintjs/action-semantic-release-info@v1
        env:
          GITHUB_TOKEN: ${{ github.token }}
      - if: ${{ steps.semantic_release_info.outputs.no_release == 'false' }}
        name: Add comment to the PR
        uses: marocchino/sticky-pull-request-comment@3d60a5b2dae89d44e0c6ddc69dd7536aec2071cd
        with:
          header: ReleasePreview
          recreate: true
          message: |
            ## This PR will create a ${{steps.semantic_release_info.outputs.type}} release :rocket:
            ${{steps.semantic_release_info.outputs.notes}}
      - if: ${{ steps.semantic_release_info.outputs.no_release == 'true' }}
        name: Add comment to the PR
        uses: marocchino/sticky-pull-request-comment@3d60a5b2dae89d44e0c6ddc69dd7536aec2071cd
        with:
          header: ReleasePreview
          recreate: true
          message: |
            ## This PR will not create a new release :rocket:
```

