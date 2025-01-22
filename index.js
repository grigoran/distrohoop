import { distros } from "./distros.js";

const resolution = {
    heigth: 60,
    width: 230
}

const spaceChar = '&nbsp';

// Вероятность появления звезды в процентах
const starProbability = 1;

function getStar() {
    let star_chars = ['*', '.', '+', '·', '°'];
    return star_chars[Math.floor(Math.random() * star_chars.length)]
}

/** Возращает true или false в зависимости от starProbability */
function doStar(coef = 1) {
    return Math.floor(Math.random() * coef * (100 / starProbability)) == 0;
}

function initBuffer(){
    const buffer = [];
    for (let i = 0; i < resolution.heigth; i++) {
        buffer.push([]);
        for (let j = 0; j < resolution.width; j++) {
            if (doStar()){
                buffer[i].push(getStar())
            }
            else {
                buffer[i].push(spaceChar)
            }
        }
        buffer[i].push('<br/>')
    }

    return buffer;
}

function updateBuffer(buffer, textLength, text) {
    const textBound = Math.floor((resolution.width - textLength) / 2);
    for (let i = 0; i < resolution.heigth; i++) {
        for (let j = 0; j < resolution.width; j++) {
            
            if (buffer[i][j] == '' || buffer[i][j].length > 1) {
                buffer[i][j] = spaceChar;
            }
            
            if (doStar(100)){
                buffer[i][j] = getStar()
            } else if (doStar()) {
                buffer[i][j] = spaceChar;
            }

            if (i == Math.floor(resolution.heigth / 2) && j >= textBound && j - textBound < textLength) {
                const phrazeIndex = j-textBound;
                if (phrazeIndex == 0) {
                    buffer[i][j] = `<span id="phrase" style="color: gray;white-space: nowrap;">${text}`;
                } else if (phrazeIndex == textLength - 1) {
                    buffer[i][j] = `</span>`;
                } else {
                    buffer[i][j] = '';
                }
                
            }
        }
        buffer[i][resolution.width] = '<br/>'
    }
}

/**
 * 
 * @param {string[][]} buffer 
 */
function updateContent(buffer) {
    /** @type HTMLDivElement */
    const el = document.querySelector('#content');

    const text = buffer.map((e) => e.join('')).join('');

    el.innerHTML = text;
}

function formatDistro(distro) {
    return `${distro.description}${spaceChar}<span style="color:${distro.color}">${distro.name}</span>`;
}

function run() {
    const buffer = initBuffer();

    updateContent(buffer);

    const phrases = [
        "The stars are thinking...",
        "A decision is forming...",
        "The next distro will be decided soon...",
        "Patience is a virtue in the cosmic dance...",
        "The universe is aligning..."
    ];

    let text = phrases[0];
    let textLength = text.length;


    let phraseIndex = 1;

    const interval = setInterval(()=> {
        if (phraseIndex < phrases.length) {
            text = phrases[phraseIndex];
            textLength = text.length;
            phraseIndex++;
        } else {
            const distro = distros[Math.floor(Math.random()*distros.length)];

            text = formatDistro(distro);
            textLength = distro.description.length + distro.name.length + 10;
            clearInterval(interval);
        }
    }, 5000);

    requestAnimationFrame(function animate() {
        updateBuffer(buffer, textLength, text);
        updateContent(buffer);
        //document.querySelector('#phrase').innerHTML=text;
        requestAnimationFrame(animate);
    })
}

run();