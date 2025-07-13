# Gemini AI Chatbot

A modern, responsive chatbot application powered by Google's Gemini AI API. This application allows you to have text conversations and analyze images using AI.

## Features

- 🤖 **Text Chat**: Have conversations with Gemini AI
- 🖼️ **Image Analysis**: Upload images and ask questions about them
- 💬 **Chat History**: View and reuse previous conversations
- 🎨 **Modern UI**: Clean, responsive design
- ⚡ **Real-time Responses**: Fast AI responses with loading indicators
- 📱 **Mobile Friendly**: Works on all device sizes

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

1. Rename `gemini.env` to `.env` (if not already done)
2. Update the API key in `.env`:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

### Text Chat
1. Type your question in the input field
2. Press Enter or click the send button
3. Wait for Gemini's response

### Image Analysis
1. Click the gallery icon (📷) in the input area
2. Select an image file (JPG, PNG, etc.)
3. Type your question about the image
4. Press Enter or click send

### Chat History
1. Click the menu icon (☰) to expand the sidebar
2. View your recent conversations
3. Click on any previous chat to reuse it
4. Click "New Chat" to start fresh

## API Models Used

- **gemini-1.5-flash**: For both text conversations and image analysis

## File Structure

```
src/
├── components/
│   ├── Main/           # Main chat interface
│   └── Sidebar/        # Chat history sidebar
├── context/
│   └── Context.jsx     # State management
├── assets/
│   └── assets.js       # Icon imports
└── App.jsx             # Main app component
```

## Troubleshooting

### API Key Issues
- Make sure your API key is valid and has proper permissions
- Check that the environment variable is correctly set
- Ensure you have billing enabled on your Google Cloud account

### Image Upload Issues
- Supported formats: JPG, PNG, GIF, WebP
- Maximum file size: 4MB
- Make sure the image is not corrupted

### Common Errors
- **400 Bad Request**: Check your API key and prompt format
- **429 Too Many Requests**: You've exceeded the rate limit
- **500 Internal Server Error**: Try again in a few minutes

## Technologies Used

- React 19
- Vite
- Google Generative AI SDK
- CSS3 with Flexbox/Grid

## License

This project is for educational purposes. Make sure to comply with Google's API usage terms.
