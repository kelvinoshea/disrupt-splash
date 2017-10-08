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
    this.names = []

    // A full set of names will be created for each colour
    // Layered in the same order
    this.colours = [
      '181D38',
      '1C2242',
      '20284C',
    ]

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
      o.draw()
    }

    // Start animation
    this.startAnim()
  }

  initCanvas () {
    // Set up and place the canvas
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.canvas.style.position = 'absolute'
    this.canvas.style.width = '100vw'
    this.canvas.style.height = '100vh'

    // Tweak bg visibility here
    this.canvas.style.opacity = 1

    this.targetNode.insertBefore(this.canvas, this.targetNode.firstChild)
  }

  makeNameObjects () {
    // DisruptName(canvas, text, fontSize, heightOffsetPct)
    for (let i = 0; i < this.colours.length; i++) {
      this.names.push(...this.nameStrings.map(name => new DisruptName(this.canvas, name, this.fontSize, this.colours[i], 0.2)))
    }
  }

  // DRAW FUNCTIONS

  startAnim () {
    window.requestAnimationFrame(this.animate.bind(this))
  }

  animate () {
    let update = false
    for (let name of this.names) {
      update = update || name.update()
    }

    // Redraw if at least one name updated
    if (update) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      for (let name of this.names) {
        name.draw()
      }
    }

    // Schedule next update
    window.requestAnimationFrame(this.animate.bind(this))
  }
}

function randBetween(min, max) {
  return min + Math.random() * (max - min + 1)
}

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

class DisruptName {
  constructor (canvas, name, height, colour, offsetPct) {
    this.name = name.split('')
    this.length = this.name.length
    this.x = 0
    this.y = 0

    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    this.colour = colour
    this.ctx.font = `${height}px disruptheavy`

    this.offset = new Array(this.length).fill(0)
    this.offsetPct = offsetPct
    this.offsetChance = 0.15 // min 0, max 1
    this.offsetBound = 2

    this.w = this.ctx.measureText(name).width

    this.baseH = height
    this.h = height * (1 + this.offsetBound*2 * this.offsetPct)
    this.yStart = this.offsetPct * this.offsetBound

    this.letterWidths = this.name.map(this.getLetterWidth.bind(this))

    // Update time range, in seconds
    this.updateMin = 5
    this.updateMax = 30
    this.setUpdateCounter()

    // Set pos on canvas
    this.setOffsets()
    this.setPos()
  }

  getLetterWidth (char) {
    return this.ctx.measureText(char).width
  }

  makeOffset () {
    let chance = Math.random()
    let out = 0

    if (chance <= this.offsetChance) {
      out = 1 * (Math.random() > 0.5 ? 1 : -1)
    }
    return out
  }

  setOffsets () {
    let current = randInt(-1, 1)
    for (let i = 0; i < this.length; i++) {
      this.offset[i] = current
      current = Math.max(-this.offsetBound, Math.min(current + this.makeOffset(), this.offsetBound))
    }
  }

  _setXY () {
    this.x = Math.random() * (this.canvas.width - this.w)
    this.y = Math.random() * (this.canvas.height - this.h)
  }

  setPos () {
    if (IS_MOBILE) {
      // Don't worry about ignoring orb on mobile
      this._setXY()
    } else {
      // Place on canvas
      // Let's try and keep stuff out from behind the orb
      let orbSide = Math.min(this.canvas.width, this.canvas.height) * .65
      let orbX = (this.canvas.width - orbSide) / 2
      let orbY = (this.canvas.height - orbSide) / 2

      do {
        this._setXY()
      } while (
        (this.x > (orbX - this.w) && this.x < orbX + orbSide &&
        this.y > (orbY - this.h) && this.y < orbY + orbSide)
      )
    }
  }

  setUpdateCounter () {
    // Be lazy and assume ~60 FPS
    let FPS = 60
    this.updateCounter = Math.floor(randBetween(this.updateMin, this.updateMax) * FPS)
  }

  update () {
    // Return true if update happened
    // so parent can redraw canvas
    if (--this.updateCounter === 0) {
      this.setOffsets()
      this.setUpdateCounter()
      return true
    }
    return false
  }

  draw () {
    this.ctx.fillStyle = `#${this.colour}`
    let dx = 0
    let dy = 0
    for (let i = 0; i < this.length; i++) {
      dy = this.offset[i] * this.offsetPct * this.baseH
      this.ctx.fillText(this.name[i], this.x + dx, this.y + dy + this.baseH)
      dx += this.letterWidths[i]
    }
  }
}

window.NAME_BG = new NameBackground('main.fullScreenLayout')
