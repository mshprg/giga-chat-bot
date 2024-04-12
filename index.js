const generateMessageBlock = (role, content) => {
    return `<div class="message">
                <p class="author text">${role === 'user' ? 'Вы' : 'GigaChat'}</p>
                <p class="message-text text">${content}</p>
            </div>`
}

const addMessageToRibbon = (message) => {
    ribbon.insertAdjacentHTML(
         'beforeend', generateMessageBlock(message.role, message.content)
    )
}

const scrollToBottom = () => {
    const bottom = messages_area.scrollHeight - messages_area.clientHeight;
    messages_area.scrollTo({
        top: bottom,
        behavior: 'smooth'
    })
}

const sendMessage = async () => {
    const text = textarea.value
    if (text.replaceAll('\n', "").length !== 0) {
        button_text.style.display = 'none'
        loading.classList.remove('loading_none')
        const message = {
            role: 'user',
            content: text
        }
        messages.push(message)

        empty_text.style.display = 'none'
        ribbon.style.justifyContent = 'flex-start'

        addMessageToRibbon(message)
        scrollToBottom()

        textarea.value = ""
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';

        const formData = new FormData();
        formData.append('history', JSON.stringify(messages));
        const response = await fetch(URL + "/api/send-message", {
            method: 'POST', // Метод POST
            body: formData // Тело запроса
        })
        // .then(response => response.json()) // Ожидаем ответ и преобразуем его в JSON
        // .then(data => console.log(data)) // Выводим данные в консоль
        // .catch(error => console.error('Error:', error)); // Обрабатываем ошибки
        const message_response = await response.json()

        button_text.style.display = 'block'
        loading.classList.add('loading_none')

        addMessageToRibbon(message_response)
        scrollToBottom()
    }
}

const empty_text = document.getElementById('empty-text')
const textarea = document.getElementById('textarea');
const ribbon = document.getElementById('ribbon')
const messages_area = document.getElementById('messages-area')
const sendButton = document.getElementById('send')
const loading = document.getElementById('loading')
const button_text = document.getElementById('button-text')
const messages = []
const URL = "http://127.0.0.1:4567"

textarea.addEventListener("keydown", async function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage().then()
    }
});

textarea.addEventListener('input', (event) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
});

sendButton.addEventListener('click', async () => {
    sendMessage().then()
})
