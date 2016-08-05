export default class Label {
	constructor (labelData, connexion) {
		Object.assign(this, labelData);
		this.connexion = connexion;
	}
}