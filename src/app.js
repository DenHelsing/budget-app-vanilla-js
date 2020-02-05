import uniqid from "uniqid";

const date_span = document.querySelector(".header__date");

const balance_div = document.querySelector(".header__balance");
const expensesPercentage_div = document.querySelector(
    ".header__expenses-percentage"
);

const addSign_select = document.querySelector(".money-movement__select-sign");
const addDescription_input = document.querySelector(
    ".money-movement__description"
);
const addAmount_input = document.querySelector(".money-movement__amount");
const addApply_but = document.querySelector(".money-movement__apply");

const budget = {
    income: [],
    expenses: [],
    total: 0
};

const movementDivs = {
    income: document.querySelector(".income__body"),
    expenses: document.querySelector(".expenses__body")
};

const totalDivs = {
    income: document.querySelector(".header__income-amount"),
    expenses: document.querySelector(".header__expenses-amount")
};

const totals = {
    income: 0,
    expenses: 0
};

addApply_but.addEventListener("click", e => applyMoneyMovement(e));

addSign_select.addEventListener("change", e => onSelectChange(e));

const onSelectChange = e => {
    console.log(e.target.value);

    addSign_select.classList.toggle("plus");
    addSign_select.classList.toggle("minus");
    addDescription_input.classList.toggle("plus");
    addDescription_input.classList.toggle("minus");
    addAmount_input.classList.toggle("plus");
    addAmount_input.classList.toggle("minus");
    addApply_but.classList.toggle("plus");
    addApply_but.classList.toggle("minus");
};

const applyMoneyMovement = e => {
    e.preventDefault();

    const inputData = readInputData();

    const validated = validateInputData(
        ...inputData.slice(1, inputData.length)
    );

    if (validated) {
        addMoneyMovement(...inputData);
    } else {
        addDescription_input.placeholder = "Incorrect data entered";
        addDescription_input.classList.toggle("error");
        addAmount_input.classList.toggle("error");
        setTimeout(() => {
            addDescription_input.classList.toggle("error");
            addAmount_input.classList.toggle("error");
        }, 1500);
    }
};

const readInputData = () => {
    const type = addSign_select.options[addSign_select.selectedIndex].value;
    const description = addDescription_input.value;
    const amount = addAmount_input.value;

    return [type, description, amount];
};

const validateInputData = (description, amount) => {
    if (description.length >= 2 && !isNaN(amount) && amount > 0) {
        return true;
    }
    return false;
};

const addMoneyMovement = (type, description, amount) => {
    // const [sign, description, amount] = readInputData();

    const movement = {
        id: uniqid(),
        type,
        description,
        amount,
        percentage: 0
    };

    budget[type].push(movement);

    updateTotals(type);
    calculatePercentage(type);
    updateList(type);
    calculateExpensesPercentage();
};

const calculatePercentage = type => {
    budget[type].forEach(item => {
        item.percentage = item.amount / totals[type];
    });
};

const calculateExpensesPercentage = () => {
    expensesPercentage_div.textContent = (
        totals.expenses / totals.income
    ).toLocaleString("en-us", {
        style: "percent",
        maximumFractionDigits: 2,
        minimumFractionDigits: 1
    });
};

const deleteMovement = e => {
    let tagId = e.target.id;
    if (e.target.tagName !== "DIV") {
        tagId = e.target.parentNode.id;
    }
    const [type, id] = tagId.split("-");

    budget[type] = budget[type].filter(el => el.id !== id);

    updateTotals(type);
    calculatePercentage(type);
    updateList(type);
    calculateExpensesPercentage();
};

const convertToHTML = ({ id, type, description, amount, percentage }) => {
    const percent = percentage.toLocaleString("en-us", {
        style: "percent",
        maximumFractionDigits: 2,
        minimumFractionDigits: 1
    });
    // console.log(percent);
    return `<div class="item">
                <div class="item__description">${description}</div>
                <div class="item__hover">
                    <div class="item__am-perc">
                        <div class="item__amount">${
                            type === "income" ? "+" : "-"
                        } ${amount}</div>
                        <div class="item__percentage">${percent}</div>
                    </div>
                    <div class="item__delete" id=${type}-${id}>
                        <ion-icon name="close-circle-outline"></ion-icon>
                    </div>
                </div>
            </div>
            `;
};

const updateList = type => {
    const list = budget[type].map(convertToHTML);
    console.log(type);
    movementDivs[type].innerHTML = `${list.join("")}`;
    const deleteItem = document.querySelectorAll(".item__delete");

    deleteItem.forEach(item => {
        item.addEventListener("click", e => deleteMovement(e));
    });
};

const updateTotals = type => {
    totals[type] = budget[type].reduce((pr, curr) => pr + +curr.amount, 0);
    totalDivs[type].textContent = `${type === "income" ? "+" : "-"} ${totals[
        type
    ].toLocaleString("en-us", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    budget.total = totals.income - totals.expenses;
    console.log(budget.total);
    balance_div.textContent = `${
        budget.total > 0 ? "+" : "-"
    } ${budget.total.toLocaleString("en-us", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

// const upda

const initialize = () => {
    const today = new Date();
    date_span.textContent = `${today.toLocaleString("en-us", {
        month: "long"
    })} ${today.getFullYear()}`;
};

initialize();
