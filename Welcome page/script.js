let name;
let todos = JSON.parse(localStorage.getItem('ItemList')) ? JSON.parse(localStorage.getItem('ItemList')) : [];
let message = prompt('Please enter your name');

// Setting up name
function setName() {
    while(!message) {
        message = prompt('You must enter your name!');
    };
    if(message != null) {
        name = message;
    };
};

// Finding today`s date
function findDate() {
    let date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    $('.date').html(`${day}. ${month} ${year}.`);
};

// Setting up time and determining the message
function findTime() {
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    
    if(hour >= 0 && hour < 12) {
        $('.message').html(`Good Morning, ${name}`)
    } else if(hour >= 12 && hour < 18) {
        $('.message').html(`Good Afternoon, ${name}`)
    } else {
        $('.message').html(`Good Evening, ${name}`)
    };
    
    if(hour < 10) {
        hour = '0' + hour;
    };
    
    if(min < 10) {
        min = '0' + min;
    };
        
    $('.clock').html(`${hour} : ${min}`);
}; 

// Set daily motivation and add to Session storage
function focus() {
   if(sessionStorage.getItem('Focus')) {
        let ss = JSON.parse(sessionStorage.getItem('Focus'));
        
        $('.input').html(`${ss}`);
    }

    $('.center').click(function() {
        $('.focus').css({
            'border-bottom': '0', 
            'text-align': 'center',
            'text-shadow': '2px 2px black'
        });
        sessionStorage.setItem('Focus', JSON.stringify($('.focus').val()));

        $('.focus').html($('.focus').val());
    });
};

// Get random quote
fetch("https://type.fit/api/quotes")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
        let q = Math.floor(Math.random() * data.length);

        // Check if author of quote exist
        if(data[q].author === null) {
            data[q].author = 'Unknown';
        }

        $('.quote').html(`"${data[q].text}"`).css('text-align', 'center');
        $('.author').html(`- ${data[q].author}`).css('text-align', 'center');
});

// Add item to list using Enter or mouse click
$(function() {
    $('#toDo-input').keyup(function(e) {
        if(e.code === 'Enter') {
            if(!$('#toDo-input').val()) {
                return false;
            };
            newItem(); 
            saveLS();
        };
    });

    $('h2').click(function(e) {
        if($(e.target).hasClass('fa-check-circle')) {
            if(!$('#toDo-input').val()) {
                return false;
            };
            newItem();
            saveLS();
        };
    });
});

// Create new list item
function newItem() {
    let item = `
                <li class="d-flex justify-content-between h-100 small text-wrap text-break">- ${$('#toDo-input').val()}<i class="far fa-trash-alt align-self-center mr-2" role='button'></i></li>
        `;

    $('ul').append(item);
};

// Check if there are items in Local storage
function checkLS() {
    if(todos) {
        todos.forEach(i => {
            let li = `
                        <li class="d-flex justify-content-between h-100 small text-wrap text-break">- ${i}<i class="far fa-trash-alt align-self-center mr-2" role='button'></i></li>
            `;

            $('ul').append(li);
        });
    };
};

// Save to-do items to Local storage
function saveLS() {
    let toDoItem = $('#toDo-input').val();

    todos.push(toDoItem);

    localStorage.setItem('ItemList', JSON.stringify(todos));

    // Clear input field
    $('#toDo-input').val('');
};

// Remove to-do item
$('ul').click(function(e) {
    if($(e.target).hasClass('fa-trash-alt')) {
        // Removing to-do item from DOM
        e.target.parentElement.remove();
        
        // Removing to-do item from Local storage
        let word = (e.target.parentElement.textContent).slice(2);
        
        let index = todos.indexOf(word);
        
        todos.splice(index, 1);
        localStorage.setItem('ItemList', JSON.stringify(todos));
    };
});

window.addEventListener('load', () => {
    setName();
    checkLS();
    findTime();
    findDate();
    focus();
    setInterval(findTime, 1000);
});
