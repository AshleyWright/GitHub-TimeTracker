import moment from 'moment';
import GitHub from './GitHub';

let settings = localStorage.settings ? JSON.parse(localStorage.settings) : {
	gitHub: {
		oauth2Token: null
	}
};

function save() {
	localStorage.settings = JSON.stringify(settings);
}
save();

let gitHubTokenField = document.getElementById('github-token');
let gitHubLink = document.getElementById('gitHub-access-token-link');
if (settings.gitHub.oauth2Token) {
	gitHubTokenField.value = settings.gitHub.oauth2Token;
	gitHubLink.href = 'https://github.com/settings/tokens';
	gitHubLink.innerText = 'Review';
} else {
	gitHubLink.href = 'https://github.com/settings/tokens/new?scopes=repo,read:org&description=GitHub%20Time%20Tracker';
	gitHubLink.innerText = 'Generate';
}
function gitHubTokenChange (event) {
	settings.gitHub.oauth2Token = event.target.value;
	save();
}
gitHubTokenField.addEventListener('change', gitHubTokenChange);
gitHubTokenField.addEventListener('keyup', gitHubTokenChange);

let gitHubRateLimitOutput = document.getElementById('github-ratelimit');
let gh = new GitHub({
	token: settings.gitHub.oauth2Token
});
gh.getRateLimit()
	.then(rateLimit => {
		gitHubRateLimitOutput.innerHTML = `${rateLimit.resources.core.remaining} / ${rateLimit.resources.core.limit}<br>Resets ${moment(new Date(rateLimit.resources.core.reset * 1000)).fromNow()}`;
	})
	.catch(::console.error);