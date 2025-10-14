const pangramSelector = ".interactive-content > div > div > p:nth-child(3)";
const hintsSelector = ".interactive-content > div > div > p:nth-child(6)";
const foundWords = document.querySelector(".sb-wordlist-items-pag");
const hintsContainer = document.querySelector(".pz-byline__text");
let date;

let urlDate = window.location.href.split("/");

if (isNaN(Date.parse(new Date(urlDate[urlDate.length - 1])))) {
  // this is the normal scenario where we get today's date
  date = getDate();
} else {
  // we're visiting a page where the date is set as the path in the url
  date = getDate(urlDate[urlDate.length - 1]);
}

function getDate(str = null) {
  let date = new Date(str || new Date()).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC"
  });
  return date;
}

const url = `https://www.nytimes.com/${date}/crosswords/spelling-bee-forum.html`;
const hintsObject = {};

let displayObject = {};
let hide = true;

fetch(url)
  .then((response) => response.text())
  .then((text) => {
    processHints(text);
    renderHints();
    attachEventListeners();

    console.log(
      `%c🧠🐝 Hintify Loaded! 🐝🧠%c\nBuzzing through hints for ${date} `,
      "background: #ffde00; color: black; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
      "color: #888; font-style: italic;"
    );
  });

function processHints(text) {
  const dom = new DOMParser().parseFromString(text, "text/html");

  let hints = dom.querySelector(hintsSelector).children;
  hints = Array.from(hints)
    .map((child) => child.innerText.trim().replace(/(\r\n|\n|\r)/gm, ""))
    .join(" ")
    .split(" ")
    .map((hint) => hint.split("-"))
    .forEach((hint) => {
      const key = hint[0];
      const value = +hint[1];
      hintsObject[key] = value;
    });

  displayObject = { ...hintsObject };

  let hintArr = dom.querySelector(pangramSelector).textContent.split(":");
  const totalPangrams = hintArr[hintArr.length - 1].trim();

  const containerDiv = document.createElement("div");
  containerDiv.style.display = "flex";
  containerDiv.style.paddingTop = "1em";
  containerDiv.style.flexWrap = "wrap";

  const div = document.createElement("div");
  div.style.alignSelf = "center";
  div.textContent = `Total Pangrams: ${totalPangrams}`;

  containerDiv.appendChild(Button("Toggle", hideHints));
  containerDiv.appendChild(div);

  document.querySelector("#portal-game-header").appendChild(containerDiv);
}

function renderHints() {
  hintsContainer.innerHTML = "";
  for (const key in displayObject) {
    const circle = document.createElement("div");
    circle.classList.add("hint-circle");

    const hintSubstring = document.createElement("span");
    hintSubstring.textContent = key.toUpperCase();
    circle.appendChild(hintSubstring);

    const remainingCount = document.createElement("span");
    remainingCount.style.display = "block";
    remainingCount.textContent = displayObject[key];

    circle.appendChild(remainingCount);
    hintsContainer.appendChild(circle);
  }
}

function Button(text, fn) {
  const button = document.createElement("button");
  button.innerText = text;
  button.classList.add("button", "hive-action");
  button.addEventListener("click", fn);

  return button;
}

function hideHints() {
  if (hide) hintsContainer.style.opacity = 0;
  else hintsContainer.style.opacity = 1;
  hide = !hide;
}

function calculateHints() {
  const obj = {};

  foundWords.childNodes.forEach((word) => {
    const subStr = word.innerText.substring(0, 2).toLowerCase();
    if (!obj[subStr]) obj[subStr] = 1;
    else obj[subStr] += 1;
  });

  Object.keys(obj).forEach((key) => {
    if (displayObject[key]) {
      displayObject[key] = hintsObject[key] - obj[key];
      if (displayObject[key] === 0) delete displayObject[key];
    }
  });

  renderHints();
}

function attachEventListeners() {
  document
    .querySelector(".hive-action__submit")
    .addEventListener("click", () => {
      calculateHints();
    });

  document.querySelector("body").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      setTimeout(() => {
        calculateHints();
      }, "0");
    }
  });
}

const style = document.createElement("style");
style.textContent = `
.hint-circle {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin: 5px;
  text-align: center;
  line-height: 2rem;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  font-size: 1rem;
  font-weight: bold;
}

.button {
  transition: all 0.15s ease-in-out;
}

.button:hover {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
}

.pz-byline__text {
  transition: opacity 0.3s ease-in-out;
  margin-right: 1em;
}
`;
document.head.appendChild(style);
