# E1 Chatbot - AI Assistant

A professional chatbot application powered by Google's Gemini 2.5 Flash API with conversation history and beautiful UI.

## Features

- 🤖 **AI-Powered**: Uses Google Gemini 2.5 Flash (Free API)
- 💬 **Multi-Conversation**: Manage multiple chat threads
- 🎨 **Beautiful UI**: Professional design with dark/light themes
- 📱 **Responsive**: Works on desktop and mobile
- 💾 **Persistent**: Conversations saved in MongoDB
- ⚡ **Real-time**: Streaming AI responses

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Shadcn/ui components
- Axios for API calls
- React Router for navigation

### Backend
- FastAPI (Python)
- MongoDB (Motor async driver)
- Google GenAI SDK
- Pydantic for validation

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB
- Gemini API key from https://aistudio.google.com/

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd chatbot
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   
   Create `backend/.env`:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=chatbot_db
   CORS_ORIGINS=http://localhost:3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start Backend**
   ```bash
   cd backend
   uvicorn server:app --reload --port 8001
   ```

5. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   ```

6. **Configure Frontend Environment**
   
   Create `frontend/.env`:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

7. **Start Frontend**
   ```bash
   cd frontend
   yarn start
   ```

8. **Open browser** at http://localhost:3000

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
- Frontend: Netlify, Vercel, or any static host
- Backend: Render, Railway, or any Python hosting
- Database: MongoDB Atlas (free tier)

## API Endpoints

All endpoints are prefixed with `/api`:

- `GET /api/` - Health check
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - Get all conversations
- `DELETE /api/conversations/{id}` - Delete conversation
- `GET /api/conversations/{id}/messages` - Get messages
- `POST /api/conversations/{id}/messages` - Send message and get AI response

## Environment Variables

### Backend
- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `MONGO_URL` - MongoDB connection string (required)
- `DB_NAME` - Database name (required)
- `CORS_ORIGINS` - Allowed origins for CORS (required)

### Frontend
- `REACT_APP_BACKEND_URL` - Backend API URL (required)

## Project Structure

```
/app
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── .env              # Environment variables (not in git)
│   └── render.yaml       # Render deployment config
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Global styles
│   │   ├── components/
│   │   │   ├── chat/     # Chat components
│   │   │   ├── layout/   # Layout components
│   │   │   └── ui/       # Shadcn/ui components
│   ├── package.json      # Node dependencies
│   ├── .env              # Environment variables (not in git)
│   └── .env.production   # Production environment
├── netlify.toml          # Netlify configuration
├── DEPLOYMENT.md         # Deployment guide
└── README.md            # This file
```

## Features in Detail

### Conversation Management
- Create unlimited conversations
- Auto-generated titles from first message
- Delete conversations
- Switch between conversations seamlessly

### AI Integration
- Powered by Gemini 2.5 Flash
- Context-aware responses (remembers conversation history)
- Markdown support in responses
- Streaming responses for real-time feel

### UI/UX
- Professional design following design guidelines
- Dark/Light theme toggle
- Responsive sidebar for mobile
- Typing indicators
- Smooth animations
- Clean message bubbles

## License

MIT License - Feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.

## Credits

- Built with ❤️ using React, FastAPI, and Google Gemini
- UI components from Shadcn/ui
- Icons from Lucide React