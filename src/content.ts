
console.log("Hallo Martin");

const div = document.createElement('div');
div.style.position = 'fixed';
div.style.top = '10px';
div.style.left = '10px';
div.style.backgroundColor = 'lightblue';
div.style.padding = '10px';
div.style.zIndex = '1000';
div.textContent = 'Hallo Martin';
document.body.appendChild(div);
