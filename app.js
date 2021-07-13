/*
  Create a new JeopardyGame instance to play Jeopardy in the browser.
  There are three classes:
    Category class - Creates a new random category
      -> .getData() makes request to jservice API for a random category.
    Jeopardy class - Creates new Category instances and makes a request to jservice API for clues to go with the categories.
      -> .initCategories() initializes new category objects; calls .initClues().
      -> .initClues() adds clues to each category object.
    BrowserJeopardy class - Extends Jeopardy with UI functionality.
      -> .makeTable() - Renders game data in a Jeopardy game table
*/

startButton = document.createElement("button");
startButton.innerText = "Start Jeopardy";
document.body.append(startButton);
startButton.addEventListener("click", init);

function init() {
  // Create new game instance from BrowserJeopardy class
  const jeopardyGame = new BrowserJeopardy();
  jeopardyGame.initCategories();
  setTimeout(function () {
    jeopardyGame.makeTable();
  }, 2000); // account for time it takes to make request and shift first category // Could I run an async Fn here?
  games.push(jeopardyGame);
  return jeopardyGame;
}

const games = [];

class Category {
  /*
    Category stores data about a random Jeopardy category.
    Create a new category instance and call .getData() to populate the Category object with a title, id, and array of clues.
  */
  async getData() {
    /*
      Make a request to jservice API for a random clue.
      Extract the title and id from the clue.
      Set the title and id of object instance as title and id from random clue.
    */
    let response = await axios.get("https://www.jservice.io/api/random");
    let data = response.data[0];
    this.title = data.category.title;
    this.id = data.category.id;
    return this.title, this.id;
  }
}

class Jeopardy {
  /* 
  Each Jeopardy game features 6 categories with 5 clues.
  Call .initCategories() to populate categories array with 6 new category objects.
  Each category object has a title and id; the category id is used to make a request to the jservice API for clues from that category.
  */
  categories = [];
  initCategories() {
    /*
      Create 7 instances of the Category object. (We create 7 rather than 6 to account for a bug that doesn't retrieve the ID of the first category).
      Push each category obejct to the categories array stored in JeopardyGame object.
    */
    for (let i = 0; i <= 6; i++) {
      let category = new Category();
      category.getData();
      this.categories.push(category);
    }
    this.initClues();
  }
  async initClues() {
    /*
      Loop through categories array. Use category ID to make request to jservice API for clues.
      Create a 'clues' key for each category object and assign clues object as value.
    */
    for (let i = 0; i <= 6; i++) {
      let id = this.categories[i].id;
      let responseWithClues = await axios.get(
        "https://www.jservice.io/api/clues",
        {
          params: {
            category: id,
          },
        }
      );
      let clues = responseWithClues.data;
      this.categories[i]["clues"] = clues.slice(0, 5);
    }
    this.categories.shift(); // ID of first category wasn't being stored so we create an extra Category instance and then shift() first category off categories array
  }
}

class BrowserJeopardy extends Jeopardy {
  /*
    Provides UI logic on top of the functionality of the Jeopardy class.
  */
  constructor() {
    super();
  }
  makeTable() {
    // Make table  -> Make categories headings -> Append categories to table -> Make clue divs -> Append divs to table head element
    let gameTable = document.createElement("table");
    document.body.append(gameTable);
    let categoriesRow = document.createElement("tr");
    gameTable.append(categoriesRow);
    for (let i = 0; i < 6; i++) {
      // Create table row with category headings. We will append clue divs to each heading.
      let categoryHeading = document.createElement("th");
      categoriesRow.append(categoryHeading);
      let category = this.categories[i].title.toUpperCase();
      categoryHeading.innerText = category;
      categoryHeading.id = i.toString();
      for (let j = 0; j < 5; j++) {
        // Create divs for clues to append to a category heading
        let clueCell = document.createElement("div");
        let clue = this.categories[i].clues[j].question;
        let answer = this.categories[i].clues[j].answer;
        clueCell.innerText = clue;
        clueCell.addEventListener("click", function () {
          clueCell.innerText = answer;
        });
        categoryHeading.append(clueCell);
      }
    }
  }
}
