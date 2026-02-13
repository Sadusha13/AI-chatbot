const chatbody = document.querySelector('.chat-body');
const messageInput = document.querySelector('.message-input')
const sendMessageButton = document.querySelector('#send-message');
const chatForm = document.querySelector('.chat-form');
const chatbotPopup = document.querySelector('.chatbot-popup');
const toggleChatButton = document.querySelector('#close-chatbot');
const fileInput = document.querySelector('.file-upload-input');
const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
const fileCancelButton = document.querySelector('#file-cancel');
const chatbotToggler = document.querySelector('#chatbot-toggler');
const closeChatbot = document.querySelector('#close-chatbot');


const API_KEY = "AIzaSyD_KOczBhH-CUxrtKBjo8-8EzZC-l6W2JU";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

const userData = {
    message: null,
     file:{
        data: null,
        mime_type: null
     }
};
const chatHistory =  [];
const initialinputHeight = messageInput.scrollHeight;

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

    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event('input')); // Reset input height

    // create and display usermessage   
    const messagecontent = `<div class="message-text"></div>
        ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

    const outgoingMessageDiv = createMessageElement(messagecontent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatbody.appendChild(outgoingMessageDiv);
    scrollToBottom();

  const generateBotResponse = async (incomingMessage) => {
    const messageElement = incomingMessage.querySelector(".message-text");
    chatHistory.push({ role: "user", content: userData.message, file: userData.file.data ? {data: userData.file.data, mime_type: userData.file.mime_type} : null });    
    //API request options

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ 
          contents:[{
            parts: [{text: userData.message}, ...(userData.file.data ? [{inline_data: userData.file}] : [])]
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
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
        if (!apiResponseText) {
            throw new Error("Empty response from API");
        }
        messageElement.innerText = apiResponseText;
        scrollToBottom();
    } catch (error) {
        //handle errors gracefully
        console.log(error);
        messageElement.innerText = "Error: " + error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        userData.file = {} ;// Clear file data after response
    
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
       e.preventDefault();
       handleOutgoingMessage(e);
    }
});
// auto-resize message input height based on content
messageInput.addEventListener('input', () => {
    messageInput.style.height = `${initialinputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-body").style.borderRadius = messageInput.scrollHeight > initialinputHeight ? "15px" : "32px";

});

// handle file selection and preview the selected file
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");

        const base64String = e.target.result.split(",")[1];

        // Store the base64 string and MIME type in userData
        userData.file = {
            data: base64String,
            mime_type: file.type
        };
        fileInput.value = "";
    };

    reader.readAsDataURL(file);
});

// handle file cancel button click
fileCancelButton.addEventListener("click", () => {
    fileUploadWrapper.querySelector("img").src = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    userData.file = {};
});
// Initialize emoji picker
const picker = new EmojiMart.Picker({
    theme: 'light',
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if (e.target.id !== 'emoji-picker') {
            document.body.classList.remove("show-emoji-picker");
        }
    }
});

document.querySelector(".chat-form").appendChild(picker);

document.querySelector("#emoji-picker").addEventListener("click", () => {
    document.body.classList.toggle("show-emoji-picker");
});

// Voice input (Speech-to-Text)
const voiceInputButton = document.querySelector('#voice-input');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    voiceInputButton.addEventListener('click', () => {
        if (voiceInputButton.classList.contains('listening')) {
            recognition.stop();
            return;
        }
        recognition.start();
    });

    recognition.addEventListener('start', () => {
        voiceInputButton.classList.add('listening');
        voiceInputButton.textContent = 'graphic_eq';
    });

    recognition.addEventListener('result', (e) => {
        const transcript = Array.from(e.results)
            .map(result => result[0].transcript)
            .join('');
        messageInput.value = transcript;
        messageInput.dispatchEvent(new Event('input'));
    });

    recognition.addEventListener('end', () => {
        voiceInputButton.classList.remove('listening');
        voiceInputButton.textContent = 'mic';
    });

    recognition.addEventListener('error', (e) => {
        console.error('Speech recognition error:', e.error);
        voiceInputButton.classList.remove('listening');
        voiceInputButton.textContent = 'mic';
    });
} else {
    voiceInputButton.title = 'Speech recognition not supported in this browser';
    voiceInputButton.disabled = true;
    voiceInputButton.style.opacity = '0.5';
}

// handle form submit (send button)
chatForm.addEventListener('submit', (e) => handleOutgoingMessage(e));

// fallback click handler (in case submit is blocked)
sendMessageButton.addEventListener('click', (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click())
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

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

// Welcome message HTML
const welcomeMessageHTML = `
    <div class="message bot-message">
        <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">Hello! I'm your AI assistant. How can I help you today?</div>
    </div>`;

// New Chat button — resets everything
document.querySelector('#new-chat').addEventListener('click', () => {
    chatbody.querySelectorAll('.message').forEach(msg => msg.remove());
    chatbody.insertAdjacentHTML('afterbegin', welcomeMessageHTML);
    chatHistory.length = 0;
    userData.message = null;
    userData.file = { data: null, mime_type: null };
    messageInput.value = '';
    messageInput.style.height = `${initialinputHeight}px`;
    fileUploadWrapper.classList.remove('file-uploaded');
    scrollToBottom();
});

// Clear button — clears messages but keeps chat ready
document.querySelector('#clear-chat').addEventListener('click', () => {
    chatbody.querySelectorAll('.message').forEach(msg => msg.remove());
    chatHistory.length = 0;
    userData.file = { data: null, mime_type: null };
    fileUploadWrapper.classList.remove('file-uploaded');
});

// Help button — shows help info as a bot message
document.querySelector('#help-chat').addEventListener('click', () => {
    const helpContent = `
        <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">
            Here's how to use the chatbot:\n\n
            \u2022 Type a message and press Enter or click the send button\n
            \u2022 Click the attachment icon to upload an image\n
            \u2022 Click the mic icon to use voice input\n
            \u2022 Click the emoji icon to add emojis\n
            \u2022 Press Shift+Enter for a new line\n
            \u2022 Use "New chat" to start fresh\n
            \u2022 Use "Clear" to remove all messages
        </div>`;
    const helpMessage = createMessageElement(helpContent, 'bot-message');
    chatbody.appendChild(helpMessage);
    scrollToBottom();
});