# Lazy-Img Custom Element Web Component
A custom HTML element built using Web Components and Shadow DOM. The lazy-img custom element loads images based on the users' scroll position

## Get started, include lazy-img.js
Inlcude lazy-img.js in your html as a script:
```
<script type="module" src="./lazy-img.js"></script>
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
## Issues
The lazy-img custom element can only load images using the http/https protocols. If you are not on a hosted environment, use polymer serve or localhost
