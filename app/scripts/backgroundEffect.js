/* MOUSE EVENT PARALLAX
------------------------------------------------------------------------------------------------- */

window.addEventListener('load', addDisruptListeners)

function addDisruptListeners () {
  // Attach to mousemove
  window.addEventListener('mousemove', setDisruptTarget)
  window.addEventListener('touchmove', setDisruptTarget)

  // Reset when mouse leaves
  window.addEventListener('mouseout', resetDisruptTarget)

  // Start animation
  window.requestAnimationFrame(setDisruptOffset)
}

var OFFSETS = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  cx: window.innerWidth / 2,
  cy: window.innerHeight / 2,
  maxOffset: 16,
  spd: 0.1
}

function setDisruptTarget (evt) {
  // Get mouse offset from center of screen
  let xOff = (OFFSETS.cx - evt.clientX) / OFFSETS.cx
  let yOff = (OFFSETS.cy - evt.clientY) / OFFSETS.cy

  // Set target
  OFFSETS.x = xOff * OFFSETS.maxOffset
  OFFSETS.y = yOff * OFFSETS.maxOffset
}

function resetDisruptTarget (evt) {
  OFFSETS.x = 0
  OFFSETS.y = 0
}

const sign = n => n / Math.abs(n)

function getTransform (negative = false) {
  let neg = (negative ? -1 : 1)
  return `translate(${neg * Math.round(OFFSETS.dx)}px, ${neg * Math.round(OFFSETS.dy)}px)`
}

// Move offset towards target
function setDisruptOffset () {
  OFFSETS.dx += (OFFSETS.x - OFFSETS.dx) * OFFSETS.spd
  OFFSETS.dy += (OFFSETS.y - OFFSETS.dy) * OFFSETS.spd

  // Offset elements with css
  document.querySelector('.details.left').style.transform = getTransform()
  document.querySelector('.details.right').style.transform = getTransform(true)

  window.requestAnimationFrame(setDisruptOffset)
}
