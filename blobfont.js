class Blobfont {
    
    constructor() {
        this.index = 0;
        this.blobfonts = [];
    }

    create(dom, size, color) {
        let text = new BlobfontText(this.index++, size, color);
        blobfont.blobfonts.push(text);
        dom.appendChild(text.getDom());
        return text;
    }

}

class BlobfontText {

    constructor(index, size, color) {
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
        this.text.style.setProperty("--var-height", this.size);
    }

    accept(char) {
        if(char.match(/^[a-zA-Z ._-]$/)) {
            return true;
        } else {
            return false;
        }
    }

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
            default:
                return char;
        }
    }

    getDom() {
        return this.text;
    }

    setText(text, timing) {
        if(!timing) {
            timing = 100;
        }
        text = text.toLowerCase();
        this.nextLetter(text.split(""), timing); 
    }

    /**
     * @param {string[]} text The text
     * @param {number} timing Delay between letters
     * @param {number} current Current char leave blank on first call
     */
    nextLetter(text, timing, current) {
        if(!current) {
            current = 0;
        }
        if(text.length == current) {
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

        if(timing > 0 && letter != "new") {
            setTimeout(() => {this.nextLetter(text, timing, current+1)}, timing)
        } else {
            this.nextLetter(text, timing, current+1);
        }
    }

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

var blobfont = new Blobfont();
