function initializeHtml() {
  return `
  <body>
      <div class="container">
          <div id="randomdLocation" class="randomLocationContainer">
              <div class="imageAndCounter">
                  <h1 id="imageCounter" class="starting_image_counter">1</h1>
                  <img id="randomImage" src="" alt="map">
              </div>
              <img src="images/arrow.png" id="right_arrow" class="arrow right" alt="map">
              <img src="images/arrow.png" id="left_arrow" class="arrow left" alt="map">
          </div>
          <div class="imageContainer">
              <div class="imageWrapper">
                  <img id="myimage" class="starting-image" src="images/customsDetailed.jpg" alt="map">
                  <button id = "guess_button">Guess</button>
                  <div class="marker" id="markerContainer"> 
                      <img id="marker" src="images/marker.png" alt="">
                  </div>
              </div>
          </div>
      </div>
  </body>
  `;
}



let usedLocations = JSON.parse(localStorage.getItem("usedLocations")) || [];
// Start at 0 
let totalScoreProgress = 0;
let total_score = localStorage.getItem('total_score');
let score = 0;
let map_image;
let generateNewLocation = false;
let high_score_randomized = JSON.parse(localStorage.getItem("high_score_randomized")) || [];
let high_score_chooseMap = JSON.parse(localStorage.getItem("high_score_chooseMap")) || [];
async function handleLoad() {
  //Get the map image from this.mapData and store it in localStorage
  let map_image = localStorage.getItem("map_image");
  let selected_map = JSON.parse(localStorage.getItem("selected_map"));
  let myImg = document.getElementById("myimage");
  myImg.src = map_image;
  //Generate a new location
  await randomizedLocation(selected_map,myImg, generateNewLocation);
  //a new location as been generated, set generateNewLocation to true
  generateNewLocation = true;
  //Get the coordinates for the random location
}

document.addEventListener("DOMContentLoaded", handleLoad);
async function randomizedLocation(selected_map, myImg, generateNewLocation = false) {
  let randomLocation;
  let storedLocation = localStorage.getItem("randomLocation");
  let storedUsedLocations = localStorage.getItem("usedLocations");
  let numberOfRounds = localStorage.getItem("rounds")
  let gameMode = localStorage.getItem("gameMode");
  if (!generateNewLocation && storedLocation) {
    //If generateNewLocation is false and there is a storedLocation, use the storedLocation
    randomLocation = JSON.parse(storedLocation);
    usedLocations = JSON.parse(storedUsedLocations);
  } else {


    function handleGameOver() {
      console.log("The game is over");
      usedLocations = [];

      //Add the total score to the high score array depending on gamemode
      if (gameMode == "randomized"){
        high_score_randomized.push(total_score);
        //Sort the high score array and slice it to only contain the top 5 scores
        high_score_randomized.sort((a, b) => b - a);
        high_score_randomized = high_score_randomized.slice(0, 5);

        localStorage.setItem("high_score_randomized", JSON.stringify(high_score_randomized));
      } else{
        high_score_chooseMap.push(total_score);
        //Sort the high score array and slice it to only contain the top 5 scores
        high_score_chooseMap.sort((a, b) => b - a);
        high_score_chooseMap = high_score_chooseMap.slice(0, 5);

        localStorage.setItem("high_score_chooseMap", JSON.stringify(high_score_chooseMap));
      }
      //redirect to new page
      window.location.href = "index.html";
    }

    //If no location exists in local storage, the game is over
    if(gameMode == "randomized"){
      if (usedLocations.length == numberOfRounds) {
        handleGameOver();
      }
    } else{
    if (usedLocations.length == selected_map.locations.length || usedLocations.length == numberOfRounds) {
      handleGameOver();
    }
  }
    
    do {
      randomLocation = selected_map.locations[Math.floor(Math.random() * selected_map.locations.length)];
    } while (usedLocations.map(e => JSON.stringify(e)).includes(JSON.stringify(randomLocation)));

    //Store the new location in local storage
    localStorage.setItem("randomLocation", JSON.stringify(randomLocation));

    //Add the new location to the usedLocations array
    usedLocations.push(randomLocation);
    localStorage.setItem("usedLocations", JSON.stringify(usedLocations));
  }

  console.log("used",usedLocations);
  //sets the image number to 1 which displays the first image in the folder
  let image_number = 1;
  //gets the x and y coordinates for the random location

  let coordinatesX = randomLocation[1][0];
  let coordinatesY = randomLocation[1][1];
  //gets the image for the random location
  let location_image = randomLocation[0]+"/"+image_number+".jpg";
  //sets the image for the random location
  let randomImage = document.getElementById("randomImage");
  randomImage.src = location_image;
  cycleImages(image_number, location_image, randomImage, randomLocation);
  //returns the coordinates for the random location
  guessLocation(myImg, coordinatesX, coordinatesY, selected_map);
}



