let logo1, logo2, logo3;
let t = 1; // Time variable
let currentLogo = "logo1"; // Default logo

// Weather data
let weatherData = {
    tempF: 0,
    tempC: 0,
    weatherCondition: "",
    rain: 0,
    snow: 0
};

const options = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": "51c0316e31mshee4f7efa52e21a5p1bb922jsnffdf78609987",
        "X-RapidAPI-Host": "open-weather13.p.rapidapi.com",
    },
};

function preload() {
    logo1 = loadImage("logo.png"); // Cold & wet condition
    logo2 = loadImage("logo_20.png"); // Mild & clear
    logo3 = loadImage("logo_40.png"); // Warm & clear
    console.log("preload completed");
}

function setup() {
    let canvas = createCanvas(1710, 940, WEBGL);
    canvas.parent("canvas-container");
    document.querySelectorAll("#navbar a").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent page reload
            let city = event.target.dataset.city; // Get city name from data attribute
            fetchWeather(city); // Fetch weather data
        });
    });
}

function draw() {
    clear();
    t += 0.10; // Increment time for animation
     
    let scaleFactor = 0.2;

    // Display the appropriate logo based on temperature and weather condition
    if (currentLogo === "logo1" && logo1) {
        // Always center logo1
        image(logo1, -logo1.width / 2, -logo1.height / 2);
    } else if (currentLogo === "logo2" && logo2) {
        push();
        // Apply the warped effect to logo2 and keep it centered
        applyWarpedEffect(logo2, t); // Apply the warped effect to logo2
        pop();
    } else if (currentLogo === "logo3" && logo3) {
        push();
        // Apply the warped effect to logo3 and keep it centered
        applyWarpedEffect(logo3, t);
        pop();
    }

    // Display temperature and weather condition
    displayWeather();
}

// Apply warped effect and keep the logo centered
// function applyWarpedEffect(logo, t) {
//   let warpedImg = createImage(logo.width, logo.height);
//   warpedImg.loadPixels();
//   logo.loadPixels();

//   for (let y = 0; y < logo.height; y++) {
//       for (let x = 0; x < logo.width; x++) {
//           let index = (x + y * logo.width) * 4;
          
//           // Apply distortion with sine and cosine waves
//           let offsetX = 5 * sin(y * 0.1 + t * 3);
//           let offsetY = 5 * cos(x * 0.1 + t * 3);
          
//           // Calculate the new positions with the offset
//           let newX = constrain(x + offsetX, 0, logo.width );
//           let newY = constrain(y + offsetY, 0, logo.height ); //increase the height of the render
//           let newIndex = (int(newX) + int(newY) * logo.width) * 4;

//           // Copy the color data from the original image to the warped image
//           warpedImg.pixels[index] = logo.pixels[newIndex];        // Red channel
//           warpedImg.pixels[index + 1] = logo.pixels[newIndex + 1]; // Green channel
//           warpedImg.pixels[index + 2] = logo.pixels[newIndex + 2]; // Blue channel
//           warpedImg.pixels[index + 3] = logo.pixels[newIndex + 3]; // Alpha channel
//       }
//   }

//   // Update the pixels of the warped image after manipulation
//   warpedImg.updatePixels();

//   // Display the warped image at the center of the canvas
//   image(warpedImg, -logo.width / 2, -logo.height / 2);
// }


