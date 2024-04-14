const hasSession = sessionStorage.getItem('SESSION_ID');

const logoutAction = () => {
	let base = '';
	if(location.host === 'djamaatul.github.io'){
		base = 'https://djamaatul.github.io/bookshelf'
	}
	console.log(base)
	sessionStorage.removeItem('SESSION_ID');
	window.open(`${base}/login.html`, '_self')
};

if(!hasSession){
	logoutAction()
} else {
	document.getElementById('name').innerHTML = hasSession
	document.getElementById('placeholder').classList.add('opacity-0')
	document.getElementById('placeholder').classList.add('hidden')
}