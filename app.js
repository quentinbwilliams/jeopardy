/*
  Play Jeopardy-based trivia in the browser!
  There are two classes:
    Jeopardy Class - Creates six random category instances, then makes a request to the jservice API to get clues for each category.
      -> .initCategories(): 
        --> Gets six random clues
        --> Parses out the category data for each clue
        --> Pushes the category data to a categories array
        --> Loops through categories array to request clues using each category id
        --> Adds 5 clues to each category object
    BrowserJeopardy Class - Extends Jeopardy with UI functionality.
      -> .makeTable():
        --> Async function awaits .initCategories() call
        --> On initCategories() completion, creates table for the game, table     
            headings for the categories, and divs with clues appended to each category heading
        --> Adds event listener to each div that displays the answer on click
  Two global vairables:
    -> games
      --> Array to store each instance of BrowserJeopardy
    -> startButton
      --> Runs init() to start a new game
  And one global function:
    -> init():
      --> Creates a new instance of BrowserJeopardy as game
      --> Calls game.makeTable() to initialize categories and render board UI
      --> Pushes game instance to global games array
      --> Returns game
*/

const games = [];
const startButton = document.getElementById('start-button');
startButton.addEventListener("click", init);

function init() {
  // Create new game instance from BrowserJeopardy class
  let game = new BrowserJeopardy();
  game.makeTable()
  games.push(game);
  return game;
}

class Jeopardy {
  /* 
  Each Jeopardy game features 6 categories with 5 clues.
  Call .initCategories() to populate categories array with 6 new category objects.
  Each category object has a title and id; the category id is used to make a request to the jservice API for clues from that category.
  */
  categories = [];
  async initCategories() {
    /*
      Make a request to jservice API for 6 random categories.
      Then, request clues for each category.
    */
    let response = await axios.get("https://www.jservice.io/api/random/", {
      // making request to /random and not /categories because /categories returns the same categories each time.
      params: {
        count: 6
      }
    });
    for (let i = 0; i < 6; i++) {
      let category = response.data[i].category;
      this.categories.push(category);
    }
    for (let i = 0; i < 6; i++) { // get clues for categories from category IDs
      let id = this.categories[i].id;
      let responseWithClues = await axios.get(
        "https://www.jservice.io/api/clues", {
          params: {
            category: id,
          },
        }
      );
      let clues = responseWithClues.data;
      this.categories[i]["clues"] = clues.slice(0, 5);
    }
  }
}

class BrowserJeopardy extends Jeopardy {
  /*
    Provides UI logic on top of the functionality of the Jeopardy class.
  */
  constructor() {
    super();
  }
  async makeTable() {
    // Make table  -> Make categories headings -> Append categories to table -> Make clue divs -> Append divs to table head element
    await this.initCategories();
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
        // Create divs with event listeners for clue answers to append to category headings
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