
App = {
    contracts: {},
    // This boolean prop says if the form is able to edit a task, (IMPORTANT) we're gonna use it in 'ui.js'
    editable: false,
    // This prop says what number of task we're gonna update, firstly it gonna be 'null'
    numEditCard: null,
    // This method's gonna be runned firsty in the 'ui' script, to init the app
    init: async () => {
        console.log('Loaded');
        // All of this methods must be asyncronous
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        App.render();
        await App.renderTasks();
    },
    // Si existe lo mas probable es que tenga Metamask, si no es porque no tiene ninguna billetera
    // Don't run in incognit window
    loadEthereum: async () => {
        if (window.ethereum) {
            // Add window.eth as the object property
            App.web3Provider = window.ethereum;
            // Connects the app to Metamask
            await ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        } else {
            console.log('No ethereum browser is installed. Try it installing MetaMask');
        }
    },
    loadAccount: async () => {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        App.account = accounts[0];
        console.log(accounts);
        // We currently only ever provide a single account,
        // but the array gives us some room to grow.
    },
    loadContracts: async () => {
        // All of this function is to use the Contract solidity functions
        // All the info is stored in the JSON's of the Contract
        const res = await fetch('TaskContract.json');
        const taskContractJSON = await res.json();
        App.contracts.taskContract = TruffleContract(taskContractJSON);
        // Remember to set the Web3 provider (see above).
        App.contracts.taskContract.setProvider(App.web3Provider);
        // We'll use the deployed contract
        App.taskContract = await App.contracts.taskContract.deployed();
    },
    render: () => {
        document.getElementById('account').innerHTML = App.account;
    },
    // This is the most important render cuz it renders the app instantly 
    // when we update or create a new task in the blockchain
    renderTasks: async () => {
        const counter = await App.taskContract.nextID()
        let html = '';
        // We have to use each of the tasks created with Solidity before
        for (let index = 0; index < counter.toNumber(); index++) {
            const task = await App.taskContract.tasks(index)
            // If we want to change or put in DOM the 'done' attribute
            // We must use the from prop 'checked' and use the onchange
            html += `<div class="card bg-dark rounded-0 mb-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${task[1]}</span>
                    <div class="form-check form-switch">
                        <input class="form-check-input" data-id=${task[0].toNumber()} type="checkbox" ${task[3] && 'checked'}
                        onchange="App.toggleDone(this)">
                    </div>
                </div>
                <div class="card-body">
                    <span>${task[2]}</span>
                    <p class="text-muted">Task was created ${new Date(task[4]*1000).toLocaleString()}</p>
                    </label>
                    <input class="btn btn-primary" type="button" data-id=${task[0].toNumber()} value="Edit Task" onclick="App.useUpdate(this)">
                </div>
            </div>`
            // We're using the HTML5 Custom Data Attributes in the 2 HTML inputs inside the loop
            console.log(task)
        }
        // We put all the 'recolected' HTML tasklist from the blockchain in the DOM
        document.getElementById('tasksList').innerHTML = html;
    },
    createTask: async (name, description) => {
        // You must put the 'from' in the Solidity functions
        const result = await App.taskContract.createTask(name, description, {
            from: App.account
        });
        console.log(result.logs[0].args)
        // Sometimes is good idea to render the page just in the moment you created a new element
        await App.renderTasks();
    },
    // This method happens when we push the button "Edit Task" in any card or task on the app
    useUpdate: (element) => {
        // We're using the HTML5 Custom Data Attributes
        console.log(element.dataset.id)
        // We set this prop to a real number because we're gonna use is to set the task with this number
        App.numEditCard = element.dataset.id;
        // This prop of app is to make able the form to only modify the task we selected
        App.editable = true;
        // Puts the info from the card we selected in the form to update it
        document.getElementById('title').value=element.parentElement.parentElement.children[0].children[0].textContent;
        document.getElementById('description').value=element.parentElement.parentElement.children[1].children[0].textContent;
        console.log(App.editable)
        // It shows the 'Create Task' optional button, instructions are there
        document.getElementById('update-btn').innerHTML = `
        <span>This sky-blue button is optional, if you push it gonna disappear and the form's gonna be able only to create new tasks :)</span>
        <button class="btn btn-info w-100 mt-2" onclick="App.useCreate()">Create Task</button>`;
        document.getElementById('form-usage').innerHTML = 'Update the Task';
    },
    // This method happens when we push the sky button "Create Task" in the app
    useCreate: () => {
        // This prop of app is to make able the form to only create tasks not set them
        App.editable = false;
        // We set this prop again to 'null' because we're not gonna edit any task for the moment
        App.numEditCard = null;
        console.log(App.editable)
        // To hide the optional button we've talked before
        document.getElementById('update-btn').innerHTML = ``;
        document.getElementById('form-usage').innerHTML = 'Create a Task';
    },
    // This is the real setTask function we're gonna use, it is from the Solidity Contract script
    setTask: async (name, description) => {
        // You must put the 'from' in the Solidity functions, we use the 'numEditCard' prop
        const result = await App.taskContract.setTask(App.numEditCard, name, description, {
            from: App.account
        });
        //console.log(result.logs[0].args)
        // To render the page just in the moment we set a task
        await App.renderTasks();
    },
    toggleDone: async (element) => {
        // We're using the HTML5 Custom Data Attributes
        console.log(element.dataset.id)
        const result = await App.taskContract.toggleDone(element.dataset.id, {
            from: App.account
        });
    }
}