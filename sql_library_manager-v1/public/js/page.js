
//this page will paginate the index.pug template
//all the table rows received by pug from Express will have classes, 
//which were created within Express


const bookElements = document.getElementsByClassName('page')
const pageNumberElements = document.getElementsByClassName('page-number')

//hides all the table rows that they don't have the class name of the current page
function paginate(currentPage){
	for(i=0; i < bookElements.length; i++){
		if(bookElements[i].className === currentPage){
			bookElements[i].style.display = '';
		} else {
			bookElements[i].style.display = 'None';
		}
	}
}

//opens the page on page 1
paginate('page 1')

//whenever a page element is clicked, it shows all the elements that share that class name 
//and hides the ones that don't
for(i=0; i < pageNumberElements.length; i++){
	pageNumberElements[i].addEventListener('click', (e) =>{
		new_page = 'page ' + e.target.innerText
		paginate(new_page) 
	})
}