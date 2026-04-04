const screen = document.getElementById('screen');
const historyLog = document.getElementById('history-log');

/**
 * 1. DYNAMIC GREETING 
 * Personalized UX for the Gasa Tech brand
 */
const updateGreeting = () => {
    const hour = new Date().getHours();
    const greetElement = document.getElementById('greeting');
    if (!greetElement) return;

    if (hour < 12) greetElement.innerText = "Good Morning";
    else if (hour < 18) greetElement.innerText = "Good Afternoon";
    else greetElement.innerText = "Good Evening";
};
updateGreeting();

/**
 * 2. CORE CALCULATOR LOGIC
 */
function appendValue(val) {
    // Prevent multiple decimal points in one number
    if (val === '.' && screen.innerText.split(/[\+\-\*\/]/).pop().includes('.')) return;

    if (screen.innerText === '0' && val !== '.') {
        screen.innerText = val;
    } else {
        // Limit display length to prevent UI breaking
        if (screen.innerText.length < 15) {
            screen.innerText += val;
        }
    }
    playHaptic();
}

function clearScreen() {
    screen.innerText = '0';
    if (historyLog) historyLog.innerText = '';
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
        const rawExpression = screen.innerText;
        // Safety check for empty or operator-only strings
        if (/^[\+\-\*\/]/.test(rawExpression) || /[\+\-\*\/]$/.test(rawExpression)) return;

        let expression = rawExpression
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/−/g, '-');

        // Professional Math Handling
        let result = eval(expression);

        // Handle Division by Zero
        if (!isFinite(result)) {
            throw new Error("DivByZero");
        }

        // Show history
        if (historyLog) historyLog.innerText = rawExpression + " =";

        // Precision Control: Max 4 decimals for clean UI
        screen.innerText = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));

    } catch (err) {
        screen.innerText = err.message === "DivByZero" ? "Can't divide by 0" : "Error";
        setTimeout(clearScreen, 2000);
    }
}

/**
 * 3. KEYBOARD SUPPORT (Essential for Microsoft Store)
 */
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/[0-9]/.test(key)) appendValue(key);
    if (key === '.') appendValue('.');
    if (key === '+') appendValue('+');
    if (key === '-') appendValue('-');
    if (key === '*') appendValue('*');
    if (key === '/') { e.preventDefault(); appendValue('/'); }
    if (key === 'Enter' || key === '=') { e.preventDefault(); calculate(); }
    if (key === 'Backspace') deleteLast();
    if (key === 'Escape') clearScreen();
});

/**
 * 4. HAPTIC FEEDBACK (Great for Samsung/Mobile)
 */
function playHaptic() {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10); // Small 10ms vibration
    }
}
