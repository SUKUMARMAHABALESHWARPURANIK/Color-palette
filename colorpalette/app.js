// Get DOM elements
const colorDiv = document.querySelectorAll('.color');
const sliders = document.querySelectorAll('input[type="range"]');

// Add input event listeners to sliders
sliders.forEach(function (slider) {
    slider.addEventListener("input", hslControls);
});

// Function to generate a random color using chroma.js
function getRandomColor() {
    const hex = chroma.random();
    return hex;
}

// Function to set background color and hex values for colorDivs
function getColor() {
    colorDiv.forEach(function (div) {
        const hexValue = div.children[0];
        const random = getRandomColor();
        hexValue.innerText = random;
        div.style.backgroundColor = random;
        getColorContrast(random, hexValue);

        // Initialize sliders
        const color = chroma(random);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        colorSliders(color, hue, brightness, saturation);
    });
}

// Initialize colorDivs
getColor();

// Function to determine text color based on background color
function getColorContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}

// Function to update color sliders
function colorSliders(color, hue, brightness, saturation) {
    // Scale saturation
    const nosaturation = color.set('hsl.s', 0);
    const fulsaturation = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([nosaturation, color, fulsaturation]);

    // Scale brightness
    const midbright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(["black", midbright, "white"]);

    // Update input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;

    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;

    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(204,75,204), rgb(204,204,204), rgb(75,75,75))`;
}

// Function to handle slider input event
function hslControls(e) {
    const index = e.target.getAttribute("data-bright") ||
        e.target.getAttribute("data-sat") ||
        e.target.getAttribute("data-hue");
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bg = colorDiv[index].querySelector('h2').innerText;
    let color = chroma(bg).set("hsl.s", saturation.value).set("hsl.l", brightness.value).set("hsl.h", hue.value);
    colorDiv[index].style.backgroundColor = color;

}
