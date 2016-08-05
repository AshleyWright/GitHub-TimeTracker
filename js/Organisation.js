import request from './request';
import Repository from './Repository';

export default class Organisation {
	constructor (orgData, connexion) {
		Object.assign(this, orgData);
		this.connexion = connexion;
	}

	getRepositories() {
		return Promise.all([request({
			endpoint: `orgs/${this.login}/repos`,
			token: this.connexion.token
		}), this.connexion.getUser(this.login).then(user => user.getRepositories())])
		.then(([orgRepos, userRepos]) => Object.assign(userRepos, ...orgRepos.map(repoData => {
			return {[repoData.full_name]: new Repository(repoData, false, this.connexion)};
		})))
		.catch(::console.error);
	}
}