let user = {name: prompt('Qual o seu nome?')};

function registerUser(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);
    promise.then(loadMessages);
    promise.catch(invalidUser);
}
registerUser();

function invalidUser(){
    user = {name: prompt('Nome inválido, escolha outro:')};
    registerUser();
}

function loadMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(renderizeMessages);
    promise.catch(loadingError);
}
setInterval(loadMessages, 3000);

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
                        <p><time>${hour}</time><strong>${sender}</strong> ${message}</p>
                    </li>`
                break;
            case 'message':
                chat.innerHTML += 
                    `<li class="normal"> 
                        <p><time>${hour}</time><strong>${sender}</strong> para <strong>${recipient}:</strong> ${message}</p>
                    </li>`
                break;
            case 'private_message':
                if(recipient===user || recipient==='Todos'){
                    chat.innerHTML += 
                    `<li class="private">
                        <p><time>${hour}</time><strong>${sender}</strong> reservadamente para <strong>${recipient}:</strong> ${message}</p>
                    </li>`
                }
        }
    }
    chat.lastChild.scrollIntoView();
}

function loadingError(){
    alert('Erro ao carregar as mensagens!');
}

/*function keepConnection(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    promise.then(loadMessages);
    promise.catch()
}
setInterval(keepConnection, 5000);*/