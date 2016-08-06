import request from './request';
import Issue from './Issue';
import Label from './Label';
import Milestone from './Milestone';
import Sprint from './Sprint';
import User from './User';

export default class Repository {
	constructor (repoData, isAuthorised, connexion) {
		Object.assign(this, repoData);
		this.connexion = connexion;
		this.isAuthorised = isAuthorised;
	}

	getMilestones() {
		return request({
			endpoint: `repos/${this.full_name}/milestones`,
			token: this.connexion.token
		})
		.then(milestones => milestones.map(milestoneData => new Milestone(milestoneData, this.connexion)))
		.catch(::console.error);
	}

	getLabels() {
		return request({
			endpoint: `repos/${this.full_name}/labels`,
			token: this.connexion.token
		})
		.then(labels => labels.map(labelData => new Label(labelData, this.connexion)))
		.catch(::console.error);
	}

	getAssignees() {
		return request({
			endpoint: `repos/${this.full_name}/assignees`,
			token: this.connexion.token
		})
		.then(assignees => assignees.map(assigneeData => new User(assigneeData, false, this.connexion)))
		.catch(::console.error);
	}

	getIssues() {
		return request({
			endpoint: `repos/${this.full_name}/issues`,
			token: this.connexion.token
		})
		.then(issues => issues.map(issueData => new Issue(issueData, this.connexion)))
		.catch(::console.error);
	}
}