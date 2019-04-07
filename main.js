customElements.define('lazy-img', class extends HTMLElement {
    constructor() {

        super();

        let lazyImage = this;
        lazyImage.img;
        lazyImage.atts;
        lazyImage.shadow = lazyImage.attachShadow({mode: 'open'});
        lazyImage.styles = buildStyles();

        document.onreadystatechange = function () { // wait for dom to load
            if (document.readyState == "interactive") {
                init();
            }
        }

        function init() {
            appendToShadow(lazyImage.styles);
            lazyImage.atts = parseAttributes(lazyImage); // store lazy-img attributes
            if(lazyImage.atts.hasOwnProperty('async') && lazyImage.atts['async'] !== 'false') { // if async attribute exists load image immediately
                lazyImage.img = loadImage();
            }
            else {
                window.addEventListener('scroll', handleScrollEvent, false);
            }
        }

        function parseAttributes(elem) { // loop through elem's attributes and store as key/value pairs
            let attributes = {};
            for (let att, i = 0, atts = elem.attributes, n = atts.length; i < n; i++) { 
                att = atts[i];
                attributes[att.nodeName] = att.nodeValue;
            }
            return attributes;
        }

        function appendToShadow(elem) { // add element to shadow dom
            lazyImage.shadow.appendChild(elem);
        }

        function handleScrollEvent() {
            if (isInViewport(lazyImage)) { // if lazy-img is in view load img
                lazyImage.img = loadImage();
                window.removeEventListener('scroll', handleScrollEvent); // remove listener so we don't load multiple instances
            }
        }

        function isInViewport(elem) { // if elem is within view
            let bounding = elem.getBoundingClientRect();
            return (
                bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        function loadImage() {
            let newImg = buildImage();
            if(newImg) { // if valid img returned append it to shadow dom
                appendToShadow(newImg);
                //removeOriginalAttributes(); // unsure if necessary
                return newImg;
            }
            return false;
        }

        function buildImage() {
            if(isValidExtension(lazyImage.atts['src'])) { // check src points to an image
                const img = document.createElement('img');
                img.onerror = function(message) {
                    loadError(); // if img fails to load, handle error
                };
                for (let property in lazyImage.atts) { // loop through stored lazy-img attributes
                    if (lazyImage.atts.hasOwnProperty(property)) {
                        if(isValidProperty(property)) { // if property is valid add it to img
                            img[property] = lazyImage.atts[property];
                        }
                    }
                }
                return img;
            }
            return false;
        }

        function removeOriginalAttributes() {
            for (let property in lazyImage.atts) { // loop through stored attributes and remove from lazy-img element
                if (lazyImage.atts.hasOwnProperty(property)) {
                    lazyImage.removeAttribute(property);
                }
            }
        }

        function isValidProperty(property) {
            if(property) { // if property is truthy
                if(property === 'async') { // don't add async attribute to img
                    return false;
                }
                else if(lazyImage.atts[property] === '') { // if attribute value is blank warn in console
                    logWarning('Warning, attribute ' + property + ' has a blank value');
                }
                return true;
            }
            logError('Attribute ' + property + ' is invalid');
            return false;
        }

        function isValidExtension(src) {
            if(src) {
                if(/\.(jpe?g|png|gif|bmp)$/i.test(src)) { // check for valid image file extension
                    return true;
                }
                else {
                    logError('lazy-img src attribute requires a valid image file extension');
                }
            }
            else {
                logError('lazy-img requires a src attribute');
            }
            return false;            
        }

        function buildStyles() { // build shadow dom styles
            const style = document.createElement('style');
            style.textContent = `
    :host {
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

        function loadError() {
            logError('The image could not be loaded, please check the value of src is correct');
        }

        function logError(error) {
            console.error(error);
        }

        function logWarning(warning) {
            console.info(warning);
        }

    }

});