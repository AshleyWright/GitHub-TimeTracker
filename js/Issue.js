export default class Issue {
	constructor (issueData, connexion) {
		Object.assign(this, issueData);
		this.connexion = connexion;
	}
}