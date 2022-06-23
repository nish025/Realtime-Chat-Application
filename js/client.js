const socket = io('http://localhost:8000');

//get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

//audio that will play on receveing messages
var audio = new Audio('tng.mp3');

//function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append( messageElement);
    if(position =='left'){
        audio.play();
    }

}

// if the form gets submitted, send server the message 
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value ;
    console.log("message",message);
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})
//ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// tf the new user joins, receive his/her name from the server 
socket.on('user-joined', name =>{
append(`${name} joined the chat`, 'right')
})

//if the server sends a message, receive it 
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`,'left')
})

//if the user leaves the chat , append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`,'right')
})