const COLOR_ARRAY = ["#ff4d4d", "#ff8c00", "#f6d300", "#009959", "#668cff", "#b300b3"];
const MY_NAME = "JOE HEISER";
const NAME_ARRAY = MY_NAME.split("");

let header = document.querySelector('header');

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

//////

for (i = 1; i < 150; i++){
	let confetti = document.createElement("div");
	confetti.setAttribute('class', 'confetti');
	confetti.style.left = Math.floor(Math.random() * header.offsetWidth-10) + "px";
	confetti.style.top = Math.floor(Math.random() * header.offsetHeight-10) + "px";
	confetti.style.transform = "rotate(" + Math.floor(Math.random() * 360) + "deg)";
	randomColor(confetti);
	header.appendChild(confetti);
}

function randomColor(item){
	item.style.backgroundColor = COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)];
}

