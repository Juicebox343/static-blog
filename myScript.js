const COLOR_ARRAY = ["#ff4d4d", "#ff8c00", "#f6d300", "#009959", "#668cff", "#b300b3"];
const MY_NAME = "JOE HEISER";
const NAME_ARRAY = MY_NAME.split("");

let header = document.getElementById('header');
let og_confetti = document.querySelector('.confetti'); 

let newArray = COLOR_ARRAY.slice();

NAME_ARRAY.forEach(function(letter){
	let letterSpan = document.createElement("span"); //Create the DOM elements
	letterSpan.textContent = letter;
	letterSpan.setAttribute('class', 'animate-me');
	document.getElementById("my-name").appendChild(letterSpan);
	if (letter != " "){ 						//Don't assign colors to blank spans
		letterSpan.style.color =  newArray[0];	//assign color
		newArray.push(newArray[0]); 			//push and shift array to allow for infinite loop
		newArray.shift();
	}
});

for (i = 1; i < 75; i++){
	let confetti = document.createElement("div");
	confetti.setAttribute('class', 'confetti');
	confetti.style.left = Math.floor(Math.random() * header.offsetWidth-10) + "px";
	confetti.style.top = Math.floor(Math.random() * screen.height) + "px";
	confetti.style.transform = "rotate(" + Math.floor(Math.random() * 360) + "deg)";
	randomColor(confetti);
	header.appendChild(confetti);
}

function randomColor(item){
	item.style.backgroundColor = COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)];
}







toTopButton = document.querySelector("#to-top")
toTopButton.addEventListener('click', topFunction);

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
	scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    toTopButton.style.display = "block";
  } else {
    toTopButton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	window.scroll({ top: 0, behavior: 'smooth' });
} 