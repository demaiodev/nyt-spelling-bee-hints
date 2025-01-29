const target = $('.pz-byline__text')
const hintsSelector = '.interactive-content > div > div > p:nth-child(6)'
const hintsObject = {};
const foundWords = document.querySelector('.sb-wordlist-items-pag');
const date = new Date().toLocaleDateString('en-ZA', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})
const url = `https://www.nytimes.com/${date}/crosswords/spelling-bee-forum.html`
let displayObject = {};
let styles = {
    hintFontSize: '15px',
    hintButtonMargin: '1em',
    hintButtonText: 'Check Hints'
}

fetch(url).then((response) =>
    response.text())
    .then((text) => {
        processHintPageData(text)
        renderHints()
    }); 

function processHintPageData(text) {
    const dom = new DOMParser().parseFromString(text, "text/html") // make the text response into traversable html
    let hints = dom.querySelector(hintsSelector).children // get all the elements we need
    hints = Array.from(hints).map(child => child.innerText.trim().replace(/(\r\n|\n|\r)/gm, "")) // trim all the whitespace and new lines
    hints = hints.join(' ').split(' ') // transform into cleaned array; ex: ['do-10', 'ed-2', 'eg-1', ...]
    hints = hints.map(hint => hint.split('-')) // transform into a 2D array containing our data; ex [['do', 10], ['ed', 2], ['eg', 1]]
    hints.forEach((hint) => { // transform it yet again into an object we can work with
        const key = hint[0];
        const value = +hint[1];
        hintsObject[key] = value;
    });
    displayObject = {... hintsObject}
}

function renderHints() {
    target.style.fontSize = styles.hintFontSize
    target.innerText = JSON.stringify(displayObject)
    const hintCheckButton = document.createElement("button");
    hintCheckButton.innerText = styles.hintButtonText;
    hintCheckButton.style.marginLeft = styles.hintButtonMargin
    target.insertAdjacentElement("afterend", hintCheckButton);
    hintCheckButton.addEventListener('click', handleClick)
}

function handleClick() {
    const obj = {}
    foundWords.childNodes.forEach(word => {
        // count occurrences of substrings we have found
        const subStr = word.innerText.substring(0, 2).toLowerCase()
        if (!obj[subStr]) 
            obj[subStr] = 1
        else 
            obj[subStr] += 1
    })
    Object.keys(obj).forEach(key => {
        // subtract occurrences of substrings from total 
        if (displayObject[key]) {
            displayObject[key] = hintsObject[key] - obj[key]
        }
    })
    target.innerText = JSON.stringify(displayObject)
}