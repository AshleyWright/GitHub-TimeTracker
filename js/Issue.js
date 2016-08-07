import request from './request';
import IssueComment from './IssueComment';

export default class Issue {
	constructor (issueData, repository, connexion) {
		Object.assign(this, issueData);
		this.connexion = connexion;
		this.repository = repository;
	}

	getComments() {
		return request({
			endpoint: `repos/${this.repository.full_name}/issues/${this.number}/comments`,
			token: this.connexion.token
		})
		.then(comments => comments.map(issueCommentData => new IssueComment(issueCommentData, this.connexion)))
		.catch(::console.error);
	}
}