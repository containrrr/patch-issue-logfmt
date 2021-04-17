import * as core from '@actions/core';
import * as github from '@actions/github';
import { patchCodeBlocks } from './block-formatter';

(async () => {

    const authToken = core.getInput('repo-token');

    const octokit = github.getOctokit(authToken);

    const {owner, repo, number} = github.context.issue;

    const response = await octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
        owner,
        repo,
        issue_number: number,
    });

    if(response.status != 200) {
        core.setFailed(`Failed to fetch issue data. Server responded with ${response.status}`)
    }

    const issue = response.data;

    const [patchedBody, patchCount] = patchCodeBlocks(issue.body);
    if(patchCount < 1) {
        // No need to update the issue body, since we found no logfmt lines
        return
    }

    await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
        owner,
        repo,
        issue_number: number,
        body: patchedBody,
    })

})().catch(error => core.setFailed(error.message))

