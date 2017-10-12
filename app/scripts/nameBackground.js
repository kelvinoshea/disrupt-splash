// A whole class for this is probably overkill, but w/e

class NameBackground {
  constructor (target) {
    this.names = [
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

    this.w = window.innerWidth
    this.h = window.innerHeight
    this.fontSizePct = 2 // x% of minimum browser width/height
    this.lineHeightMult = 1.5

    this.textLines = []
    this.textBgCoverage = 0.6

    this.srcImage = new Image()

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.targetNode = document.querySelector(target)

    this.FPS = 60
    this.dt = 0
    this.lastDraw = null

    // Animation properties
    this.timer = 0
    this.moveTimerMin = 5
    this.moveTimerMax = 6
    this.bumpTimer = 0.02

    this.numColumns = 150
    this.columns = new Array(this.numColumns).fill(0)
    this.columnOffset = this.fontSize * 3/5

    this.bumping = true
    this.bumpCol = 0
    this.bumpLeft = 0
    this.bumpRight = 0
    this.bumpChance = 0.15

    this.setTimer(0)
  }

  get fontSize () {
    return Math.min(this.w, this.h) * this.fontSizePct / 100
  }

  get numLines () {
    return Math.floor(this.h * this.textBgCoverage / this.lineHeight)
  }

  get lineHeight () {
    return this.fontSize * this.lineHeightMult
  }

  get imgHeight () {
    return this.numLines * this.lineHeight
  }

  get ms () {
    return 1000 / this.FPS
  }

  get columnWidth () {
    return this.w / this.numColumns
  }

  // INIT FUNCTIONS

  init () {
    this.initCanvas()
    this.makeTextLines()
    this.makeSrcImage().then(img => {
      return this.disruptSrcImage(img)
    }).then(() => {
      // Initial draw
      this.setupBump()
      this.draw()

      // Start animation
      this.startAnim()
    }).catch(() => {
      console.log('Error setting up background image.')
    })
  }

  initCanvas () {
    // Set up and place the canvas
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.canvas.style.position = 'absolute'
    this.canvas.style.left = '-1vw'
    this.canvas.style.width = '102vw'
    this.canvas.style.height = '100vh'
    this.canvas.style.opacity = 1

    this.ctx.font = `${this.fontSize}px disruptheavy`
    this.ctx.fillStyle = '#20284C'

    this.targetNode.insertBefore(this.canvas, this.targetNode.firstChild)
  }

  joinNames (names) {
    // Add spaces between letters and join with bullet points
    return names.map(n => n.toUpperCase().split('').join(' ')).join('  •  ')
  }

  makeTextLines() {
    let names = []
    let namesLen

    let thisName
    let thisLine = []
    let thisLineLength

    while (this.textLines.length < this.numLines) {
      // Generate a full line of text
      thisLine = []
      thisLineLength = 0

      while (thisLineLength < window.innerWidth) {
        // Refill names array if needed
        if (names.length === 0) {
          names = this.names.slice()
        }

        // Choose a random name
        thisName = names.splice(randInt(0, names.length - 1), 1)[0]
        thisLine.push(thisName)
        thisLineLength = this.ctx.measureText(this.joinNames(thisLine)).width
      }

      this.textLines.push(this.joinNames(thisLine))
    }
  }

  makeSrcImage () {
    this.clearCanvas()

    let textY = (this.h - this.imgHeight) / 2
    let textX

    for (let line of this.textLines) {
      textX = (this.w - this.ctx.measureText(line).width) / 2
      this.ctx.fillText(line, textX, textY + this.fontSize)
      textY += this.lineHeight
    }

    let png = this.canvas.toDataURL()
    this.clearCanvas()

    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => {
        resolve(img)
      }
      img.onerror = reject
      img.src = png
    })
  }

  disruptSrcImage (img) {
    this.clearCanvas()

    let imgY = (this.h - this.imgHeight) / 2
    let fineTune = 0.08
    let lineAdjust = this.lineHeight * (0.5 + fineTune)

    let dx = 0
    let dxMax = this.fontSize * 2

    let dyOld = 0
    let dy = 0
    let dyMax = this.fontSize / 5

    let rectY

    for (let i = 0; i < this.numLines + 1; i++) {
      // Choose y offset for this line
      dy = randInt(-dyMax, dyMax)

      // Draw line
      dx = randInt(-dxMax, dxMax)
      rectY = imgY + i * this.lineHeight - lineAdjust
      this.ctx.drawImage(
        img,
        0, rectY + dyOld, this.w, this.lineHeight + dy - dyOld,
        dx, rectY + dyOld, this.w, this.lineHeight + dy - dyOld
      )

      dyOld = dy
    }

    // Place a guaranteed blue line somewhere
    let guaranteedLine = randInt(0, this.numLines)
    this.ctx.fillRect(0, imgY + guaranteedLine * this.lineHeight + fineTune * this.lineHeight, this.w, this.fontSize)

    // Random chance for any given line to just become a blue rectangle
    let rectChance = 1 / this.numLines * 2
    for (let i = 0; i < this.numLines; i++) {
      if (Math.random() < rectChance && i !== guaranteedLine) {
        this.ctx.clearRect(0, imgY + i * this.lineHeight + fineTune * this.lineHeight, this.w, this.fontSize)
      }
    }

    let png = this.canvas.toDataURL()
    this.clearCanvas()

    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => {
        this.srcImage = img
        resolve()
      }
      img.onerror = reject
      img.src = png
    })
  }

  clearCanvas () {
    this.ctx.clearRect(0, 0, this.w, this.h)
  }

  // DRAW FUNCTIONS

  setTimer (min, max = -1) {
    let time = (max === -1 ? min : randBetween(min, max))
    this.timer = Math.floor(time * this.FPS)
  }

  startAnim () {
    window.requestAnimationFrame(this.animate.bind(this))
  }

  animate (timestamp) {
    if (this.lastDraw === null) { this.lastDraw = timestamp }
    this.dt += timestamp - this.lastDraw

    // Too much inactive tab time causes large delta and freezes the site
    if (this.dt > this.ms * this.FPS) {
      // If we have to do more than 1 second of logic, just skip it all
      this.dt = this.ms
    }

    // Run logic at fps
    while (this.dt > 0) {
      this.dt -= this.ms

      if (--this.timer <= 0) {
        if (!this.bumping) {
          this.setTimer(this.moveTimerMin, this.moveTimerMax)
          this.setupBump()
        } else {
          this.setTimer(this.bumpTimer)
          this.bumping = this.doBump()
          this.draw()
        }
      }
    }

    // Schedule next update
    this.lastDraw = timestamp
    window.requestAnimationFrame(this.animate.bind(this))
  }

  bump () {
    let c = Math.random()
    if (c < this.bumpChance) {
      return 1 * (Math.random() < 0.5 ? 1 : -1)
    }
    return 0
  }

  setupBump () {
    this.bumping = true
    // this.bumpCol = randInt(0, this.numColumns - 1)
    this.bumpCol = Math.floor(this.numColumns / 2)
    this.columns[this.bumpCol] = 0

    this.bumpLeft = this.bumpCol
    this.bumpRight = this.bumpCol
  }

  // Return true if there are still more bumps left
  doBump () {
    // Bump sides
    let bump

    if (--this.bumpLeft >= 0) {
      bump = this.bump()
      this.columns[this.bumpLeft] = this.columns[this.bumpLeft + 1] + bump

      // Adjust bump tail for smoother animation
      if (this.bumpLeft > 0) {
        for (let i = this.bumpLeft - 1; i >= 0; i--) {
          // Is this out of range of the previous column?
          let diff = this.columns[i] - this.columns[i + 1]
          if (Math.abs(diff) > 1) {
            this.columns[i] = this.columns[i + 1] + (diff / Math.abs(diff))
          }
        }
      }
    }
    if (++this.bumpRight < this.numColumns) {
      bump = this.bump()
      this.columns[this.bumpRight] = this.columns[this.bumpRight - 1] + bump

      // Adjust bump tail for smoother animation
      if (this.bumpRight < this.numColumns - 1) {
        for (let i = this.bumpRight + 1; i < this.numColumns; i++) {
          // Is this out of range of the previous column?
          let diff = this.columns[i] - this.columns[i - 1]
          if (Math.abs(diff) > 1) {
            this.columns[i] = this.columns[i - 1] + (diff / Math.abs(diff))
          }
        }
      }
    }

    return (this.bumpLeft >= 0 || this.bumpRight < this.numColumns)
  }

  draw () {
    this.clearCanvas()
    for (let i = 0; i < this.numColumns; i++) {
      this.ctx.drawImage(
        this.srcImage,
        i * this.columnWidth, 0, this.columnWidth, this.h,
        i * this.columnWidth, this.columnOffset * this.columns[i], this.columnWidth, this.h
      )
    }
  }
}

function randBetween(min, max) {
  return min + Math.random() * (max - min + 1)
}

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

// This effect is desktop only
if (!IS_MOBILE) {
  window.NAME_BG = new NameBackground('main.fullScreenLayout')
}
