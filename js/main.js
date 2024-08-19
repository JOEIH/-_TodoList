//배경화면 날짜, 시계 추가
const wallDate = document.querySelector('.date');
const wallYear = document.querySelector('.year');
const clock = document.querySelector('.clock');

function inputDate() {
    let today = new Date();
    let years = today.getFullYear();
    let months = today.getMonth() + 1;
    let days = today.getDate();

    wallYear.textContent += `${years}`;
    wallDate.textContent += `${months}/${days}`;
}
inputDate();

function inputClock() {
    let now = new Date();

    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    clock.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(inputClock, 1000) 
inputClock();

//카테고리
const ctgyBtn = document.querySelector('.ctgyLabel');
const optionList = document.querySelector('.optionList');
const defaultCtgyText = 'Select Category <i class="fas fa-sort"></i>';
let activeTodoBox = null;

ctgyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ctgyBtn.classList.toggle('on');
});
optionList.addEventListener('click', (e) => {
    if(e.target.className === 'optionItem') {
        ctgyBtn.innerHTML = e.target.textContent;

        if (activeTodoBox) {
            const ctgy = activeTodoBox.querySelector('.ctgy')
            ctgy.textContent = e.target.textContent;
        }
        ctgyBtn.classList.remove('on');
        activeTodoBox = null;
    }
})


// 투두리스트 추가
const addBtn = document.querySelector('.addBtn');
const writeTodo = document.querySelector('.writeTodo');
const todoList = document.getElementById('todo_list');
const category = document.querySelector('.category');
//counting task
const completed = document.querySelector('.completedCount');
const pending = document.querySelector('.pendingCount');
let pendingCount = 0;
let completedCount = 0;
completed.textContent = completedCount;
pending.textContent = pendingCount;

//todo 개수 세기
function countingTask() {
    completed.textContent = completedCount;
    pending.textContent = pendingCount;
}   

function makeTodoBox() {
    countingTask();
    // Clone the template todo box
    let template = document.getElementById('todo_template').children[0];
    let newTodoBox = template.cloneNode(true);

    // Set the content for the new todo box
    let todoPart = newTodoBox.querySelector('.todoPart');
    todoPart.textContent = writeTodo.value;

    let ctgy = newTodoBox.querySelector('.ctgy');
    let writtenDate = newTodoBox.querySelector('.writtenDate');

    // Set the category and date
    let selectedCtgy = category.innerText;
    let months = today.getMonth() + 1;
    let year = today.getFullYear();
    let days = today.getDate();
    
    ctgy.textContent = selectedCtgy;
    writtenDate.textContent = `${year}.${months}.${days}`;

    // Attach event listeners for edit and delete buttons
    let checkBtn = newTodoBox.querySelector('.fa-check-circle').parentNode;
    let editBtn = newTodoBox.querySelector('.fa-pen').parentNode;
    let deleteBtn = newTodoBox.querySelector('.fa-trash-alt').parentNode;

    let state = false;
    //complete function
    checkBtn.addEventListener('click', function() {
        if (state === false) {
            completedCount++;
            pendingCount--;
            newTodoBox.style.filter = 'brightness(50%)'
            state = true;
        } else {
            completedCount--;
            pendingCount++;
            newTodoBox.style.filter = 'brightness(100%)'
            state = false;
        }
        countingTask();
    })

    // Edit function
    editBtn.addEventListener('click', function() {
        // Make contentBox editable and focus it
        todoPart.setAttribute('contenteditable', 'true');
        todoPart.focus();

        // When the user clicks outside the contentBox, save changes and remove the editable attribute
        if (todoPart != '') {
            todoPart.addEventListener('blur', function() {
                todoPart.removeAttribute('contenteditable');
            })
        }else {
            alert('변경할 내용이 없습니다.');
        }
    });

    // Delete function
    deleteBtn.addEventListener('click', function() {
        if(state === true) {
            completedCount--;
        } else {
            pendingCount--;
        }
        countingTask();
        newTodoBox.remove(); // Remove the entire todo box
    });

    //카테고리 변경
    ctgy.addEventListener('click', (e) => {
        e.preventDefault();
        ctgyBtn.classList.toggle('on');
        activeTodoBox = newTodoBox; // Set the currently active Todo box
    });

    // Append the new todo box to the todo list
    todoList.appendChild(newTodoBox);
    ctgyBtn.innerHTML = defaultCtgyText;
}


//버튼 누르면 투두리스트 추가
function addTodo() {
    if(writeTodo.value != '') {
        makeTodoBox();
        ctgyBtn.innerHTML = defaultCtgyText;
        pendingCount++;
        writeTodo.value = '';
        countingTask();
    } else {
        if (ctgyBtn.innerHTML == defaultCtgyText && writeTodo.value == '') {
            alert('카테고리를 선택하고 오늘 할 일을 입력해주세요.')
        } else if (writeTodo.value == ''){
            alert('오늘 할 일을 입력해주세요.');
        } else if (ctgyBtn.innerHTML == defaultCtgyText) {
            alert('카테고리를 선택해주세요.');
        }
    }
}

