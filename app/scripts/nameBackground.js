// A whole class for this is probably overkill, but w/e

class NameBackground {
  constructor (target) {
    this.nameStrings = [
      'Elouise Baartz',
      'Amira Afiqa Binti Azimi',
      'Joelle Black',
      'Jordan Chee',
      'Pascal Cunin',
      'Samuel Dale',
      'Olivia Garvey',
      'Douglas Haigh',
      'Julia Hall',
      'Bridget Harbourne',
      'Sarah Kramer',
      'Natasha Lawrence',
      'Samuel Mackay',
      'Zachary Mctague',
      'Samuel Mullen',
      'Holly Nash',
      'Kim Nguyen',
      'Adam Nicholson',
      'Caitlin Nicol',
      'Nicole Nughes',
      'Kelvin O\'Shea',
      'Ga-Young Park',
      'James Pike',
      'Elena Prescot',
      'Lincoln Ray-Smith',
      'Miranda Rielly',
      'Brooke Royston',
      'Khairunnissa Ryan',
      'Anna Sachs',
      'Mitchell Schade',
      'Tayla Shelswell',
      'Meaghan Strong',
      'Lily Sullivan',
      'Yu Sun',
      'Tori Walsh',
      'Mitchell Williams',
      'Monica Wong'
    ]
    this.names = null
    this.listMultiplier = 3

    this.w = window.innerWidth
    this.h = window.innerHeight
    this.fontSizePct = 4 // x% of minimum browser width/height

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.targetNode = document.querySelector(target)
  }

  get fontSize () {
    return Math.min(this.w, this.h) * this.fontSizePct / 100
  }

  // INIT FUNCTIONS

  init () {
    this.initCanvas()
    this.makeNameObjects()

    for (let o of this.names) {
      o.update()
      o.draw()
    }
  }

  initCanvas () {
    // Set up and place the canvas
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.canvas.style.position = 'absolute'
    this.canvas.style.width = '100vw'
    this.canvas.style.height = '100vh'

    this.targetNode.insertBefore(this.canvas, this.targetNode.firstChild)
  }

  makeNameObjects () {
    // DisruptName(canvas, text, fontSize, heightOffsetPct)
    let endList = []

    for (let i = 0; i < this.listMultiplier; i++) {
      endList = [
        ...endList,
        ...this.nameStrings
      ]
    }

    this.names = endList.map(name => new DisruptName(this.canvas, name, this.fontSize, 0.2))
  }

  // DRAW FUNCTIONS

  startAnim () {
    window.requestAnimationFrame(this.animate.bind(this))
  }

  animate () {
    this.drawNames()
    window.requestAnimationFrame(this.animate.bind(this))
  }
}

class DisruptName {
  constructor (canvas, name, height, offsetPct) {
    this.name = name.split('')
    this.length = this.name.length
    this.offsets = new Array(this.length).fill(0)
    this.x = 0
    this.y = 0
    this.yStart = 0

    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    this.ctx.fillStyle = '#f00'
    this.ctx.font = `${height}px disruptheavy`

    this.w = this.ctx.measureText(name).width
    this.baseH = height
    this.h = height
    this.offsetPct = offsetPct
    this.offsetChance = 0.2 // min 0, max 1

    this.letterWidths = this.name.map(this.getLetterWidth.bind(this))
  }

  getLetterWidth (char) {
    return this.ctx.measureText(char).width
  }

  makeOffset () {
    let chance = Math.random()
    if (chance <= this.offsetChance / 2) {
      return -1
    } else if (chance > 1 - this.offsetChance / 2) {
      return 1
    }
    return 0
  }

  setOffsets () {
    for (let i = 0; i < this.length; i++) {
      this.offsets[i] = this.makeOffset()
    }
  }

  calcTotalHeight () {
    let up = 0
    let down = 0
    let current = 0

    // Get highest and lowest offsets
    for (let o of this.offsets) {
      current += o
      up = Math.max(up, current)
      down = Math.min(down, current)
    }

    // Convert to physical height as percentage
    return {
      h: 1 + (up * this.offsetPct) + (-down * this.offsetPct),
      start: up * this.offsetPct
    }
  }

  setPos () {
    // Recalculate height since offsets have changed
    let hCalc = this.calcTotalHeight()
    this.h = this.baseH * hCalc.h
    this.yStart = this.baseH * hCalc.start

    // Place on canvas
    this.x = Math.random() * (this.canvas.width - this.w)
    this.y = Math.random() * (this.canvas.height - this.h  - this.baseH)
  }

  update () {
    this.setOffsets()
    this.setPos()
  }

  draw () {
    let dx = 0
    let dy = this.yStart
    for (let i = 0; i < this.length; i++) {
      this.ctx.fillText(this.name[i], this.x + dx, this.y + dy + this.baseH)

      dx += this.letterWidths[i]
      dy += this.offsets[i] * this.offsetPct * this.baseH
    }
  }
}

window.NAME_BG = new NameBackground('main.fullScreenLayout')
