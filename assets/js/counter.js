function addToLoadCount(event) {
    let counterElem = document.getElementById('load-counter');
    let newCount = parseInt(counterElem.getAttribute('data-count')) + 1;
    let pluralMeowString = (newCount === 1) ? ' meow' : ' meows';
    counterElem.setAttribute('data-count', newCount);
    counterElem.innerHTML = newCount + pluralMeowString;
}

window.addEventListener('lazy-img-load', addToLoadCount, true);