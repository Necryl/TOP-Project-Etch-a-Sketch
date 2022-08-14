// defining elements
const containerElement = document.querySelector('#container');
const colorPickerElement = document.querySelector('.colorPicker');
const resoSliderElement = document.querySelector('#resolution');
const resNumElement = document.querySelector('#resNum');
const clearBtnElement = document.querySelector('.clear');
const shadeBtnElement = document.querySelector('.shadeMode');
const colorBtnElement = document.querySelector('.colorMode');
const rainbowBtnElement = document.querySelector('.rainbowMode');
const eraserBtnElement = document.querySelector('.eraserMode');
const colorWrapperElement = document.querySelector('.colorWrapper');

// defining letiables
let resolution = 16;
let pixels = [];
let color = colorPickerElement.value;
let currentColor = color;
let eraserColor = '#FFFFFF';
let clicked = false;
let colorMode = 'color';
let shadowMode = false;


// adding events (apart from the ones for the pixels, which is in the function addEventToPixel())
colorPickerElement.addEventListener('change', event => {
    color = colorPickerElement.value;
    if (colorMode === 'color' || shadowMode) {
        currentColor = color;
    }
});
colorPickerElement.addEventListener('input', event => {
    colorWrapperElement.style.backgroundColor = colorPickerElement.value;;
});
window.addEventListener('mousedown', event => {
    clicked = true;
});
window.addEventListener('mouseup', event => {
    clicked = false;
});
resoSliderElement.addEventListener('input', event => {
    updateResFromSlider();
    constructPixels();
})
resNumElement.addEventListener('change', event => {
    if (event.target.value < 8) {
        event.target.value = 8;
    } else if (event.target.value > 64) {
        event.target.value = 64;
    }
    updateResFromNum();
    constructPixels();
})
clearBtnElement.addEventListener('click', event => {
    constructPixels();
})
eraserBtnElement.addEventListener('click', event => {
    colorMode = 'eraser';
    currentColor = eraserColor;
    toggle('eraser');
})
colorBtnElement.addEventListener('click', event => {
    colorMode = 'color';
    currentColor = color;
    toggle('color')
})
rainbowBtnElement.addEventListener('click', event => {
    colorMode = 'rainbow';
    toggle('rain');
})
shadeBtnElement.addEventListener('click', event => {

    if (shadowMode) {
        shadowMode = false;
        shadeBtnElement.classList.remove('btnON');
        shadeBtnElement.classList.add('btnOFF');
    } else {
        shadowMode = true;
        shadeBtnElement.classList.remove('btnOFF');
        shadeBtnElement.classList.add('btnON');
    }
})


// defining some functions
function createElement(tag, cls=null, text=null, attr=null) {
    //tag -> string, cls -> string or [strings], text -> string, attr -> string or Object
    if (cls != null && !Array.isArray(cls)) {
        cls = [cls];
    }
    if (attr != null) {
        if (attr.constructor != Object) {
            let temp = {};
            if (Array.isArray(attr)) {
                if (attr.length === 2) {
                    temp[attr[0]] = attr[1];
                    attr = temp;
                } else if (attr.length === 1) {
                    temp[attr[0]] = null;
                    attr = temp;
                } else {
                    throw 'Error: invalid argument for parameter <attr> only Objects (with any number of items) or Arrays with one or two items is accepted';
                }
            } else if (typeof attr === 'string') {
                temp[attr] = null;
                attr = temp;
            }
        }
    }
    let result = document.createElement(tag);
    if (cls != null) {
        for (let i = 0; i < cls.length; i++) {
            result.classList.add(cls[i]);
        }
    }
    if (text != null) {
        result.textContent = text;
    }
    if (attr != null) {
        let keys = Object.keys(attr);
        for (let i = 0; i < keys.length; i++) {
            if (attr[keys[i]] === null) {
                result.toggleAttribute(keys[i]);
            } else {
                result.setAttribute(keys[i], attr[keys[i]])
            }
        }
    }
    
    return result;
}

