/* MOUSE EVENT PARALLAX
------------------------------------------------------------------------------------------------- */
window.onload = function() {
 window.onmousemove = function(event) {

   var posX = Math.floor(event.pageX / window.innerWidth * 75);
   var posY = Math.floor(event.pageY / window.innerWidth * 75);


   document.querySelector('.disrupt.right').style.transform = "translate(calc(50% + "+ -posX +"px), calc(-50% + "+ -posY +"px))"
   document.querySelector('.disrupt.left').style.transform = "translate(calc(-50% + "+ posX +"px), calc(-50% + "+ posY +"px))"
 }
}
