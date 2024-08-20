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



//날짜에 해당하는 투두리스트 넣을 공간
const dailyTodo = document.querySelector('.dailyTodo');


//투두리스트 담을 객체
let todos = {}

// 날짜에 해당하는 투두리스트를 표시하는 함수
function showTodos(date) {
    dailyTodo.innerHTML = `<p>${date}</p>`
    // dailyTodo.innerHTML = ''; // 기존 내용을 초기화
    if (todos[date]) {
        todos[date].forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.textContent = todo;
            dailyTodo.appendChild(todoItem);
        });
    } else {
        dailyTodo.innerHTML = '<p>투두리스트를 추가하세요 :)</p>';
    }
}




// 투두리스트 추가
const addBtn = document.querySelector('.addBtn');
const writeTodo = document.querySelector('.writeTodo');
const todoList = document.getElementById('todo_list');
const category = document.querySelector('.category');

//완료, 미완료 개수 세기
const completed = document.querySelector('.completedCount');
const pending = document.querySelector('.pendingCount');
let pendingCount = 0;
let completedCount = 0;
completed.textContent = completedCount;
pending.textContent = pendingCount;

function countingTask() {
    completed.textContent = completedCount;
    pending.textContent = pendingCount;
}   


//투두박스 만들기
function makeTodoBox() {
    countingTask();
    //html에 만들어져있는 todoBox 복제
    let template = document.getElementById('todo_template').children[0];
    let newTodoBox = template.cloneNode(true);

    //투두리스트 내용
    let todoPart = newTodoBox.querySelector('.todoPart');
    todoPart.textContent = writeTodo.value;

    let ctgy = newTodoBox.querySelector('.ctgy');
    var writtenDate = newTodoBox.querySelector('.writtenDate');

    //카테고리, 날짜 설정
    let selectedCtgy = category.innerText;
    let months = today.getMonth() + 1;
    let year = today.getFullYear();
    let days = today.getDate();
    
    ctgy.textContent = selectedCtgy;
    writtenDate.value = `${year}-${String(months).padStart(2, '0')}-${String(days).padStart(2, '0')}`;
    
    // 투두리스트에 날짜별로 저장
    if (!todos[writtenDate.value]) {
        todos[writtenDate.value] = [];
    }
    todos[writtenDate.value].push(todoPart.textContent);

    // 날짜 변경 시 실시간 업데이트
    writtenDate.addEventListener('change', () => {
        let oldDate = Object.keys(todos).find(date => todos[date].includes(todoPart.textContent));
        if (oldDate && oldDate !== writtenDate.value) {
            todos[oldDate] = todos[oldDate].filter(todo => todo !==todoPart.textContent);
            if (!todos[writtenDate.value]) {
                todos[writtenDate.value] = [];
            }
            todos[writtenDate.value].push(todoPart.textContent);
        }
        showTodos(writtenDate.value); // 날짜 변경 시 dailyTodo 업데이트
    });
    

    //완료, 수정, 삭제버튼
    let checkBtn = newTodoBox.querySelector('.fa-check-circle').parentNode;
    let editBtn = newTodoBox.querySelector('.fa-pen').parentNode;
    let deleteBtn = newTodoBox.querySelector('.fa-trash-alt').parentNode;

    let state = false;

    //완료
    checkBtn.addEventListener('click', function() {
        if (state === false) {
            completedCount++;
            pendingCount--;
            newTodoBox.style.filter = 'brightness(50%)'
            state = true;
            dailyTodo
        } else {
            completedCount--;
            pendingCount++;
            editBtn.style.color = 'black';
            newTodoBox.style.filter = 'brightness(100%)'
            state = false;
        }
        countingTask();
    })

    //수정
    editBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (state === true) {
            editBtn.style.color = 'red';
            setTimeout(() => {
                editBtn.style.color = 'black';
            },2000)
            todoPart.setAttribute('contenteditable', 'false');
        } else {
            todoPart.setAttribute('contenteditable', 'true');
            todoPart.focus();
        }
    });

    //삭제
    deleteBtn.addEventListener('click', function() {
        if(state === true) {
            completedCount--;
        } else {
            pendingCount--;
        }

        let date = writtenDate.value;
        todos[date] = todos[date].filter(todo => todo !== todoPart.textContent);
        countingTask();
        newTodoBox.remove(); 
        showTodos(date);
    });

    //카테고리 변경
    ctgy.addEventListener('click', (e) => {
        e.preventDefault();
        ctgyBtn.classList.toggle('on');
        activeTodoBox = newTodoBox; 
    });


    todoList.appendChild(newTodoBox);
    ctgyBtn.innerHTML = defaultCtgyText;

    showTodos(writtenDate.value);
}



//+ 버튼 누르면 투두리스트 추가
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




//투두 슬라이드
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
        //wallpaper 좌측으로 이동, todo_section 슬라이드 우측에서 나오도록
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

//캘린더 슬라이드
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




function clickedDate() {
    document.querySelectorAll('.dates li').forEach(dateElement => {
        dateElement.addEventListener('click', function () {
            document.querySelectorAll('.dates li').forEach(date => {
                date.classList.remove('selected');
            });

            if (!this.classList.contains('today')) this.classList.add('selected');

            let selectedDay = `${years}-${String(month + 1).padStart(2, '0')}-${String(this.textContent).padStart(2, '0')}`;
            today = new Date(years, month, this.textContent);
            showTodos(selectedDay);

            today = new Date(years, month, parseInt(this.textContent, 10));
        });
    });
}

//캘린더
const yearBox = document.querySelector('.yearBox')
const header = document.querySelector('header h3');
const dates = document.querySelector('.dates');
const navs = document.querySelectorAll('.fa-chevron-left, .fa-chevron-right');

let today = new Date();
let month = today.getMonth();
let years = today.getFullYear();
let days = today.getDate();

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

    // 초기화면에 오늘 날짜의 투두리스트 표시
    let initialDay = `${years}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    showTodos(initialDay);
    clickedDate();
}
    

//캘린더 다른 달로 이동
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


