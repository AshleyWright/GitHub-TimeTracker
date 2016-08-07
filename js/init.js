import GitHub from './GitHub';

let settings = localStorage.settings && JSON.parse(localStorage.settings);
if (!settings || !settings.gitHub.oauth2Token)
	window.location = 'settings.html';

window.GitHub = GitHub;

const gh = new GitHub({token: settings.gitHub.oauth2Token}),
	timeTracker = {
		connexion: gh,
		users: {},
		repositories: {},
		repository: null,
		assignees: [],
		milestones: [],
		labels: [],
		userSelect: document.querySelector('select[name="user"]'),
		repoSelect: document.querySelector('select[name="repo"]'),
		scopeSelect: document.querySelector('select[name="scope"]'),
		identifierSelect: document.querySelector('select[name="scope-identifier"]'),
		userImage: document.getElementById('user-image'),
		scopeImage: document.getElementById('scope-image'),
		issueList: document.getElementById('issue-list'),
		onUserChange: function onUserChange (event) {
			document.body.classList.add('loading');
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
			document.body.classList.add('loading');
			let repo = timeTracker.repository = timeTracker.repositories[event.target.selectedOptions[0].value];
			Promise.all([repo.getAssignees(), repo.getMilestones(), repo.getLabels(), repo.getIssues()])
				.then(([assignees, milestones, labels, issues]) => {
					timeTracker.assignees = assignees;
					timeTracker.milestones = milestones;
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
					if (labels.length > 0) addScope('label', 'Labels');
					Stretchy.resize(timeTracker.scopeSelect);
					timeTracker.onScopeChange({target: timeTracker.scopeSelect});
				});
		},
		onScopeChange: function onScopeChange (event) {
			document.body.classList.add('loading');
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
			document.body.classList.add('loading');
			let identifier = event.target.value,
				assignee, label;
			switch (timeTracker.scope) {
			case 'assignee':
				assignee = timeTracker.assignees.filter(user => user.login === identifier)[0];
				timeTracker.scopeImage.src = assignee.avatar_url;
				timeTracker.renderIssues(timeTracker.issues.filter(issue => issue.assignees.filter(a => a.login === assignee.login).length));
				break;
			case 'milestone':
				timeTracker.renderIssues(timeTracker.issues.filter(issue => issue.milestone && issue.milestone.number === +identifier));
				break;
			case 'label':
				label = timeTracker.labels.filter(label => label.name === identifier)[0];
				timeTracker.scopeImage.src = '';
				timeTracker.scopeImage.style.backgroundColor = `#${label.color}`;
				timeTracker.renderIssues(timeTracker.issues.filter(issue => issue.labels.filter(l => l.name === identifier).length));
				break;
			default:
				console.error('Unknown scope');
				break;
			}
		},
		renderIssues: function renderIssues(issues) {
			document.body.classList.add('loading');
			Promise.all(issues.map(issue => issue.getComments()))
				.then(issueCommentsArray => {
					if (issues.length) {
						while (timeTracker.issueList.children.length) timeTracker.issueList.removeChild(timeTracker.issueList.firstChild);
						for (let i = 0; i < issues.length; i++) {
							let issue = issues[i]
							issue.comments = issueCommentsArray[i];
							timeTracker.calculateTime(issue);
							timeTracker.issueList.appendChild(timeTracker.renderIssue(issue));
						}
					} else {
						timeTracker.issueList.innerHTML = '<p class="no-issues">No Issues Found</p>';
					}
					document.body.classList.remove('loading');
				})
				.catch(::console.error);
		},
		renderIssue: function renderIssue (issue) {
			let issueElement = document.createElement('div');
			issueElement.classList.add('issue');
			issueElement.innerHTML =
				`<div>
					<div class="issue-title">${issue.title}</div>
					<div class="issue-time-container">
						${(() => {
							if (issue.trackedTime.elapsed <= issue.trackedTime.estimated) {
								return `<meter min="0" max="${issue.trackedTime.estimated} value="${issue.trackedTime.elapsed}"></meter>`;
							}
							return `<meter min="0" max="${issue.trackedTime.elapsed}" value="${issue.trackedTime.estimated}" class="overtime"></meter>`;
						})()}
					</div>
				</div>
				<div>
					<div class="issue-milestone">${issue.milestone ? issue.milestone.title : ''}</div>
					<div class="issue-labels">${issue.labels.map(label => {
						return `<span class="label" style="background:#${label.color}">${label.name}</span>`;
					}).join('')}</div>
					<div class="issue-assignees">${issue.assignees.map(assignee => {
						return `<img class="avatar" title="${assignee.login}" src="${assignee.avatar_url}">`
					}).join('')}</div>
				</div>`;
			return issueElement;
		},
		calculateTime: function calculateTime(issue) {
			let time = {
				elapsed: 0,
				estimated: 0
			};
			issue.comments.forEach(comment => {
				let parsedElapsed = (/:clock\d*:\s(\d*d)?\s*(\d*h)?\s*(\d*m)?\s*(\d*s)?/).exec(comment.body);
				let parsedEstimated = (/:dart:\s*(\+)?\s*(\d*d)?\s*(\d*h)?\s*(\d*m)?\s*(\d*s)?/).exec(comment.body);

				if (parsedElapsed) {
					time.elapsed += (parsedElapsed[1] ? parsedElapsed[1].substr(0, parsedElapsed[1].length - 1) : 0) * 24*60*60;
					time.elapsed += (parsedElapsed[2] ? parsedElapsed[2].substr(0, parsedElapsed[2].length - 1) : 0) *    60*60;
					time.elapsed += (parsedElapsed[3] ? parsedElapsed[3].substr(0, parsedElapsed[3].length - 1) : 0) *       60;
					time.elapsed += (parsedElapsed[4] ? parsedElapsed[4].substr(0, parsedElapsed[4].length - 1) : 0) *        1;
				}

				if (parsedEstimated) {
					if (parsedEstimated[1]) time.estimated = Math.max(time.elapsed, time.estimated);
					time.estimated += (parsedEstimated[2] ? parsedEstimated[2].substr(0, parsedEstimated[2].length - 1) : 0) * 24*60*60;
					time.estimated += (parsedEstimated[3] ? parsedEstimated[3].substr(0, parsedEstimated[3].length - 1) : 0) *    60*60;
					time.estimated += (parsedEstimated[4] ? parsedEstimated[4].substr(0, parsedEstimated[4].length - 1) : 0) *       60;
					time.estimated += (parsedEstimated[5] ? parsedEstimated[5].substr(0, parsedEstimated[5].length - 1) : 0) *        1;
				}
			});
			return issue.trackedTime = time;
		}
	};
timeTracker.userSelect.addEventListener('change', timeTracker.onUserChange);
timeTracker.repoSelect.addEventListener('change', timeTracker.onRepoChange);
timeTracker.scopeSelect.addEventListener('change', timeTracker.onScopeChange);
timeTracker.identifierSelect.addEventListener('change', timeTracker.onScopeIdentifierChange);

document.body.classList.add('loading');
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