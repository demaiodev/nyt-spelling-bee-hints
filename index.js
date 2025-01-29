const target = $('.pz-byline__text')
const hintsSelector = '.interactive-content > div > div > p:nth-child(6)'
const hintsObject = {};
const foundWords = document.querySelector('.sb-wordlist-items-pag'); // gotta figure out how to handle the paginated results somehow
const date = new Date().toLocaleDateString('en-ZA', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})
const url = `https://www.nytimes.com/${date}/crosswords/spelling-bee-forum.html`

fetch(url).then((response) =>
    response.text())
    .then((text) => {
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
        target.style.fontSize = '15px' // make it smaller cuz its big as hell
        target.innerText = JSON.stringify(hintsObject) // set to the author name on the page because its in a nice spot
        const hintCheckButton = document.createElement("button"); // create a new button element
        hintCheckButton.innerText = 'Check Hints'; // assign text
        target.insertAdjacentElement("afterend", hintCheckButton); // pop it in the dom after our hints map
        hintCheckButton.addEventListener('click', () => { // add event listener to handle clicks
            // on click, run a loop to check the found words substring against our hints object
            foundWords.childNodes.forEach(word => {
                const foundWordSubstring = word.innerText.substring(0, 2).toLowerCase() // object key; ex: 'do'
                // this doesnt work yet - -- - - -
                if (foundWordSubstring in hintsObject) {
                    
                }
                const existingEntry = hintsObject[foundWordSubstring] // this is the number value; ex: 6
                console.log(foundWordSubstring)
                console.log('before', hintsObject)

                console.log('after', hintsObject)
                target.innerText = JSON.stringify(hintsObject) // repaint? idk
            })
        })
    });