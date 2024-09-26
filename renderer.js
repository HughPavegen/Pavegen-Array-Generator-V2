const widthSlider = document.getElementById('widthSlider');
const widthInput = document.getElementById('widthInput');
const lengthSlider = document.getElementById('lengthSlider');
const lengthInput = document.getElementById('lengthInput');
const gridContainer = document.getElementById('gridContainer');
const downloadButton = document.getElementById('downloadButton');

// Set the initial grid
updateGrid();

// Event listeners for the sliders
widthSlider.oninput = () => {
  let widthValue = Math.max(2, widthSlider.value); // Ensure width is at least 2
  widthSlider.value = widthValue; // Correct the slider position if needed
  widthInput.value = widthValue;
  updateGrid();
};

lengthSlider.oninput = () => {
  let lengthValue = Math.max(2, lengthSlider.value); // Ensure length is at least 1
  lengthSlider.value = lengthValue; // Correct the slider position if needed
  lengthInput.value = (lengthValue * 0.5).toFixed(1); // Convert to increments of 0.5
  updateGrid();
};

// Event listeners for the text inputs
widthInput.onchange = () => {
  let widthValue = Math.max(2, widthInput.value); // Ensure width is at least 2
  widthInput.value = widthValue; // Correct the input value if needed
  widthSlider.value = widthValue;
  updateGrid();
};

lengthInput.onchange = () => {
  let lengthValue = Math.max(1, parseFloat(lengthInput.value)); // Ensure length is at least 0.5
  lengthValue = (Math.round(lengthValue * 2) / 2).toFixed(1); // Round to nearest 0.5
  lengthInput.value = lengthValue; // Set the corrected value back to the input
  lengthSlider.value = lengthValue * 2; // Adjust the slider value
  updateGrid();
};

// Function to update the grid
function updateGrid() {
  const width = parseInt(widthInput.value, 10); // Parse the width as an integer
  const length = parseFloat(lengthInput.value) * 2; // Convert length input to tile units, rounding to nearest 0.5

  gridContainer.innerHTML = ''; // Clear existing grid
  
  for (let y = 0; y < width; y++) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    
    for (let x = 0; x < length; x++) {
      const img = document.createElement('img');
      img.src = './assets/half-tile-instance.png';
      img.width = 50; // Width of a single tile
      img.height = 86; // Height of a single tile
      // Apply transformations
      img.style.transform = `scaleX(${x % 2 === 0 ? 1 : -1}) scaleY(${y % 2 === 0 ? 1 : -1})`;
      img.style.objectFit = 'cover';
      row.appendChild(img);
    }
    gridContainer.appendChild(row);
  }

  // Call updateTable and pass the current length and width
  updateTable(length, width);
}

// The updateTable function now accepts length and width as parameters
function updateTable(length, width) {
  const tilesLong = length / 2;
  const tilesWide = width;
  const lengthM = length * (0.5 / 2) + 0.05; // Assuming each tile length unit is 0.5 meters
  const widthM = width * 0.433 + 0.05; // Assuming each tile width unit is 1 meter
  const areaM2 = lengthM * widthM; // Area calculation
  const numGenerators = (Math.floor((tilesWide - 1) / 2)) * (Math.floor(tilesLong - 0.5)) +
                        (Math.floor((tilesWide) / 2)) * (Math.floor(tilesLong));
  const fullTiles = tilesWide * ((tilesLong * 2) - 1);
  const halfTiles = tilesWide * 2;

  document.getElementById('tilesLong').innerText = tilesLong;
  document.getElementById('tilesWide').innerText = tilesWide;
  document.getElementById('lengthM').innerText = lengthM.toFixed(2);
  document.getElementById('widthM').innerText = widthM.toFixed(2);
  document.getElementById('areaM2').innerText = areaM2.toFixed(2);
  document.getElementById('numGenerators').innerText = numGenerators;
  document.getElementById('fullTiles').innerText = fullTiles;
  document.getElementById('halfTiles').innerText = halfTiles;
}

downloadButton.addEventListener('click', () => {
  // Get the current values of the width and length
  const width = widthInput.value;
  const length = lengthInput.value;

  // Use html2canvas to capture the gridContainer
  html2canvas(gridContainer).then((canvas) => {
    const dataUrl = canvas.toDataURL('image/png');
    
    // Create an anchor element to download the image with a dynamic filename
    const link = document.createElement('a');
    link.href = dataUrl;
    // Set the filename to include the width and length
    link.download = `Array_${width}_tiles_wide_x_${length}_tile_long.png`; 
    link.click();
  }).catch((error) => {
    console.error('Error capturing screenshot:', error);
  });
});