import request from './request';
import Organisation from './Organisation';
import Repository from './Repository';

export default class User {
	constructor (userData, isAuthorised, connexion) {
		Object.assign(this, userData);
		this.connexion = connexion;
		this.isAuthorised = isAuthorised;
	}

	getRepositories() {
		return request({
			endpoint: this.isAuthorised ? 'user/repos' : `users/${this.login}/repos`,
			token: this.connexion.token
		})
		.then(repos => repos.filter((r => r.owner.id === this.id)).map(repoData => new Repository(repoData, this.isAuthorised, this.connexion)))
		.catch(::console.error);
	}

	getOrganisations() {
		return request({
			endpoint: this.isAuthorised ? 'user/orgs' : `users/${this.login}/orgs`,
			token: this.connexion.token
		})
		.then(orgs => orgs.map(orgData => new Organisation(orgData, this.connexion)))
		.catch(::console.error);
	}
}