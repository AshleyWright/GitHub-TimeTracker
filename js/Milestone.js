export default class Milestone {
	constructor (milestoneData, connexion) {
		Object.assign(this, milestoneData);
		this.connexion = connexion;
	}
}