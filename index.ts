import * as core from '@actions/core';
import * as github from '@actions/github';
import { patchCodeBlocks } from './block-formatter';

(async () => {

    const authToken = core.getInput('repo-token');

    const octokit = github.getOctokit(authToken);

    const {owner, repo, number} = github.context.issue;

    console.log(`Repo: ${owner}/${repo}`)
    console.log(`Issue: ${number}`)

    console.log('Retrieving issue details...')

    const response = await octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
        owner,
        repo,
        issue_number: number,
    });

    if(response.status != 200) {
        core.setFailed(`Failed to fetch issue data. Server responded with ${response.status}`)
    }

    const issue = response.data;

    console.log(`Issue title: ${issue.title}`)
    console.log(`Issue body:\n${issue.body}\n`)
    console.log(`Patching issue body...`)

    const [patchedBody, patchCount] = patchCodeBlocks(issue.body);

    if(patchCount < 1) {
        console.log('No lines where patched. Skipping update.')
        // No need to update the issue body, since we found no logfmt lines
        return
    }

    console.log(`Patch count: ${patchCount}`)
    console.log(`Saving issue body...`)

    const saveResponse = await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
        owner,
        repo,
        issue_number: number,
        body: patchedBody,
    })

    console.log('Response:')
    console.log(saveResponse.data)

    if(saveResponse.status != 200) {
        core.setFailed(`Failed to save issue data. Server responded with ${response.status}`)
    }

})().catch(error => core.setFailed(error.message))

