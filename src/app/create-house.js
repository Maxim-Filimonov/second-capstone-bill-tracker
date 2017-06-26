let { updateState } = require('./manage-state')
let HouseHold = require('./mock-model')

let state = updateState();

// roommate rendered and saved to state
let roommateHtml = (roommate, index) => {
    return `<li>${roommate.name} 
                <button class="btn btn-sm delete-btn-js" id="roommate-${index}">Delete</button>
            </li>`
};

let renderRoommateList = () => {
    let roommateContainer = document.getElementById('add-roommate');
    roommateContainer.innerHTML = listToString(state.getRoommates(), roommateHtml);
    document.getElementById('add-roommate-form').reset();

    watchDeleteRoommate();
};

let watchRoommateBtn = () => {
    let addRoommateBtn = document.getElementById('add-roommate-form');

    addRoommateBtn.addEventListener('submit', (e) => {
        e.preventDefault();
        let value = document.getElementsByName('create-roommate')[0].value;

        state.addRoommate(value);

        render();
    })
};

let watchDeleteRoommate = () => {
    let deleteBtn = document.getElementsByClassName('delete-btn-js');
    let trimIdString = 9;
    addListenerByClassName(deleteBtn, trimIdString, state.removeRoommate, render);
};

// ***************************************************************
// used in both expense and roommate render
let listToString = (list, callback) => {
    let newList = list.map((item, index) => {
        return callback(item, index);
    })
    return newList.join('');
};

let addListenerByClassName = (classNames, trimIndex, list, callback) => {
    Array.from(classNames).forEach((item) => {
        item.addEventListener('click', (e) => {
            let index = e.target.id.substring(trimIndex);
            list(index);
            callback();
        })
    })
}

// *******************************************
// expenses rendered and saved to state
let partialExpenseTableHtml = () => {
    return `<div class="col-md-6">
                <table class="table table-condensed">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody id="expense-table">

                    </tbody>
                </table>
            </div>`
};

let expenseTableHtml = (expense, index) => {
    return `<tr>
                <td>${expense.name}</td>
                <td>${expense.amount}</td>
                <td>${expense.dueDate}</td>
                <td>
                    <button class="btn btn-sm delete-expense-btn-js" id="expense-${index}">Delete</button>
                </td>
            </tr>`
};

let renderExpenseTable = () => {
    let tableContainer = document.getElementById('table-container');

    if (state.getExpenses().length >= 1) {
        tableContainer.innerHTML = partialExpenseTableHtml();
        let expenseTable = document.getElementById('expense-table')
        expenseTable.innerHTML = listToString(state.getExpenses(), expenseTableHtml)
        document.getElementById('add-expense-form').reset();

        watchDeleteExpenseBtn();
    } else {
        tableContainer.innerHTML = '';
    }

}

let watchExpenseBtn = () => {
    let addBillBtn = document.getElementById('add-expense-form');

    addBillBtn.addEventListener('submit', (e) => {
        e.preventDefault();
        let expenseInfo = []
        let expenseObject = {}
        let expenseData = new FormData(e.currentTarget);

        // find a better solution this iterates three times per one object
        for ([key, value] of expenseData) {
            expenseObject[key] = value;
        }
        expenseInfo.push(expenseObject);

        state.addExpenseToState(expenseInfo[0]);

        render();
    })
};

let watchDeleteExpenseBtn = () => {
    let deleteBtn = document.getElementsByClassName('delete-expense-btn-js');
    let trimIdString = 8;
    addListenerByClassName(deleteBtn, trimIdString, state.removeExpense, render);
}

// ****************************************
// rendering for household submission
let submitHtml = () => {
    return `<button class="btn" id="submit-household-btn">
                Submit Houshold
            </button>`
}

let watchSubmitHousehold = () => {
    let submitHouseBtn = document.getElementById('submit-household-btn');
    submitHouseBtn.addEventListener('click', (e) => {
        let householdName = document.getElementById('household-name');
        state.setHouseName(householdName.value);

        HouseHold.name = state.getHouseName();
        HouseHold.roommates = state.getRoommates();
        HouseHold.expenses = state.getExpenses();

        console.log(HouseHold);
    })
}

let renderSubmitHousehold = () => {
    let submitHouseContainer = document.getElementById('submit-household')
    submitHouseContainer.innerHTML = '';
    if (state.readyForSubmit()) {
        submitHouseContainer.innerHTML = submitHtml();
        watchSubmitHousehold();
    }
}

let render = () => {

    renderRoommateList();

    renderExpenseTable();

    renderSubmitHousehold();
}

document.addEventListener('DOMContentLoaded', () => {
    watchRoommateBtn();
    watchExpenseBtn();
});