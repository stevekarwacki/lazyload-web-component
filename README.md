# <lazy-img> Custom HTML Element
A custom HTML element for lazyloading images on scroll or asynchronously

## Include lazy-img.js
Inlcude lazy-img.js in your html as a script:
```
<script src="lazy-img.js"></script>
```

## lazy-img HTML Tag
Use the lazy-img tag similar the img tag:
```
<lazy-img src="http://bit.ly/lazy-kitten" alt="Lazy Kitten"></lazy-img>
```
All attributes on the lazy-img element will be copied to the img element

**Requires valid src attrbiute**

## Async Property
Add the async property to make the lazy-img element load asynchronously instead of on scroll:
```
<lazy-img src="..." async></lazy-img>
<lazy-img src="..." async="true"></lazy-img>
```
