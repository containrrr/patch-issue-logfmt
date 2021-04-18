import * as core from '@actions/core';
import * as github from '@actions/github';
import { patchIssue } from './block-formatter';

(async () => {

    const authToken = core.getInput('repo-token');

    const {owner, repo, number} = github.context.issue;

    await patchIssue(authToken, owner, repo, number)

})().catch(error => core.setFailed(error.message))