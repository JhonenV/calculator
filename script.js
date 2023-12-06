const calculatorElement = document.getElementById("calculator");
const [calculatorHistory, calculatorDisplayElement] = document.querySelector(".calculator-display").children;

calculatorElement.addEventListener("click", event => handleInput(event.target));

const calculatorDisplay = {
    element: calculatorDisplayElement,
    currentNum: 0,
    empty: true,
    update: function() {
        this.element.textContent = this.currentNum;
    },
    clear: function() {
        this.currentNum = 0;
        this.empty = true;
        this.update();
    },
    pushNum: function(num) {
        if (this.empty) {
            this.currentNum = num;
            this.empty = false;
        } else {
            this.currentNum = this.currentNum * 10 + num;
        }

        this.update();
    }
}

function handleInput(element) {
    if (element.nodeName !== "BUTTON")
        return;

    if (Number(element.innerText)) {
        calculatorDisplay.pushNum(Number(element.innerText));
    }

    switch(element.innerText.toLowerCase()) {
        case "ac":
            calculatorDisplay.clear();
    }
}

function add(first, second) {
    return first + second;
}

function subtract(first, second) {
    return first - second;
}

function multiply(first, second) {
    return first * second;
}

function divide(first, second) {
   return first / second; 
}

function operate(first, second, operator) {
    switch(operator) {
        case "+":
            return add(first, second);
        case "-":
            return subtract(first, second);
        case "*":
            return multiply(first, second);
        case "/":
            return divide(first, second);
    }
}
