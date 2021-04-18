import { patchIssue } from './block-formatter';

if(process.argv.length != 6) {
    console.log(process.argv)
    console.log(`Usage:\ncli TOKEN OWNER REPO ISSUE`)
} else {

    const [, , authToken, owner, repo, number] = process.argv;

    patchIssue(authToken, owner, repo, parseInt(number)).catch(error => {
        console.error('Failed:', error.message)
        process.exit(1)
    })
}