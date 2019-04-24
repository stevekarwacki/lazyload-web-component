class LazyImg extends HTMLElement {

    lazyAtts;
    lazyShadow;

    constructor() {
        super();
        this.lazyShadow = this.attachShadow({mode: 'open'});
        this.lazyAtts = this.parseAttributes(this); // store lazy-img attributes
        this.lazyShadow.appendChild(this.buildStyles(this.lazyAtts));
        if(this.lazyAtts.hasOwnProperty('async') && this.lazyAtts['async'] !== 'false') { // if async attribute exists load image immediately
            let newImg = this.loadImage();
        }
        else {
            const self = this;
            window.addEventListener('scroll', (this.scrollHandler = function() { // store reference to event listener instance as object property
                self.checkLoadImage(); // if lazy-img element is in view, attempt to load it
            }));
            this.checkLoadImage(); // if in view, load lazy-img element immediately
        }
    }

    checkLoadImage() {
        if (this.isInViewport(this)) { // if lazy-img element is in view, load lazy-img
            let lazyImg = this.loadImage();
            if(lazyImg !== false) { // if lazy-img successfully loaded
                window.removeEventListener('scroll', this.scrollHandler); // remove scroll event listener for this instance
                return lazyImg;
            }
        }
        return false;
    }

    loadImage() {
        let lazyImg = this.buildImage();
        if(lazyImg) { // if lazy-img built successfully
            this.lazyShadow.appendChild(lazyImg); // append element to shadow dom
            this.dispatchLoadEvent(); // dispatch custom loaded event
            return lazyImg;
        }
        return false;
    }

    buildImage() {
        if(this.isValidExtension(this.lazyAtts['src'])) { // check src points to an image
            const self = this;
            const newImg = document.createElement('img');
            newImg.onerror = function() {
                self.logError('lazy-img with src \'' + self.lazyAtts['src'] + '\' could not be loaded'); // if img fails to load, handle error
            };
            for (let property in this.lazyAtts) { // loop through stored lazy-img attributes
                if (this.lazyAtts.hasOwnProperty(property)) {
                    if(this.isValidProperty(property)) { // if property is valid add it to img
                        newImg[property] = this.lazyAtts[property];
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
        dynamicStyles = (elemAtts.hasOwnProperty('width')) ? dynamicStyles + 'width: ' + elemAtts.width + 'px;' : dynamicStyles;
        dynamicStyles = (elemAtts.hasOwnProperty('height')) ? dynamicStyles + 'height: ' + elemAtts.height + 'px;' : dynamicStyles;
        styles.textContent = `
        :host {
            ${dynamicStyles}
            display: inline-block;
        }
        `;
        return styles;
    }

    isValidExtension(src) {
        if(src) {
            if(/\.(jpe?g|png|gif|bmp)$/i.test(src)) { // check for valid image file extension
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
            if(property === 'async') { // don't add async attribute to img
                return false;
            }
            return true;
        }
        return false;
    }

    parseAttributes(elem) { // loop through elem's attributes and store as key/value pairs
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
        this.dispatchEvent(new CustomEvent('lazy-img-load', { }));
    }

    logError(error) {
        console.error(error);
    }

}

customElements.define('lazy-img', LazyImg);