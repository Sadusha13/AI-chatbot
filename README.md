# AI Chatbot

A modern, feature-rich AI chatbot built with HTML, CSS, and JavaScript, powered by the Google Gemini API.

## Features

- **AI-Powered Responses** — Uses Google Gemini 3 Flash Preview for intelligent conversation
- **Image Attachments** — Upload and send images for the AI to analyze
- **Voice Input** — Speech-to-text using the Web Speech API
- **Emoji Picker** — Built-in emoji selector powered by Emoji Mart
- **Auto-Resizing Input** — Textarea grows as you type
- **Chat Management** — New Chat, Clear, and Help buttons
- **Responsive Design** — Toggle chatbot popup with a floating button

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **AI Model:** Google Gemini 3 Flash Preview
- **Icons:** Material Symbols Rounded
- **Emojis:** Emoji Mart

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sadusha13/AI-chatbot.git
   cd AI-chatbot
   ```

2. **Set your API key**  
   Open `script.js` and replace the `API_KEY` value with your own Google Gemini API key:
   ```js
   const API_KEY = "your-api-key-here";
   ```

3. **Open in browser**  
   Simply open `index.html` in a web browser — no build tools required.

## Usage

| Action | How |
|---|---|
| Send a message | Type and press **Enter** or click the send button |
| New line | Press **Shift + Enter** |
| Attach an image | Click the 📎 attachment icon |
| Voice input | Click the 🎤 mic icon |
| Add emoji | Click the 😊 emoji icon |
| Start fresh | Click **New chat** |
| Clear messages | Click **Clear** |
| View help | Click **Help** |

## Project Structure

```
AI-chatbot/
├── index.html    # Main HTML structure
├── script.js     # Chat logic, API calls, event handlers
├── styles.css    # All styling
└── README.md     # This file
```

## Browser Support

- Google Chrome (recommended)
- Microsoft Edge
- Safari
- Firefox (voice input not supported)

## License

This project is open source and available for personal and educational use.
