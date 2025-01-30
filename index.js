const pangramSelector = ".interactive-content > div > div > p:nth-child(3)";
const hintsSelector = ".interactive-content > div > div > p:nth-child(6)";
const foundWords = document.querySelector(".sb-wordlist-items-pag");
const hintsContainer = document.querySelector(".pz-byline__text");
const url = `https://www.nytimes.com/${date}/crosswords/spelling-bee-forum.html`;
const date = new Date().toLocaleDateString("en-ZA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const hintsObject = {};

let displayObject = {};
let hide = true;

fetch(url)
  .then((response) => response.text())
  .then((text) => {
    processHints(text);
    renderHints();
    attachEventListeners();
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

  const totalPangrams = dom
    .querySelector(pangramSelector)
    .textContent.split("PANGRAMS:")[1]
    .trim()
    .replace(/(\r\n|\n|\r)/gm, "");

  const div = document.createElement("div")
  div.textContent = `Total Pangrams: ${totalPangrams}`
  div.style.paddingTop = '1em'
  document.querySelector("h2").insertAdjacentElement('afterend', div)
  hintsContainer.insertAdjacentElement("afterend", Button("Toggle", hideHints));
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
  document.querySelector(".hive-action__submit").addEventListener("click", () => {
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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 5px;
  text-align: center;
  line-height: 30px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
}

.button {
  transition: all 0.15s ease-in-out; 
}

.button:hover {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15); 
}

.pz-byline__text {
  transition: opacity 0.3s ease-in-out;
  font-size: 12px !important;
  margin-right: 1em;
}
`;
document.head.appendChild(style);
