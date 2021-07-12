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
    numQuestions = 5;
    numCategories = 6;
    categories = [];
    categoryIDs = [];
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
            this.categoryIDs.push(id)
        }
    }
}
