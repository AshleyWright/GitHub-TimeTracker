import GitHub from './GitHub';

if (!localStorage.gitHubAccessToken)
	localStorage.gitHubAccessToken = prompt('GitHub personal access token:');

window.GitHub = GitHub;

const gh = new GitHub({token: localStorage.gitHubAccessToken}),
	timeTracker = {
		connexion: gh,
		users: {},
		repositories: {},
		repository: null,
		assignees: [],
		milestones: [],
		sprints: [],
		labels: [],
		userSelect: document.querySelector('select[name="user"]'),
		repoSelect: document.querySelector('select[name="repo"]'),
		scopeSelect: document.querySelector('select[name="scope"]'),
		identifierSelect: document.querySelector('select[name="scope-identifier"]'),
		userImage: document.getElementById('user-image'),
		scopeImage: document.getElementById('scope-image'),
		onUserChange: function onUserChange (event) {
			let user = timeTracker.users[event.target.selectedOptions[0].value];
			timeTracker.userImage.src = user.avatar_url;
			user.getRepositories()
				.then(repositories => {
					timeTracker.repositories = repositories;
					while (timeTracker.repoSelect.firstChild) timeTracker.repoSelect.removeChild(timeTracker.repoSelect.firstChild);
					Object.keys(timeTracker.repositories).forEach(repositoryName => {
						let repository = timeTracker.repositories[repositoryName],
							option = document.createElement('option');
						option.value = repositoryName;
						option.innerText = repository.name;
						timeTracker.repoSelect.appendChild(option);
					});
					Stretchy.resize(timeTracker.repoSelect);
					timeTracker.onRepoChange({target: timeTracker.repoSelect});
				})
				.catch(::console.error);
		},
		onRepoChange: function onRepoChange (event) {
			let repo = timeTracker.repository = timeTracker.repositories[event.target.selectedOptions[0].value];
			Promise.all([repo.getAssignees(), repo.getMilestones(), repo.getSprints(), repo.getLabels(), repo.getIssues()])
				.then(([assignees, milestones, sprints, labels, issues]) => {
					timeTracker.assignees = assignees;
					timeTracker.milestones = milestones;
					timeTracker.sprints = sprints;
					timeTracker.labels = labels;
					timeTracker.issues = issues;
					while (timeTracker.scopeSelect.firstChild) timeTracker.scopeSelect.removeChild(timeTracker.scopeSelect.firstChild);
					function addScope(value, label) {
						let option = document.createElement('option');
						option.value = value;
						option.innerText = label;
						timeTracker.scopeSelect.appendChild(option);
					}
					if (assignees.length > 1) addScope('assignee', 'Assignees');
					if (milestones.length > 0) addScope('milestone', 'Milestones');
					if (sprints.length > 0) addScope('sprint', 'Spirints');
					if (labels.length > 0) addScope('label', 'Labels');
					Stretchy.resize(timeTracker.scopeSelect);
					timeTracker.onScopeChange({target: timeTracker.scopeSelect});
				});
		},
		onScopeChange: function onScopeChange (event) {
			let scope = timeTracker.scope = event.target.selectedOptions[0].value;
			timeTracker.scopeImage.style.display = ~['assignee', 'label'].indexOf(scope) ? 'initial' : 'none';
			while (timeTracker.identifierSelect.firstChild) timeTracker.identifierSelect.removeChild(timeTracker.identifierSelect.firstChild);
			switch (scope) {
			case 'assignee':
				timeTracker.assignees.forEach(assignee => {
					let option = document.createElement('option');
					option.innerText = option.value = assignee.login;
					timeTracker.identifierSelect.appendChild(option);
				});
				break;
			case 'milestone':
				timeTracker.milestones.forEach(milestone => {
					let option = document.createElement('option');
					option.value = milestone.number;
					option.innerText = milestone.title;
					timeTracker.identifierSelect.appendChild(option);
				});
				break;
			case 'sprint':
				timeTracker.sprints.forEach(sprint => {
					let option = document.createElement('option');
					option.innerText = option.value = sprint.name;
					timeTracker.identifierSelect.appendChild(option);
				});
				break;
			case 'label':
				timeTracker.labels.forEach(label => {
					let option = document.createElement('option');
					option.innerText = option.value = label.name;
					timeTracker.identifierSelect.appendChild(option);
				});
				break;
			default:
				console.error('Unknown scope');
				break;
			}
			Stretchy.resize(timeTracker.identifierSelect);
			timeTracker.onScopeIdentifierChange({target: timeTracker.identifierSelect});
		},
		onScopeIdentifierChange: function onScopeIdentifierChange (event) {
			let identifier = event.target.value,
				assignee, label;
			switch (timeTracker.scope) {
			case 'assignee':
				assignee = timeTracker.assignees.filter(user => user.login === identifier)[0];
				timeTracker.scopeImage.src = assignee.avatar_url;
				console.log(timeTracker.issues.filter(issue => issue.assignees.filter(a => a.login === assignee.login).length));
				break;
			case 'milestone':
				console.log(timeTracker.issues.filter(issue => issue.milestone && issue.milestone.number === +identifier));
				break;
			case 'sprint':
				console.log(timeTracker.issues.filter(issue => issue.labels.filter(l => l.name === identifier).length));
				break;
			case 'label':
				label = timeTracker.labels.filter(label => label.name === identifier)[0];
				timeTracker.scopeImage.src = '';
				timeTracker.scopeImage.style.backgroundColor = `#${label.color}`;
				console.log(timeTracker.issues.filter(issue => issue.labels.filter(l => l.name === identifier).length));
				break;
			default:
				console.error('Unknown scope');
				break;
			}
		}
	};
timeTracker.userSelect.addEventListener('change', timeTracker.onUserChange);
timeTracker.repoSelect.addEventListener('change', timeTracker.onRepoChange);
timeTracker.scopeSelect.addEventListener('change', timeTracker.onScopeChange);
timeTracker.identifierSelect.addEventListener('change', timeTracker.onScopeIdentifierChange);

gh.getUser()
	.then(user => {
		timeTracker.users[user.login] = timeTracker.authenticatedUser = user;
		return user.getOrganisations();
	})
	.then(organisations => {
		timeTracker.users = {...timeTracker.users, ...organisations};
		while (timeTracker.userSelect.firstChild) timeTracker.userSelect.removeChild(timeTracker.userSelect.firstChild);
		Object.keys(timeTracker.users).forEach(userName => {
			let user = timeTracker.users[userName],
				option = document.createElement('option');
			option.innerText = option.value = user.login;
			if (user.login === timeTracker.authenticatedUser.login) option.selected = true;
			timeTracker.userSelect.appendChild(option);
		})
		Stretchy.resize(timeTracker.userSelect);
		timeTracker.onUserChange({target: timeTracker.userSelect});
	})
	.catch(::console.error);

window.timeTracker = timeTracker;