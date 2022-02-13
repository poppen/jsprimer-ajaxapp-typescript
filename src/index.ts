console.log('index.js: loaded');

type GitHubUserInfo = {
	name: string,
	login: string,
	avatar_url: string,
	location: string,
	public_repos: number,
}

async function main() {
	try {
		const userId = getUserId();
		const userInfo: GitHubUserInfo = await fetchUserInfo(userId);
		console.log(userInfo);
		const v = createView(userInfo);
		displayView(v);
	} catch (error: unknown) {
		console.error(`エラーが発生しました。（${error}）`);
		if (error instanceof Error) {
			displayError(error.message);
		}
	}
}

function fetchUserInfo(userId: string): Promise<GitHubUserInfo> | any | void {
	return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
		.then((response) => {
			console.log(response.status);
			if (!response.ok) {
				console.error('エラーレスポンス', response);
				return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
			} else {
				return response.json();
			}
		});
}

function getUserId(): string {
	const input = document.getElementById('userId') as HTMLInputElement;
	const v = input.value;
	if (v.length === 0) {
		throw new Error('GitHub User IDを入力してください。');
	} else {
		return v;
	}
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
	clearError();

	const result = document.getElementById('result');
	if (result !== null) {
		result.innerHTML = view;
	}
}

function clearError(): void {
	displayError('');
}


function displayError(msg: string): void {
	const result = document.getElementById('error');
	if (result !== null) {
		result.textContent = msg;
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
