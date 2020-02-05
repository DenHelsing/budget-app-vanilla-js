import uniqid from "uniqid";

const date_span = document.querySelector(".header__date");

const balance_div = document.querySelector(".header__balance");
const incomeAmount_div = document.querySelector(".header__income-amount");
const expensesAmount_div = document.querySelector(".header__expenses-amount");
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

const movementBodies = {
    income: document.querySelector(".income__body"),
    expenses: document.querySelector(".expenses__body")
};

addApply_but.addEventListener("click", e => applyMoneyMovement(e));

const applyMoneyMovement = e => {
    e.preventDefault();

    const inputData = readInputData();

    const validated = validateInputData(
        ...inputData.slice(1, inputData.length)
    );

    if (validated) {
        addMoneyMovement(...inputData);
    } else {
        console.log("Enter correct data");
    }
};

const readInputData = () => {
    const type = addSign_select.options[addSign_select.selectedIndex].value;
    const description = addDescription_input.value;
    const amount = addAmount_input.value;

    return [type, description, amount];
};

const validateInputData = (description, amount) => {
    if (description.length >= 3 && !isNaN(amount) && amount > 0) {
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
        amount
    };

    budget[type].push(movement);

    updateList(type);
};

const calculatePercentage = () => {};

const deleteMovement = e => {
    let tagId = e.target.id;
    if (e.target.tagName !== "DIV") {
        tagId = e.target.parentNode.id;
    }
    const [type, id] = tagId.split("-");

    budget[type] = budget[type].filter(el => el.id !== id);

    updateList(type);
};

const convertToHTML = ({ id, type, description, amount }) => {
    return `<div class="item">
                <div class="item__description">${description}</div>
                <div class="item__hover">
                    <div class="item__am-perc">
                        <div class="item__amount">${
                            type === "income" ? "+" : "-"
                        } ${amount}</div>
                        <div class="item__percentage">10%</div>
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
    movementBodies[type].innerHTML = `${list.join("")}`;
    const deleteItem = document.querySelectorAll(".item__delete");

    deleteItem.forEach(item => {
        item.addEventListener("click", e => deleteMovement(e));
    });
};

const initialize = () => {
    const today = new Date();
    date_span.textContent = `${today.toLocaleString("en-us", {
        month: "long"
    })} ${today.getFullYear()}`;
};

initialize();
