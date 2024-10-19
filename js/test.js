
// Functie om de naam op te slaan in localStorage en de gebruiker naar inlog1.html te sturen
function saveName() {
    var name = document.getElementById('name').value;
    if (name) {
        localStorage.setItem('userName', name);
        window.location.href = 'inlog1.html'; // Gaat naar de volgende pagina
    }
}

// Wacht tot de DOM volledig is geladen
document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');

    // Als het formulier op de inlog.html staat
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Voorkomt standaard submitgedrag
            saveName(); // Slaat de naam op en navigeert naar de volgende pagina
        });
    }

    // Als de gebruiker op de inlog1.html pagina is
    var helloElement = document.getElementById('hello');
    if (helloElement) {
        // Verwijder "ACCESS GRANTED" na 2 seconden
        setTimeout(function () {
            var accessText = document.querySelector('.h2');
            if (accessText) {
                accessText.remove(); // Verwijder de 'ACCESS GRANTED' tekst
            }
        }, 2000);

        // Functie om de naam weer te geven
        function displayText() {
            var name = localStorage.getItem('userName') || 'USER';
            document.getElementById("hello").textContent = "WELCOME TO PROJECT EVE, " + name.toUpperCase();
        }

        // Roep de displayText functie aan na 2,5 seconden
        setTimeout(displayText, 2500);
    }
});

setTimeout(() => {
    const sometext = document.getElementById('hello');
}, 5500);

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation

        const image = new Image()
        image.src = './img/spaceship1.jpg'
        image.onload = () => {
            const scale = 0.15
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

        this.radius = 4
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'blue'
        c.fill()
        c.closePath()

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
        image.src = './img/invader6.jpg'
        image.onload = () => {
            const scale = 0.22
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

        const columns = Math.floor(Math.random() * 10 + 1)
        const rows = Math.floor(Math.random() * 5 + 1)

        this.width = columns * 60

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 55,
                            y: y * 40
                        }
                    })
                )
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}


const player = new Player()
const projectiles = []
const grids = [new Grid()]
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
let randomInterval = Math.floor(Math.random() * 500) + 500


function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    player.update()
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
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })
    
            projectiles.forEach((projectile, j) => {
                // Check for collision between projectile and invader
                if (
                    projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                ) {
                    // Remove invader and projectile immediately
                    grid.invaders.splice(i, 1)
                    projectiles.splice(j, 1)
    
                    // Update grid width if invaders remain
                    if (grid.invaders.length > 0) {
                        const firstInvader = grid.invaders[0]
                        const lastInvader = grid.invaders[grid.invaders.length - 1]
                        grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                        grid.position.x = firstInvader.position.x
                    } else {
                        // Remove the grid if no invaders are left
                        grids.splice(gridIndex, 1)
                    }
                }
            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) { // zodat spaceshuttle niet weggaat uit scherm als je a inhoudt
        player.velocity.x = -3
        player.rotation = -0.12
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {  // zodat spaceshuttle niet weggaat uit scherm als je d inhoudt
        player.velocity.x = 3
        player.rotation = 0.12
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    // spawning enemies
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
            console.log(projectiles)
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
capsLockWarning.style.backgroundColor = '#00FFFF';
capsLockWarning.style.color =
    capsLockWarning.style.color = 'white';
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