const TaskContract = artifacts.require("TaskContract");

describe('TaskContract', () => {
    // Before all we deploy the contract, all to use it
    before(async ()=>{
        this.taskContract = await TaskContract.deployed()
    });

    // We check if the address exists, if not the app's not gonna be runned
    it('migrate deployed successfully', () => {
        const address = this.taskContract.address;
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, '');
        assert.notEqual(address, 0x0);
    })
    // We test the task created in the constructor, if the values match the test is correct
    it('get Tasks List', async () => {
        const count = await this.taskContract.nextID();
        const lastTask = await this.taskContract.tasks(count-1);
        const task = await this.taskContract.tasks(0);
        assert.equal(lastTask.id, count-1);
        assert.equal(task.name, 'xdd');
        assert.equal(task.description, 'gaaaa');
        assert.equal(task.done, false);
    })

    it('task props exists', async () => {
        const task = await this.taskContract.tasks(0);
        assert.notEqual(task.name, null);
        assert.notEqual(task.name, undefined);
        assert.notEqual(task.name, '');
        assert.notEqual(task.name, 0x0);
        assert.notEqual(task.description, null);
        assert.notEqual(task.description, undefined);
        assert.notEqual(task.description, '');
        assert.notEqual(task.description, 0x0);
    })
    
    it('task toggle done', async () => {
        const result =await this.taskContract.toggleDone(0);
        const task = await this.taskContract.tasks(0);
        const taskEvent = result.logs[0].args;
        // We test the done prop from the task created in the constructor
        assert.equal(task.done, true);
        assert.equal(task.done, taskEvent.done);
        assert.equal(taskEvent.done, true);
        // We test the first task which is created at the constructor in the contract
        assert.equal(taskEvent.id.toNumber(), 0);
    })

});