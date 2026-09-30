const terminalOutput = document.getElementById("terminal-output");
const terminalInput = document.getElementById("terminal-command");

const terminalCommands = {
    help: `Available commands:
  help       - Show available commands
  about      - About Hazeem
  skills     - Technical skills
  projects   - Featured projects
  education  - Education details
  contact    - Contact information
  whoami     - Show user identity
  clear      - Clear terminal`,

    about: `Mohammed Hazeem Shafi

2nd Year Computer Science Engineering student
at P.A. College of Engineering.

Interested in:
- Full-stack web development
- Python
- JavaScript
- Software development
- Modern user interfaces`,

    skills: `Technical Stack

Languages:
- JavaScript
- Python
- C
- HTML
- CSS

Technologies:
- React
- Node.js
- Express
- MySQL
- Git
- Docker
- Linux`,

    projects: `Featured Projects

1. Snan Groceries
   Business web application

   Website:
   https://snan-grocery.netlify.app/`,

    education: `Education

P.A. College of Engineering
Bachelor of Engineering - Computer Science
Status: 2nd Year

G.H.S.S Chemnad
Higher Secondary Education
Status: Completed`,

    contact: `Contact

Email:
stryker461@gmail.com

LinkedIn:
linkedin.com/in/mohammed-hazeem-shafi-b06aa9386

GitHub:
https://github.com/stryker461-cpu`,

    whoami: "guest@hazeem"
};

function addTerminalLine(text, showPrompt = false) {
    const line = document.createElement("div");
    line.className = "terminal-line";

    if (showPrompt) {
        const prompt = document.createElement("span");
        prompt.className = "terminal-prompt";
        prompt.textContent = "guest@hazeem:~$";
        line.appendChild(prompt);
    }

    const output = document.createElement("span");
    output.className = "terminal-output";
    output.textContent = text;

    line.appendChild(output);
    terminalOutput.appendChild(line);
}

function printTerminalOutput(text) {
    text.split("\n").forEach(line => {
        addTerminalLine(line);
    });

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function executeCommand(command) {
    const value = command.trim().toLowerCase();

    if (!value) return;

    addTerminalLine(command, true);

    if (value === "clear") {
        terminalOutput.innerHTML = "";
        return;
    }

    if (terminalCommands[value]) {
        printTerminalOutput(terminalCommands[value]);
    } else {
        printTerminalOutput(
            `Unknown command: ${command}
Type 'help' to see available commands.`
        );
    }
}

terminalInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        executeCommand(terminalInput.value);
        terminalInput.value = "";
    }
});

printTerminalOutput("Welcome to Hazeem's terminal.");
printTerminalOutput("Type 'help' to get started.");

const canvas = document.getElementById("background-canvas");

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 50;

function resizeBackground() {
    const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    renderer.setPixelRatio(pixelRatio);

    renderer.setSize(
        window.innerWidth,
        window.innerHeight,
        false
    );

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
}

resizeBackground();

const matrixCharacters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=%アイウエオカキクケコサシスセソタチツテト";

const greenTextures = {};
const whiteTextures = {};

function createCharacterTexture(character, color, glow) {
    const textureCanvas = document.createElement("canvas");

    textureCanvas.width = 64;
    textureCanvas.height = 64;

    const context = textureCanvas.getContext("2d");

    if (glow) {
        context.shadowColor = color;
        context.shadowBlur = 10;
    }

    context.fillStyle = color;
    context.font = "bold 48px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(character, 32, 32);

    return new THREE.CanvasTexture(textureCanvas);
}

function getCharacterTexture(character, white = false) {
    const textureCache = white
        ? whiteTextures
        : greenTextures;

    if (!textureCache[character]) {
        textureCache[character] =
            createCharacterTexture(
                character,
                white ? "#ffffff" : "#00ff41",
                !white
            );
    }

    return textureCache[character];
}

const matrixLines = [];

const lineCount =
    Math.ceil(window.innerWidth / 25);

for (let i = 0; i < lineCount; i++) {
    const length =
        Math.floor(Math.random() * 20) + 15;

    const line = new THREE.Group();

    for (let j = 0; j < length; j++) {
        const character =
            matrixCharacters[
                Math.floor(
                    Math.random() *
                    matrixCharacters.length
                )
            ];

        const material =
            new THREE.MeshBasicMaterial({
                map: getCharacterTexture(
                    character,
                    j === 0
                ),
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.5),
            material
        );

        mesh.position.y = -j * 1.6;

        line.add(mesh);
    }

    line.position.set(
        (Math.random() - 0.5) * 150,
        Math.random() * 100 - 50,
        Math.random() * 100 - 80
    );

    line.userData = {
        speed: Math.random() * 0.4 + 0.3,
        timer: 0,
        interval: Math.random() * 10 + 5
    };

    scene.add(line);
    matrixLines.push(line);
}

let mouseX = 0;

document.addEventListener("mousemove", event => {
    mouseX =
        event.clientX / window.innerWidth - 0.5;
});

function animateMatrix() {
    requestAnimationFrame(animateMatrix);

    matrixLines.forEach(line => {
        line.position.y -= line.userData.speed;

        if (line.position.y < -70) {
            line.position.y = 70;

            line.position.x =
                (Math.random() - 0.5) * 150;
        }

        line.position.x +=
            (
                mouseX * 5 -
                line.position.x * 0.01
            ) * 0.01;

        line.userData.timer++;

        if (
            line.userData.timer >
            line.userData.interval
        ) {
            const index =
                Math.floor(
                    Math.random() *
                    line.children.length
                );

            const character =
                matrixCharacters[
                    Math.floor(
                        Math.random() *
                        matrixCharacters.length
                    )
                ];

            line.children[index].material.map =
                getCharacterTexture(
                    character,
                    index === 0
                );

            line.children[index]
                .material
                .needsUpdate = true;

            line.userData.timer = 0;
        }

        line.children.forEach(
            (character, index) => {
                character.material.opacity =
                    Math.max(
                        0,
                        1 -
                        (
                            index /
                            line.children.length
                        ) * 1.2
                    );
            }
        );
    });

    renderer.render(scene, camera);
}

window.addEventListener(
    "resize",
    resizeBackground
);

animateMatrix();

document.getElementById("current-year").textContent =
    new Date().getFullYear();

const revealElements =
    document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.15
            }
        );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}

const contactForm =
    document.getElementById("contact-form");

const submitButton =
    document.getElementById("submit-button");

const successMessage =
    document.getElementById("form-success");

const errorMessage =
    document.getElementById("form-error");

contactForm.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        successMessage.style.display = "none";
        errorMessage.style.display = "none";

        submitButton.disabled = true;
        submitButton.style.opacity = "0.7";

        try {
            const response = await fetch(
                contactForm.action,
                {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Form submission failed"
                );
            }

            contactForm.reset();

            successMessage.style.display =
                "inline-flex";
        } catch (error) {
            console.error(
                "Contact form error:",
                error
            );

            errorMessage.style.display =
                "inline-flex";
        } finally {
            submitButton.disabled = false;
            submitButton.style.opacity = "1";
        }
    }
);