function toggle(btn) {
    let togglable = [colorBtnElement, rainbowBtnElement, eraserBtnElement];

    for (let i = 0; i < togglable.length; i++) {
        if (togglable[i].getAttribute('toggle') === btn) {
            togglable[i].classList.remove('btnOFF');
            togglable[i].classList.add('btnON');
        } else {
            togglable[i].classList.remove('btnON');
            togglable[i].classList.add('btnOFF');
        }
    }
}

function getColorType(col, checkFor=null) {
    
    let regexFor_rgb = new RegExp('\^rgb\[\(\]\(\?\:\\s\*0\*\(\?\:\\d\\d\?\(\?\:\\\.\\d\+\)\?\(\?\:\\s\*%\)\?\|\\\.\\d\+\\s\*%\|100\(\?\:\\\.0\*\)\?\\s\*%\|\(\?\:1\\d\\d\|2\[0\-4\]\\d\|25\[0\-5\]\)\(\?\:\\\.\\d\+\)\?\)\\s\*\(\?\:,\(\?\!\[\)\]\)\|\(\?\=\[\)\]\)\)\)\{3\}\[\)\]\$', 'ig');
    let regexFor_hex = new RegExp('\^\#\(\?\:\[A\-Fa\-f0\-9\]\{3\}\)\{1,2\}\$', 'ig');
    let regexFor_rgba = new RegExp('\^\^rgba\[\(\]\(\?\:\\s\*0\*\(\?\:\\d\\d\?\(\?\:\\\.\\d\+\)\?\(\?\:\\s\*%\)\?\|\\\.\\d\+\\s\*%\|100\(\?\:\\\.0\*\)\?\\s\*%\|\(\?\:1\\d\\d\|2\[0\-4\]\\d\|25\[0\-5\]\)\(\?\:\\\.\\d\+\)\?\)\\s\*,\)\{3\}\\s\*0\*\(\?\:\\\.\\d\+\|1\(\?\:\\\.0\*\)\?\)\\s\*\[\)\]\$', 'ig');
    let regexFor_hsl = new RegExp('\^hsl\[\(\]\\s\*0\*\(\?\:\[12\]\?\\d\{1,2\}\|3\(\?\:\[0\-5\]\\d\|60\)\)\\s\*\(\?\:\\s\*,\\s\*0\*\(\?\:\\d\\d\?\(\?\:\\\.\\d\+\)\?\\s\*%\|\\\.\\d\+\\s\*%\|100\(\?\:\\\.0\*\)\?\\s\*%\)\)\{2\}\\s\*\[\)\]\$', 'ig');
    let regexFor_hsla = new RegExp('\^hsla\[\(\]\\s\*0\*\(\?\:\[12\]\?\\d\{1,2\}\|3\(\?\:\[0\-5\]\\d\|60\)\)\\s\*\(\?\:\\s\*,\\s\*0\*\(\?\:\\d\\d\?\(\?\:\\\.\\d\+\)\?\\s\*%\|\\\.\\d\+\\s\*%\|100\(\?\:\\\.0\*\)\?\\s\*%\)\)\{2\}\\s\*,\\s\*0\*\(\?\:\\\.\\d\+\|1\(\?\:\\\.0\*\)\?\)\\s\*\[\)\]\$', 'ig');
    
    let result;

    if (regexFor_rgba.test(col)) {
        result = 'rgba';
    } else if (regexFor_hsla.test(col)) {
        result = 'hsla';
    } else if (regexFor_hex.test(col)) {
        result = 'hex';
    } else if (regexFor_hsl.test(col)) {
        result = 'hsl';
    } else if (regexFor_rgb.test(col)) {
        result = 'rgb';
    } else {
        result = 'unknown';
    }

    if (checkFor === null) {
        return result;
    } else if (checkFor === result) {
        return true;
    } else {
        return false;
    }
}

