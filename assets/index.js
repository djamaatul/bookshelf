const navigation = document.querySelectorAll('ul li a');

navigation.forEach(item => {
	item.addEventListener('click', (e) => {
		e.preventDefault();
		const section = e.target.getAttribute('href');
		history.pushState({
			section
		}, e.target.getAttribute('href'), e.target.getAttribute('href'));
	});
});

const html = document.querySelector('html');
const bottomSheetOverlay = document.getElementById('bottom-sheet-overlay');
const bottomSheetClose = document.getElementById('bottom-sheet-close');
const bottomSheet = document.getElementById('bottom-sheet');
const create = document.getElementById('create');
const logout = document.getElementById('logout');
const form = document.getElementById('form');
const content = document.getElementById('content');
const tabContainer = document.getElementById('tab-container');
const search = document.getElementById('search');
const searchButton = document.getElementById('search-button');

const unreadTab = tabContainer.children[0];
const readedTab = tabContainer.children[1];
const readed = document.getElementById('readed-content');
const unread = document.getElementById('unread-content');

bottomSheetOverlay.onclick = () => {
	bottomSheet.style.maxHeight = '0px';
	html.style.overflow = 'auto';
	setTimeout(() => {
		bottomSheetOverlay.classList.remove('h-screen');
	}, 300);
};

bottomSheetClose.onclick = bottomSheetOverlay.onclick;

bottomSheet.onclick = (e) => {
	e.stopPropagation();
};

create.onclick = () => {
	html.style.overflow = 'hidden';
	bottomSheetOverlay.classList.add('h-screen');
	bottomSheet.style.maxHeight = '900px';
};

logout.onclick = logoutAction;

