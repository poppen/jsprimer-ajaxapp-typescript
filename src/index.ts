console.log('index.js: loaded');

function fetchUserInfo(userId:string) {
	fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
		.then((response) => {
			console.log(response.status);
			if (!response.ok) {
				console.error('$B%(%i!<%l%9%]%s%9(B', response);
			} else {
				return response.json().then((userInfo) => {
					console.log(userInfo);
				});
			}
		}).catch((error) => {
			console.error(error);
		});
}
