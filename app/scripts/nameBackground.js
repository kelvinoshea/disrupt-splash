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

  // INIT FUNCTIONS

  init () {
    this.initCanvas()
    this.makeTextLines()
    this.makeSrcImage().then(img => {
      return this.disruptSrcImage(img)
    }).then(() => {
      this.ctx.drawImage(this.srcImage, 0, 0)
    }).catch(() => {
      console.log('Error setting up background image.')
    })

    // Start animation
    this.startAnim()
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
    let dxMax = this.fontSize

    let dyOld = 0
    let dy = 0
    let dyMax = this.fontSize / 4

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

    let png = this.canvas.toDataURL()
    this.clearCanvas()

    return new Promise((resolve, reject) => {
      this.srcImage.onload = resolve
      this.srcImage.onerror = resolve
      this.srcImage.src = png
    })
  }

  clearCanvas () {
    this.ctx.clearRect(0, 0, this.w, this.h)
  }

  // DRAW FUNCTIONS

  startAnim () {
    window.requestAnimationFrame(this.animate.bind(this))
  }

  animate () {

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

// This effect is desktop only
if (!IS_MOBILE) {
  window.NAME_BG = new NameBackground('main.fullScreenLayout')
}
