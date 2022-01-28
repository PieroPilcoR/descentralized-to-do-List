const taskForm = document.querySelector('#taskForm');

document.addEventListener('DOMContentLoaded', () => {
    // It runs the app
    App.init();
})

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(taskForm['title'].value, taskForm['description'].value);
    // The usage of the form depends on the 'editable' boolean prop we've talked about before
    (App.editable)
    ? App.setTask(taskForm['title'].value, taskForm['description'].value)
    : App.createTask(taskForm['title'].value, taskForm['description'].value)
})