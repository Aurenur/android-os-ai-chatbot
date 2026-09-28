const STORAGE_KEY = 'ai-os-lite-state';

const demoMessages = [
  { text: 'Hello! I am your AI assistant. What would you like to do today?', type: 'bot' },
  { text: 'Summarize my saved notes and suggest a plan for the week.', type: 'user' },
  { text: 'I found 5 notes related to your goals and created a short action plan for the next 7 days.', type: 'bot' }
];

const defaultLibrary = [
  { title: 'Project Blueprint', date: 'Today' },
  { title: 'AI Memory', date: 'Today' },
  { title: 'Travel Notes', date: 'Yesterday' },
  { title: 'Research Ideas', date: '2 days ago' }
];

const state = {
  messages: loadMessages(),
  library: loadLibrary()
};

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const libraryList = document.getElementById('libraryList');
const addNoteBtn = document.getElementById('addNoteBtn');

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (Array.isArray(saved.messages) && saved.messages.length) return saved.messages;
  } catch (error) {
    console.warn('Could not parse saved chat state.', error);
  }
  return demoMessages;
}

function loadLibrary() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (Array.isArray(saved.library) && saved.library.length) return saved.library;
  } catch (error) {
    console.warn('Could not parse saved library state.', error);
  }
  return defaultLibrary;
}

function renderMessages() {
  chatMessages.innerHTML = '';

  state.messages.forEach((message) => {
    const div = document.createElement('div');
    div.className = `message ${message.type}`;
    div.textContent = message.text;
    chatMessages.appendChild(div);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderLibrary() {
  libraryList.innerHTML = '';

  state.library.forEach((item) => {
    const template = document.getElementById('libraryItemTemplate');
    const clone = template.content.cloneNode(true);
    clone.querySelector('.library-title').textContent = item.title;
    clone.querySelector('.library-date').textContent = item.date;
    libraryList.appendChild(clone);
  });
}

function addBotReply(prompt) {
  const replies = [
    `I reviewed your request: "${prompt}". I can organize it, summarize it, or turn it into a task list.`,
    `Your assistant is ready. Here is a smart action plan for: "${prompt}".`,
    `I saved that idea to your memory and recommended a next step for: "${prompt}".`,
    `Suggestion: break this into a small plan, then create a focused task list for it.`,
    `I can help you with that. I’ve prepared a concise summary for: "${prompt}".`
  ];

  const reply = replies[Math.floor(Math.random() * replies.length)];
  state.messages.push({ text: reply, type: 'bot' });
  saveState();
  renderMessages();
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();

  if (!value) return;

  state.messages.push({ text: value, type: 'user' });
  chatInput.value = '';
  saveState();
  renderMessages();

  setTimeout(() => addBotReply(value), 350);
});

addNoteBtn.addEventListener('click', () => {
  const title = prompt('Add a note to your library:', 'New idea');
  if (!title || !title.trim()) return;

  state.library.unshift({ title: title.trim(), date: 'Now' });
  saveState();
  renderLibrary();
});

renderMessages();
renderLibrary();
