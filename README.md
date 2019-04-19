# Lazy-Img Custom Element Web Component
A custom HTML element built using Web Components and Shadow DOM. The lazy-img custom element loads images based on the users' scroll position

## Get started, include lazy-img.js
Inlcude lazy-img.js in your html as a script:
```
<script type="module" src="./components/lazy-img.js"></script>
```

## Use the lazy-img HTML Element
Use the lazy-img element like you use the img element:
```
<lazy-img src="https://funlava.com/wp-content/uploads/2013/03/cute-cats-wallpaper.jpg" alt="Lazy Kitten"></lazy-img>
```
All attributes on the lazy-img element will be copied to the new img element

**Lazy-Img requires valid src attrbiute**

## Async Property
Add the async property to make the lazy-img element load it's respective img asynchronously instead of loading on scroll position:
```
<lazy-img src="https://funlava.com/wp-content/uploads/2013/03/cute-cats-wallpaper.jpg" async></lazy-img>
<lazy-img src="https://funlava.com/wp-content/uploads/2013/03/cute-cats-wallpaper.jpg" async="true"></lazy-img>
```

## Custom Load Event
When a lazy-img element successfully generates an img, it dispatches a custom event called lazy-img-load. The event object that is passed to the event handler contains a property (elementRef) that is a reference to the loaded lazy-img element. This property may be accessed in an event handler like this: event.detail.elementRef

## Issues
The lazy-img custom element can only load images using the http/https protocols
