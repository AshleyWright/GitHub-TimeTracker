import request from './request';
import User from './User';

export default class GitHub
{
	constructor({token}) {
		this.token = token;
	}

	getUser(username) {
		return request({
			endpoint: username ? `users/${username}` : 'user',
			token: this.token
		}).then(userData => new User(userData, !username, this))
		.catch(::console.error);
	}

	getRateLimit() {
		return request({
			endpoint: 'rate_limit',
			token: this.token
		})
		.catch(::console.error);
	}
}