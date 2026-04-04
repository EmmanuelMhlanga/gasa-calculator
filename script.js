/**
 * GASA TECH | Elite Pro Calculator Engine
 * Logic for: Neumorphic UI, Scientific Math, ZAR Converters, and Offline PWA
 */

const screen = document.getElementById('screen');
const historyLog = document.getElementById('history-log');
let isSecondMode = false;
let memoryValue = 0;
let isScientificNotation = false;

// 1. DYNAMIC GREETING & REAL-TIME CLOCK (Recs 1, 9, 39)
const updateHeader = () => {
    const now = new Date();
    const hr = now.getHours();
    const greetElement = document.getElementById('greeting');
    const clockElement = document.getElementById('clock');
    
    if (greetElement) {
        // Personalization for Emmanuel (Rec 39)
        let name = "Emmanuel"; 
        if (hr < 12) greetElement.innerText = `Morning, ${name}`;
        else if (hr < 18) greetElement.innerText = `Afternoon, ${name}`;
        else greetElement.innerText = `Evening, ${name}`;
    }

    if (clockElement) {
        clockElement.innerText = now.toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit', hour12: true 
        });
    }
};
setInterval(updateHeader, 1000);
updateHeader();

// 2. CORE INPUT LOGIC (Recs 4, 12, 18)
function appendValue(val) {
    playHaptic("light"); // Rec 21
    
    // Prevent UI Overflow (Rec 4)
    if (screen.innerText.length > 18) {
        screen.style.fontSize = "2rem"; 
    }

    if (val === 'π') {
        screen.innerText = (screen.innerText === '0') ? Math.PI.toFixed(6) : screen.innerText + Math.PI.toFixed(6);
        return;
    }

    if (val === '.') {
        const parts = screen.innerText.split(/[\+\-\*\/]/);
        if (parts[parts.length - 1].includes('.')) return;
    }

    if (screen.innerText === '0' && val !== '.') {
        screen.innerText = val;
    } else {
        screen.innerText += val;
    }
}

// 3. SCIENTIFIC FUNCTIONS (Recs 13, 14, 15, 16)
function sciFunc(type) {
    playHaptic("medium");
    try {
        let current = eval(sanitizeExpression(screen.innerText));
        let result;
        switch(type) {
            case 'sqrt': result = Math.sqrt(current); break;
            case 'sq': result = Math.pow(current, 2); break;
            case 'sin': result = Math.sin(current); break;
            case 'cos': result = Math.cos(current); break;
            case 'tan': result = Math.tan(current); break;
        }
        historyLog.innerText = `${type}(${screen.innerText})`;
        formatResult(result);
    } catch (e) {
        triggerError();
    }
}

// 4. MEMORY & 2nd TOGGLE (Recs 1, 19)
function toggleSecond() {
    playHaptic("medium");
    isSecondMode = !isSecondMode;
    const btn = document.getElementById('btn-2nd');
    const row = document.getElementById('sci-row');
    const rowAlt = document.getElementById('sci-row-alt');
    
    btn.classList.toggle('active-mode');
    row.classList.toggle('hidden');
    rowAlt.classList.toggle('hidden');
}

function memoryAdd() {
    playHaptic("medium");
    memoryValue += parseFloat(screen.innerText) || 0;
    document.getElementById('mem-indicator').innerText = "M"; // Rec 19
}

function memoryRecall() {
    playHaptic("medium");
    screen.innerText = memoryValue.toString();
}

// 5. CALCULATION ENGINE (Recs 11, 33)
function calculate() {
    try {
        const rawInput = screen.innerText;
        let expression = sanitizeExpression(rawInput);
        let result = eval(expression);

        if (!isFinite(result)) throw new Error("Infinity");

        historyLog.innerText = rawInput + " =";
        formatResult(result);
        
        // Rec 3: Glow effect on equals
        const eqBtn = document.getElementById('equals-btn');
        eqBtn.style.boxShadow = "0 0 20px var(--neon-cyan)";
        setTimeout(() => eqBtn.style.boxShadow = "", 300);

    } catch (e) {
        triggerError(e.message === "Infinity" ? "Can't divide by 0" : "Error");
    }
}

function sanitizeExpression(expr) {
    return expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
}

function formatResult(res) {
    if (isScientificNotation) {
        screen.innerText = res.toExponential(4);
    } else {
        screen.innerText = Number.isInteger(res) ? res : parseFloat(res.toFixed(6));
    }
}

// 6. UTILITIES (Recs 23, 31, 32, 47)
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function copyHistory() {
    const text = historyLog.innerText + " " + screen.innerText;
    navigator.clipboard.writeText(text);
    alert("History copied to clipboard!");
}

function triggerError(msg = "Error") {
    playHaptic("heavy");
    screen.innerText = msg;
    setTimeout(clearScreen, 2000);
}

function clearScreen() {
    screen.innerText = '0';
    historyLog.innerText = '';
    screen.style.fontSize = "3.5rem";
}

function deleteLast() {
    if (screen.innerText.length > 1) {
        screen.innerText = screen.innerText.slice(0, -1);
    } else {
        screen.innerText = '0';
    }
}

// 7. HAPTICS & KEYBOARD (Recs 21, 22)
function playHaptic(type) {
    if (!navigator.vibrate) return;
    if (type === "light") navigator.vibrate(10);
    if (type === "medium") navigator.vibrate(25);
    if (type === "heavy") navigator.vibrate([50, 30, 50]);
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendValue(e.key);
    if (e.key === 'Enter') { e.preventDefault(); calculate(); }
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearScreen();
});
