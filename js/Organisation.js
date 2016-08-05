import request from './request';
import Repository from './Repository';

export default class Organisation {
	constructor (orgData, connexion) {
		Object.assign(this, orgData);
		this.connexion = connexion;
	}

	getRepositories() {
		return request({
			endpoint: `orgs/${this.login}/repos`,
			token: this.connexion.token
		})
		.then(repos => repos.map(repoData => new Repository(repoData, false, this.connexion)))
		.catch(::console.error);
	}
}