function applyWarpedEffect(logo, t) {
    // Add padding equal to the maximum distortion amount
    let padding = 15; // slightly larger than the max distortion of 5
    let warpedImg = createImage(logo.width + padding*2, logo.height + padding*2);
    
    warpedImg.loadPixels();
    logo.loadPixels();
    
    for (let y = 0; y < warpedImg.height; y++) {
      for (let x = 0; x < warpedImg.width; x++) {
        let index = (x + y * warpedImg.width) * 4;
        
        // Map coordinates back to the original logo space (removing padding)
        let logoX = x - padding;
        let logoY = y - padding;
        
        
        
        // Apply edge-aware distortion
        let offsetX = 5 * sin(logoY * 0.1 + t * 3) ;
        let offsetY = 5 * cos(logoX * 0.1 + t * 3) ;
        
        // Calculate the source position from the original logo
        let sourceX = constrain(logoX - offsetX, 0, logo.width - 1);
        let sourceY = constrain(logoY - offsetY, 0, logo.height - 1);
        
        // Only copy pixels if the source is within the original logo
        if (sourceX >= 0 && sourceX < logo.width && sourceY >= 0 && sourceY < logo.height) {
          let sourceIndex = (int(sourceX) + int(sourceY) * logo.width) * 4;
          
          // Copy the color data
          warpedImg.pixels[index] = logo.pixels[sourceIndex];
          warpedImg.pixels[index + 1] = logo.pixels[sourceIndex + 1];
          warpedImg.pixels[index + 2] = logo.pixels[sourceIndex + 2];
          warpedImg.pixels[index + 3] = logo.pixels[sourceIndex + 3];
        } else {
          // Set transparent for pixels outside the original logo
          warpedImg.pixels[index + 3] = 0;
        }
      }
    }
    
    warpedImg.updatePixels();
    
    // Center the padded image, accounting for the padding
    image(warpedImg, -logo.width/2 - padding, -logo.height/2 - padding);
  }



async function fetchWeather(city) {
    const url = `https://open-weather13.p.rapidapi.com/city/${encodeURIComponent(city)}/EN`;  // Correct URL for city;
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        let tempF = result.main.temp; // Temperature in Fahrenheit
        let tempC = (tempF - 32) * 5 / 9; // Convert Fahrenheit to Celsius
        let weatherCondition = result.weather[0].main; // "Rain", "Clear", "Snow"
        let rain = result.rain ? result.rain["1h"] || 0 : 0; // Rain in mm (last 1 hour)
        let snow = result.snow ? result.snow["1h"] || 0 : 0; // Snow in mm (last 1 hour)

        // Update weather data
        weatherData = {
            tempF: tempF,
            tempC: tempC,
            weatherCondition: weatherCondition,
            rain: rain,
            snow: snow
        };

        // Update UI with temperature in Celsius & Fahrenheit
        document.getElementById("fahrenheit").innerText = `F°: ${tempF.toFixed(1)}°F`;
        document.getElementById("celsius").innerText = `C°: ${tempC.toFixed(1)}°C`;

        // Determine which logo to display
        if (tempF < 30 && (rain > 0 || snow > 0)) {
            currentLogo = "logo1"; // Cold & wet
        } else if (tempF >= 50 && tempF <= 70 && rain === 0 && snow === 0) {
            currentLogo = "logo2"; // Mild & clear
        } else if (tempF >= 70.5 && tempF <= 90 && rain === 0 && snow === 0) {
            currentLogo = "logo3"; // Warm & clear
        } else {
            currentLogo = "logo1"; // Default to static logo
        }

    } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
    }
}

function displayWeather() {
    // Display the temperature
    document.getElementById("fahrenheit").innerText = `F°: ${weatherData.tempF.toFixed(1)}°F`;
    document.getElementById("celsius").innerText = `C°: ${weatherData.tempC.toFixed(1)}°C`;

    // Update the condition
    document.getElementById("weather-condition").innerText = `Condition: ${weatherData.weatherCondition}`;

    // If rain or snow, display the weather type
    if (weatherData.rain > 0) {
        document.getElementById("weather-condition").innerText += " - Raining";
    }
    if (weatherData.snow > 0) {
        document.getElementById("weather-condition").innerText += " - Snowing";
    }
}


document.querySelectorAll("#navbar a").forEach((link) => {
  link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent page reload

      // Remove 'selected' class from all links
      document.querySelectorAll("#navbar a").forEach((link) => {
          link.classList.remove("selected");
      });

      // Add 'selected' class to the clicked link
      event.target.classList.add("selected");

      let city = event.target.dataset.city; // Get city name from data attribute
      fetchWeather(city); // Fetch weather data
  });
});