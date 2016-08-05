export default function request({method, endpoint, token}) {
	return fetch('https://api.github.com/' + endpoint, {
		cache: 'force-cache',
		headers: {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': `token ${token}`,
			'Content-Type': 'application/json;charset=UTF-8'
		},
		method: method ? method.toUpperCase() : 'GET',
		referrer: 'no-referrer'
	})
	.then(response => response.json());
}