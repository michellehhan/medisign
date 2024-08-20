$(window).on("load", function() {
  setTimeout(function(){
  $(".loader-wrapper").fadeOut(1400);
  }, 500);
});

document.addEventListener('DOMContentLoaded', function() {
  const displayModeSelect = document.getElementById('display-mode');

  displayModeSelect.addEventListener('change', function() {
      const selectedMode = displayModeSelect.value;

      if (selectedMode === 'light') {
          applyLightMode();
      } else if (selectedMode === 'dark') {
          applyDarkMode();
      } else if (selectedMode === 'high-contrast') {
          applyHighContrastMode();
      }
  });

  function applyLightMode() {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
      applyStylesToElements('white', 'black');
      applyNavStyles('white', 'black');
  }

  function applyDarkMode() {
      document.body.style.backgroundColor = '#1e1e1e';
      document.body.style.color = 'white';
      applyStylesToElements('#1e1e1e', 'white');
      applyNavStyles('#1e1e1e', 'white');
  }

  function applyHighContrastMode() {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = '#f4f4a9';
      applyStylesToElements('black', '#f4f4a9');
      applyNavStyles('black', '#f4f4a9');
  }

  function applyStylesToElements(backgroundColor, color) {
      const elementsToUpdate = document.querySelectorAll('*:not(button):not(.footer):not(.footer p)');
      elementsToUpdate.forEach(element => {
          element.style.backgroundColor = backgroundColor;
          element.style.color = color;
      });

      const navLinks = document.querySelectorAll('.navbar-links a, .logo a.michelle');
      navLinks.forEach(link => {
          link.style.color = color;
      });
  }

  function applyNavStyles(backgroundColor, color) {
      const navElement = document.querySelector('nav');
      navElement.style.backgroundColor = backgroundColor;
      navElement.style.color = color;
  }

  applyLightMode();
});

document.getElementById('menu-btn').addEventListener('click', function() {
  this.classList.toggle('open');
  document.getElementById('navigation').classList.toggle('open');
});
const modelsConfig = {
  medical_personnel: {
    URL: "https://teachablemachine.withgoogle.com/models/g6DeHB2Ie/",
    webcamContainerId: "webcam-container-medical-personnel",
    labelContainerId: "label-container-medical-personnel",
    mostLikelyId: "most-likely-medical-personnel",
    collapseButtonId: "collapse-button-medical-personnel",
  },
  medical_locations: {
    URL: "https://teachablemachine.withgoogle.com/models/hDaPHRCFc2/",
    webcamContainerId: "webcam-container-medical-locations",
    labelContainerId: "label-container-medical-locations",
    mostLikelyId: "most-likely-medical-locations",
    collapseButtonId: "collapse-button-medical-locations",
  },
  patient_feelings: {
    URL: "https://teachablemachine.withgoogle.com/models/Ud6GNhmS_/",  
    webcamContainerId: "webcam-container-patient-feelings",
    labelContainerId: "label-container-patient-feelings",
    mostLikelyId: "most-likely-patient-feelings",
    collapseButtonId: "collapse-button-patient-feelings",
  },
};

let models = {};
let webcams = {};
let labelContainers = {};
let maxPredictions = {};
let webcamsInitialized = {
  medical_personnel: false,
  medical_locations: false,
  patient_feelings: false,
};

async function init(type) {
  if (!webcamsInitialized[type]) {
    const modelURL = modelsConfig[type].URL + "model.json";
    const metadataURL = modelsConfig[type].URL + "metadata.json";

    models[type] = await tmImage.load(modelURL, metadataURL);
    maxPredictions[type] = models[type].getTotalClasses();

    const flip = true;
    webcams[type] = new tmImage.Webcam(400, 400, flip);
    await webcams[type].setup();
    await webcams[type].play();
    window.requestAnimationFrame(() => loop(type));

    document.getElementById(modelsConfig[type].webcamContainerId).appendChild(webcams[type].canvas);
    labelContainers[type] = document.getElementById(modelsConfig[type].labelContainerId);
    for (let i = 0; i < maxPredictions[type]; i++) {
      const labelDiv = document.createElement("div");
      labelDiv.innerHTML = `
        <div class="label-name"></div>
        <div class="label-bar">
          <div class="bar"></div>
          <div class="percentage"></div>
        </div>`;
      labelContainers[type].appendChild(labelDiv);
    }
    webcamsInitialized[type] = true;
    document.getElementById(modelsConfig[type].collapseButtonId).style.display = 'inline-block'; // Show collapse button
  }
}

async function loop(type) {
  webcams[type].update();
  await predict(type);
  window.requestAnimationFrame(() => loop(type));
}

async function predict(type) {
  const prediction = await models[type].predict(webcams[type].canvas);
  let highestProbability = 0;
  let mostLikelyPrediction = "";

  for (let i = 0; i < maxPredictions[type]; i++) {
    const probability = (prediction[i].probability * 100).toFixed(2);
    const className = prediction[i].className;
    const labelDiv = labelContainers[type].childNodes[i];

    labelDiv.querySelector('.label-name').textContent = className;
    labelDiv.querySelector('.bar').style.width = `${probability}%`;
    labelDiv.querySelector('.percentage').textContent = `${probability}%`;

    if (prediction[i].probability > highestProbability) {
      highestProbability = prediction[i].probability;
      mostLikelyPrediction = className;
    }
  }

  document.getElementById(modelsConfig[type].mostLikelyId).innerHTML = `Most likely: ${mostLikelyPrediction}`;
}

function collapse(type) {
  webcams[type].stop(); // Stop the webcam
  document.getElementById(modelsConfig[type].webcamContainerId).innerHTML = '';
  document.getElementById(modelsConfig[type].labelContainerId).innerHTML = '';
  document.getElementById(modelsConfig[type].mostLikelyId).innerHTML = '';
  webcamsInitialized[type] = false; // Allow reinitialization
  document.getElementById(modelsConfig[type].collapseButtonId).style.display = 'none'; // Hide collapse button
}

function scrollToAbout() {
  const aboutSection = document.getElementById('about-section');
  const offset = -50; 
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = aboutSection.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition + offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

function updateTextContent() {
  const elements = document.querySelectorAll('[data-short]');
  const isSmallScreen = window.innerWidth <= 1200;

  elements.forEach(el => {
    if (isSmallScreen) {
      el.textContent = el.getAttribute('data-short');
    } 
  });
}

window.addEventListener('resize', updateTextContent);
window.addEventListener('load', updateTextContent);