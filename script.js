// defining elements
const container = document.querySelector('#container');

// defining variables
let resolution = 16;
let pixels = [];


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

function constructPixels() {
    for (let i = 0; i < resolution; i++) {
        let list = createElement('ul', 'pixelRow');
        let pixelArray = [];
        for (let x = 0; x < resolution; x++) {
            let item = createElement('div', 'pixel');
            pixelArray.push(item);
            list.appendChild(item);
        }
        container.appendChild(list);
        pixels.push(pixelArray);
    }
}