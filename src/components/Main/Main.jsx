import React, { useContext, useRef } from "react";
import "./main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    handleKeyPress,
    chatHistory,
    runChat,
    uploadedImage,
    handleImageUpload,
    removeImage,
    handleVoiceInput
  } = useContext(Context);

  const fileInputRef = useRef(null);

  const handleCardClick = (prompt) => {
    runChat(prompt);
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev</span>
              </p>
              <p>How can I help you today</p>
            </div>

            <div className="cards">
              <div className="card" onClick={() => handleCardClick("Suggest beautiful places to see on an upcoming road trip")}>
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>

              <div className="card" onClick={() => handleCardClick("Briefly summarize this concept : urban planning")}>
                <p>Briefly summarize this concept : urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>

              <div className="card" onClick={() => handleCardClick("Brainstorm team bonding activities for our work retreat")}>
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>

              <div className="card" onClick={() => handleCardClick("Improve the readability of the following code")}>
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <div>
                <p>{recentPrompt}</p>
                {uploadedImage && (
                  <div className="uploaded-image">
                    <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" />
                    <button onClick={removeImage} className="remove-image">×</button>
                  </div>
                )}
              </div>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData.replace(/\n/g, '<br/>') }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={handleKeyPress}
              value={input} 
              type="text" 
              placeholder={uploadedImage ? "Ask about the image..." : "Enter a prompt here"} 
            />
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <img 
                src={assets.gallery_icon} 
                alt="" 
                onClick={handleGalleryClick}
                className={uploadedImage ? 'active' : ''}
              />
              <img src={assets.mic_icon} alt="" onClick={handleVoiceInput} />
              <img 
                onClick={() => onSent()} 
                src={assets.send_icon} 
                alt="" 
                className={(!input.trim() && !uploadedImage) ? 'disabled' : ''}
              />
            </div>
          </div>

          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