const renderData = ({ isComplete, filter = '' }) => {
	let data = window.localStorage.getItem('DATA');
	if (!data) data = '[]'
		const parsed = JSON.parse(data);

		const filtered = parsed.filter(item => {
			const match = `${item.title}`.toLowerCase().includes(filter.toLowerCase());
			return item.isComplete === isComplete && match;
		});
		renderSplashscreen(isComplete ? readed : unread);
		const html = `
			<h2 class="class="font-medium">${isComplete ? 'Sudah dibaca' : 'Belum dibaca'}</h2>
			${!filtered.length ? `
				<h1 class="text-center">Data Tidak Ditemukan :(</h1>
			` : ''}
			${filtered.map(item => `
					<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col">
						<h2 class="text-black text-base font-medium">${item.title}</h2>
						<div class="flex justify-between">
							<div>
								<h3 class="flex-1">Tahun: ${item.year}</h3>
								<h4 class="justify-self-center overflow-hidden max-w-[200px] overflow-ellipsis whitespace-nowrap">Penulis: ${item.author}</h4>
							</div>
							<div class="text-white flex gap-2">
								<button class="bg-blue-500 px-2 rounded-lg" onclick="handleMarkRead(this)" data-id="${item.id}">Tandai ${item.isComplete ? 'Belum' : 'Sudah'} Baca</button>
								<button class="bg-red-500 px-2 rounded-lg" onclick="handleDelete(this)" data-id="${item.id}">Hapus</button>
							</div>
						</div>
					</div>	
				`).join('')
			}
		`;
		//make transition
		setTimeout(() => {
			if (isComplete) {
				readed.innerHTML = html;
			} else {
				unread.innerHTML = html;
			}
		}, 500);
};

const refreshData = () => {
	const { width } = content.getBoundingClientRect();
	const isComplete = width === content.scrollLeft;
	renderData({ filter: search.value, isComplete });
};

unreadTab.onclick = () => {
	unreadTab.classList.remove('bg-blue-500', 'text-white');
	readedTab.classList.add('bg-blue-500', 'text-white');
	content.scrollTo({
		left: 0,
		behavior: 'smooth'
	});
};
readedTab.onclick = () => {
	unreadTab.classList.add('bg-blue-500', 'text-white');
	readedTab.classList.remove('bg-blue-500', 'text-white');
	const { width } = content.getBoundingClientRect();
	content.scrollTo({
		left: width,
		behavior: 'smooth'
	});
};

form.onsubmit = (e) => {
	try {
		e.preventDefault();
		const formData = new FormData(form);
		const values = Object.fromEntries(formData.entries());

		values.isComplete = values.isComplete === 'on';
		values.id = crypto.randomUUID();
		values.year = +values.year

		const prevData = window.localStorage.getItem('DATA');
		const appendData = (newData, prev) => {
			const data = prev ?? JSON.parse(prevData);
			data.push(newData);
			window.localStorage.setItem('DATA', JSON.stringify(data));
		};
		if (prevData) {
			appendData(values);
		} else {
			appendData(values, []);
		}

		if (values.isComplete) {
			readedTab.onclick();
		} else {
			unreadTab.onclick();
		}
		//hide bottomsheet
		bottomSheetOverlay.onclick();
		refreshData();
	} catch (error) {
		console.log(error);
	}
};

const renderSplashscreen = (element) => {
	return element.innerHTML = `
	<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col animate-pulse gap-2">
		<h2 class="inline-block h-3 w-full bg-gray-200 animate-pulse"></h2>
		<h3 class="inline-block h-3 w-16 bg-gray-200 animate-pulse"></h3>
		<h4 class="self-end h-3 w-24 bg-gray-200"></h4>
	</div>
	<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col animate-pulse gap-2">
		<h2 class="inline-block h-3 w-full bg-gray-200 animate-pulse"></h2>
		<h3 class="inline-block h-3 w-16 bg-gray-200 animate-pulse"></h3>
		<h4 class="self-end h-3 w-24 bg-gray-200"></h4>
	</div>
	<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col animate-pulse gap-2">
		<h2 class="inline-block h-3 w-full bg-gray-200 animate-pulse"></h2>
		<h3 class="inline-block h-3 w-16 bg-gray-200 animate-pulse"></h3>
		<h4 class="self-end h-3 w-24 bg-gray-200"></h4>
	</div>
	<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col animate-pulse gap-2">
		<h2 class="inline-block h-3 w-full bg-gray-200 animate-pulse"></h2>
		<h3 class="inline-block h-3 w-16 bg-gray-200 animate-pulse"></h3>
		<h4 class="self-end h-3 w-24 bg-gray-200"></h4>
	</div>
	<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col animate-pulse gap-2">
		<h2 class="inline-block h-3 w-full bg-gray-200 animate-pulse"></h2>
		<h3 class="inline-block h-3 w-16 bg-gray-200 animate-pulse"></h3>
		<h4 class="self-end h-3 w-24 bg-gray-200"></h4>
	</div>
	<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col animate-pulse gap-2">
		<h2 class="inline-block h-3 w-full bg-gray-200 animate-pulse"></h2>
		<h3 class="inline-block h-3 w-16 bg-gray-200 animate-pulse"></h3>
		<h4 class="self-end h-3 w-24 bg-gray-200"></h4>
	</div>
	<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col animate-pulse gap-2">
		<h2 class="inline-block h-3 w-full bg-gray-200 animate-pulse"></h2>
		<h3 class="inline-block h-3 w-16 bg-gray-200 animate-pulse"></h3>
		<h4 class="self-end h-3 w-24 bg-gray-200"></h4>
	</div>
	<div class="border rounded-xl min-w-fit p-4 overflow-hidden text-gray-500 text-sm flex flex-col animate-pulse gap-2">
		<h2 class="inline-block h-3 w-full bg-gray-200 animate-pulse"></h2>
		<h3 class="inline-block h-3 w-16 bg-gray-200 animate-pulse"></h3>
		<h4 class="self-end h-3 w-24 bg-gray-200"></h4>
	</div>
`;
};

content.onscroll = () => {
	const searchQuery = new URLSearchParams(location.search);
	const filter = searchQuery.get('q') ?? '';
	search.value = filter;

	const { width } = content.getBoundingClientRect();
	if (width === content.scrollLeft) {
		renderData({ isComplete: true, filter });
	} else if (!content.scrollLeft) {
		renderData({ isComplete: false, filter });
	}
};

content.onscroll();

search.onkeydown = (e) => {
	const { width } = content.getBoundingClientRect();
	const isComplete = width === content.scrollLeft;
	if (e.keyCode === 13) {
		history.replaceState(null, null, `?q=${search.value}`);
		renderData({ filter: search.value, isComplete });
	}
};
searchButton.onclick = () => {
	const { width } = content.getBoundingClientRect();
	const isComplete = width === content.scrollLeft;
	history.replaceState(null, null, `q=${search.value}`);
	renderData({ filter: search.value, isComplete });
};

const handleMarkRead = (e) => {

	const id = e.dataset.id;
	const prev = localStorage.getItem('DATA');

	const parsed = JSON.parse(prev);
	const index = parsed.findIndex(item => item.id === id);

	const answer = confirm(`Apakah Anda yakin memindahkan ke ${parsed[index].isComplete ? 'belum dibaca' : 'sudah dibaca'}?`);
	if (!answer) return;

	parsed[index].isComplete = !parsed[index].isComplete;

	localStorage.setItem('DATA', JSON.stringify(parsed));

	refreshData();
};

const handleDelete = (e) => {
	const answer = confirm(`Apakah Anda yakin Menghapus ini?`);
	if (!answer) return;

	const id = e.dataset.id;
	const prev = localStorage.getItem('DATA');

	const parsed = JSON.parse(prev);
	const index = parsed.findIndex(item => item.id === id);

	parsed.splice(index, 1);

	localStorage.setItem('DATA', JSON.stringify(parsed));
	refreshData();
};