console.log('index.js: loaded');

type GitHubUserInfo = {
	name: string,
	login: string,
	avatar_url: string,
	location: string,
	public_repos: number,
}

function main() {
	fetchUserInfo('poppen');
}

function fetchUserInfo(userId: string): string | void {
	fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
		.then((response) => {
			console.log(response.status);
			if (!response.ok) {
				console.error('エラーレスポンス', response);
			} else {
				response.json().then((userInfo) => {
					console.log(userInfo);
					const view = createView(userInfo);
					displayView(view);
				});
			}
		}).catch((error) => {
			console.error(error);
		});
}

function createView(userInfo: GitHubUserInfo): string {
	return escapeHTML `
		<h4>${userInfo.name} (@${userInfo.login})</h4>
		<img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
		<di>
		<dt>Location</dt>
		<dd>${userInfo.location}</dd>
		<dt>Repositories</dt>
		<dd>${String(userInfo.public_repos)}</dd>
		</di>
		`;
}

function displayView(view: string): void {
	const result = document.getElementById('result');
	if (result !== null) {
		result.innerHTML = view;
	}
}

function escapeSpecialChars(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function escapeHTML(hashes: TemplateStringsArray, ...values: string[]): string {
	return hashes.reduce((result: string, cur: string, idx: number) => {
		const v = values[idx - 1]
		return result + escapeSpecialChars(String(v)) + cur;
	})
}
