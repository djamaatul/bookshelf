const hasSession = sessionStorage.getItem('SESSION_ID');

if(hasSession){
	window.open('/', '_self')
}
document.getElementById('placeholder').classList.add('hidden')

const form = document.querySelector('#form');

form.onsubmit = (e) => {
	e.preventDefault();
	const formData = new FormData(form)
	const values = Object.fromEntries(formData.entries());

	if(values.username !== values.password) return alert('Password Salah')

	sessionStorage.setItem('SESSION_ID', values.username);
	
	window.open('/', '_self');
}
