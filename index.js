const target = document.querySelector(".pz-byline__text");
const hintsSelector = ".interactive-content > div > div > p:nth-child(6)";
const hintsObject = {};
const foundWords = document.querySelector(".sb-wordlist-items-pag");
const date = new Date().toLocaleDateString("en-ZA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const url = `https://www.nytimes.com/${date}/crosswords/spelling-bee-forum.html`;
let displayObject = {};

fetch(url)
  .then((response) => response.text())
  .then((text) => {
    processHints(text);
    renderHints();
    renderCalculateButton();
  });

function processHints(text) {
  const dom = new DOMParser().parseFromString(text, "text/html");
  let hints = dom.querySelector(hintsSelector).children;
  hints = Array.from(hints).map((child) =>
    child.innerText.trim().replace(/(\r\n|\n|\r)/gm, "")
  );
  hints = hints.join(" ").split(" ");
  hints = hints.map((hint) => hint.split("-"));
  hints.forEach((hint) => {
    const key = hint[0];
    const value = +hint[1];
    hintsObject[key] = value;
  });
  displayObject = { ...hintsObject };
}

function renderHints() {
  target.style.fontSize = "12px";
  target.style.padding = "10px";
  target.style.border = "1px solid #ccc";
  target.style.borderRadius = "5px";
  target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

  target.innerHTML = ""; 

  for (const key in displayObject) {
    const circle = document.createElement("div");
    circle.classList.add("hint-circle"); 
    circle.style.display = "inline-block";
    circle.style.width = "30px";
    circle.style.height = "30px";
    circle.style.borderRadius = "50%";
    circle.style.margin = "5px";
    circle.style.textAlign = "center";
    circle.style.lineHeight = "30px";
    circle.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.2)";
    circle.style.border = "1px solid #0f0f0f";

    const hintSubstring = document.createElement("span");
    hintSubstring.textContent = key.toUpperCase();
    circle.appendChild(hintSubstring);

    const remainingCount = document.createElement("span");
    remainingCount.style.display = "block";
    remainingCount.textContent = displayObject[key];
    circle.appendChild(remainingCount);

    target.appendChild(circle); 
  }
}

function renderCalculateButton() {
  const calculateButton = document.createElement("button");
  calculateButton.innerText = "Calculate";
  calculateButton.style.marginLeft = "1em";
  calculateButton.style.padding = "8px 15px"; 
  calculateButton.style.borderRadius = "3px"; 
  calculateButton.style.backgroundColor = "#f9d924";
  calculateButton.style.color = "black"; 
  calculateButton.style.border = "1px solid #0f0f0f"; 
  calculateButton.style.cursor = "pointer"; 
  calculateButton.classList.add("calculate-button"); 
  calculateButton.addEventListener("click", handleClick);
  target.insertAdjacentElement("afterend", calculateButton);
}

function handleClick() {
  const obj = {};
  foundWords.childNodes.forEach((word) => {
    // count occurrences of substrings we have found
    const subStr = word.innerText.substring(0, 2).toLowerCase();
    if (!obj[subStr]) obj[subStr] = 1;
    else obj[subStr] += 1;
  });
  Object.keys(obj).forEach((key) => {
    // subtract occurrences of substrings from total
    if (displayObject[key]) {
      displayObject[key] = hintsObject[key] - obj[key];
    }
  });
  renderHints()
}

// Add this CSS to your page (or within a <style> tag)
const style = document.createElement('style');
style.textContent = `
.hint-circle {
  transition: background-color 0.3s ease-in-out; 
}

.hint-circle:hover {
  background-color: #f9d924; /* Yellow hover color */
  cursor: pointer;
}

.calculate-button {
  transition: all 0.15s ease-in-out; 
}

.calculate-button:hover {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15); 
}
`;
document.head.appendChild(style);