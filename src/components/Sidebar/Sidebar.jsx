import React, { useState, useContext } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Sidebar = () => {
  const [extended, setExtended] = useState(false)
  const { 
    chatHistory, 
    clearChat, 
    runChat,
    showHistory,
    showHelp,
    showSettings,
    handleHistoryClick,
    handleHelpClick,
    handleSettingsClick,
    closeAllModals,
    exportChatHistory,
    deleteChatHistory,
    clearAllHistory,
    deleteSingleChat
  } = useContext(Context)

  const handleNewChat = () => {
    clearChat()
    setExtended(false)
    closeAllModals()
  }

  const handleChatClick = (prompt) => {
    runChat(prompt)
    setExtended(false)
    closeAllModals()
  }

  return (
    <div className='sidebar'>
      <div className="top">
        <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt="" />
        <div className="new-chat" onClick={handleNewChat}>
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>

        {extended ? (
          <div className="recent">
            <p className='recent-title'>Recent</p>
            {chatHistory.length > 0 ? (
              chatHistory.slice(0, 5).map((chat) => (
                <div 
                  key={chat.id} 
                  className="recent-entry"
                  onClick={() => handleChatClick(chat.prompt)}
                >
                  <img src={assets.message_icon} alt="" />
                  <p>{chat.prompt.length > 30 ? chat.prompt.substring(0, 30) + '...' : chat.prompt}</p>
                </div>
              ))
            ) : (
              <div className="recent-entry">
                <img src={assets.message_icon} alt="" />
                <p>No recent chats</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry" onClick={handleHelpClick}>
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>

        <div className="bottom-item recent-entry" onClick={handleHistoryClick}>
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>

        <div className="bottom-item recent-entry" onClick={handleSettingsClick}>
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chat History ({chatHistory.length})</h3>
              <button className="close-btn" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              {chatHistory.length > 0 ? (
                <div className="history-list">
                  {chatHistory.map((chat) => (
                    <div key={chat.id} className="history-item">
                      <div className="history-item-content" onClick={() => handleChatClick(chat.prompt)}>
                        <div className="history-item-header">
                          <span className="history-timestamp">{chat.timestamp}</span>
                          {chat.hasImage && <span className="history-image-indicator">📷</span>}
                        </div>
                        <p className="history-prompt">{chat.prompt}</p>
                        <p className="history-response">{chat.response.substring(0, 100)}...</p>
                      </div>
                      <button 
                        className="delete-single-chat"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSingleChat(chat.id);
                        }}
                        title="Delete this chat"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-history">No chat history available</p>
              )}
              <div className="history-actions">
                <button onClick={exportChatHistory} className="action-btn export-btn">
                  Export History
                </button>
                <button onClick={clearAllHistory} className="action-btn delete-btn">
                  Clear History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Help & Tips</h3>
              <button className="close-btn" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="help-section">
                <h4>Getting Started</h4>
                <ul>
                  <li>Type your questions in the input field and press Enter</li>
                  <li>Click the gallery icon to upload images for analysis</li>
                  <li>Use the microphone icon for voice input (coming soon)</li>
                  <li>Click on recent chats to continue previous conversations</li>
                </ul>
              </div>
              <div className="help-section">
                <h4>Features</h4>
                <ul>
                  <li><strong>Text Chat:</strong> Ask questions, get explanations, brainstorm ideas</li>
                  <li><strong>Image Analysis:</strong> Upload images and ask questions about them</li>
                  <li><strong>Chat History:</strong> View and reuse previous conversations</li>
                  <li><strong>Export:</strong> Download your chat history as JSON</li>
                </ul>
              </div>
              <div className="help-section">
                <h4>Tips for Better Results</h4>
                <ul>
                  <li>Be specific in your questions</li>
                  <li>For code help, include the programming language</li>
                  <li>For image analysis, ask specific questions about what you see</li>
                  <li>Use follow-up questions to dive deeper into topics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Settings</h3>
              <button className="close-btn" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <SettingsPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Settings Panel Component
const SettingsPanel = () => {
  const { settings, updateSettings } = useContext(Context);

  return (
    <div className="settings-panel">
      <div className="setting-item">
        <label>Theme:</label>
        <select 
          value={settings.theme} 
          onChange={(e) => updateSettings({ theme: e.target.value })}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      
      <div className="setting-item">
        <label>Font Size:</label>
        <select 
          value={settings.fontSize} 
          onChange={(e) => updateSettings({ fontSize: e.target.value })}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      
      <div className="setting-item">
        <label>
          <input 
            type="checkbox" 
            checked={settings.autoSave} 
            onChange={(e) => updateSettings({ autoSave: e.target.checked })}
          />
          Auto-save chat history
        </label>
      </div>
      
      <div className="setting-item">
        <label>
          <input 
            type="checkbox" 
            checked={settings.notifications} 
            onChange={(e) => updateSettings({ notifications: e.target.checked })}
          />
          Enable notifications
        </label>
      </div>
      
      <div className="setting-item">
        <label>API Key Status:</label>
        <span className="api-status">
          {import.meta.env.VITE_GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}
        </span>
      </div>
    </div>
  );
};

export default Sidebar
