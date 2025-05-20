# GitHub Action - Get Next Semantic Release Info
This GitHub Action summarizes information about the next semantic release. It does not publish the release. The information is exported as output variables of the GitHub action.

> **Note**
> This package isn’t part of our core product. It’s kindly shared “as-is” without any guaranteed level of support from Fingerprint. We warmly welcome community contributions.

## Usage

Add this step to your GitHub workflow file: 
```yaml
- name: Gets semantic release info
  id: semantic_release_info
  uses: fingerprintjs/action-semantic-release-info@v1
```

### Inputs

- `semanticReleasePlugins` (optional): Additional Semantic Release plugins to install and include. For example;
  ```
  - name: Collect semantic-release-info
    id: semantic_release_info
    uses: fingerprintjs/action-semantic-release-info@v1
    env:
      GITHUB_TOKEN: ${{ github.token }}
    with:
      semanticReleasePlugins: |
        @fingerprintjs/semantic-release-native-dependency-plugin@^1.2.1
  ```

### Output Variables

After the action is completed, you can access the output variables using this pattern:
```yaml
${{ steps.semantic_release_info.outputs.<variable name> }}
```

- `type` - The part of the version incremented - major/minor/patch
- `channel` - The distribution channel on which the last release was initially made available
- `git_head` - The sha of the last commit being part of the release
- `version` - The version of the release
- `git_tag` - The Git tag associated with the release
- `name` - The name of the release
- `notes` - The release notes of the release (a summary of git commits)
- `no_release` - If true, new release will not generated after merging the pr

### Full Example
For example, you can get a changelog of a future release and add it as a comment to a pull request: 

```yaml
name: Add release preview comment

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
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: ReleasePreview
          recreate: true
          message: |
            ## This PR will create a ${{steps.semantic_release_info.outputs.type}} release :rocket:
            ${{steps.semantic_release_info.outputs.notes}}
      - if: ${{ steps.semantic_release_info.outputs.no_release == 'true' }}
        name: Add comment to the PR
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: ReleasePreview
          recreate: true
          message: |
            ## This PR will not create a new release :rocket:
      - name: Add release notes preview to the job summary
        if: ${{ steps.semantic_release_info.outputs.no_release == 'false' }}
        run: |
          echo "## This PR will create a ${{steps.semantic_release_info.outputs.type}} release :rocket:" >> $GITHUB_STEP_SUMMARY
          echo "${{steps.semantic_release_info.outputs.notes}}" >> $GITHUB_STEP_SUMMARY
      - name: Add release notes preview to the job summary
        if: ${{ steps.semantic_release_info.outputs.no_release == 'true' }}
        run: |
          echo "## This PR will not create a new release :rocket:" >> $GITHUB_STEP_SUMMARY
```