function cycleImages(image_number, location_image, randomImage, randomLocation) {
    //adds event listener to the left and right arrow buttons which changes the image_number and thus changes the random image src
    document.getElementById("right_arrow").addEventListener("click", function() {
      if(image_number < 4){
        image_number++;
      }
      else{
        image_number = 1;
      }
      location_image = randomLocation[0]+"/"+image_number+".jpg";
      randomImage.src = location_image;
      document.getElementById("imageCounter").innerHTML = image_number;
    });
    
    document.getElementById("left_arrow").addEventListener("click", function() {
      if(image_number > 1){
        image_number--;
      }
      else{
        image_number = 4;
      }
      location_image = randomLocation[0]+"/"+image_number+".jpg";
      randomImage.src = location_image;
      document.getElementById("imageCounter").innerHTML = image_number;
    });
}


function guessLocation(myImg, coordinatesX, coordinatesY) {
  let marker = document.getElementById("markerContainer");
  let clickedX = 0; let clickedY = 0;

  myImg.addEventListener("click", function (event) {
    let rect = myImg.getBoundingClientRect();
    //Calculate the x/y coordinates of the click relative to the image size, is expressed between 0-1 where 1 is 100% of the image size.
    clickedX = (event.clientX - rect.left) / rect.width;
    clickedY= (event.clientY - rect.top) / rect.height;
    //Show the marker
    marker.style.display = "block"; 
    //Set the marker position, x/y coordinates are relative to the image size between 0-1 where 1 is 100%, so we multiply with 100 to get the correct position, Then we divide and substract to get the pinpoint of the marker on the cursors position.
    marker.style.left = `calc(${clickedX * 100}% - ${marker.offsetWidth / 2}px)`;
    marker.style.top = `calc(${clickedY * 100}% - ${marker.offsetHeight}px)`;

    console.log("Clicked", clickedX, clickedY);
    console.log("Coordinates", coordinatesX, coordinatesY);
  });
    //guess button is clicked
    document.getElementById("guess_button").addEventListener("click", function() {
      if (clickedX !== 0 && clickedY !== 0) {
        score = getScore(coordinatesX, coordinatesY);
        displayScore(score);
      }
    })

    
    //Calculate the distance between the click anä-d the coordinates of the random location
    function getScore(coordinatesX, coordinatesY){
      let rect = myImg.getBoundingClientRect();
      let aspectRatio = rect.width / rect.height;
      /*pythagoras theorem to calculate the distance between the click and the coordinates of the random location
      the coordinates in the y-direction are divided with the aspect ratio to make upp for the perecentage difference in height and width.
      (Height is (rect.width / rect.height) times smaller than width which will result in a larger percentage distance per pixel)*/
      let distance = Math.sqrt(Math.pow((coordinatesX - clickedX), 2) + Math.pow(((coordinatesY/aspectRatio) - (clickedY/aspectRatio)), 2));
      //Gets score based on the distance between the click and the coordinates of the random location
      score = 1000 - Math.round(distance *4000);
      if (score < 0){
        score = 0;
      } else if (score > 980){
        score = 1000;
      }
      if (total_score == null) {
        // If it's not in localStorage, this must be the first round
        total_score = 0;
      } else {
        // If it is in localStorage, parse it as a number
        total_score = Number(total_score);
      }
      total_score += score;
      localStorage.setItem("total_score", total_score);
      return score
    }


    function displayScore(score) {
      //Remove the existing content of the body
      document.body.innerHTML = '';
    
      //Create score container
      let scoreContainer = document.createElement("div");
      scoreContainer.id = "scoreContainer";
    
      //Create score text
      let scoreText = document.createElement("p");
      scoreText.id = "scoreText";
      // Start at 0
      let scoreProgress = 0;

      //Create total score text
      let totalScoreText = document.createElement("p");
      totalScoreText.id = "totalScoreText";
      totalScoreText.innerHTML = "Total score: " + (localStorage.getItem("total_score")-score);
      totalScoreProgress++; // Increase by 1 each time
      

      // Update the score every 100 milliseconds
      if (score > 0 ){
      let intervalId = setInterval(() => {
        if (scoreProgress < score) {
          scoreProgress++; // Increase by 1 each time
          scoreText.innerHTML = "Score: " + scoreProgress + "/1000";
          progress.style.setProperty('--after-width', scoreProgress / 10 + "%");
        } else {
          // Stop the interval when the score reaches the target
          clearInterval(intervalId);
          totalScoreText.innerHTML = "Total score: " + total_score;
        }
      }, 1);
    }else{
      scoreText.innerHTML = "Score: 0";
    }
  
      //Create progress bar
      let scoreBar = document.createElement("div");
      scoreBar.id = "progress";
    
      //Create image container
      let imgDiv = document.createElement("div");
      imgDiv.style.width = 'auto';
      // Check if window width is less than or equal to 400px
      if(window.innerWidth <= 400) {
        imgDiv.style.height = '35%';
      } else if(window.innerWidth<=700){
        imgDiv.style.height = "50%"
      }else {
        imgDiv.style.height = '75%';
      }
      imgDiv.style.position = 'relative'; //Make imgDiv a positioned element


    
      //Create image
      let img = document.createElement("img");
      img.id = "scoreImage";
      img.src = myImg.src;
      img.style.width = '100%';
      
      img.style.height = '100%';

      //Create next button
      let nextButton = document.createElement("button");
      nextButton.id = "nextButton";
      nextButton.innerHTML = "Next";

    
      //Create correct marker container
      let correctMarkerContainer = document.createElement("div");
      correctMarkerContainer.className = "correctMarkerContainer";
      let correctMarker = document.createElement("img");
      correctMarker.id = "correctMarker";
      correctMarker.src = "images/flagResized.png";
    
      //Create canvas
      let myCanvas = document.createElement("canvas");
      myCanvas.id = "myCanvas";
    
      //Append elements to the DOM
      document.body.id = "score_body";
      document.body.appendChild(scoreContainer);
      imgDiv.appendChild(correctMarkerContainer);
      imgDiv.appendChild(myCanvas);
      correctMarkerContainer.appendChild(correctMarker);
      scoreContainer.appendChild(nextButton);
      scoreContainer.appendChild(totalScoreText);
      scoreContainer.appendChild(scoreText);
      scoreContainer.appendChild(scoreBar);
      scoreContainer.appendChild(imgDiv);
      imgDiv.appendChild(img);
      imgDiv.appendChild(marker);
      marker.style.display = "block";
    
      //Select the progress element
      var progress = document.getElementById('progress');
      //Change the value of the --after-width variable
    
      //Set the position of the correct marker
      correctMarkerContainer.style.left = `calc(${coordinatesX * 100}%)`;
      correctMarkerContainer.style.top = `calc(${coordinatesY * 100}% - ${correctMarkerContainer.offsetHeight}px)`;
    
      //Get the bounding rectangles of the elements
      let correctMarkerRect = correctMarkerContainer.getBoundingClientRect();
      let markerRect = marker.getBoundingClientRect();
    
      //Calculate the positions relative to the canvas
      let correctMarkerX = correctMarkerRect.left - imgDiv.getBoundingClientRect().left;
      let correctMarkerY = correctMarkerRect.top - imgDiv.getBoundingClientRect().top + correctMarkerRect.height;
      let markerX = markerRect.left - imgDiv.getBoundingClientRect().left + markerRect.width/2;
      let markerY = markerRect.top - imgDiv.getBoundingClientRect().top + markerRect.height;
    
      //Get the dimensions of the parent div
      let imgDivRect = imgDiv.getBoundingClientRect();
    
      //Set the width and height of the canvas to match the dimensions of the parent div
      myCanvas.width = imgDivRect.width;
      myCanvas.height = imgDivRect.height;
    
      //Draw the line
      let line = myCanvas.getContext("2d");
      line.beginPath();
      line.moveTo(correctMarkerX, correctMarkerY);
      line.lineTo(markerX, markerY);
      line.stroke();

      //Add event listener to the next button
      nextButton.addEventListener("click", nextButtonClicked);
    }
    async function nextButtonClicked() {
      document.body.innerHTML = initializeHtml();
      // Generate a new random location
      
    
      let gameMode = localStorage.getItem("gameMode");
      if (gameMode == "randomized"){
        //Calls chooseMap with "randomized" as argument
        chooseMap("randomized");
    } else{
      await handleLoad();
    }
  }
}

/*TO DO
1. add a leaderboard
2. add settings for timelimit 
3. add a tutorial page
4. fix css and responsiveness
*/
