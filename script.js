import users from './users-data.js';

const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn   = document.getElementById('sendBtn');

// Verify Puter.js SDK loaded
window.addEventListener('load', () => {
  if (!window.puter || !puter.ai || !puter.ai.chat) {
    alert('Error: puter.js SDK not loaded correctly.');
  }
});

const sellerPersona = `SYSTEM: You are Alex Morgan, founder of the "Money Mastery Course".
Use this user data: ${JSON.stringify(users)}
Your goal: convert in 5 steps using the 15 persuasion tricks.
`;

const history = [{ role: 'system', content: sellerPersona }];

function renderHistory() {
  chatbox.innerHTML = '';
  history.slice(1).forEach((msg, idx) => {
    const div = document.createElement('div');
    div.className = 'message ' + msg.role;
    div.textContent = (msg.role === 'user' ? '🧑 ' : '🤖 ') + msg.content;
    const btn = document.createElement('button');
    btn.textContent = 'Edit'; btn.className = 'edit-btn';
    btn.onclick = () => editMessage(idx + 1);
    div.appendChild(btn);
    chatbox.appendChild(div);
  });
  chatbox.scrollTop = chatbox.scrollHeight;
}

function editMessage(idx) {
  const newText = prompt('Edit message:', history[idx].content);
  if (newText !== null) {
    history[idx].content = newText;
    renderHistory();
  }
}

async function sendMessage() {
  const text = userInput.value.trim(); if (!text) return;
  userInput.value = '';
  history.push({ role: 'user', content: text }); renderHistory();

  history.push({ role: 'bot', content: 'Typing…' }); renderHistory();
  const fullPrompt = history
    .map(m => m.role === 'system' ? m.content : `${m.role === 'user' ? 'USER' : 'BOT'}: ${m.content}`)
    .join('\n') + '\nBOT:';
  try {
    const reply = await window.puter.ai.chat(fullPrompt);
    history.pop();
    history.push({ role: 'bot', content: reply });
  } catch (err) {
    history.pop();
    history.push({ role: 'bot', content: '⚠️ Error: ' + err.message });
  }
  renderHistory();
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

// Initial greeting
history.push({ role: 'bot', content: '👑 Welcome, friend. I’m Alex Morgan… What’s your biggest money dream? 🌳' });
renderHistory();
