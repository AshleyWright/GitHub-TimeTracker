/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _context3;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _GitHub = __webpack_require__(1);
	
	var _GitHub2 = _interopRequireDefault(_GitHub);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var settings = localStorage.settings && JSON.parse(localStorage.settings);
	if (!settings || !settings.gitHub.oauth2Token) window.location = 'settings.html';
	
	window.GitHub = _GitHub2.default;
	
	var gh = new _GitHub2.default({ token: settings.gitHub.oauth2Token }),
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
		onUserChange: function onUserChange(event) {
			var _context;
	
			document.body.classList.add('loading');
			var user = timeTracker.users[event.target.selectedOptions[0].value];
			timeTracker.userImage.src = user.avatar_url;
			user.getRepositories().then(function (repositories) {
				timeTracker.repositories = repositories;
				while (timeTracker.repoSelect.firstChild) {
					timeTracker.repoSelect.removeChild(timeTracker.repoSelect.firstChild);
				}Object.keys(timeTracker.repositories).forEach(function (repositoryName) {
					var repository = timeTracker.repositories[repositoryName],
					    option = document.createElement('option');
					option.value = repositoryName;
					option.innerText = repository.name;
					timeTracker.repoSelect.appendChild(option);
				});
				Stretchy.resize(timeTracker.repoSelect);
				timeTracker.onRepoChange({ target: timeTracker.repoSelect });
			}).catch((_context = console).error.bind(_context));
		},
		onRepoChange: function onRepoChange(event) {
			document.body.classList.add('loading');
			var repo = timeTracker.repository = timeTracker.repositories[event.target.selectedOptions[0].value];
			Promise.all([repo.getAssignees(), repo.getMilestones(), repo.getLabels(), repo.getIssues()]).then(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 4);
	
				var assignees = _ref2[0];
				var milestones = _ref2[1];
				var labels = _ref2[2];
				var issues = _ref2[3];
	
				timeTracker.assignees = assignees;
				timeTracker.milestones = milestones;
				timeTracker.labels = labels;
				timeTracker.issues = issues;
				while (timeTracker.scopeSelect.firstChild) {
					timeTracker.scopeSelect.removeChild(timeTracker.scopeSelect.firstChild);
				}function addScope(value, label) {
					var option = document.createElement('option');
					option.value = value;
					option.innerText = label;
					timeTracker.scopeSelect.appendChild(option);
				}
				if (assignees.length > 1) addScope('assignee', 'Assignees');
				if (milestones.length > 0) addScope('milestone', 'Milestones');
				if (labels.length > 0) addScope('label', 'Labels');
				Stretchy.resize(timeTracker.scopeSelect);
				timeTracker.onScopeChange({ target: timeTracker.scopeSelect });
			});
		},
		onScopeChange: function onScopeChange(event) {
			document.body.classList.add('loading');
			var scope = timeTracker.scope = event.target.selectedOptions[0].value;
			timeTracker.scopeImage.style.display = ~['assignee', 'label'].indexOf(scope) ? 'initial' : 'none';
			while (timeTracker.identifierSelect.firstChild) {
				timeTracker.identifierSelect.removeChild(timeTracker.identifierSelect.firstChild);
			}switch (scope) {
				case 'assignee':
					timeTracker.assignees.forEach(function (assignee) {
						var option = document.createElement('option');
						option.innerText = option.value = assignee.login;
						timeTracker.identifierSelect.appendChild(option);
					});
					break;
				case 'milestone':
					timeTracker.milestones.forEach(function (milestone) {
						var option = document.createElement('option');
						option.value = milestone.number;
						option.innerText = milestone.title;
						timeTracker.identifierSelect.appendChild(option);
					});
					break;
				case 'label':
					timeTracker.labels.forEach(function (label) {
						var option = document.createElement('option');
						option.innerText = option.value = label.name;
						timeTracker.identifierSelect.appendChild(option);
					});
					break;
				default:
					console.error('Unknown scope');
					break;
			}
			Stretchy.resize(timeTracker.identifierSelect);
			timeTracker.onScopeIdentifierChange({ target: timeTracker.identifierSelect });
		},
		onScopeIdentifierChange: function onScopeIdentifierChange(event) {
			document.body.classList.add('loading');
			var identifier = event.target.value,
			    assignee = void 0,
			    label = void 0;
			switch (timeTracker.scope) {
				case 'assignee':
					assignee = timeTracker.assignees.filter(function (user) {
						return user.login === identifier;
					})[0];
					timeTracker.scopeImage.src = assignee.avatar_url;
					timeTracker.renderIssues(timeTracker.issues.filter(function (issue) {
						return issue.assignees.filter(function (a) {
							return a.login === assignee.login;
						}).length;
					}));
					break;
				case 'milestone':
					timeTracker.renderIssues(timeTracker.issues.filter(function (issue) {
						return issue.milestone && issue.milestone.number === +identifier;
					}));
					break;
				case 'label':
					label = timeTracker.labels.filter(function (label) {
						return label.name === identifier;
					})[0];
					timeTracker.scopeImage.src = '';
					timeTracker.scopeImage.style.backgroundColor = '#' + label.color;
					timeTracker.renderIssues(timeTracker.issues.filter(function (issue) {
						return issue.labels.filter(function (l) {
							return l.name === identifier;
						}).length;
					}));
					break;
				default:
					console.error('Unknown scope');
					break;
			}
		},
		renderIssues: function renderIssues(issues) {
			var _context2;
	
			document.body.classList.add('loading');
			Promise.all(issues.map(function (issue) {
				return issue.getComments();
			})).then(function (issueCommentsArray) {
				if (issues.length) {
					while (timeTracker.issueList.children.length) {
						timeTracker.issueList.removeChild(timeTracker.issueList.firstChild);
					}for (var i = 0; i < issues.length; i++) {
						var issue = issues[i];
						issue.comments = issueCommentsArray[i];
						timeTracker.calculateTime(issue);
						timeTracker.issueList.appendChild(timeTracker.renderIssue(issue));
					}
				} else {
					timeTracker.issueList.innerHTML = '<p class="no-issues">No Issues Found</p>';
				}
				document.body.classList.remove('loading');
			}).catch((_context2 = console).error.bind(_context2));
		},
		renderIssue: function renderIssue(issue) {
			var issueElement = document.createElement('div');
			issueElement.classList.add('issue');
			issueElement.innerHTML = '<div>\n\t\t\t\t\t<div class="issue-title">' + issue.title + '</div>\n\t\t\t\t\t<div class="issue-time-container">\n\t\t\t\t\t\t' + function () {
				if (issue.trackedTime.elapsed <= issue.trackedTime.estimated) {
					return '<meter min="0" max="' + issue.trackedTime.estimated + ' value="' + issue.trackedTime.elapsed + '"></meter>';
				}
				return '<meter min="0" max="' + issue.trackedTime.elapsed + '" value="' + issue.trackedTime.estimated + '" class="overtime"></meter>';
			}() + '\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<div class="issue-milestone">' + (issue.milestone ? issue.milestone.title : '') + '</div>\n\t\t\t\t\t<div class="issue-labels">' + issue.labels.map(function (label) {
				return '<span class="label" style="background:#' + label.color + '">' + label.name + '</span>';
			}).join('') + '</div>\n\t\t\t\t\t<div class="issue-assignees">' + issue.assignees.map(function (assignee) {
				return '<img class="avatar" title="' + assignee.login + '" src="' + assignee.avatar_url + '">';
			}).join('') + '</div>\n\t\t\t\t</div>';
			return issueElement;
		},
		calculateTime: function calculateTime(issue) {
			var time = {
				elapsed: 0,
				estimated: 0
			};
			issue.comments.forEach(function (comment) {
				var parsedElapsed = /:clock\d*:\s(\d*d)?\s*(\d*h)?\s*(\d*m)?\s*(\d*s)?/.exec(comment.body);
				var parsedEstimated = /:dart:\s*(\+)?\s*(\d*d)?\s*(\d*h)?\s*(\d*m)?\s*(\d*s)?/.exec(comment.body);
	
				if (parsedElapsed) {
					time.elapsed += (parsedElapsed[1] ? parsedElapsed[1].substr(0, parsedElapsed[1].length - 1) : 0) * 24 * 60 * 60;
					time.elapsed += (parsedElapsed[2] ? parsedElapsed[2].substr(0, parsedElapsed[2].length - 1) : 0) * 60 * 60;
					time.elapsed += (parsedElapsed[3] ? parsedElapsed[3].substr(0, parsedElapsed[3].length - 1) : 0) * 60;
					time.elapsed += (parsedElapsed[4] ? parsedElapsed[4].substr(0, parsedElapsed[4].length - 1) : 0) * 1;
				}
	
				if (parsedEstimated) {
					if (parsedEstimated[1]) time.estimated = Math.max(time.elapsed, time.estimated);
					time.estimated += (parsedEstimated[2] ? parsedEstimated[2].substr(0, parsedEstimated[2].length - 1) : 0) * 24 * 60 * 60;
					time.estimated += (parsedEstimated[3] ? parsedEstimated[3].substr(0, parsedEstimated[3].length - 1) : 0) * 60 * 60;
					time.estimated += (parsedEstimated[4] ? parsedEstimated[4].substr(0, parsedEstimated[4].length - 1) : 0) * 60;
					time.estimated += (parsedEstimated[5] ? parsedEstimated[5].substr(0, parsedEstimated[5].length - 1) : 0) * 1;
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
	gh.getUser().then(function (user) {
		timeTracker.users[user.login] = timeTracker.authenticatedUser = user;
		return user.getOrganisations();
	}).then(function (organisations) {
		timeTracker.users = _extends({}, timeTracker.users, organisations);
		while (timeTracker.userSelect.firstChild) {
			timeTracker.userSelect.removeChild(timeTracker.userSelect.firstChild);
		}Object.keys(timeTracker.users).forEach(function (userName) {
			var user = timeTracker.users[userName],
			    option = document.createElement('option');
			option.innerText = option.value = user.login;
			if (user.login === timeTracker.authenticatedUser.login) option.selected = true;
			timeTracker.userSelect.appendChild(option);
		});
		Stretchy.resize(timeTracker.userSelect);
		timeTracker.onUserChange({ target: timeTracker.userSelect });
	}).catch((_context3 = console).error.bind(_context3));
	
	window.timeTracker = timeTracker;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _request = __webpack_require__(2);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _User = __webpack_require__(3);
	
	var _User2 = _interopRequireDefault(_User);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GitHub = function () {
		function GitHub(_ref) {
			var token = _ref.token;
	
			_classCallCheck(this, GitHub);
	
			this.token = token;
		}
	
		_createClass(GitHub, [{
			key: 'getUser',
			value: function getUser(username) {
				var _this = this,
				    _context;
	
				return (0, _request2.default)({
					endpoint: username ? 'users/' + username : 'user',
					token: this.token
				}).then(function (userData) {
					return new _User2.default(userData, !username, _this);
				}).catch((_context = console).error.bind(_context));
			}
		}, {
			key: 'getRateLimit',
			value: function getRateLimit() {
				var _context2;
	
				return (0, _request2.default)({
					endpoint: 'rate_limit',
					token: this.token
				}).catch((_context2 = console).error.bind(_context2));
			}
		}]);
	
		return GitHub;
	}();
	
	exports.default = GitHub;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = request;
	function request(_ref) {
		var method = _ref.method;
		var endpoint = _ref.endpoint;
		var token = _ref.token;
	
		return fetch('https://api.github.com/' + endpoint, {
			cache: 'force-cache',
			headers: {
				'Accept': 'application/vnd.github.v3+json',
				'Authorization': 'token ' + token,
				'Content-Type': 'application/json;charset=UTF-8'
			},
			method: method ? method.toUpperCase() : 'GET',
			referrer: 'no-referrer'
		}).then(function (response) {
			return response.json();
		});
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _request = __webpack_require__(2);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _Organisation = __webpack_require__(4);
	
	var _Organisation2 = _interopRequireDefault(_Organisation);
	
	var _Repository = __webpack_require__(5);
	
	var _Repository2 = _interopRequireDefault(_Repository);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var User = function () {
		function User(userData, isAuthorised, connexion) {
			_classCallCheck(this, User);
	
			Object.assign(this, userData);
			this.connexion = connexion;
			this.isAuthorised = isAuthorised;
		}
	
		_createClass(User, [{
			key: 'getRepositories',
			value: function getRepositories() {
				var _this = this,
				    _context;
	
				return (0, _request2.default)({
					endpoint: this.isAuthorised ? 'user/repos' : 'users/' + this.login + '/repos',
					token: this.connexion.token
				}).then(function (repos) {
					return Object.assign.apply(Object, _toConsumableArray(repos.filter(function (r) {
						return r.owner.id === _this.id;
					}).map(function (repoData) {
						return _defineProperty({}, repoData.full_name, new _Repository2.default(repoData, _this.isAuthorised, _this.connexion));
					})));
				}).catch((_context = console).error.bind(_context));
			}
		}, {
			key: 'getOrganisations',
			value: function getOrganisations() {
				var _this2 = this,
				    _context2;
	
				return (0, _request2.default)({
					endpoint: this.isAuthorised ? 'user/orgs' : 'users/' + this.login + '/orgs',
					token: this.connexion.token
				}).then(function (orgs) {
					return Object.assign.apply(Object, _toConsumableArray(orgs.map(function (orgData) {
						return _defineProperty({}, orgData.login, new _Organisation2.default(orgData, _this2.connexion));
					})));
				}).catch((_context2 = console).error.bind(_context2));
			}
		}]);
	
		return User;
	}();
	
	exports.default = User;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _request = __webpack_require__(2);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _Repository = __webpack_require__(5);
	
	var _Repository2 = _interopRequireDefault(_Repository);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Organisation = function () {
		function Organisation(orgData, connexion) {
			_classCallCheck(this, Organisation);
	
			Object.assign(this, orgData);
			this.connexion = connexion;
		}
	
		_createClass(Organisation, [{
			key: 'getRepositories',
			value: function getRepositories() {
				var _this = this,
				    _context;
	
				return Promise.all([(0, _request2.default)({
					endpoint: 'orgs/' + this.login + '/repos',
					token: this.connexion.token
				}), this.connexion.getUser(this.login).then(function (user) {
					return user.getRepositories();
				})]).then(function (_ref) {
					var _ref2 = _slicedToArray(_ref, 2);
	
					var orgRepos = _ref2[0];
					var userRepos = _ref2[1];
					return Object.assign.apply(Object, [userRepos].concat(_toConsumableArray(orgRepos.map(function (repoData) {
						return _defineProperty({}, repoData.full_name, new _Repository2.default(repoData, false, _this.connexion));
					}))));
				}).catch((_context = console).error.bind(_context));
			}
		}]);
	
		return Organisation;
	}();
	
	exports.default = Organisation;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _request = __webpack_require__(2);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _Issue = __webpack_require__(6);
	
	var _Issue2 = _interopRequireDefault(_Issue);
	
	var _Label = __webpack_require__(8);
	
	var _Label2 = _interopRequireDefault(_Label);
	
	var _Milestone = __webpack_require__(9);
	
	var _Milestone2 = _interopRequireDefault(_Milestone);
	
	var _Sprint = __webpack_require__(10);
	
	var _Sprint2 = _interopRequireDefault(_Sprint);
	
	var _User = __webpack_require__(3);
	
	var _User2 = _interopRequireDefault(_User);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Repository = function () {
		function Repository(repoData, isAuthorised, connexion) {
			_classCallCheck(this, Repository);
	
			Object.assign(this, repoData);
			this.connexion = connexion;
			this.isAuthorised = isAuthorised;
		}
	
		_createClass(Repository, [{
			key: 'getMilestones',
			value: function getMilestones() {
				var _this = this,
				    _context;
	
				return (0, _request2.default)({
					endpoint: 'repos/' + this.full_name + '/milestones',
					token: this.connexion.token
				}).then(function (milestones) {
					return milestones.map(function (milestoneData) {
						return new _Milestone2.default(milestoneData, _this.connexion);
					});
				}).catch((_context = console).error.bind(_context));
			}
		}, {
			key: 'getLabels',
			value: function getLabels() {
				var _this2 = this,
				    _context2;
	
				return (0, _request2.default)({
					endpoint: 'repos/' + this.full_name + '/labels',
					token: this.connexion.token
				}).then(function (labels) {
					return labels.map(function (labelData) {
						return new _Label2.default(labelData, _this2.connexion);
					});
				}).catch((_context2 = console).error.bind(_context2));
			}
		}, {
			key: 'getAssignees',
			value: function getAssignees() {
				var _this3 = this,
				    _context3;
	
				return (0, _request2.default)({
					endpoint: 'repos/' + this.full_name + '/assignees',
					token: this.connexion.token
				}).then(function (assignees) {
					return assignees.map(function (assigneeData) {
						return new _User2.default(assigneeData, false, _this3.connexion);
					});
				}).catch((_context3 = console).error.bind(_context3));
			}
		}, {
			key: 'getIssues',
			value: function getIssues() {
				var _this4 = this,
				    _context4;
	
				return (0, _request2.default)({
					endpoint: 'repos/' + this.full_name + '/issues',
					token: this.connexion.token
				}).then(function (issues) {
					return issues.map(function (issueData) {
						return new _Issue2.default(issueData, _this4, _this4.connexion);
					});
				}).catch((_context4 = console).error.bind(_context4));
			}
		}]);
	
		return Repository;
	}();
	
	exports.default = Repository;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _request = __webpack_require__(2);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _IssueComment = __webpack_require__(7);
	
	var _IssueComment2 = _interopRequireDefault(_IssueComment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Issue = function () {
		function Issue(issueData, repository, connexion) {
			_classCallCheck(this, Issue);
	
			Object.assign(this, issueData);
			this.connexion = connexion;
			this.repository = repository;
		}
	
		_createClass(Issue, [{
			key: 'getComments',
			value: function getComments() {
				var _this = this,
				    _context;
	
				return (0, _request2.default)({
					endpoint: 'repos/' + this.repository.full_name + '/issues/' + this.number + '/comments',
					token: this.connexion.token
				}).then(function (comments) {
					return comments.map(function (issueCommentData) {
						return new _IssueComment2.default(issueCommentData, _this.connexion);
					});
				}).catch((_context = console).error.bind(_context));
			}
		}]);
	
		return Issue;
	}();
	
	exports.default = Issue;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var IssueComment = function IssueComment(issueCommentData, connexion) {
		_classCallCheck(this, IssueComment);
	
		Object.assign(this, issueCommentData);
		this.connexion = connexion;
	};
	
	exports.default = IssueComment;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Label = function Label(labelData, connexion) {
		_classCallCheck(this, Label);
	
		Object.assign(this, labelData);
		this.connexion = connexion;
	};
	
	exports.default = Label;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Milestone = function Milestone(milestoneData, connexion) {
		_classCallCheck(this, Milestone);
	
		Object.assign(this, milestoneData);
		this.connexion = connexion;
	};
	
	exports.default = Milestone;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Sprint = function Sprint(sprintData, connexion) {
		_classCallCheck(this, Sprint);
	
		Object.assign(this, sprintData);
		this.connexion = connexion;
	};
	
	exports.default = Sprint;

/***/ }
/******/ ]);
//# sourceMappingURL=app.bundle.js.map