function RGBToHex(col) {
    col_values = [];
    col = col.toLowerCase().split('(')[1].split(')')[0].replace(' ', '').split(',').forEach(item => {col_values.push(parseInt(item))})

    r = col_values[0].toString(16);
    g = col_values[1].toString(16);
    b = col_values[2].toString(16);
  
    if (r.length == 1) {
        r = "0" + r;
    }
    if (g.length == 1) {
        g = "0" + g;
    }
    if (b.length == 1) {
        b = "0" + b;
    }
    
    let result = "#" + r + g + b;

    return result.toUpperCase();
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let col = '#';
    for (let i = 0; i < 6; i++) {
      col += letters[Math.floor(Math.random() * 16)];
    }
    return col;
}

function parseHexToArray(hexNum) {
    hexNum = hexNum.toUpperCase();
    let letters = {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "A": 10,
        "B": 11,
        "C": 12,
        "D": 13,
        "E": 14,
        "F": 15
    }

    let result = [];

    for (let i = 0; i < hexNum.length; i++) {
        if (hexNum[0] === '#' && i === 0) {
        } else {
            result.push(letters[hexNum[i]]);
        }
    }
    return result;
}

function parseArrayToHex(hexNum) {

    let letters = '0123456789ABCDEF';
    let result = '#';
    hexNum.forEach(num => {
        result += letters[num];
    });
    return result;
}

function mixHexColors(color1, color2) {
    if (getColorType(color1, 'rgb')) {
        color1 = RGBToHex(color1);
    }
    if (getColorType(color2, 'rgb')) {
        color2 = RGBToHex(color2);
    }

    color1 = parseHexToArray(color1);
    color2 = parseHexToArray(color2);
    

    let col = [];
    let dif;
    for (let i = 0; i < 6; i++) {

        if (color1[i] === color2[i]) {
            col.push(color1[i]);
        } else {
            dif_temp = Math.abs(color1[i] - color2[i]);
            dif_extra = dif_temp % 2;
            dif = Math.floor(dif_temp/2);
            if (dif_extra === 1 && dif === 0) {
                dif++;
            }
            if (color1[i] < color2[i]) {
                col.push(color2[i] - dif);
            } else {
                col.push(color1[i] - dif);
            }
        }
    }

    return parseArrayToHex(col);
}

function getColor(oldCol=null) {
    
    col = currentColor
    if (colorMode === 'rainbow') {
        col = getRandomColor();
    }
    if (shadowMode) {
        if (oldCol === null) {
            throw "Error: parameter oldCol is not given, it is necessary for shade mode"
        }
        return mixHexColors(oldCol, col);
    }
    return col;
}

function constructPixels() {
    if (containerElement.innerHTML != '') {
        while(containerElement.firstChild) {
            containerElement.removeChild(containerElement.firstChild);
        }
    }
    for (let i = 0; i < resolution; i++) {
        let list = createElement('ul', 'pixelRow');
        let pixelArray = [];
        for (let x = 0; x < resolution; x++) {
            let item = createElement('div', 'pixel', null, {style: 'background-color: #FFFFFF'});
            addEventToPixel(item);
            pixelArray.push(item);
            list.appendChild(item);
        }
        containerElement.appendChild(list);
        pixels.push(pixelArray);
    }
}

function addEventToPixel(pixelElem) {
    pixelElem.addEventListener('mousedown', event => {
        let oldCol = event.target.style.backgroundColor;
        event.target.style.backgroundColor = getColor(oldCol);
    });
    pixelElem.addEventListener('mouseover', event => {
        if (clicked) {
            let oldCol = event.target.style.backgroundColor;
            event.target.style.backgroundColor = getColor(oldCol);
        }
    });
}

function updateResFromSlider() {
    resolution = resoSliderElement.value;
    resNumElement.value = resolution;
}

function updateResFromNum() {
    resolution = resNumElement.value;
    resoSliderElement.value = resolution;
}

// Run on start
colorWrapperElement.style.backgroundColor = colorPickerElement.value;
updateResFromSlider();
constructPixels();