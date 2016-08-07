export default class IssueComment {
	constructor (issueCommentData, connexion) {
		Object.assign(this, issueCommentData);
		this.connexion = connexion;
	}
}