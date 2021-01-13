let db = JSON.parse(localStorage.getItem('nominations')) || Array()
let movieTitle = document.getElementById('search-input')
let resultHeading = document.getElementById('result-heading')
let searchResultSegment = document.getElementById('search-result-segment')
let nominations = document.getElementById('nominations')
let searchResults = document.getElementById('search-results')
let nominationSegment = document.getElementById('nomination-segment')
let nominationList = document.createElement('ul')

function toogleResultSegment() {
	(movieTitle.value.length > 0)
		? searchResultSegment.style.display = 'block'
		: searchResultSegment.style.display = 'none'
}

async function nominate(e) {
	const nominationButton = e.target
	const response = await fetch(`https://www.omdbapi.com/?i=${nominationButton.id}&apikey=5bb9cee4`)
	const jsonData = await response.json()

	db.length ? nominations.style.display = 'block' : ''

	if(db.length < 5) {
		nominationButton.disabled = true
		db.push(jsonData)
		listNominations()
	} else {
		console.log("You can't nominate any more movie")
	}
}

function listNominations() {
	nominations.style.display = 'block'
	nominationList.innerHTML = ''
	db.forEach(item => {
		const nominations = document.createElement('li')
		const cancelNominationButton = document.createElement('button')

		nominations.innerHTML = item.Title
		cancelNominationButton.innerHTML = 'Remove'

		cancelNominationButton.classList.add('btn-danger')
		nominations.classList.add('nominated-movie')

		cancelNominationButton.setAttribute('id', item.imdbID)

		nominationList.appendChild(nominations)
		nominations.appendChild(cancelNominationButton)
		nominationSegment.appendChild(nominationList)

		cancelNominationButton.addEventListener('click', removeNomination)
	})
}

function removeNomination(e) {
	db = db.filter(item => item.imdbID != e.target.id)
	listNominations()
}

async function getMovies (e) {
	toogleResultSegment()
	searchResults.innerHTML = '' // clear movie list area for new data.

	const searchTerm = e.target.value
	const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=5bb9cee4`)
	const movies = await response.json()
	const searchResult = movies.Search

	if(searchResult){
		resultHeading.textContent = `Results for "${searchTerm}":`
		searchResult.filter(item => item.Type == 'movie')
			.forEach(item => {
				let imageSrc = './images/no-image.png'; 

				if(item.Poster != 'N/A') {
					imageSrc = item.Poster
				}

				const movieWrapper = document.createElement('div')
				const movieCard = document.createElement('div')
				const movieImage = document.createElement('div')
				const cardBody = document.createElement('div')
				const emptyElement = document.createElement('div')
				const movieTitle = document.createElement('b')
				const releasedDate = document.createElement('span')
				const nominateButton = document.createElement('button')

				movieWrapper.classList.add('col-sm-3')
				movieCard.classList.add('card')
				movieImage.classList.add('movie-poster')
				cardBody.classList.add('card-body')
				movieTitle.classList.add('card-title')
				releasedDate.classList.add('release-date')
				nominateButton.classList.add('btn-primary')

				movieImage.style.backgroundImage = `url(${imageSrc})`
				movieTitle.textContent = item.Title.substring(0, 21)
				releasedDate.textContent = item.Year
				nominateButton.textContent = 'Nominate'

				movieTitle.setAttribute('title', item.Title)
				nominateButton.setAttribute('id', item.imdbID)
				
				cardBody.append(movieTitle, releasedDate, emptyElement, nominateButton)
				movieCard.append(movieImage, cardBody)
				movieWrapper.appendChild(movieCard)
				searchResults.appendChild(movieWrapper)

				nominateButton.addEventListener('click', nominate)
			})
	} else {
		searchResults.innerHTML = ''
		resultHeading.textContent = 'There are no results for your search...'
	}
}

window.onload = function() {
	movieTitle.addEventListener('keyup', getMovies)
	if (db.length > 0 ){
		listNominations()
	}
}

window.onbeforeunload = function(event) {
	event.returnValue = "Your nominations will be saved till your next visit...";
  localStorage.setItem('nominations', JSON.stringify(db));
};