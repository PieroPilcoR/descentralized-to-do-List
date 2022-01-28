// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TaskContract {

    // Variables
    // This is for the id of each task, it gonna increase when we add a new task
    uint public nextID = 0;
    
    // This generates the unic Task to test
    constructor(){
        createTask('xdd', 'gaaaa');
    }

    // Events
    // Declaring an event to the create function
    event TaskCreated (
        uint id,
        string name,
        string description,
        bool done,
        uint createdAt
    );

    // Declaring an event to the set function
    event TaskEdited (
        uint id,
        string name,
        string description
    );

    // Just necesary these props to the done function
    event TaskToggleDone (
        uint id,
        bool done
    );

    // Declaring a structure
    struct Task { 
        uint id;
        string name;
        string description;
        bool done;
        uint createdAt;
    }
  
    // Declaring a structure object
    //Task[] tasks;
    mapping (uint256 => Task) public tasks;
    
    // Functions from the contract
    function createTask(string memory _name, string memory _description) public { 
        tasks[nextID] = Task(nextID, _name, _description, false, block.timestamp);
        //tasks.push(Task(nextID, name, description)); 
        // We throw an event
        emit TaskCreated(nextID, _name, _description, false, block.timestamp);
        nextID++;
    }

    function readTask(uint i) public view returns (uint, string memory, string memory) { 
        return (tasks[i].id, tasks[i].name, tasks[i].description);
        //return (tasks[i]); 
    }

    // To change some of the info from a task
    function setTask(uint i, string memory _name, string memory _description) public { 
        tasks[i].name = _name; 
        tasks[i].description = _description;
        // We throw an event
        emit TaskEdited(nextID, _name, _description);
    }

    // To change the value of the done prop
    function toggleDone(uint _id) public { 
        Task memory _task = tasks[_id];
        //_task.done = !_task.done;
        //tasks[_id] = _task;
        tasks[_id].done = !_task.done;
        // We throw an event
        emit TaskToggleDone(_id, tasks[_id].done);
    }
}