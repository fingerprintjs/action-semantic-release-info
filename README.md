# GitHub Action - Get Next Semantic Release Info
This GitHub Action gets next semantic release info, does not publish. export the info as output variables.

## Usage

Add this step in your workflow file
```yaml
- name: Gets semantic release info
  id: semantic_release_info
  uses: jossef/action-semantic-release-info@v2.1.0
  env:
    GITHUB_TOKEN: ${{ github.token }}
```

### Output Variables

- `type` - The part of the version incremented - major/minor/patch
- `channel` - The distribution channel on which the last release was initially made available
- `git_head` - The sha of the last commit being part of the release
- `version` - The version of the release
- `git_tag` - The Git tag associated with the release
- `name` - The name of the release
- `notes` - The release notes of the release (a summary of git commits)

output variables can be accessed after the step is completed via 
```
${{ steps.semantic_release_info.outputs.<variable name> }}
```

### Full Example
In this example I build auto generated docs, commit the built docs artifacts and make a tagged release  

```yaml

name: CI

on:
  push:
    branches:
      - '**'
    tags-ignore:
      - '*.*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
            
      - name: Gets semantic release info
        id: semantic_release_info
        uses: jossef/action-semantic-release-info@v2.1.0
        env:
          GITHUB_TOKEN: ${{ github.token }}
      
      - name: Build auto generated docs
        run: |
          npm install
          npm run build-docs
      
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A
          git commit -m "docs(): bumping release ${{ steps.semantic_release_info.outputs.git_tag }}"
          git tag ${{ steps.semantic_release_info.outputs.git_tag }}
          
      - name: Push changes
        uses: ad-m/github-push-action@v0.6.0
        with:
          github_token: ${{ github.token }}
          tags: true

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ github.token }}
        with:
          tag_name: ${{ steps.semantic_release_info.outputs.git_tag }}
          release_name: ${{ steps.semantic_release_info.outputs.git_tag }}
          body: ${{ steps.semantic_release_info.outputs.notes }}
          draft: false
          prerelease: false
```

