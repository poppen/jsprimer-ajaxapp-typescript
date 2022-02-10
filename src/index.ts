console.log('index.js: loaded');

function fetchUserInfo(userId: string): string | void {
	fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
		.then((response) => {
			console.log(response.status);
			if (!response.ok) {
				console.error('エラーレスポンス', response);
			} else {
				response.json().then((userInfo) => {
					console.log(userInfo);
					const view:string = escapeHTML `
						<h4>${userInfo.name} (@${userInfo.login})</h4>
						<img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
						<di>
							<dt>Location</dt>
							<dd>${userInfo.location}</dd>
							<dt>Repositories</dt>
							<dd>${userInfo.public_repos}</dd>
						</di>
					`;

					const result = document.getElementById('result');
					if (result !== null) {
						result.innerHTML = view;
					}
				});
			}
		}).catch((error) => {
			console.error(error);
		});
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
