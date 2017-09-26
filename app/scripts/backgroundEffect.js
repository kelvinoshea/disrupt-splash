/* MOUSE EVENT PARALLAX
------------------------------------------------------------------------------------------------- */

window.onload = function() {
  window.onmousemove = function(event) {
    moveDisrupt(event);
  }

  window.onmouseout = function() {
    resetDisrupt();
  }

  window.addEventListener("touchmove", function(event) {
    moveDisrupt(event);
  });
};

function moveDisrupt(event) {
  var posX = Math.floor((event.pageX - (window.innerWidth / 2)) / window.innerWidth * 15);
  var posY = Math.floor((event.pageY - (window.innerHeight / 2)) / window.innerHeight * 15);

  document.querySelector('.details.right').style.transform = "translate(calc(60% + "+ -posX +"px), calc(-120% + "+ -posY +"px))";
  document.querySelector('.details.left').style.transform = "translate(calc(-70% + "+ posX +"px), calc(30% + "+ posY +"px))";
}

function resetDisrupt(){
  document.querySelector('.details.left').style.transform = "translate(-70%, 30%)";
  document.querySelector('.details.right').style.transform = "translate(60%, -120%)";
}
