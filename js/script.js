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

const player = new Player()
const projectiles = []
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
    projectiles.forEach(projectile => {
        projectile.update()
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