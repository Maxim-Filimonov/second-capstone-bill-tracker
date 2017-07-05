
const HouseHolds = require('./mock-model');
const HOUSE_HTML = require('./house-stats-html');
const state = require('./manage-state')
const EXPENSE_DIVIDED_HTML = require('./expenses-divided-html')
const { billingSummary } = require('./divide-expenses')
const { getFirstPage, forwardOnePage, backOnePage } = require('./pagination');

let bills = HouseHolds[0].bills;
let doubleIt = (bills) => bills.concat(bills.slice(0))
let BillsTripled = doubleIt(doubleIt(doubleIt(bills)))
    .map((e) => Object.assign({}, e, { editable: false }));

// let lotsOfBills = getFirstPage(BillsTripled);
// const lotsOfBills = doubleIt(bills);
const lotsOfBills = bills;

let buildTable = (bills) => bills.map((item, index) => HOUSE_HTML(item, index));

let tableToString = (bills) => buildTable(bills).join('');

let getTableBodyId = () => document.getElementById('main-content-js');

let renderTableData = (bills) => {
    getTableBodyId().innerHTML = tableToString(bills);
    return watchEdit();
}

let isEditable = (index) => {
    if (lotsOfBills[index].editable) {
        return false;
    } else {
        return true;
    }
}

let watchEdit = () => {
    let editButton = document.getElementsByClassName("watch-js");

    Array.from(editButton).forEach(function (element, i, array) {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            let element = e.target
            let index = element.id.substring(10);
            index = parseInt(index);
            lotsOfBills[index].editable = isEditable(index);
            setEditedRow(e, index);
            renderTableData(lotsOfBills);
        });
    });
}

//todo
let setEditedRow = (e, i) => {
    let data = e.target.parentNode.parentNode.getElementsByTagName('input')

    lotsOfBills[i].name = data[0].value
    lotsOfBills[i].dueDate = data[1].value
    lotsOfBills[i].amount = data[2].value
    // lotsOfBills[i].users.push(lotsOfBills[i].users.find((data[3].value)))
    lotsOfBills[i].lastPaidOn = data[4].value === '' ? Date.now() : data[4].value
}

// let watchNextBtn = () => {
//     let nextBtn = document.getElementById('next-js');
//     nextBtn.addEventListener('click', (e) => {
//         lotsOfBills = forwardOnePage(state.currentPage);
//         renderTableData(lotsOfBills)
//     })
// }

// let watchPreviousBtn = () => {
//     let previousBtn = document.getElementById('previous-js');
//     previousBtn.addEventListener('click', (e) => {
//         lotsOfBills = backOnePage(state.currentPage);
//         renderTableData(lotsOfBills);
//     })
// }

const divideTheExpenses = () => {
    const expenses = lotsOfBills.map((item) => {
        return item.amount;
    })
    const dividedBills = billingSummary(lotsOfBills, '300.00', '2.00')
    return dividedBills;
}

const createHtml = () => {
    return divideTheExpenses().map((arr) => {
        return EXPENSE_DIVIDED_HTML(arr);
    })
}

const renderExpenseSummary = () => {
    const summaryContainer = document.getElementById('expense-summary-container');
    summaryContainer.innerHTML = createHtml().join('');
}

document.addEventListener('DOMContentLoaded', () => {
    renderTableData(lotsOfBills);
    renderExpenseSummary();

    // watchNextBtn();
    // watchPreviousBtn();
});
