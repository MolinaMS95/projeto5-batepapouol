let user = {name: ""};
const loading = document.querySelector('.loading');
const loginInfo = document.querySelector('.login');
const sideMenu = document.querySelector('.menu');
let selectedParticipant = "Todos";
let selectedVisibility = "Público";
let target = document.querySelector('.target');

function registerUser(){
    const id = document.querySelector('.name').value;
    user.name = id;
    loading.classList.remove('hidden');
    loginInfo.classList.add('hidden');
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);
    promise.then(loadMessages);
    promise.catch(invalidUser);
}

function invalidUser(){
    const input = document.querySelector('.name');
    input.value = "";
    user = {name: ""};
    alert('Nome inválido, escolha outro:');
    loading.classList.add('hidden');
    loginInfo.classList.remove('hidden');
}

function loadMessages(){
    if(user.name !== ""){
        const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        promise.then(renderizeMessages);
        promise.catch(loadingError);
        const loginScreen = document.querySelector('.loginScreen');
        loginScreen.classList.add('hidden');
        const chat = document.querySelector('.mainContent');
        chat.classList.remove('hidden');
    }
}
setInterval(loadMessages, 3000);

function renderizeMessages(response){
    const arrayMessages = response.data;
    const chat = document.querySelector('.messages');
    chat.innerHTML = '';
    for(let i=0; i< arrayMessages.length; i++){
        let hour = arrayMessages[i].time;
        let sender = arrayMessages[i].from;
        let recipient = arrayMessages[i].to;
        let message = arrayMessages[i].text;
        switch(arrayMessages[i].type){
            case 'status':
                chat.innerHTML += 
                    `<li class="status">
                        <p><time>(${hour})</time><strong>${sender}</strong> ${message}</p>
                    </li>`
                break;
            case 'message':
                chat.innerHTML += 
                    `<li class="normal"> 
                        <p><time>(${hour})</time><strong>${sender}</strong> para <strong>${recipient}:</strong> ${message}</p>
                    </li>`
                break;
            case 'private_message':
                if(sender===user.name || recipient===user.name){
                    chat.innerHTML += 
                    `<li class="private">
                        <p><time>(${hour})</time><strong>${sender}</strong> reservadamente para <strong>${recipient}:</strong> ${message}</p>
                    </li>`
                }
        }
    }
    chat.lastChild.scrollIntoView();
}

function loadingError(){
    alert('Erro ao carregar as mensagens!');
}

function keepConnection(){
    if(user.name !== ""){
        axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    }
}
setInterval(keepConnection, 5000);

function send(){
    let textInput = document.querySelector('.text');
    let writing = textInput.value;
    let recipient = document.querySelector('.participants .selected');
    let visibility = document.querySelector('.visibility .selected');
    let textObject = {};
    if (recipient === null || recipient.children[1].innerHTML === "Todos"){
        textObject = {from: user.name, to: "Todos", text: writing, type: "message"};
    }
    else {
        if(visibility === null || visibility.children[1].innerHTML === "Público"){
            textObject = {from: user.name, to: recipient.children[1].innerHTML, text: writing, type: "message"};
        }
        else{
            textObject = {from: user.name, to: recipient.children[1].innerHTML, text: writing, type: "private_message"};
        }
    }
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', textObject);
    promise.then(succesfulSending);
    promise.catch(failedSending);
    textInput.value="";
}

function succesfulSending(){
    loadMessages();
}

function failedSending(){
    window.location.reload();
}

let input = document.querySelector('.text');
input.addEventListener("keypress", event => {
    if(event.key === "Enter"){
        event.preventDefault();
        document.querySelector('.sendMessage').click();
    }
});

function openMenu(){
    sideMenu.classList.remove('hidden');
}

function closeMenu(){
    sideMenu.classList.add('hidden');
}

function getParticipants(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(listParticipants);
}
getParticipants();
setInterval(getParticipants, 10000);

function listParticipants(list){
    const arrayParticipants = list.data;
    const participants = document.querySelector('.participants');
    participants.innerHTML =
    `<li onclick="select(this)">
        <ion-icon class="menuButton" name="people"></ion-icon>
        <p>Todos</p>
        <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
    </li>`;
    target.innerHTML = `Enviando para Todos (Público)`;
    for(let i=0; i<arrayParticipants.length; i++){
        let id = arrayParticipants[i].name;
        if(id === selectedParticipant){
            participants.innerHTML += 
            `<li onclick="select(this)" data-identifier="participant" class="selected">
                <ion-icon name="person-circle"></ion-icon>
                <p>${id}</p>
                <ion-icon class="check" name="checkmark-sharp"></ion-icon>
            </li>`
            target.innerHTML = `Enviando para ${selectedParticipant} (${selectedVisibility})`;
        } else{
            participants.innerHTML += 
            `<li onclick="select(this)" data-identifier="participant">
                <ion-icon name="person-circle"></ion-icon>
                <p>${id}</p>
                <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
            </li>`
        }
    }
}

function select(item){
    const section = item.parentNode;
    for (let i = 0; i <section.children.length; i++){
        if(section.children[i].classList.contains('selected')){
            section.children[i].classList.remove('selected');
            section.children[i].lastElementChild.classList.add('hidden');
        }
    }
    item.classList.add('selected');
    item.lastElementChild.classList.remove('hidden');
    if(section.className === 'participants'){
        selectedParticipant = item.children[1].innerHTML;
    }
    else if(section.className === 'visibility') {
        selectedVisibility = item.children[1].innerHTML;
    }
    if(selectedParticipant==="Todos"){
        target.innerHTML = `Enviando para ${selectedParticipant} (Público)`;
    }
    else{
        target.innerHTML = `Enviando para ${selectedParticipant} (${selectedVisibility})`;
    }
}