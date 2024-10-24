const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scoreEl = document.querySelector('#scoreEl')
const muziek = new Audio('sounds/audio1.mp3')

canvas.width = 1434
canvas.height = 806




class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation
        this.opacity = 1

        const image = new Image()
        image.src = './img/spaceshuttle.png'
        image.onload = () => {
            const scale = 0.10
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {

        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2

        )
        c.rotate(this.rotation)

        c.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2

        )

        if (this.image) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
            c.restore()
        }
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x


            if (this.position.x < 0) this.position.x = 0
            if (this.position.x + this.width > canvas.width)
                this.position.x = canvas.width - this.width
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.radius = 5
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()

    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({ position, velocity, radius, color, fades}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()

    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if (this.fades) this.opacity -= 0.01
    }
}

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.width = 5
        this.height = 20

    }

    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0
        }


        const image = new Image()
        image.src = './img/eindbaas.png'
        image.onload = () => {
            const scale = 0.20
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {


        if (this.image) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }
    }

    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new InvaderProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 0,
                    y: 2
                }
            })
        )
    }
}


class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 2,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 5 + 2)
        const rows = Math.floor(Math.random() * 2 + 1)
        this.width = columns * 110
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: x * 120,
                        y: y * 90
                    }
                }))
            }
        }
        console.log(this.invaders)
    }
    update() {
        this.position.x += this.velocity.x;

        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 50;
        }
    }
}





const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: true
}

let score = 0

for (let i = 0; i <125; i++){
    particles.push(new Particle({
      position:   {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
      },
      
      velocity: {
          x: 0,
          y: 0.4
      },
      radius: Math.random() * 2,
      color: 'white'
    }))
}

function createParticles({object, color, fades}) {
    for (let i = 0; i <15; i++){
        particles.push(new Particle({
          position:   {
              x: object.position.x + object.width / 2,
              y: object.position.y + object.height / 2
          },
          
          velocity: {
              x: (Math.random() -0.5)* 2,
              y: (Math.random() -0.5)* 2
          },
          radius: Math.random() * 3,
          color: color || 'purple',
          fades
        }))
      }
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    muziek.play();
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }
        if (particle.opacity<= 0){
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0);
        } else {
            particle.update()
        }
    })


    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (
            invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else {
            invaderProjectile.update()
        }

        if (invaderProjectile.position.y + invaderProjectile.height >=
            player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width
            >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width) {

            console.log('you lose')
            setTimeout(() => {
                invaderProjectiles.splice(index,1 )
                player.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() => {
                game.active = false
            }, 1000)
            createParticles({
                object: player,
                color: 'white',
                fades: true
            })
        }
    })



    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }

    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        //spawning projectiles
        if (frames % 200 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            // projectiles raken enemy
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <=
                    invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                    invader.position.x &&
                    projectile.position.x - projectile.radius <=
                    invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                ) {

                    

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2
                        ) => invader2 === invader
                        )

                        const projectileFound = projectiles.find(
                            projectile2 => projectile2 === projectile)

                        // remove invader and projectile
                        if (invaderFound && projectileFound) {
                            score += 100
                            console.log(score)
                            scoreEl.innerHTML = score
                            createParticles({
                                object: invader,
                                fades: true
                            })
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x + lastInvader.width - firstInvader.position.x
                             grid.position.x = firstInvader.position.x 
                            } else {
                                grids.splice(gridIndex, 1)
                            }

                        }
                    })
                }
            })

        })
    })

    if (keys.a.pressed && player.position.x >= 0) { // zodat spaceshuttle niet weggaat uit scherm als je a inhoudt
        player.velocity.x = -5
        player.rotation = -0.20
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {  // zodat spaceshuttle niet weggaat uit scherm als je d inhoudt
        player.velocity.x = 5
        player.rotation = 0.20
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    // spawning new enemies
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
        console.log(randomInterval)
    }


    frames++
}

animate()

addEventListener('keydown', ({ key }) => {
    if (game.over) return
    switch (key) {
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -8
                }
            }))
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

// Check for Caps Lock during keypresses
addEventListener('keydown', (event) => {
    // Check if Caps Lock is on
    if (event.getModifierState('CapsLock')) {
        alert('Caps Lock is ON');
    }
});

addEventListener('keyup', (event) => {
    // Check again on key up to handle the case when Caps Lock is turned off
    if (!event.getModifierState('CapsLock')) {
        console.log('Caps Lock is OFF');
    }
});

// Create a caps lock warning element
const capsLockWarning = document.createElement('div');
capsLockWarning.innerText = 'Caps Lock is ON';
capsLockWarning.style.position = 'fixed';
capsLockWarning.style.borderRadius = '10px'
capsLockWarning.style.top = '10px';
capsLockWarning.style.right = '10px';
capsLockWarning.style.padding = '10px';
capsLockWarning.style.backgroundColor = 'orange';
capsLockWarning.style.color = 'black';
capsLockWarning.style.display = 'none';  // Hidden by default
document.body.appendChild(capsLockWarning);

// Check for Caps Lock during keypresses
addEventListener('keydown', (event) => {
    if (event.getModifierState('CapsLock')) {
        capsLockWarning.style.display = 'block';  // Show the warning
    } else {
        capsLockWarning.style.display = 'none';   // Hide the warning
    }
});

addEventListener('keyup', (event) => {
    if (!event.getModifierState('CapsLock')) {
        capsLockWarning.style.display = 'none';  // Hide warning when Caps Lock is off
    }
});