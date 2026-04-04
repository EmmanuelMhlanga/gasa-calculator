const screen = document.getElementById('screen');
const historyLog = document.getElementById('history-log');

// 1. Gasa Tech Dynamic Greeting
const setGreeting = () => {
    const hr = new Date().getHours();
    const greetElement = document.getElementById('greeting');
    if (!greetElement) return;
    
    if (hr < 12) greetElement.innerText = "Good Morning";
    else if (hr < 18) greetElement.innerText = "Good Afternoon";
    else greetElement.innerText = "Good Evening";
};
setGreeting();

// 2. Core Logic with Input Protection
function appendValue(val) {
    playHaptic();
    
    // Prevent multiple decimals in a single number block
    if (val === '.') {
        const parts = screen.innerText.split(/[\+\-\*\/]/);
        if (parts[parts.length - 1].includes('.')) return;
    }

    if (screen.innerText === '0' && val !== '.') {
        screen.innerText = val;
    } else if (screen.innerText.length < 16) { // Prevent UI overflow
        screen.innerText += val;
    }
}

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
        // Sanitize for eval
        let expression = rawInput
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/−/g, '-');

        let result = eval(expression);

        // Handle Math Errors
        if (!isFinite(result)) {
            throw new Error("Infinity");
        }

        historyLog.innerText = rawInput + " =";
        // Format decimals to 4 places maximum
        screen.innerText = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
        
    } catch (e) {
        screen.innerText = e.message === "Infinity" ? "Can't divide by 0" : "Error";
        setTimeout(clearScreen, 2000);
    }
}

// 3. Professional Keyboard Support
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

// 4. Mobile Haptic Feedback
function playHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }
}
