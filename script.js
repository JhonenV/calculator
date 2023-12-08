const calculatorElement = document.getElementById("calculator");
const [calculatorHistoryElement, calculatorDisplayElement] = document.querySelector(".calculator-display").children;

calculatorElement.addEventListener("click", event => handleInput(event.target));

const calculatorDisplay = {
    element: calculatorDisplayElement,
    historyElement: calculatorHistoryElement,
    fullExpression: [],
    currentNum: 0,
    empty: true,
    update: function() {
        this.element.textContent = this.currentNum;
        this.historyElement.textContent = this.fullExpression.join(" ");
    },
    clear: function() {
        if (this.empty)
            this.fullExpression = [];
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
    },
    pushOperator: function(operator) {
        this.fullExpression.push(this.currentNum);
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
        result.pop();

        if (result.length === 0) {
            this.clear();
        } else {
            result = Number(result.join(""));
            this.currentNum = result;
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

    const option = element.innerText.toLowerCase();
    switch(option) {
        case "ac":
            calculatorDisplay.clear();
            break;
        case "back":
            calculatorDisplay.pop();
            break;
        case "+":
        case "-":
        case "/":
        case "x":
            calculatorDisplay.pushOperator(option);
            break;

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
