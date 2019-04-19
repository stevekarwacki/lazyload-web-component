import { PolymerElement } from '/assets/polymer/polymer-element.js';

class LazyImg extends PolymerElement {

    lazyAtts;
    lazyShadow;
    lazyImgLoaded;

    constructor() {
        super();
        this.lazyImgLoaded = false;
        this.lazyShadow = this.attachShadow({mode: 'open'});
        this.lazyShadow.appendChild(this.buildStyles());
        this.lazyAtts = this.parseAttributes(this); // store lazy-img attributes
        if(this.lazyAtts.hasOwnProperty('async') && this.lazyAtts['async'] !== 'false') { // if async attribute exists load image immediately
            let newImg = this.loadImage();
        }
        else {
            let self = this;
            this.checkLoadImage(); // check if element is already in view
            window.addEventListener('scroll', function() {
                self.checkLoadImage(); // check if element is in view on scroll
            });
        }
    }

    buildStyles() { // build shadow dom styles
        const style = document.createElement('style');
        style.textContent = `
:host {
    min-height: 1px;
    min-width: 1px;
    display: inline-block;
    overflow: hidden;
}
:host img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
}
`;
        return style;
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

    loadImage() {
        let lazyImg = this.buildImage();
        if(lazyImg) {
            let self = this;
            this.lazyImgLoaded = true;
            this.lazyShadow.appendChild(lazyImg);
            let loadEvent = new CustomEvent('lazy-img-load', { 
                detail: {
                    elementData: this
                }
            });
            this.dispatchEvent(loadEvent);
            return true;
        }
        return false;
    }

    checkLoadImage() {
        if (!this.lazyImgLoaded && this.isInViewport(this)) { // if lazy-img is in view, load img
            let newImg = this.loadImage();
        }
    }

    isInViewport(elem) { // if elem is within view
        let bounding = elem.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    buildImage() {
        if(this.isValidExtension(this.lazyAtts['src'])) { // check src points to an image
            let self = this;
            const img = document.createElement('img');
            img.onerror = function() {
                self.logError('lazy-img with src \'' + self.lazyAtts['src'] + '\' could not be loaded'); // if img fails to load, handle error
            };
            for (let property in this.lazyAtts) { // loop through stored lazy-img attributes
                if (this.lazyAtts.hasOwnProperty(property)) {
                    if(this.isValidProperty(property)) { // if property is valid add it to img
                        img[property] = this.lazyAtts[property];
                    }
                }
            }
            return img;
        }
        return false;
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

    logError(error) {
        console.error(error);
    }

}

customElements.define('lazy-img', LazyImg);