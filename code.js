let user = {name: ""};

function registerUser(){
    const id = document.querySelector('.name').value;
    user.name = id;
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);
    promise.then(loadMessages);
    promise.catch(invalidUser);
}

function invalidUser(){
    const input = document.querySelector('.name');
    input.value = "";
    user = {name: ""};
    alert('Nome inválido, escolha outro:');
}

function loadMessages(){
    if(user.name !== ""){
        const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        promise.then(renderizeMessages);
        promise.catch(loadingError);
        const loginScreen = document.querySelector('.loginScreen');
        if(loginScreen.classList.contains('loginScreen')){
            loginScreen.classList.remove('loginScreen')
            loginScreen.classList.add('hidden');
            const chat = document.querySelector('.mainContent');
            chat.classList.remove('hidden');
        }
    }
}

function renderizeMessages(response){
    const arrayMessages = response.data;
    const chat = document.querySelector('.messages');
    chat.innerHTML = '';
    for(i=0; i< arrayMessages.length; i++){
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
                if(recipient===user.name || recipient==='Todos'){
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
    let textObject = {from: user.name, to: "Todos", text: writing, type: "message"};
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