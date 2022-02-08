console.log('index.js: loaded');

const heading = document.querySelector('h2');
const headingTesxt = heading?.textContent;

const button = document.createElement('button');
button.textContent = 'Push Me'
document.body.appendChild(button);
