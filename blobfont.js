class Blobfont {

    /**
     * Creates the API class.
     * Don't use this constructor, use the global var blobfont instead
     */
    constructor() {
        /**
         * @private
         * @type {number}
         */
        this.index = 0;
        /**
         * @private
         * @type {BlobfontText[]}
         */
        this.blobfonts = [];
    }

    /**
     * @public
     * @param {Node} dom The node supposed to contain the blobfont object
     * @param {number?} size Height in px
     * @param {string?} color font color
     * @param {string?} bgcolor background color
     * @return {BlobfontText}
     */
    create(dom, size, color, bgcolor) {
        let text = new BlobfontText(this.blobfonts.length, size, color, bgcolor);
        blobfont.blobfonts.push(text);
        dom.appendChild(text.getDom());
        return text;
    }

    /**
     * @param {Node|number} dom the blobfont node
     * @return {BlobfontText|undefined}
     */
    get(dom) {
        if(typeof dom == "number") {
            return this.blobfonts[dom];
        }
        if(!dom.hasAttribute("index")) {
            return undefined;
        }
        return this.blobfonts[dom.getAttribute("index")];
    }

}

class BlobfontText {

    /**
     * Represents a fontobject
     * @param {number} index Index of the node in the array
     * @param {number?} size Height in px
     * @param {string?} color font color
     * @param {string?} bgcolor background color
     */
    constructor(index, size, color, bgcolor) {
        this.bgcolor = bgcolor || "white";
        this.color = color || "black";
        if(size && (size + "").match(/^[0-9]+$/g)) {
            this.size = size + "px";
        } else {
            this.size = size && size.endsWith("px") ? size : "80px";
        }
        this.letters = [];
        this.text = document.createElement("blobfont");
        this.text.className = "blobfont" + index;
        this.text.setAttribute("index", index++);
        this.text.style.setProperty("--var-background", this.color);
        this.text.style.setProperty("--var-squares", this.bgcolor);
        this.text.style.setProperty("--var-height", this.size);
    }

    /**
     * @private
     * @param {string} char Single letter string
     * @return {boolean} Wether the char is accepted in blobfonts
     */
    accept(char) {
        return !!char.match(/^[a-zA-Z !._-]$/);
    }

    /**
     * @public
     * Removes the node
     */
    remove() {
        this.text.parentElement.removeChild(this.text);
    }

    /**
     * @private
     * Translates single characters into class names for nodes
     * @param {string} char Single letter string
     * @return {string} Sanitized class name
     */
    translate(char) {
        switch(char) {
            case ".":
                return "dot";
            case "_":
                return "underline";
            case "-":
                return "dash";
            case " ":
                return "new";
            case "!":
                return "exclamation";
            default:
                return char;
        }
    }

    /**
     * @public
     * @return {Node} The Node of the blobfont
     */
    getDom() {
        return this.text;
    }

    /**
     * @public
     * @return {number} Height of the blobfont
     */
    getSize() {
        return this.size;
    }

    /**
     * @public
     * @param {number|string} size The new height of the font
     */
    setSize(size) {
        if(size && (size + "").match(/^[0-9]+$/g)) {
            this.size = size + "px";
        } else {
            this.size = size && size.endsWith("px") ? size : "80px";
        }
        this.text.style.setProperty("--var-height", this.size);
    }

    /**
     * @public
     * @param {string?} color font color
     * @param {string?} bgcolor background color
     */
    setColor(color, bgcolor) {
        this.bgcolor = bgcolor || "white";
        this.color = color || "black";
        this.text.style.setProperty("--var-background", this.color);
        this.text.style.setProperty("--var-squares", this.bgcolor);
    }

    /**
     * @public
     * Changes the active text
     * @param {string} text The new text of the element
     * @param {number?} timing The delay between each modified/added letter - 100 by default
     */
    setText(text, timing) {
        if(!text) {
            return;
        }
        if(!timing) {
            timing = 100;
        }
        text = text.toLowerCase();
        this.nextLetter(text.split(""), timing);
    }

    /**
     * @private
     * Recursively travels through the letters
     * @param {string[]} text The text
     * @param {number} timing Delay between letters
     * @param {number} current Current char leave blank on first call
     */
    nextLetter(text, timing, current) {
        if(!current) {
            current = 0;
        }
        if(text.length === current) {
            for(let i = this.letters.length-1; i >= current ; i--) {
                this.letters[i].className = "letter new";
                let letter = this.letters[i];
                let dom = this.text;
                setTimeout(() => {
                    dom.removeChild(letter)
                }, 1000);
            }
            this.letters = this.letters.slice(0, current);
            return;
        }
        let letter = text[current];
        if(!this.accept(letter)) {
            letter = "new"
        } else {
            letter = this.translate(letter);
        }
        let dom = this.letters[current] || this.buildLetter();
        setTimeout(() => {dom.className = "letter " + letter}, 100);

        if(timing > 0 && letter !== "new") {
            setTimeout(() => {this.nextLetter(text, timing, current+1)}, timing)
        } else {
            this.nextLetter(text, timing, current+1);
        }
    }

    /**
     * @private
     * Builds nodes for a letter
     * @return {Node} main node of a letter
     */
    buildLetter() {
        let dom = document.createElement("div");
        let blob1 = document.createElement("div");
        let blob2 = document.createElement("div");
        dom.className = "new letter";
        blob1.className = "blob b1";
        blob2.className = "blob b2";
        this.letters.push(dom);
        dom.appendChild(blob1);
        dom.appendChild(blob2);
        this.text.append(dom);
        return dom;
    }

}

const blobfont = new Blobfont();
