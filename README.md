# Blobfont
## Using
1.: Include the style and js into your webpage
```html
<link rel="stylesheet" type="text/css" href="https://spthiel.github.io/blobfont/blobfont.css">
<script src="https://spthiel.github.io/blobfont/blobfont.js"></script>
```
2.: Create a new blobfont text inside the desired object
```js
// dom is the element where the textelements will be placed inside
// size defaults to 80px and accepts integer and px units
// color defaults to black and accepts any valid css color
let font = blobfont.create(<dom>,[size],[color]);
```
3. and onward: Set text
```js
// text is the text that will be drawn
// delay defaults to 100 and is the amount of ms between the drawing of each character
font.setText(<text>,[delay])
```
