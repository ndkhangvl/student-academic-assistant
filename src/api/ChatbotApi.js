import axios from 'axios';
//const BASE_URL = 'https://student-academic-assistant-ai.onrender.com';
const BASE_URL = 'http://127.0.0.1:8000';
//const BASE_URL = 'https://student-academic-assistant-ai.onrender.com';

const ChatbotApi = {
  async ask(message) {
    const response = await axios.post(`${BASE_URL}/ask`, { question: message });
    return response.data;
  }
};

export default ChatbotApi;
