# Map Location Guessing Game

This is a **GeoGuessr-inspired** game set in the **Escape from Tarkov** universe. In this game, players are tasked with guessing specific locations from the *Escape from Tarkov* game world by clicking on a map image. 

Points are awarded based on the accuracy of the guess, with higher scores given for closer guesses. The game includes features like:
- **Image cycling**: Players see a variety of locations from the game.
- **Score display**: Shows how close the guess was to the correct location.
- **Game modes**: Options for different levels or challenges within the game.

The game aims to challenge your knowledge of the *Escape from Tarkov* maps and locations, testing both your memory and awareness of the game's world!

## Getting Started

1. Clone the repository to your local machine.
   ```bash
   git clone https://github.com/your-username/map-location-guessing-game.git
   ```
2. Open `index.html` in your preferred web browser to start the game.
3. Ensure the `images` folder is in the correct directory with all required images (e.g., `marker.png`, `arrow.png`, `flagResized.png`, and location images).

## How to Play

1. Click the "Guess" button to make a guess on the map.
2. Use the left and right arrows to view different images for the current location.
3. Your score is calculated based on how close your guess is to the actual target.
4. Click "Next" to proceed to the next round.
5. The game ends when all rounds are complete. High scores are saved for both `randomized` and `chooseMap` game modes.

## Adding New Locations

To add new locations, follow these steps:

### 1. **Edit `data.json`**:
   Add a new location object in the `data.json` file. Each location object should contain:
   - A key (e.g., `"customs"`, `"lighthouse"`) for the location name.
   - The `map` key with the file path to the location's map image.
   - A `locations` array with individual location entries.

   Each entry in the `locations` array should have:
   - The relative file path to the folder containing in-game screenshots of the place.
   - A pair of X and Y coordinates, which denote the location's position on the map image.

   **Example**:
   ```json
   {
       "new_location": {
           "map": "images/new_location_map.jpg",
           "locations": [
               ["locations/new_location/place1", [0.35, 0.45]],
               ["locations/new_location/place2", [0.60, 0.30]],
               ["locations/new_location/place3", [0.15, 0.80]]
           ]
       }
   }
   ```

### 2. **Get Coordinates**:
   To determine the correct coordinates for a location, follow these steps:
   - Run the application with the map image displayed.
   - Click on the point on the map where you want to add a location.
   - The coordinates (X and Y values) will be logged in the console.
   
   To calculate the coordinates:
   - The X and Y values represent the relative position of the click on the image. They are between 0 and 1, where `(0, 0)` is the top-left corner of the map, and `(1, 1)` is the bottom-right corner.
   - Example: If you click on the center of the map, the coordinates would be approximately `[0.5, 0.5]`.

### 3. **Add Map and Screenshot Images**:
   - Place the map image in the `images` folder, matching the path specified in the `map` field.
   - Create a subdirectory for each location within `locations/`. For example, `locations/new_location/place1`.
   - Add screenshots to each `place` folder, which will be shown to players when guessing the location.

## License

This project is licensed under the MIT License.
