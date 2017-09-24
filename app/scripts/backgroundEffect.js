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

/* DISRUPT NODES
------------------------------------------------------------------------------------------------- */

const NODE_SETTINGS = {
  fgColour: '#fff',
  bgColour: '#000',
  nodeRadius: 12,
  nodeStroke: 2,
  opacity: 0.02
}

/**
 * MOUSE class, for basic mouse tracking
 */

class Mouse {
  constructor () {
    this.x = -1000
    this.y = -1000

    window.addEventListener('mousemove', e => {
      this.x = e.clientX
      this.y = e.clientY
    })
  }

  get pos () {
    return {
      x: this.x,
      y: this.y
    }
  }
}

const MOUSE = new Mouse()

/**
 * Trigonometry class
 */

class Trig {
  static distanceBetween (p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }

  static angleBetween (p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  }

  static lengthdirX (len, dir) {
    return len * Math.cos(dir)
  }

  static lengthdirY (len, dir) {
    return len * Math.sin(dir)
  }
}

/**
 * Tween class, for smooth animations
 */

class Tween {
  static parabola (x) {
    return -Math.pow(x - 1, 2) + 1
  }

  static sine (x) {
    return 0.5 * Math.sin(Math.PI * (x - 0.5)) + 0.5
  }
}

/**
 * Node class, tracks position and draws itself
 */

class DotNode {
  constructor (ctx, x, y, fixed, settings) {
    this.ctx = ctx
    this.canLog = false

    this.fixed = fixed

    this.radius = settings.radius
    this.stroke = settings.stroke
    this.fgColour = settings.fgColour
    this.bgColour = settings.bgColour

    let xOffset = settings.maxSpawnOffset * (Math.random() * 2 - 1)
    let yOffset = settings.maxSpawnOffset * (Math.random() * 2 - 1)

    this.xOrigin = x + (fixed ? 0 : xOffset)
    this.yOrigin = y + (fixed ? 0 : yOffset)
    this.xTarget = this.xOrigin
    this.yTarget = this.yOrigin
    this.x = this.xOrigin
    this.y = this.yOrigin
    this.dx = 0
    this.dy = 0

    this.active = false

    // Movement
    this.detectDistance = settings.detectDistance
    this.maxDisplacement = settings.maxDisplacement

    this.spdAdvance = settings.spdAdvance
    this.spdRetreat = settings.spdRetreat
  }

  get origin () {
    return {
      x: this.xOrigin,
      y: this.yOrigin
    }
  }

  get pos () {
    return {
      x: this.x,
      y: this.y
    }
  }

  get targetPos () {
    return {
      x: this.xTarget,
      y: this.yTarget
    }
  }

  // How fast should the node be moving?
  get speed () {
    return this.active ? this.spdAdvance : this.spdRetreat
  }

  // Tell the point if it is in proximity to the mouse
  setActive () {
    let distToMouse = Trig.distanceBetween(MOUSE.pos, this.origin)
    this.active = (distToMouse <= this.detectDistance && !this.fixed)
  }

  // Tell the node what to move towards
  setTarget () {
    if (this.active) {
      let len = Trig.distanceBetween(MOUSE.pos, this.pos)
      let dir = Trig.angleBetween(MOUSE.pos, this.origin)

      let maxLen = Math.min(this.maxDisplacement, len)
      this.xTarget = this.xOrigin + Trig.lengthdirX(maxLen, dir)
      this.yTarget = this.yOrigin + Trig.lengthdirY(maxLen, dir)
    } else {
      this.xTarget = this.xOrigin
      this.yTarget = this.yOrigin
    }
  }

  update () {
    // Set active state and target
    this.setActive()
    this.setTarget()

    let distToTarget = Trig.distanceBetween(this.pos, this.targetPos)
    let angleToTarget = Trig.angleBetween(this.pos, this.targetPos)

    this.dx = Trig.lengthdirX(distToTarget * this.speed, angleToTarget)
    this.dy = Trig.lengthdirY(distToTarget * this.speed, angleToTarget)

    this.x += this.dx
    this.y += this.dy
  }

