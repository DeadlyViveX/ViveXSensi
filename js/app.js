const state = {
  brand: "",
  ram: "",
  storage: "",
  density: 0
};


const $ = (id) => document.getElementById(id);


/* PHONE BRANDS */

const BRANDS = [
  "Samsung",
  "Realme",
  "Vivo",
  "OPPO",
  "Xiaomi",
  "OnePlus",
  "Motorola",
  "Infinix",
  "Tecno",
  "iQOO",
  "Apple",
  "POCO",
  "Nothing",
  "Honor",
  "Google Pixel"
];


/* PAGE NAVIGATION */

function goTo(id){

  document
    .querySelectorAll(".screen")
    .forEach((screen) => {
      screen.classList.remove("active");
    });

  $(id).classList.add("active");

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}


/* LOAD BRANDS */

function init(){

  $("brandGrid").innerHTML = BRANDS
    .map((brand) => `
      <button
        class="brand"
        onclick="selectBrand('${brand}', this)"
      >
        ${brand}
      </button>
    `)
    .join("");
}


/* SELECT BRAND */

function selectBrand(brand, element){

  state.brand = brand;

  $("brandNext").disabled = false;

  document
    .querySelectorAll(".brand")
    .forEach((item) => {
      item.classList.remove("selected");
    });

  element.classList.add("selected");
}


/* OPEN RAM/STORAGE PAGE */

function openDeviceStep(){

  $("selectedBrand").textContent = state.brand;

  $("ramSelect").value = "";
  $("storageSelect").value = "";

  state.ram = "";
  state.storage = "";
  state.density = 0;

  $("densityText").textContent =
    "Not scanned yet";

  $("deviceNext").disabled = true;

  goTo("device");
}


/* PIXEL DENSITY SCAN */

function scanDensity(){

  const dpr =
    window.devicePixelRatio || 1;

  /*
    Browser Android ka real system DPI
    reliably nahi de sakta.

    Isliye screen DPR se estimated PPI
    calculate kiya ja raha hai.
  */

  const ppi =
    Math.round(160 * dpr);

  const width =
    Math.round(window.screen.width * dpr);

  const height =
    Math.round(window.screen.height * dpr);


  state.density = ppi;


  $("densityText").textContent =
    `Detected • ${width} × ${height} • ~${ppi} PPI`;


  updateNext();
}


/* NEXT BUTTON CHECK */

function updateNext(){

  $("deviceNext").disabled = !(
    state.ram &&
    state.storage &&
    state.density
  );
}


/* RAM NUMBER */

function getRam(){

  return parseInt(state.ram) || 4;

}


/* CREATE SENSITIVITY */

function generateSensitivity(){

  const ram = getRam();

  const ppi =
    state.density || 320;


  /*
    Base sensitivity.

    Free Fire sensitivity:
    0 - 200
  */

  let base =
    165 +
    Math.round((ppi - 300) / 20);


  /*
    RAM adjustment
  */

  if(ram >= 8){
    base += 5;
  }

  if(ram >= 12){
    base += 4;
  }

  if(ram >= 16){
    base += 3;
  }


  /*
    Never above 200
  */

  base =
    Math.max(
      100,
      Math.min(200, base)
    );


  return {

    general:
      Math.min(200, base + 10),

    redDot:
      Math.min(200, base + 5),

    scope2x:
      Math.min(200, base),

    scope4x:
      Math.max(80, base - 10),

    sniper:
      Math.max(50, base - 45),

    freeLook:
      Math.min(200, base + 2)

  };

}


/* SHOW RESULT */

function showResult(){

  const ram =
    getRam();

  const ppi =
    state.density || 320;

  const sensi =
    generateSensitivity();


  /* DEVICE INFO */

  $("resultBrand").textContent =
    state.brand;

  $("resultRam").textContent =
    state.ram;

  $("resultStorage").textContent =
    state.storage;

  $("resultDensity").textContent =
    `~${ppi} PPI`;


  /* SENSITIVITY CARDS */

  const settings = [

    ["General", sensi.general],

    ["Red Dot", sensi.redDot],

    ["2X Scope", sensi.scope2x],

    ["4X Scope", sensi.scope4x],

    ["Sniper Scope", sensi.sniper],

    ["Free Look", sensi.freeLook]

  ];


  $("settingsGrid").innerHTML =
    settings
      .map(
        ([name, value]) => `
          <div class="setting">
            <small>${name}</small>
            <strong>${value}</strong>
          </div>
        `
      )
      .join("");


  /* FIRE BUTTON */

  let fireButton =
    48 + Math.round(ram / 4);


  fireButton =
    Math.max(
      45,
      Math.min(55, fireButton)
    );


  $("fireButton").textContent =
    `${fireButton}%`;


  /* RECOMMENDED DPI */

  let recommendedDpi =
    Math.round(ppi * 1.25);


  recommendedDpi =
    Math.max(
      320,
      Math.min(560, recommendedDpi)
    );


  $("dpi").textContent =
    recommendedDpi;


  goTo("result");
}


/* RESTART */

function restart(){

  state.brand = "";
  state.ram = "";
  state.storage = "";
  state.density = 0;

  $("brandNext").disabled = true;

  document
    .querySelectorAll(".brand")
    .forEach((item) => {
      item.classList.remove("selected");
    });

  goTo("home");
}


/* START */

init();
