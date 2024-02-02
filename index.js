//Defins the GameMap class
class GameMap {
    //takes data and name as parameters
    constructor(data, name) {
      this.data = data; //Assign data to this.data
      this.name = name;
      this.mapData = this.getMapData(); // Call getMapData method and assign the result to this.mapData
    }
  
    //Method to get map data
    getMapData() {
      //If the name is "randomized", return immediately
      if (this.name == "randomized") {
         return;
      } else {
        //Find the index of the object in this.data where the key is this.name
        let index = this.data.findIndex(obj => this.name in obj);
        
        //Return the value of the key this.name in the found object
        return this.data[index][this.name];
      }
    }
  
    //Method to handle button click
    buttonClicked() {
      //Get the map image from this.mapData and store it in localStorage
      let map_image = this.mapData.map;
      localStorage.setItem("map_image", map_image);
      //Store this.mapData in localStorage
      localStorage.setItem("selected_map", JSON.stringify(this.mapData));
      //Store this.data in localStorag
      localStorage.setItem("data", JSON.stringify(this.data));
      //Redirect to guess.html
      window.location.href = "guess.html";
    }
  
    //Method to handle randomized map
    randomizedMap() {
      //Selects a random map from this.data
      let selected_map = this.data[Math.floor(Math.random() * this.data.length)];
      selected_map = selected_map[Object.keys(selected_map)[0]];
      //Gets the map image from the selected map and store it in localStorage
      let map_image = selected_map.map;
      localStorage.setItem("map_image", map_image);
      //Stores the selected map in localStorage
      localStorage.setItem("selected_map", JSON.stringify(selected_map));  
      //Redirects to guess.html
      window.location.href = "guess.html";
    }
  }
  
//Function to handle game mode selection
//Function to handle game mode selection
function chooseGameMode() {
  document.addEventListener('DOMContentLoaded', leaderboard);
  settings();
  //Clears the localstorage
  localStorage.removeItem("usedLocations");
  localStorage.removeItem("total_score");
  //Adds click event listener to the "randomizedMaps" element
  document.getElementById("randomizedMaps").addEventListener("click", () => {
    //Clears the body HTML
    document.body.innerHTML = '';
    //Calls chooseMap with "randomized" as argument
    localStorage.setItem("gameMode", "randomized");
    chooseMap("randomized");
  });
  //Adds click event listener to the "selectMap" element
  document.getElementById("selectMap").addEventListener("click", () => {
    //Clears the body HTML
    document.body.innerHTML = '';
    //Calls singleMapHTML
    singleMapHTML();
    //Calls chooseMap with no argument
    localStorage.setItem("gameMode", "chooseMap");
    chooseMap();
    // Add a history state
    history.pushState({ page: "selectMap" }, "selectMap", "#selectMap");
  });
}

// Listen for the popstate event, which is fired when the history state changes
window.addEventListener("popstate", function(event) {
  if (event.state && event.state.page === "selectMap") {
    // If the state is the "selectMap" state, call chooseGameMode
    chooseGameMode();
  }
});

function settings(){
  // Select the input element
var inputElement = document.getElementById("rounds");

document.getElementById("applySettings").addEventListener("click", () => {
  // Get the value of the input element
  var inputValue = inputElement.value;
  if (inputElement.value == "") {
    var inputValueAsNumber = 3;
  } else if (inputValue < 1 || inputValue > 10) {
    alert("You have to enter a number between 0 and 11");
  } else{
    var inputValueAsNumber = Number(inputValue);
  }

  localStorage.setItem("rounds", inputValueAsNumber);
  console.log("applied" ,inputValueAsNumber);
});
}



//Function to create the buttons for the single map selection
function singleMapHTML() {
    //Create the ul element
    let ul = document.createElement("ul");
    //Define the button names and ids
    let buttons = [
    { name: "Customs", id: "customsButton" },
    { name: "Lighthouse", id: "lighthouseButton" },
    { name: "Shoreline", id: "shorelineButton" },
    { name: "Woods", id: "woodsButton" },
    { name: "Reserve", id: "reserveButton" },
    { name: "Streets Of Tarkov", id: "streetsButton" },
    { name: "Factory", id: "factoryButton" },
    { name: "Interchange", id: "interchangeButton" },
    { name: "Labs", id: "labsButton" },
    ];

    //Loops through the buttons array and creates the li and button elements
    buttons.forEach(button => {
    let li = document.createElement("li");
    let btn = document.createElement("button");
    btn.textContent = button.name;
    btn.id = button.id;
    btn.className = "commonButton";
    li.appendChild(btn);
    ul.appendChild(li);
    });

    //Appends the ul element to the body
    document.body.appendChild(ul);
}

function chooseMap(gameMode) {
    fetch("data.json")
      .then(response => response.json())
      .then(data => {
        //clear the current randomLocation from localStorage
        localStorage.removeItem("randomLocation");
        //creates instances of the GameMap class for each map and then calls the buttonClicked function for the correct instance when a button is clicked
        if (gameMode == "randomized") {
          let randomMap = new GameMap(data, "randomized");
          randomMap.randomizedMap();
        }else{
            let customsMap = new GameMap(data, "customs");
            customsButton.addEventListener("click", () => customsMap.buttonClicked());

            let lighthouseMap = new GameMap(data, "lighthouse");
            lighthouseButton.addEventListener("click", () => lighthouseMap.buttonClicked());
    
            let shorelineMap = new GameMap(data, "shoreline");
            shorelineButton.addEventListener("click", () => shorelineMap.buttonClicked());
    
            let woodsMap = new GameMap(data, "woods");
            woodsButton.addEventListener("click", () => woodsMap.buttonClicked());
    
            let reserveMap = new GameMap(data, "reserve");
            reserveButton.addEventListener("click", () => reserveMap.buttonClicked());
    
            let streetsMap = new GameMap(data, "streets_of_tarkov");
            streetsButton.addEventListener("click", () => streetsMap.buttonClicked());
    
            let factoryMap = new GameMap(data, "factory");
            factoryButton.addEventListener("click", () => factoryMap.buttonClicked());
    
            let interchangeMap = new GameMap(data, "interchange");
            interchangeButton.addEventListener("click", () => interchangeMap.buttonClicked());
    
            let labsMap = new GameMap(data, "labs");
            labsButton.addEventListener("click", () => labsMap.buttonClicked());
        }
      });
  }

  function leaderboard() {
    let high_score_randomized = JSON.parse(localStorage.getItem("high_score_randomized")) || [];
    let high_score_chooseMap = JSON.parse(localStorage.getItem("high_score_chooseMap")) || [];
    console.log("highscore randomized", high_score_randomized);
    console.log("highscore chooseMap", high_score_chooseMap);
  
    for (let i = 0; i < high_score_randomized.length; i++) {
      let randomizedLeaderboard = document.createElement("li");
      randomizedLeaderboard.textContent = ((i+1)+"."+ "  "+high_score_randomized[i]);
      let randomizedLeaderboard_group = document.getElementById("randomizedLeaderboard_group");
      randomizedLeaderboard_group.appendChild(randomizedLeaderboard);
    }
  
    for (let i = 0; i < high_score_chooseMap.length; i++) {
      let chooseMapLeaderboard = document.createElement("li");
      chooseMapLeaderboard.textContent = ((i+1)+"."+ "  "+high_score_chooseMap[i]);
      let chooseMapLeaderboard_group = document.getElementById("chooseMapLeaderboard_group");
      chooseMapLeaderboard_group.appendChild(chooseMapLeaderboard);
    }
  }





















  