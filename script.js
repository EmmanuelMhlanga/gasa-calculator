const screen = document.getElementById('screen');
const history = document.getElementById('history');
function appendValue(val) {
    if (screen.innerText === '0') screen.innerText = val;
    else screen.innerText += val;
}
function clearScreen() { screen.innerText = '0'; history.innerText = ''; }
function deleteLast() {
    if (screen.innerText.length > 1) screen.innerText = screen.innerText.slice(0, -1);
    else screen.innerText = '0';
}
function calculate() {
    try {
        let expression = screen.innerText.replace('÷', '/').replace('×', '*').replace('−', '-');
        let result = eval(expression);
        history.innerText = screen.innerText;
        screen.innerText = Number.isInteger(result) ? result : result.toFixed(2);
    } catch { screen.innerText = "Error"; setTimeout(clearScreen, 1500); }
}