//엔터키 눌러도 투두 추가되게
function enterKey(event) {
    if (event.keyCode === 13) {
        addTodo();
    }
}

writeTodo.addEventListener('keydown', enterKey);
addBtn.addEventListener('click', addTodo);

//햄버거 누르면 todo_section 사라지게
const hamburger = document.querySelector('.fa-check-circle');
const calBtn = document.querySelector('.fa-calendar');

const todoSection = document.querySelector('.todo_section');
const wallpaperSection = document.querySelector('.wallpaper_section');
const background = document.querySelector('.background');
const slideCalender = document.querySelector('.slideCalendar');


let state = false;
hamburger.addEventListener('click', function() {
    if (state === false) {
        //wallpaper 우측으로, todo_section 슬라이드 우측
        hamburger.setAttribute('class', 'fas fa-check-circle');
        todoSection.style.transform = 'translateX(0)'
        wallpaperSection.style.width = '60%'
        background.style.width = '100%'


        state = true;
    } else {
        hamburger.setAttribute('class', 'far fa-check-circle');
        background.style.width = '100%'
        wallpaperSection.style.width = '100vw'
        background.style.width = '100vw'
        todoSection.style.transform = 'translateX(100%)'
        
        state = false;
    }
})

calBtn.addEventListener('click', function() {
    if(state === false) {
        calBtn.setAttribute('class', 'fas fa-calendar');
        slideCalender.style.transform = 'translateX(0)'
        background.style.justifyContent = 'space-between'
        wallYear.style.visibility = 'hidden'

        state = true;
    } else {
        calBtn.setAttribute('class', 'far fa-calendar');
        slideCalender.style.transform = 'translateX(-100%)'
        wallYear.style.visibility = 'visible'

        state = false;
    }
})

//검색기능
const searchTodo = document.querySelector('.searchTodo');

function searchInput() {
    let filter = searchTodo.value.toLowerCase();
    let todoBoxes = todoList.querySelectorAll('.todoBox');

    todoBoxes.forEach(function(box) {
        let todoText = box.querySelector('.todoPart').textContent.toLowerCase();
        if (todoText.includes(filter)) {
            box.style.display = '';
        } else {
            box.style.display = 'none';
        }
    })
}
function enterSearch(e) {
    if(e.keyCode === 13) {
        e.preventDefault();
        searchInput();
    }
}
searchTodo.addEventListener('keydown', enterSearch);

//캘린더
const yearBox = document.querySelector('.yearBox')
const header = document.querySelector('header h3');
const dates = document.querySelector('.dates');
const navs = document.querySelectorAll('.fa-chevron-left, .fa-chevron-right');

// const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
// ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let today = new Date();
let month = today.getMonth();
let years = today.getFullYear();

function renderCalendar() {
    const start = new Date(years, month, 1).getDay();
    const endDate = new Date(years, month+1, 0).getDate();
    const end = new Date(years, month, endDate).getDay();
    const endDatePrev = new Date(years, month, 0).getDate();

    let datesHtml = "";

    for(let i = start; i > 0; i--) {
        datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
    }

    for(let i = 1; i <= endDate; i++) {
        let className = 
            i === today.getDate() &&
            month === new Date().getMonth() &&
            years === new Date().getFullYear()
            ? 'class="today"' : "";

        datesHtml += `<li ${className}>${i}</li>`
    }

    for (let i = end; i < 6; i++) {
        datesHtml += `<li class="inactive">${i - end + 1}</li>`
    }

    dates.innerHTML = datesHtml;
    header.textContent = `${month + 1}`
    yearBox.textContent = `${years}`
}

navs.forEach(nav => {
    nav.addEventListener('click', e => {
        if(e.target.classList.contains('fa-chevron-left')) {
            month--;
            if(month < 0) {
                years--;
                month = 11;
            }
        } else if (e.target.classList.contains('fa-chevron-right')){
            month++;
            if(month > 11) {
                years++;
                month = 0;
            }
        }

        today = new Date(years, month, new Date().getDate());
        years = today.getFullYear();
        month = today.getMonth();

        renderCalendar();
    })
})
renderCalendar();


// //달력 누르면 할 일 보여주기
// let selectedDay = document.querySelectorAll('.dates li');
// let dailyTodo = document.querySelector('.dailyTodo');
// let todayNum = document.querySelector('.today');

// if(writtenDate.includes('todayNum')) {
//     dailyTodo.innerHTML += `<li></li>`
// }   
// selectedDay.forEach(someday => {

//     someday.addEventListener('click', () => {
//         someday.setAttribute('class', 'selected');
//         dailyTodo.innerHTML += '<li>test</li>'
//     })
// })
