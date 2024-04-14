const hasSession = sessionStorage.getItem('SESSION_ID');

if(!hasSession){
		window.open('/login.html', '_self')
} else {
	document.getElementById('name').innerHTML = hasSession
	document.getElementById('placeholder').classList.add('opacity-0')
	document.getElementById('placeholder').classList.add('hidden')
}