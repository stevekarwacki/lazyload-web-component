class LazyImg extends HTMLElement {

    clonedAttributes; // persistent access to attributes

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.clonedAttributes = this.parseAttributes(this); // translate lazy-img html attributes to key/value pairs
        this.shadowRoot.appendChild(this.buildStyles(this.clonedAttributes));
        if(this.clonedAttributes.hasOwnProperty('async') && this.clonedAttributes['async'] !== 'false') { // if async attribute exists load immediately
            let newImg = this.loadImage();
        }
        else {
            const self = this;
            window.addEventListener('scroll', (this.scrollHandler = function() { // this.scrollHandler references this event listener instance
                self.checkLoadImage(); // if lazy-img element is in view, attempt to load it
            }));
            this.checkLoadImage(); // if in view on page load, load lazy-img element immediately
        }
    }

    checkLoadImage() {
        if (this.isInViewport(this)) { // if lazy-img element is in view, load lazy-img
            let lazyImg = this.loadImage();
            if(lazyImg !== false) { // if lazy-img successfully loaded
                window.removeEventListener('scroll', this.scrollHandler); // remove scroll event listener
                return lazyImg;
            }
        }
        return false;
    }

    loadImage() {
        let lazyImg = this.buildImage(); // generate img element
        if(lazyImg) { // if img built successfully
            this.shadowRoot.appendChild(lazyImg); // append element to shadow dom
            this.dispatchLoadEvent(); // dispatch custom load event
            return lazyImg;
        }
        return false;
    }

    buildImage() {
        if(this.isValidExtension(this.clonedAttributes['src'])) { // check src has valid image extension
            const self = this;
            const newImg = document.createElement('img');
            newImg.onerror = function() {
                self.logError('lazy-img with src \'' + self.clonedAttributes['src'] + '\' could not be loaded'); // if img fails to load, handle error
            };
            for (let property in this.clonedAttributes) { // loop through stored lazy-img attributes
                if (this.clonedAttributes.hasOwnProperty(property)) {
                    if(this.isValidProperty(property)) { // if property is valid add it to img
                        newImg[property] = this.clonedAttributes[property];
                    }
                }
            }
            return newImg;
        }
        return false;
    }

    buildStyles(elemAtts) { // build shadow dom styles
        const styles = document.createElement('style');
        let dynamicStyles = '';
        // force lazy-img to respect width and height attributes
        dynamicStyles += (elemAtts.hasOwnProperty('width')) ? 'width: ' + elemAtts.width + 'px;' : '';
        dynamicStyles += (elemAtts.hasOwnProperty('height')) ? 'height: ' + elemAtts.height + 'px;' : '';
        styles.textContent = `
        :host {
            display: inline-block;
            ${dynamicStyles}
        }
        :host(:defined) {
            height: auto;
        }
        :host img {
            display: block;
            max-width: 100%;
            max-height: 100%;
        }
        `;
        return styles;
    }

    isValidExtension(src) {
        if(src) {
            if(/\.(jpe?g|png|gif|bmp)$/i.test(src)) { // check for valid image file extension - TODO change to find extension anywhere in url path
                return true;
            }
            else {
                this.logError('lazy-img src attribute requires a valid image file extension');
            }
        }
        else {
            this.logError('lazy-img requires a src attribute');
        }
        return false;            
    }

    isValidProperty(property) {
        if(property) { // if property is truthy
            switch(property) { // don't clone these properties into generated img element
                case 'async': 
                    return false;
                case 'width':
                    return false;
                case 'height':
                    return false;
                default:
                    return true;
            }
        }
        return false;
    }

    parseAttributes(elem) { // loop through elem's attributes and return as key/value pairs
        let attributes = {};
        let atts = elem.attributes;
        for (let i = 0, att; i < atts.length; i++) { 
            att = atts[i];
            attributes[att.nodeName] = att.nodeValue;
        }
        return attributes;
    }

    isInViewport(elem) { // if elem is partially within view
        let bounding = elem.getBoundingClientRect();
        let windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        return (
            (bounding.top <= windowHeight) && ((bounding.top + bounding.height) >= 0)
        );
    }

    dispatchLoadEvent() { // dispatch custom event when lazy-img loads successfully
        let loadEvent = new CustomEvent('lazy-img-load', { 
            detail: {
                elementRef: this // send reference to this lazy-img element
            }
        });
        window.dispatchEvent(loadEvent);
    }

    logError(error) {
        console.error(error);
    }

}

customElements.define('lazy-img', LazyImg);