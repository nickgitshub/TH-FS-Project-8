const bookElements = document.getElementsByClassName('page')
const pageNumberElements = document.getElementsByClassName('page-number')


function paginate(currentPage){
	for(i=0; i < bookElements.length; i++){
		if(bookElements[i].className === currentPage){
			bookElements[i].style.display = '';
		} else {
			bookElements[i].style.display = 'None';
		}
	}
}

paginate('page 1')

for(i=0; i < pageNumberElements.length; i++){
	pageNumberElements[i].addEventListener('click', (e) =>{
		new_page = 'page ' + e.target.innerText
		paginate(new_page) 
	})
}