  draw () {
    if (!this.fixed) {
      // Formatting
      this.ctx.fillStyle = this.fgColour

      // Main circle
      this.ctx.beginPath()
      this.ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, Math.PI * 2)
      this.ctx.fill()

      // Circle inactive "fill"
      if (!this.active) {
        this.ctx.fillStyle = this.bgColour
        let innerRad = this.radius - this.stroke

        this.ctx.beginPath()
        this.ctx.ellipse(this.x, this.y, innerRad, innerRad, 0, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
  }

  log (o) {
    if (this.canLog) {
      console.dir(o)
    }
  }
}

/**
 * Container for nodes, handles animation loop
 */

class NodeGrid {
  constructor (insertAt = 'body') {
    // Animation constants
    this.fps = 60

    this.settings = NODE_SETTINGS
    // Canvas
    this.canvas = document.createElement('canvas')
    this.w = window.innerWidth
    this.h = window.innerHeight

    // Style canvas
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.canvas.style.position = 'absolute'
    this.canvas.style.width = '100vw'
    this.canvas.style.height = '100vh'
    this.canvas.style.opacity = this.settings.opacity

    // Append canvas to DOM
    let parent = document.querySelector(insertAt)
    parent.insertBefore(this.canvas, parent.firstChild)

    // Canvas context
    this.ctx = this.canvas.getContext('2d')

    this.gridSize = 100
    this.rows = Math.floor(this.h / this.gridSize) + 2
    this.cols = Math.floor(this.w / this.gridSize) + 2
    this.x = (this.w - (this.cols - 1) * this.gridSize) / 2
    this.y = (this.h - (this.rows - 1) * this.gridSize) / 2

    this.nodes = []
    this.createNodes()
    this.nodes[this.rows + 1].canLog = true

    this.timestamp = 0
    this.dt = 0
    this.oneSecond = 1000 / this.fps

    // Start animation
    window.requestAnimationFrame(this.animLoop.bind(this))
  }

  /**
   * Handle node grid
   */

  get nodeSettings () {
    return {
      // Visual settings
      radius: this.settings.nodeRadius,
      stroke: this.settings.nodeStroke,
      fgColour: this.settings.fgColour,
      bgColour: this.settings.bgColour,

      // Position-related settings
      detectDistance: this.gridSize * 2,
      maxDisplacement: this.gridSize,
      maxSpawnOffset: this.gridSize / 2,

      // Speed settings
      spdAdvance: 0.1,
      spdRetreat: 0.05
    }
  }

  getNodePoint (nodeIndex) {
    return this.nodes[nodeIndex].pos
  }

  createNodes () {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let fixed = (
          x === 0 || y == 0 ||
          x === this.cols - 1 || y === this.rows - 1
        )
        this.nodes.push(new DotNode(
          this.ctx,
          this.x + x * this.gridSize,
          this.y + y * this.gridSize,
          fixed,
          this.nodeSettings
        ))
      }
    }
  }

  /**
   * Drawing functions
   */

  drawLine (startIndex, horizontal) {
    // Move to start of line
    let p = this.getNodePoint(startIndex)
    this.ctx.moveTo(p.x, p.y)

    // Set increments
    let inc = horizontal ? this.rows : 1
    let upper = horizontal ? startIndex + this.cols * this.rows : startIndex + this.rows

    for (let i = startIndex + inc; i < upper; i += inc) {
      p = this.getNodePoint(i)
      this.ctx.lineTo(p.x, p.y)
    }

    this.ctx.stroke()
  }

  draw () {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.w, this.h)

    // Set line formatting
    this.ctx.strokeStyle = this.settings.fgColour
    this.ctx.lineWidth = this.settings.connectionStroke

    // Vertical lines
    for (let x = this.cols - 2; x > 0; x--) {
      this.drawLine(x * this.rows, false)
    }

    // Horizontal lines
    for (let y = 1; y < this.rows - 1; y++) {
      this.drawLine(y, true)
    }

    // Draw nodes
    for (let node of this.nodes) {
      node.draw()
    }
  }

  /**
   * Handle animation and update loops
   */

  updateLoop () {
    for (let node of this.nodes) {
      node.update()
    }
  }

  animLoop (timestamp) {
    // Delta timing
    this.dt += timestamp - this.timestamp
    while (this.dt > this.oneSecond) {
      // Run animation logic
      this.updateLoop()
      this.dt -= this.oneSecond
    }

    // Draw once per animation frame
    this.draw()

    this.timestamp = timestamp
    window.requestAnimationFrame(this.animLoop.bind(this))
  }
}

// Start it all going
const GRID = new NodeGrid('#contentContainer')
