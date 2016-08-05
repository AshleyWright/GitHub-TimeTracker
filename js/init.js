import GitHub from './GitHub';

if (!localStorage.gitHubAccessToken)
	localStorage.gitHubAccessToken = prompt('GitHub personal access token:');

window.GitHub = GitHub;

const gh = new GitHub({token: localStorage.gitHubAccessToken}),
	timeTracker = {
		users: {},
		repositories: {},
		userSelect: document.querySelector('select[name="user"]'),
		repoSelect: document.querySelector('select[name="repo"]'),
		scopeSelect: document.querySelector('select[name="scope"]'),
		identifierSelect: document.querySelector('select[name="scope-identifier"]'),
		userImage: document.getElementById('user-image'),
		onUserChange: function onUserChange (event) {
			let user = timeTracker.users[event.target.selectedOptions[0].value];
			timeTracker.userImage.src = user.avatar_url;
			user.getRepositories()
				.then(repositories => {
					timeTracker.repositories = Object.assign(...repositories.map(repo => {
						return {[repo.full_name]: repo};
					}));
					while (timeTracker.repoSelect.firstChild) timeTracker.repoSelect.removeChild(timeTracker.repoSelect.firstChild);
					Object.keys(timeTracker.repositories).forEach(repositoryName => {
						let repository = timeTracker.repositories[repositoryName],
							option = document.createElement('option');
						option.value = repositoryName;
						option.innerText = repository.name;
						timeTracker.repoSelect.appendChild(option);
					});
					Stretchy.resize(timeTracker.repoSelect);
				})
				.catch(::console.error);
		}
	};
timeTracker.userSelect.addEventListener('change', timeTracker.onUserChange);

gh.getUser()
	.then(user => {
		timeTracker.authenticatedUser = user;
		timeTracker.users[user.login] = user;
		return user.getOrganisations();
	})
	.then(organisations => {
		timeTracker.users = {...timeTracker.users, ...Object.assign(...organisations.map(org => {
			return {[org.login]: org};
		}))};
		while (timeTracker.userSelect.firstChild) timeTracker.userSelect.removeChild(timeTracker.userSelect.firstChild);
		Object.keys(timeTracker.users).forEach(userName => {
			let user = timeTracker.users[userName],
				option = document.createElement('option');
			option.value = user.login;
			option.innerText = user.login;
			if (user.login === timeTracker.authenticatedUser.login) option.selected = true;
			timeTracker.userSelect.appendChild(option);
		})
		Stretchy.resize(timeTracker.userSelect);
		timeTracker.onUserChange({target: timeTracker.userSelect});
	})
	.catch(::console.error);

window.timeTracker = timeTracker;