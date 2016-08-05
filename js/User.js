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
		.then(repos => Object.assign(...repos.filter((r => r.owner.id === this.id)).map(repoData => {
			return {[repoData.full_name]: new Repository(repoData, this.isAuthorised, this.connexion)};
		})))
		.catch(::console.error);
	}

	getOrganisations() {
		return request({
			endpoint: this.isAuthorised ? 'user/orgs' : `users/${this.login}/orgs`,
			token: this.connexion.token
		})
		.then(orgs => Object.assign(...orgs.map(orgData => {
			return {[orgData.login]: new Organisation(orgData, this.connexion)};
		})))
		.catch(::console.error);
	}
}