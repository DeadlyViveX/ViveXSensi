const state = {
  brand: "",
  ram: "",
  storage: "",
  density: 0,
  screenWidth: 0,
  screenHeight: 0,
  dpr: 1
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


/* BRAND TUNING */

const BRAND_FACTOR = {
  "Samsung": 0,
  "Realme": 4,
  "Vivo": 3,
  "OPPO": 2,
  "Xiaomi": 4,
  "OnePlus": 5,
  "Motorola": 1,
  "Infinix": 6,
  "Tecno": 6,
  "iQOO": 7,
  "Apple": -4,
  "POCO": 5,
  "Nothing": 2,
  "Honor": 1,
  "Google Pixel": -2
};


/* PAGE NAVIGATION */

function goTo(id) {

  document
    .querySelectorAll(".screen")
    .forEach((screen) => {
      screen.classList.remove("active");
    });

  $(id).classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* LOAD BRANDS */

function init() {

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

function selectBrand(brand, element) {

  state.brand = brand;

  $("brandNext").disabled = false;

  document
    .querySelectorAll(".brand")
    .forEach((item) => {
      item.classList.remove("selected");
    });

  element.classList.add("selected");
}


/* OPEN DEVICE PAGE */

function openDeviceStep() {

  $("selectedBrand").textContent = state.brand;

  $("ramSelect").value = "";
  $("storageSelect").value = "";

  state.ram = "";
  state.storage = "";
  state.density = 0;
  state.screenWidth = 0;
  state.screenHeight = 0;
  state.dpr = 1;

  $("densityText").textContent =
    "Not scanned yet";

  $("deviceNext").disabled = true;

  goTo("device");
}


/* PIXEL DENSITY / SCREEN SCAN */

function scanDensity() {

  const dpr =
    window.devicePixelRatio || 1;

  const width =
    Math.round(
      window.screen.width * dpr
    );

  const height =
    Math.round(
      window.screen.height * dpr
    );

  /*
    Browser se exact Android system DPI
    reliably detect nahi hota.

    Isliye DPR se estimated PPI banaya
    ja raha hai.
  */

  const ppi =
    Math.round(160 * dpr);


  state.density = ppi;
  state.screenWidth = width;
  state.screenHeight = height;
  state.dpr = dpr;


  $("densityText").textContent =
    `Detected • ${width} × ${height} • ${dpr}x • ~${ppi} PPI`;


  updateNext();
}


/* CHECK NEXT BUTTON */

function updateNext() {

  $("deviceNext").disabled = !(
    state.ram &&
    state.storage &&
    state.density
  );
}


/* RAM */

function getRam() {

  return parseInt(state.ram) || 4;

}


/* STORAGE */

function getStorage() {

  const value =
    state.storage
      .replace(" GB", "")
      .replace(" TB", "");

  if (state.storage.includes("TB")) {
    return parseFloat(value) * 1024;
  }

  return parseInt(value) || 64;
}


/* DEVICE SCORE */

function getDeviceScore() {

  const ram =
    getRam();

  const storage =
    getStorage();

  const ppi =
    state.density || 320;

  const dpr =
    state.dpr || 1;


  /*
    Screen resolution score
  */

  const pixels =
    state.screenWidth *
    state.screenHeight;


  const resolutionScore =
    Math.min(
      20,
      pixels / 180000
    );


  /*
    PPI score
  */

  const ppiScore =
    Math.min(
      20,
      Math.max(
        -10,
        (ppi - 300) / 12
      )
    );


  /*
    RAM score
  */

  const ramScore =
    Math.min(
      12,
      ram * 0.8
    );


  /*
    Storage score
  */

  const storageScore =
    Math.min(
      5,
      storage / 128
    );


  /*
    DPR score
  */

  const dprScore =
    Math.min(
      10,
      dpr * 3
    );


  /*
    Brand difference
  */

  const brandScore =
    BRAND_FACTOR[state.brand] || 0;


  return (
    125 +
    resolutionScore +
    ppiScore +
    ramScore +
    storageScore +
    dprScore +
    brandScore
  );
}


/* GENERATE SENSITIVITY */

function generateSensitivity() {

  const score =
    getDeviceScore();


  /*
    General sensitivity

    0 - 200
  */

  const general =
    clamp(
      Math.round(score + 18),
      100,
      200
    );


  const redDot =
    clamp(
      Math.round(score + 10),
      90,
      195
    );


  const scope2x =
    clamp(
      Math.round(score + 2),
      80,
      190
    );


  const scope4x =
    clamp(
      Math.round(score - 12),
      70,
      180
    );


  const sniper =
    clamp(
      Math.round(score - 45),
      40,
      140
    );


  const freeLook =
    clamp(
      Math.round(score + 5),
      90,
      195
    );


  return {
    general,
    redDot,
    scope2x,
    scope4x,
    sniper,
    freeLook
  };
}


/* CLAMP */

function clamp(value, min, max) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


/* SHOW RESULT */

function showResult() {

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


  /* SENSITIVITY */

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

  const deviceScore =
    getDeviceScore();


  let fireButton =
    48 +
    Math.round(
      (deviceScore - 125) / 8
    );


  fireButton =
    clamp(
      fireButton,
      45,
      60
    );


  $("fireButton").textContent =
    `${fireButton}%`;


  /* RECOMMENDED DPI */

  let recommendedDpi =
    Math.round(
      360 +
      (deviceScore - 125) * 2.5
    );


  recommendedDpi =
    clamp(
      recommendedDpi,
      320,
      560
    );


  $("dpi").textContent =
    recommendedDpi;


  goTo("result");
}


/* RESTART */

function restart() {

  state.brand = "";
  state.ram = "";
  state.storage = "";
  state.density = 0;
  state.screenWidth = 0;
  state.screenHeight = 0;
  state.dpr = 1;


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
