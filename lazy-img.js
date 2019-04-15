class LazyImg extends HTMLElement {

    lazyImg;
    lazyAtts;
    lazyShadow;
    lazyStyles;
    lazyImgLoaded;

    constructor() {
        super();
        this.lazyImgLoaded = false;
        this.lazyShadow = this.attachShadow({mode: 'open'});
        this.lazyStyles = this.buildStyles();
        this.lazyShadow.appendChild(this.lazyStyles);
        this.lazyAtts = this.parseAttributes(this); // store lazy-img attributes
        if(this.lazyAtts.hasOwnProperty('async') && this.lazyAtts['async'] !== 'false') { // if async attribute exists load image immediately
            this.loadImage();
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

    checkLoadImage() {
        if (!this.lazyImgLoaded && this.isInViewport(this)) { // if lazy-img is in view, load img
            this.loadImage();
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

    loadImage() {
        let lazyImg = this.buildImage();
        if(lazyImg) {
            this.lazyImg = lazyImg;
            this.lazyShadow.appendChild(this.lazyImg);
            this.lazyImgLoaded = true;
        }
    }

    buildImage() {
        if(this.isValidExtension(this.lazyAtts['src'])) { // check src points to an image
            let self = this;
            const img = document.createElement('img');
            img.onerror = function(message) {
                self.logError('The image could not be loaded, please check the value of src is correct'); // if img fails to load, handle error
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
            else if(this.lazyAtts[property] === '') { // if attribute value is blank warn in console
                this.logWarning('Warning, attribute ' + property + ' has a blank value');
            }
            return true;
        }
        this.logError('Attribute ' + property + ' is invalid');
        return false;
    }

    logError(error) {
        console.error(error);
    }

    logWarning(warning) {
        console.info(warning);
    }

}
document.onreadystatechange = function () { // wait for dom to load
    if (document.readyState == "complete") {
        customElements.define('lazy-img', LazyImg);
    }
}