// gameboard should be 6 across 5 down// 6 categories & 5 clues// make number of categories extensible but clues should be limited to 5


// !
// const Category = function () {
//         let id = null
//         let title = "";
//         let clues = [];
//         return {
//             setTitleAndID: function () {
//                 axios.get('https://www.jservice.io/api / random ', {}).then(function (response) {
//                     const responseData = response.data[0]


//                     const categoryTitle = responseData.category.title const categoryID = responseData.category_id id = categoryID title = categoryTitle
//                 })
//             },
//             setClues: function () {
//                 axios.get('https://www.jservice.io/api/clues', {
//                     params: {
//                         category: id
//                     }
//                 }).then(function (response) {
//                     const responseData = response.data
//                     const arr = [];
//                     for (let i = 0; i <= 5; i++) {
//                         clue = {
//                             question: responseData[i].question,
//                             answer: responseData[i].answer,
//                             showing: null
//                         }
//                         clues.push(clue)
//                         console.log(clue)
//                     }
//                 })
//             },
//             getID: function () {
//                 return id
//             },
//             getTitle: function () {
//                 return title
//             },
//             getClues: function () {
//                 return clues
//             }
//         }
//     }


class Category {
    async getData() {
        let response = await axios.get('https://www.jservice.io/api/random')
		let data = response.data[0];
		this.title = data.category.title;
		this.id = data.category.id;
		console.log('this.title: ', this.title, 'this.id: ', this.id)
        return this.title, this.id
    }
}

class Jeopardy {
    numQuestions = 5;
	numCategories = 6;
	categories = []
	categoryIDs = []
    initCategories() {
		for (let i = 0; i < 6; i++) {
			let category = new Category;
			category.getData()
			this.categories.push(category)
		}
	}
	initClues() {
		for (let i = 0; i < 6; i++) {
			let id = this.categories[i].id
			console.log('this.categories[i].id', this.categories[i].id)
			this.categoryIDs.push(id)
			console.log('pusing to IDs array: ', this.categoryIDs)
		}
	}
}

// ** Fill the HTML table#jeopardy with the categories & cells for questions. * * -The < thead > should be filled w / a < tr >,and a < td > for each category * -The < tbody > should be filled w / NUM_QUESTIONS_PER_CAT < tr > s, * each with a question for each category in a < td > * (initally, just show a "?" where the question / answer would go.) * /async function fillTable () {}/ ** Handle clicking on a clue : show the question or answer. * * Uses.showing property on clue to determine what to show : * -if currently null, show question & set.showing to "question" * -if currently "question", show answer & set.showing to "answer" * -if currently "answer", ignore click * * /function handleClick (evt) {}/ ** Wipe the current Jeopardy board, show the loading spinner, * and update the button used to fetch data. * /function showLoadingView () {}/ ** Remove the loading spinner and update the button used to fetch data. * /function hideLoadingView () {}/ ** Start game : * * -get random category Ids * -get data for each category * -create HTML table * * /async function setupAndStart () {}/ ** On click of start / restart button, set up game. * // / TODO/** On page load, add event handler for clicking clues  TODO
