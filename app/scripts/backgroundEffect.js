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
  var posX = Math.floor((event.pageX - (window.innerWidth / 2)) / window.innerWidth * 100);
  var posY = Math.floor((event.pageY - (window.innerHeight / 2)) / window.innerHeight * 100);

  document.querySelector('.disrupt.right').style.transform = "translate(calc(50% + "+ -posX +"px), calc(-15% + "+ -posY +"px))";
  document.querySelector('.disrupt.left').style.transform = "translate(calc(-50% + "+ posX +"px), calc(15% + "+ posY +"px))";
}

function resetDisrupt(){
  document.querySelector('.disrupt.left').style.transform = "translate(-50%,15%)";
  document.querySelector('.disrupt.right').style.transform = "translate(50%,-15%)";
}
