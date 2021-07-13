// gameboard should be 6 across 5 down// 6 categories & 5 clues// make number of categories extensible but clues should be limited to 5

startButton = document.createElement("button");
startButton.innerText = "Start Jeopardy";
startButton.addEventListener("click", () => {
  console.log("click");
  init();
});

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
      // hard code number of categories to 6
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
      this.categories[i]["clues"] = clues;
    }
    this.categories.shift(); // ID of first category wasn't being stored so we create an extra Category instance and then shift() first category off categories array
  }
}

class BrowserJeopardy extends Jeopardy {
  /*
    Provides UI logic on top of the functionality of the Jeopardy class.
  */
  constructor(table) {
    super();
    this.table = table;
  }
  makeTable() {
    // make category row
    let gameTable = document.createElement("table");
    document.body.append(gameTable);
    let categoriesRow = document.createElement("tr");
    gameTable.append(categoriesRow);
    for (let i = 0; i < 6; i++) {
      //Create table row with category headings. We will append clue divs to each heading.
      let categoryHeading = document.createElement("th");
      categoriesRow.append(categoryHeading);
      categoryHeading.innerText = this.categories[i].title;
      categoryHeading.id = i.toString();
      for (let j = 0; j < 5; j++) {
        let clueCell = document.createElement("div");
        clueCell.innerText = "";
        categoryHeading.append(clueCell);
      }
    }
    // for (let i = 0; i < 6; i++) {
    //   let category = document.getElementById(i.toString());
    //   for (let k = 0; k < 5; k++) {
    //     let clueCell = document.createElement("div");
    //     category.append(clueCell);
    //     clueCell.innerText = this.categories[i].clues[k];
    //     console.log(this.categories[i].clues[k]);
    //   }
    // }
    //   let table = document.createElement("table");
    //   table.id = "jeopardy-table";
    //   document.body.appendChild(table);
    //   for (let x = 0; x < 7; x++) {
    //     const row = document.createElement("tr");
    //     row.id = "categories";
    //     table.appendChild(row);
    //     console.log("making rows");
    //     for (let y = 0; y < 6; y++) {
    //       const cell = document.createElement("td");
    //       row.append(cell);
    //     }
    //     table.append(row);
    //   }
    // }
  }
}

function init() {
  const jeopardyGame = new BrowserJeopardy();
  jeopardyGame.initCategories();
  setTimeout(function(){jeopardyGame.makeTable()}, 1000)
  games.push(jeopardyGame);
  console.log("click");
  return jeopardyGame;
}

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
