# Gemini API Setup Guide

## Step 1: Get Your API Key

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key" button
   - Choose "Create API Key in new project" or select existing project
   - Copy the generated API key

## Step 2: Configure Environment Variables

1. **Update .env file**
   ```bash
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Important Notes**
   - Never commit your API key to version control
   - The .env file should be in your .gitignore
   - Restart your development server after changing .env

## Step 3: Enable Billing (Required)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Enable Billing**
   - Navigate to "Billing" in the left sidebar
   - Link a billing account to your project
   - Gemini API requires billing to be enabled

## Step 4: Enable Gemini API

1. **Enable the API**
   - Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Click "Enable"

## API Usage Limits

- **Free Tier**: 15 requests per minute
- **Paid Tier**: Higher limits based on your billing plan
- **Image Analysis**: Limited to 4MB per image
- **Model**: Using gemini-1.5-flash (supports both text and vision)

## Troubleshooting

### Common Issues:

1. **"API key not valid"**
   - Check if the API key is correctly copied
   - Ensure billing is enabled
   - Verify the API is enabled in your project

2. **"Rate limit exceeded"**
   - Wait a minute before making new requests
   - Consider upgrading to paid tier

3. **"Image too large"**
   - Compress images to under 4MB
   - Use JPG or PNG format

4. **"CORS errors"**
   - This is a client-side app, CORS shouldn't be an issue
   - Check if your API key has proper permissions

## Testing Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Try a simple text prompt:
   - Type "Hello, how are you?" in the chat
   - You should get a response from Gemini

3. Test image analysis:
   - Upload an image
   - Ask "What's in this image?"
   - You should get a description

## Security Best Practices

- Keep your API key secure
- Use environment variables
- Monitor your API usage
- Set up billing alerts
- Regularly rotate your API keys 