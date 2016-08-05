export default class Sprint {
	constructor (sprintData, connexion) {
		Object.assign(this, sprintData);
		this.connexion = connexion;
	}
}