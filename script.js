const calculatorElement = document.getElementById("calculator");
const [calculatorHistoryElement, calculatorDisplayElement] = document.querySelector(".calculator-display").children;
const decimalButton = document.querySelectorAll(".calculator-button")[14];

calculatorElement.addEventListener("click", event => handleInput(event.target));

const calculatorDisplay = {
    element: calculatorDisplayElement,
    historyElement: calculatorHistoryElement,
    fullExpression: [],
    currentNum: 0,
    empty: true,
    clearFullExpression: false,
    update: function() {
        this.element.textContent = this.currentNum;
        this.historyElement.textContent = this.fullExpression.join(" ");
    },
    clear: function() {
        if (this.empty || this.clearFullExpression) {
            this.fullExpression = [];
            this.clearFullExpression = false;
        }
        this.currentNum = 0;
        this.empty = true;
        this.update();
    },
    pushNum: function(value) {
        if (this.empty) {
            if (value === ".") {
                this.currentNum = "0.";
            } else {
                this.currentNum = value;
            }
            this.empty = false;
        } else {
            const result = this.currentNum.toString().split("");
            result.push(value);
            this.currentNum = result.join("");
        }

        this.update();
    },
    pushOperator: function(operator) {
        if (this.clearFullExpression) {
            this.clearFullExpression = false;
            this.empty = true;
            this.fullExpression = [this.currentNum, operator];
            this.currentNum = 0;
            this.update();
            return;
        }

        this.fullExpression.push(Number(this.currentNum));

        if (operator === "=") {
            this.clearFullExpression = true;
            return;
        }

        this.fullExpression.push(operator);
        this.clear();
    },
    pop: function() {
        if (this.empty) {
            if (this.fullExpression.length !== 0) {
                this.fullExpression.pop();
                this.currentNum = this.fullExpression.pop();
                this.update();
                this.empty = false;
            }
            return;
        }

        let result = this.currentNum.toString().split("");
        const popped = result.pop();

        if (result.length === 0) {
            this.clear();
        } else {
            result = Number(result.join(""));
            this.currentNum = result;
        }

        this.update();
        return popped;
    },
    displayAnswer: function(answer) {
        answer = answer.toString().split("");
        this.currentNum = Number(answer.slice(0, Math.min(answer.length, 16)).join(""));
        this.update();
    }
}

let decimalEnabled = true;

function handleInput(element) {
    if (element.nodeName !== "BUTTON")
        return;


    if (!isNaN(element.innerText)) {
        calculatorDisplay.pushNum(Number(element.innerText));
        return;
    }

    const option = element.innerText.toLowerCase();
    switch(option) {
        case ".":
            calculatorDisplay.pushNum(".");
            decimalEnabled = false;
            break;
        case "ac":
            calculatorDisplay.clear();
            decimalEnabled = true;
            break;
        case "back":
            let popped = calculatorDisplay.pop();
            if (popped === ".") {
                decimalEnabled = true;
            }
            break;
        case "+":
        case "-":
        case "/":
        case "x":
            calculatorDisplay.pushOperator(option);
            decimalEnabled = true;
            break;
        case "=":
            if (calculatorDisplay.fullExpression.length % 2 !== 0)
                return;
            calculatorDisplay.pushOperator(option);
            const result = calculateExpression(calculatorDisplay.fullExpression.slice());
            calculatorDisplay.displayAnswer(result);
            decimalEnabled = !(result.toString().includes("."));
            break;
    }

    if (!decimalEnabled) {
        decimalButton.setAttribute("disabled", "disabled");
    } else {
        decimalButton.removeAttribute("disabled");
    }
}

function calculateExpression(expression) {
    const firstPriority = x => x === "x" || x === "/";
    const secondPriority = x => x === "+" || x === "-";
    const order = [firstPriority, secondPriority];

    let currentIndex;
    order.forEach(func => {
        currentIndex = expression.findIndex(func);
        while (currentIndex !== -1) {
            let [first, operator, second] = expression.splice(currentIndex - 1, 3);
            const solution = operate(first, second, operator);
            expression.splice(currentIndex - 1, 0, solution);
            currentIndex = expression.findIndex(func);
        }
    });

    return expression[0];
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
        case "x":
            return multiply(first, second);
        case "/":
            return divide(first, second);
    }
}
