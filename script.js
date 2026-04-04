const screen = document.getElementById('screen');
const historyLog = document.getElementById('history-log');

// 1. Gasa Tech Dynamic Greeting & Real-Time Clock
const updateHeader = () => {
    const now = new Date();
    const hr = now.getHours();
    
    // Update Greeting
    const greetElement = document.getElementById('greeting');
    if (greetElement) {
        if (hr < 12) greetElement.innerText = "Good Morning";
        else if (hr < 18) greetElement.innerText = "Good Afternoon";
        else greetElement.innerText = "Good Evening";
    }

    // Update Clock (from your reference image)
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.innerText = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
};
setInterval(updateHeader, 1000);
updateHeader();

// 2. Core Logic with Input Protection
function appendValue(val) {
    playHaptic();
    
    // Handle PI constant
    if (val === 'π') {
        if (screen.innerText === '0') screen.innerText = Math.PI.toFixed(8);
        else screen.innerText += Math.PI.toFixed(8);
        return;
    }

    // Prevent multiple decimals in a single number block
    if (val === '.') {
        const parts = screen.innerText.split(/[\+\-\*\/]/);
        if (parts[parts.length - 1].includes('.')) return;
    }

    if (screen.innerText === '0' && val !== '.') {
        screen.innerText = val;
    } else if (screen.innerText.length < 24) { // Increased limit for scientific numbers
        screen.innerText += val;
    }
}

// 3. New "Elite Pro" Scientific Functions
function calculateSquareRoot() {
    playHaptic();
    try {
        const result = Math.sqrt(eval(screen.innerText.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-')));
        historyLog.innerText = `√(${screen.innerText})`;
        screen.innerText = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
    } catch (e) {
        screen.innerText = "Error";
    }
}

function calculateSquare() {
    playHaptic();
    try {
        const result = Math.pow(eval(screen.innerText.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-')), 2);
        historyLog.innerText = `(${screen.innerText})²`;
        screen.innerText = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
    } catch (e) {
        screen.innerText = "Error";
    }
}

// Memory placeholders (for M+ and MR buttons in image)
let memoryValue = 0;
function memoryAdd() {
    playHaptic();
    memoryValue += parseFloat(screen.innerText);
}
function memoryRecall() {
    playHaptic();
    screen.innerText = memoryValue.toString();
}

function toggleSecond() {
    playHaptic();
    // Logic for 2nd function toggle can be added here
}

// 4. Standard Logic
function clearScreen() {
    screen.innerText = '0';
    historyLog.innerText = '';
}

function deleteLast() {
    if (screen.innerText.length > 1 && screen.innerText !== "Error") {
        screen.innerText = screen.innerText.slice(0, -1);
    } else {
        screen.innerText = '0';
    }
}

function calculate() {
    try {
        const rawInput = screen.innerText;
        let expression = rawInput
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/−/g, '-');

        let result = eval(expression);

        if (!isFinite(result)) {
            throw new Error("Infinity");
        }

        historyLog.innerText = rawInput + " =";
        screen.innerText = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
        
    } catch (e) {
        screen.innerText = e.message === "Infinity" ? "Can't divide by 0" : "Error";
        setTimeout(clearScreen, 2000);
    }
}

// 5. Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendValue(e.key);
    if (e.key === '.') appendValue('.');
    if (e.key === '+') appendValue('+');
    if (e.key === '-') appendValue('-');
    if (e.key === '*') appendValue('*');
    if (e.key === '/') { e.preventDefault(); appendValue('/'); }
    if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearScreen();
});

// 6. Haptic Feedback
function playHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }
}
