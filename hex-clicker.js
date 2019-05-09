//variables
var num = 0;
var gap = 20;
var h, w, point;
var compliments = [
  "click",
  "Going good",
  "marvelous",
  "keep going",
  "click",
  "Brilliant",
  "click",
  "click",
  "click",
  "well done",
  "you can stop now",
  "click",
  "click",
  "click",
  "you should probably stop now",
  "click",
  "click",
  "you will hurt your fingers",
  "click",
  "click",
  "click",
  "Just stop",
  "click",
  "click",
  "click",
  "It's hurting, isn't ?",
  "click",
  "click",
  "click",
  "Looks like you are really enjoying it",
  "still...",
  "stop now"
];

//functions
window.onload = function() {
  point = document.getElementById("point");
  //determine top and left of the button
  h = btn.getBoundingClientRect();
  point.style.top = h.top + h.height / 2 - 14 + "px";

  // function for clicking button
  document.getElementById("btn").addEventListener("click", increasePoint);
  point.addEventListener("click", increasePoint);
};

function increasePoint() {
  //increment in number
  num++;
  point.innerText = num;

  //display of comment on top
  if (num % gap == 0 && compliments[num / gap] != undefined) {
    comm.innerText = compliments[num / gap];
  }

  /* animation stuff */

  //first create a div
  let div = document.createElement("div");

  //fill text and location
  let x =
    h.left +
    h.width / 2 +
    Math.pow(-1, num % 2) * ((Math.random() * h.width) / 2);
  let y = h.top - Math.random() * 30;

  div.innerText = "+1";
  div.style.top = y + "px";
  div.style.left = x + "px";

  //attach a class that perform animation
  div.classList.add("anim");

  //add it to our html body
  document.body.appendChild(div);

  //add event listener that will delete the div once the animation ends
  div.addEventListener("animationend", function() {
    div.parentNode.removeChild(div);
  });
}
