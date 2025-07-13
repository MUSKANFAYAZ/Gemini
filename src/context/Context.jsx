import { createContext, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem('gemini-chat-history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // Sidebar functionality states
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('gemini-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      theme: 'light',
      fontSize: 'medium',
      autoSave: true,
      notifications: true
    };
  });

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyC3QCvJovE1A6XwOSmZSuycT4J0f5z0GeQ");

  // Apply settings on mount and load chat history
  useEffect(() => {
    applySettingsToDocument(settings);
    
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('gemini-chat-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading chat history:', error);
        localStorage.removeItem('gemini-chat-history');
      }
    }
  }, []);

  const runChat = async (prompt) => {
    if (!prompt.trim()) return;

    setLoading(true);
    setShowResult(true);
    setRecentPrompt(prompt);

    try {
      let model, result, response, text;

      if (uploadedImage) {
        // For image + text input
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Convert image to base64
        const imageData = await fileToGenerativePart(uploadedImage);
        
        result = await model.generateContent([prompt, imageData]);
        response = await result.response;
        text = response.text();
        
        // Clear image after processing
        setUploadedImage(null);
      } else {
        // For text-only input
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();
      }

      setResultData(text);
      
      // Add to chat history
      const newChat = {
        id: Date.now(),
        prompt: prompt,
        response: text,
        timestamp: new Date().toLocaleString(),
        hasImage: !!uploadedImage
      };
      
      const updatedHistory = [newChat, ...chatHistory];
      setChatHistory(updatedHistory);
      setPreviousPrompt(prev => [prompt, ...prev]);
      
      // Save to localStorage
      localStorage.setItem('gemini-chat-history', JSON.stringify(updatedHistory));
      
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setResultData("Sorry, I encountered an error. Please check your API key and try again. Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert file to GenerativePart
  const fileToGenerativePart = async (file) => {
    const data = await file.arrayBuffer();
    return {
      inlineData: {
        data: btoa(String.fromCharCode(...new Uint8Array(data))),
        mimeType: file.type,
      },
    };
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert('Image size should be less than 4MB');
        return;
      }
      
      setUploadedImage(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const handleVoiceInput = () => {
    // Placeholder for voice input functionality
    alert('Voice input feature coming soon!');
  };

  const onSent = async () => {
    if (!input.trim() && !uploadedImage) return;
    await runChat(input);
    setInput(""); // Clear input after sending
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSent();
    }
  };

  const clearChat = () => {
    // Don't clear the history, just reset the current conversation
    setPreviousPrompt([]);
    setShowResult(false);
    setResultData("");
    setRecentPrompt("");
    setInput("");
    setUploadedImage(null);
    
    // Show notification
    showNotification('New chat started', 'info');
  };

  const clearAllHistory = () => {
    setChatHistory([]);
    setPreviousPrompt([]);
    setShowResult(false);
    setResultData("");
    setRecentPrompt("");
    setInput("");
    setUploadedImage(null);
    
    // Clear from localStorage
    localStorage.removeItem('gemini-chat-history');
    
    // Show notification
    showNotification('All chat history cleared', 'success');
  };

  // Sidebar functionality handlers
  const handleHistoryClick = () => {
    setShowHistory(true);
    setShowHelp(false);
    setShowSettings(false);
  };

  const handleHelpClick = () => {
    setShowHelp(true);
    setShowHistory(false);
    setShowSettings(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setShowHistory(false);
    setShowHelp(false);
  };

  const closeAllModals = () => {
    setShowHistory(false);
    setShowHelp(false);
    setShowSettings(false);
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    // Save to localStorage
    localStorage.setItem('gemini-settings', JSON.stringify(updatedSettings));
    
    // Apply settings to document
    applySettingsToDocument(updatedSettings);
  };

  const applySettingsToDocument = (currentSettings) => {
    const root = document.documentElement;
    
    // Apply theme
    root.setAttribute('data-theme', currentSettings.theme);
    
    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.fontSize = fontSizeMap[currentSettings.fontSize] || '16px';
  };

  const exportChatHistory = () => {
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-chat-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Chat history exported successfully', 'success');
  };

  const deleteChatHistory = () => {
    if (window.confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
      clearAllHistory();
    }
  };

  const deleteSingleChat = (chatId) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);
    localStorage.setItem('gemini-chat-history', JSON.stringify(updatedHistory));
    showNotification('Chat deleted successfully', 'success');
  };

  const showNotification = (message, type = 'info') => {
    if (!settings.notifications) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    // Set background color based on type
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#17a2b8',
      warning: '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const contextValue = {
    previousPrompt,
    setPreviousPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    chatHistory,
    clearChat,
    clearAllHistory,
    handleKeyPress,
    runChat,
    uploadedImage,
    handleImageUpload,
    removeImage,
    handleVoiceInput,
    // Sidebar functionality
    showHistory,
    showHelp,
    showSettings,
    settings,
    handleHistoryClick,
    handleHelpClick,
    handleSettingsClick,
    closeAllModals,
    updateSettings,
    exportChatHistory,
    deleteChatHistory,
    deleteSingleChat,
    showNotification
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;

