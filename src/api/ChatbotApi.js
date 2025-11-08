import axios from 'axios';

const BASE_URL = 'https://student-academic-assistant-ai.onrender.com';

const ChatbotApi = {
  async ask(message) {
    const response = await axios.post(`${BASE_URL}/ask`, { question: message });
    return response.data;
  }
};

export default ChatbotApi;
