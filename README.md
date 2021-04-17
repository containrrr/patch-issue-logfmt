# logmt patcher

GitHub Action for patching logfmt logs in issues.
Finds logfmt log lines in issues and replaces them with formatted version that is easier to follow.

## Inputs

### `repo-token`

**Required** The PAT to use for authorizing the edits (usually `${{ secrets.GITHUB_TOKEN }}`)

## Example usage

```yaml
uses: containrrr/logfmt-patcher@v0.1
with:
  repo-token: ${{ secrets.GITHUB_TOKEN }}
```
