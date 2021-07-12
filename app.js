// gameboard should be 6 across 5 down// 6 categories & 5 clues// make number of categories extensible but clues should be limited to 5

class Category {
    async getData() {
        let response = await axios.get('https://www.jservice.io/api/random')
        let data = response.data[0];
        this.title = data.category.title;
        this.id = data.category.id;
        return this.title,
        this.id
    }
}

class Jeopardy {
    categories = [];
    initCategories() {
        for (let i = 0; i <= 6; i++) { // hard code number of categories to 6
            let category = new Category;
            category.getData()
            this.categories.push(category)
        }
    }
    async initClues() {
        for (let i = 0; i <= 6; i++) {
            let id = this.categories[i].id;
            let responseWithClues = await axios.get('https://www.jservice.io/api/clues', {
                params: {
                    category: id
                }
            })
            let clues = responseWithClues.data
            this.categories[i]['clues'] = clues

        }
      this.categories.shift() // ID of first category wasn't being stored so I made an extra Category instance and then shift first category off categories array
    }
}

function init() {
    let jeopardyGame = new Jeopardy;
    jeopardyGame.initCategories();
    jeopardyGame.initClues();
    return jeopardyGame
}
