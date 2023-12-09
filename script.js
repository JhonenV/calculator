const calculatorElement = document.getElementById("calculator");
const [calculatorHistoryElement, calculatorDisplayElement] = document.querySelector(".calculator-display").children;

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
        result.pop();

        if (result.length === 0) {
            this.clear();
        } else {
            result = Number(result.join(""));
            this.currentNum = result;
        }

        this.update();
    },
    displayAnswer: function(answer) {
        this.currentNum = answer;
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
        case "=":
            if (calculatorDisplay.fullExpression.length % 2 !== 0)
                return;
            calculatorDisplay.pushOperator(option);
            const result = calculateExpression(calculatorDisplay.fullExpression.slice());
            calculatorDisplay.displayAnswer(result);
            break;
    }
}

function calculateExpression(expression) {
    const firstPriority = x => x === "x" || x === "/";
    const secondPriority = x => x === "+" || x === "-";
    const order = [firstPriority, secondPriority];
    console.log(expression);

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
    console.log(expression);

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
