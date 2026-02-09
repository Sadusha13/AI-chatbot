const chatbody = document.querySelector('.chat-body');
const messageInput = document.querySelector('.message-input')
const sendMessageButton = document.querySelector('#send-message');
const chatForm = document.querySelector('.chat-form');
const chatbotPopup = document.querySelector('.chatbot-popup');
const toggleChatButton = document.querySelector('#close-chatbot');

const API_KEY = "AIzaSyCujOoS8TDCerY94c2ByxY7MvvmBGA0gPY";
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

const userData = {
    message: null
};

const createMessageElement = (content, ...classes) => {
    const div = document.createElement('div');
    div.classList.add('message', ...classes);
    div.innerHTML = content;
    return div;
}

const scrollToBottom = () => {
    chatbody.scrollTop = chatbody.scrollHeight;
};
// generate bot response using Gemini API
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    if (!userData.message) {
        return;
    }
    messageInput.value = '';

    // create and display usermessage   
    const messagecontent = ` <div class="message-text"></div>`;

    const outgoingMessageDiv = createMessageElement(messagecontent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatbody.appendChild(outgoingMessageDiv);
    scrollToBottom();

  const generateBotResponse = async (incomingMessage) => {
    const messageElement = incomingMessage.querySelector(".message-text");
    //API request options

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ 
          contents:[{
            parts: [{text: userData.message}],
        }]
        })
    };
    if (!API_KEY) {
        messageElement.innerText = "Error: API key is missing";
        scrollToBottom();
        incomingMessage.classList.remove("thinking");
        return;
    }
    try {
        // const response from API
        const response = await fetch(`${API_URL}?key=${API_KEY}`, requestOptions);
        const data = await response.json();
        if(!response.ok) {throw new Error (data.error?.message || "API request failed");}
 
        //extract and display the bot response
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.?)\*\*/g, '$1').trim();
        if (!apiResponseText) {
            throw new Error("Empty response from API");
        }
        messageElement.innerText = apiResponseText;
        scrollToBottom();
    } catch (error) {
        console.log(error);
        messageElement.innerText = "Error: " + error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        incomingMessage.classList.remove("thinking");
        scrollToBottom();
    }
  }
//simulate bot response with a delay
    setTimeout(() => {
    const messagecontent = `  <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
     <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
           </svg>
            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div> 
                    <div class="dot"></div>
                </div>
            </div>`;

    const incomingMessage = createMessageElement(messagecontent,"bot-message", "thinking");
    chatbody.appendChild(incomingMessage);
    scrollToBottom();
    generateBotResponse(incomingMessage);
    },600);
};

// handle enter key press for sending message
messageInput.addEventListener('keydown', (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === 'Enter' && !e.shiftKey && userMessage) {
       handleOutgoingMessage(e);
    }
});

// handle form submit (send button)
chatForm.addEventListener('submit', (e) => handleOutgoingMessage(e));

// fallback click handler (in case submit is blocked)
sendMessageButton.addEventListener('click', (e) => handleOutgoingMessage(e));

// toggle chat popup (header button only)
if (toggleChatButton && chatbotPopup) {
    toggleChatButton.addEventListener('click', () => {
        chatbotPopup.classList.toggle('collapsed');
        toggleChatButton.setAttribute(
            'aria-label',
            chatbotPopup.classList.contains('collapsed') ? 'Expand chat' : 'Collapse chat'
        );
    });
}