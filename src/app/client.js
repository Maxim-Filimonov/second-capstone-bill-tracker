
const HouseHolds = require('./mock-model');
let bills = HouseHolds[0].bills;
let doubleIt = (bills) => bills.concat(bills.slice(0))
let BillsTripled = doubleIt(doubleIt(doubleIt(bills)))
    .map((e) => Object.assign({}, e, { editable: false }));

const HOUSE_HTML = require('./house-stats-html');
const { getFirstPage, forwardOnePage, backOnePage, state } = require('./pagination');

let lotsOfBills = getFirstPage(BillsTripled);

let buildTable = (bills) => bills.map((item, index) => HOUSE_HTML(item, index));

let tableToString = (bills) => buildTable(bills).join('');

let getTableBodyId = () => document.getElementById('main-content-js');

let renderTableData = (bills) => {
    getTableBodyId().innerHTML = tableToString(bills);
    return watchEdit();
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

let setEditedRow = (e, i) => {
    let data = e.target.parentNode.parentNode.getElementsByTagName('input')

    lotsOfBills[i].name = data[0].value
    lotsOfBills[i].dueDate = data[1].value
    lotsOfBills[i].amount = data[2].value
    // lotsOfBills[i].users.push(lotsOfBills[i].users.find((data[3].value)))
    lotsOfBills[i].lastPaidOn = data[4].value
}

let isEditable = (index) => {
    if (lotsOfBills[index].editable) {
        return false;
    } else {
        return true;
    }
}

let watchNextBtn = () => {
    let nextBtn = document.getElementById('next-js');
    nextBtn.addEventListener('click', (e) => {
        lotsOfBills = forwardOnePage(state.currentPage);
        renderTableData(lotsOfBills)
    })
}

let watchPreviousBtn = () => {
    let previousBtn = document.getElementById('previous-js');
    previousBtn.addEventListener('click', (e) => {
        lotsOfBills = backOnePage(state.currentPage);
        renderTableData(lotsOfBills);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    renderTableData(lotsOfBills);
    watchNextBtn();
    watchPreviousBtn();
});
