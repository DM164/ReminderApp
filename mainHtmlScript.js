const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');
const remote = require('electron').remote;

let isOpen = false;

//Substitute to the windows buttons
document.getElementById("closeApp").addEventListener("click", function(){
    ipcRenderer.send('closeApp:close', true)
});

document.getElementById("minimizeApp").addEventListener("click", function (e) {
    const window = remote.getCurrentWindow();
    window.minimize(); 
});

document.getElementById("maximizeApp").addEventListener("click", function (e) {
    const window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();          
    } else {
        window.unmaximize();
    }
});


document.getElementById('addReminder-today').addEventListener('click', function(){
    if (isOpen == false) {
        // this is 'X' button
            document.getElementById('addItem-today').style.display='block';
            document.getElementById('addReminder-today').style.transform='rotate(45deg)'
            isOpen = true;
    } else {
        // this is '+' button
            document.getElementById('addItem-today').style.display='none';
            document.getElementById('addReminder-today').style.transform='rotate(0deg)'
            isOpen = false;
    }
});

document.getElementById('addReminder').addEventListener('click', function(){
    if (isOpen == false) {
        // this is 'X' button (normal lists)
            document.getElementById('addItem').style.display='block';
            document.getElementById('addReminder').style.transform='rotate(45deg)'
            isOpen = true;
    } else {
        // this is '+' button (Normal lists)
            document.getElementById('addItem').style.display='none';
            document.getElementById('addReminder').style.transform='rotate(0deg)'
            isOpen = false;
    }
});

//counts how many reminders are in the "Today" list
setInterval(function(){
    let todayCounter = document.getElementById("todayList").childElementCount - 1;
    document.getElementById('num').innerHTML=todayCounter;
}, 1000);



//Sidebar functionality
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list]')

const listTitle = document.querySelector('[data-list-title]')

const LOCAL_STORAGE_LIST_KEY = 'reminder.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'reminder.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

//Switch between Today and List view
document.getElementById('today').addEventListener('click', function(){
    selectedListId = null
    saveAndRender()
})

listsContainer.addEventListener('click', function(e){
    if (e.target.tagName.toLowerCase() === 'li'){
        document.getElementById('content').style.display='block'
        document.getElementById('contentToday').style.display='none'
        selectedListId = e.target.dataset.listId
    }
    saveAndRender()
})

deleteListButton.addEventListener('click', function(e){
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

newListForm.addEventListener('submit', function(e){
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === ''){ return }
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

function createList(name) {
    return {id: Date.now().toString(), name: name, tasks: []}
}

function saveAndRender(){
    save()
    render()
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

const selectedList = lists.find(list => list.id === selectedListId)
function render() {
    ClearElement(listsContainer)
    if(selectedListId == null){
        document.getElementById('content').style.display='none'
        document.getElementById('contentToday').style.display='block'
    } else{
        listTitle.innerText = selectedList.name
    }
    renderLists()
}

function renderLists(){
    lists.forEach(list =>{
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('list-item')
        listElement.innerText = list.name
        listsContainer.appendChild(listElement)
        
        if (list.id === selectedListId){
            listElement.classList.add('active-list')
        }
    })
}

function ClearElement(element){
    while (element.firstChild){
        element.removeChild(element.firstChild)
    }
}

render()

//TODO: rewrite code
//send item and add it to the main html list
