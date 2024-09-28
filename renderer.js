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
  let widthValue = Math.max(2, widthSlider.value);
  widthSlider.value = widthValue;
  widthInput.value = widthValue;
  updateGrid();
};

lengthSlider.oninput = () => {
  let lengthValue = Math.max(2, lengthSlider.value);
  lengthSlider.value = lengthValue;
  lengthInput.value = (lengthValue * 0.5).toFixed(1);
  updateGrid();
};

// Event listeners for the text inputs
widthInput.onchange = () => {
  let widthValue = Math.max(2, widthInput.value);
  widthInput.value = widthValue;
  widthSlider.value = widthValue;
  updateGrid();
};

lengthInput.onchange = () => {
  let lengthValue = Math.max(1, parseFloat(lengthInput.value));
  lengthValue = (Math.round(lengthValue * 2) / 2).toFixed(1);
  lengthInput.value = lengthValue;
  lengthSlider.value = lengthValue * 2;
  updateGrid();
};

// Function to update the grid
function updateGrid() {
  const width = parseInt(widthInput.value, 10);
  const length = parseFloat(lengthInput.value) * 2;

  gridContainer.innerHTML = ''; // Clear existing grid
  
  for (let y = 0; y < width; y++) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    
    for (let x = 0; x < length; x++) {
      const img = document.createElement('img');
      img.src = './assets/half-tile-instance.png';
      img.width = 50; // Width of a single tile
      img.height = 86; // Height of a single tile
      img.style.transform = `scaleX(${x % 2 === 0 ? 1 : -1}) scaleY(${y % 2 === 0 ? 1 : -1})`;
      img.style.objectFit = 'cover';
      row.appendChild(img);
    }
    gridContainer.appendChild(row);
  }

  updateTable(length, width); // Call updateTable
}

// The updateTable function
function updateTable(length, width) {
  const tilesLength = 0.500;
  const tilesWidth = 0.43258;
  const frameWidth = 0.0505;
  const tilesLong = length / 2;
  const tilesWide = width;
  const lengthM = (tilesLong * tilesLength) + (2 * frameWidth);
  const widthM = (tilesWide * tilesWidth) + (2 * frameWidth);
  const areaM2 = lengthM * widthM;
  const GeneratorsOnOddRows = Math.floor(tilesLong);
  const GeneratorsOnEvenRows = Math.floor(tilesLong - 0.5);
  const NumberOfOddRows = Math.floor((tilesWide) / 2);
  const NumberOfEvenRows = Math.floor((tilesWide - 1) / 2);
  const numGenerators = ((GeneratorsOnOddRows * NumberOfOddRows) + (GeneratorsOnEvenRows * NumberOfEvenRows));
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

// Ramp-related functionality
document.addEventListener('DOMContentLoaded', () => {
  const rampsCheckbox = document.getElementById('rampsCheckbox');
  const rampSizeLabel = document.getElementById('rampSizeLabel');
  const rampSizeInput = document.getElementById('rampSizeInput');
  const frameDivs = document.querySelectorAll('.frame');

  const updateRamps = () => {
    const rampSizeM = parseFloat(rampSizeInput.value);
    const rampWidthPx = (rampSizeM / 0.25) * 50;
    const rampHeightPx = (rampSizeM / 0.43) * 86;

    document.querySelectorAll('.triangle-svg').forEach(svg => {
      svg.style.width = `${rampWidthPx}px`;
      svg.style.height = `${rampHeightPx}px`;
    });

    document.querySelector('.top-left').style.width = `${rampWidthPx}px`;
    document.querySelector('.top-left').style.height = `${rampHeightPx}px`;

    document.querySelector('.top-right').style.width = `${rampWidthPx}px`;
    document.querySelector('.top-right').style.height = `${rampHeightPx}px`;

    document.querySelector('.bottom-left').style.width = `${rampWidthPx}px`;
    document.querySelector('.bottom-left').style.height = `${rampHeightPx}px`;

    document.querySelector('.bottom-right').style.width = `${rampWidthPx}px`;
    document.querySelector('.bottom-right').style.height = `${rampHeightPx}px`;
  };

  updateRamps(); // Initialize ramps with default size

  rampSizeInput.addEventListener('input', updateRamps); // Update ramps on size change

  // Ramps toggle functionality
  rampsCheckbox.addEventListener('change', () => {
    if (rampsCheckbox.checked) {
      frameDivs.forEach(div => {
        div.style.width = '';
        div.style.height = '';
        div.style.display = 'block';
      });
      rampSizeInput.classList.remove('hidden');
      rampSizeLabel.classList.remove('hidden');
    } else {
      frameDivs.forEach(div => {
        div.style.width = '0';
        div.style.height = '0';
        div.style.display = 'none';
      });
      rampSizeInput.classList.add('hidden');
      rampSizeLabel.classList.add('hidden');
    }
  });
});

// Download the screenshot functionality
downloadButton.addEventListener('click', () => {
  const width = widthInput.value;
  const length = lengthInput.value;

  html2canvas(gridContainer).then((canvas) => {
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Array_${width}_tiles_wide_x_${length}_tile_long.png`;
    link.click();
  }).catch((error) => {
    console.error('Error capturing screenshot:', error);
  });
});