
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

    sometext.style.display = 'none';

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

        this.radius = 3
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

class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }


        const image = new Image()
        image.src = './img/invader1.jpg'
        image.onload = () => {
            const scale = 0.30
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.x,
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

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
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
            x: 0,
            y: 0
        }

        this.invaders = []

        for (let i = 0; i < 10; i++) {
            this.invaders.push(new Invader({
                position: {
                x: i *30,
                y: 0
                }
            }))

        }
        console.log(this.invaders)
    }
    update() {}

}



const player = new Player()
const projectiles = []
const girds = [new Grid()]
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

    girds.forEach(grid => {
        grid.update()
        grid.invaders.forEach(invader => {
            invader.update()
        })
    })
    if (keys.a.pressed && player.position.x >= 0) { // zodat spaceshuttle niet weggaat uit scherm als je a inhoudt
        player.velocity.x = -5
        player.rotation = -0.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {  // zodat spaceshuttle niet weggaat uit scherm als je d inhoudt
        player.velocity.x = 5
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
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