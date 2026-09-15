<template>
  <div class="chat-wrapper">
    <div class="app-container">
      <header class="top-bar">
        <div class="user-info">
          <div class="avatar">{{ userInitial }}</div>
          <span>{{ userData.nome || 'Usuário' }}</span>
          <button class="settings-btn" title="Perfil do Usuário" @click="toggleProfile">⚙️</button>
        </div>

        <div v-if="!showProfile" class="chat-target-info">
          <div class="avatar">{{ activeContact.avatar }}</div>
          <span>{{ activeContact.name }}</span>
        </div>
      </header>

      <main v-if="!showProfile" class="chat-view">
        <aside class="sidebar">
          <div
            v-for="contact in contacts"
            :key="contact.id"
            class="contact-card"
            :class="{ active: contact.id === activeContactId }"
            @click="activeContactId = contact.id"
          >
            <div class="avatar">{{ contact.avatar }}</div>
            <div class="contact-details">
              <span class="contact-name">{{ contact.name }}</span>
              <span class="contact-role">{{ contact.role }}</span>
            </div>
          </div>
        </aside>

        <section class="chat-area">
          <div ref="messagesContainer" class="messages-container" @click="closeContextMenu">
            <div
              v-for="msg in activeMessages"
              :key="msg.id"
              class="message"
              :class="[msg.sender, { editing: editingMessageId === msg.id }]"
              @contextmenu.prevent="openContextMenu($event, msg)"
            >
              <div v-if="editingMessageId === msg.id" class="edit-input-wrapper">
                <input
                  v-model="editingText"
                  type="text"
                  class="inline-edit-input"
                  @keyup.enter="saveInlineEdit(msg)"
                  @keyup.esc="cancelInlineEdit"
                  ref="inlineInput"
                />
                <span class="edit-hint">Pressione Enter para salvar ou Esc para cancelar</span>
              </div>

              <template v-else>
                <span>{{ msg.text }}</span>
                <span v-if="msg.edited" class="message-edited">(editado)</span>
              </template>
            </div>
          </div>

          <form class="input-container" @submit.prevent="sendMessage">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Digite sua mensagem..."
              required
            />
            <button type="submit">Enviar</button>
          </form>
        </section>
      </main>

      <main v-else class="profile-view">
        <div class="profile-header">
          <h2>Perfil do Usuário</h2>
        </div>
        
        <div class="profile-grid">
          <div class="profile-card">
            <label>Nome:</label>
            <p>{{ userData.nome || 'Não informado' }}</p>
          </div>
          <div class="profile-card">
            <label>CPF:</label>
            <p>{{ userData.cpf || 'Não informado' }}</p>
          </div>
          <div class="profile-card">
            <label>Peso:</label>
            <p>{{ userData.peso || 'Não informado' }}</p>
          </div>
          <div class="profile-card">
            <label>Data de Nascimento:</label>
            <p>{{ formatDate(userData.dataNascimento) }}</p>
          </div>
          <div class="profile-card">
            <label>E-mail:</label>
            <p>{{ userData.email || 'Não informado' }}</p>
          </div>
          <div class="profile-card">
            <label>Telefone:</label>
            <p>{{ userData.telefone || 'Não informado' }}</p>
          </div>
        </div>

        <div class="profile-actions">
          <button type="button" class="btn-cancel" @click="showProfile = false">Voltar ao Chat</button>
        </div>
      </main>

      <!-- Menu de Contexto posicionado dinamicamente -->
      <div
        v-if="contextMenu.visible"
        class="context-menu"
        :style="contextMenuStyle"
      >
        <button v-if="contextMenu.messageSender === 'sent'" @click="startEditing">✏️ Editar</button>
        <button @click="deleteMessage">🗑️ Apagar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, reactive, onMounted, watch } from 'vue'

const showProfile = ref(false)
const activeContactId = ref(1)
const newMessage = ref('')
const messagesContainer = ref(null)

const editingMessageId = ref(null)
const editingText = ref('')
const inlineInput = ref(null)

const userData = reactive({
  nome: '',
  cpf: '',
  peso: '',
  dataNascimento: '',
  email: '',
  telefone: ''
})

const defaultHistory = {
  1: [
    { id: 101, sender: 'sent', text: 'Olá, nutricionista! Gostaria de melhorar minha alimentação.' },
    { id: 102, sender: 'received', text: 'Olá! O primeiro passo é organizar sua rotina diária.' }
  ],
  2: [
    { id: 201, sender: 'received', text: 'Olá! Como foram suas refeições essa semana?' }
  ],
  3: [],
  4: []
}

const conversationHistory = reactive({})

onMounted(() => {
  const savedData = localStorage.getItem('usuarioLogado')
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      Object.assign(userData, parsed)
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e)
    }
  }

  const savedMessages = localStorage.getItem('chat_historico_mensagens')
  if (savedMessages) {
    try {
      const parsedHistory = JSON.parse(savedMessages)
      Object.assign(conversationHistory, parsedHistory)
    } catch (e) {
      Object.assign(conversationHistory, defaultHistory)
    }
  } else {
    Object.assign(conversationHistory, defaultHistory)
  }

  nextTick(() => {
    scrollToBottom()
  })
})

watch(
  conversationHistory,
  (newHistory) => {
    localStorage.setItem('chat_historico_mensagens', JSON.stringify(newHistory))
  },
  { deep: true }
)

const userInitial = computed(() => {
  return userData.nome ? userData.nome.charAt(0).toUpperCase() : 'U'
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'Não informado'
  const [year, month, day] = dateStr.split('-')
  return day && month && year ? `${day}/${month}/${year}` : dateStr
}

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  alignLeft: false,
  messageId: null,
  messageSender: null
})

// Estilo reativo para posicionamento do menu oposto ao canto mais próximo
const contextMenuStyle = computed(() => {
  const style = { top: `${contextMenu.y}px` }
  if (contextMenu.alignLeft) {
    style.right = `${window.innerWidth - contextMenu.x}px`
  } else {
    style.left = `${contextMenu.x}px`
  }
  return style
})

const contacts = ref([
  { id: 1, name: 'Juliana', role: 'Nutricionista', avatar: 'J' },
  { id: 2, name: 'Carlos', role: 'Nutricionista', avatar: 'C' },
  { id: 3, name: 'Rafael', role: 'Nutricionista', avatar: 'R' },
  { id: 4, name: 'Mariana', role: 'Nutricionista', avatar: 'M' }
])

const activeContact = computed(() => {
  return contacts.value.find(c => c.id === activeContactId.value) || contacts.value[0]
})

const activeMessages = computed(() => {
  return conversationHistory[activeContactId.value] || []
})

watch(activeContactId, () => {
  cancelInlineEdit()
  nextTick(() => {
    scrollToBottom()
  })
})

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  closeContextMenu()
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  if (!conversationHistory[activeContactId.value]) {
    conversationHistory[activeContactId.value] = []
  }

  conversationHistory[activeContactId.value].push({
    id: Date.now(),
    sender: 'sent',
    text: newMessage.value.trim()
  })

  newMessage.value = ''
  await nextTick()
  scrollToBottom()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const openContextMenu = (event, msg) => {
  contextMenu.visible = true
  contextMenu.y = event.clientY
  contextMenu.messageId = msg.id
  contextMenu.messageSender = msg.sender

  if (messagesContainer.value) {
    const rect = messagesContainer.value.getBoundingClientRect()
    const containerCenterX = rect.left + rect.width / 2
    
    // Se a mensagem for pequena e estiver no canto direito, abre para a esquerda
    // Se estiver no lado esquerdo, abre para a direita
    contextMenu.alignLeft = event.clientX > containerCenterX
  } else {
    contextMenu.alignLeft = event.clientX > window.innerWidth / 2
  }

  contextMenu.x = event.clientX
}

const closeContextMenu = () => {
  contextMenu.visible = false
  contextMenu.messageSender = null
}

const deleteMessage = () => {
  const list = conversationHistory[activeContactId.value]
  if (list) {
    conversationHistory[activeContactId.value] = list.filter(m => m.id !== contextMenu.messageId)
  }
  closeContextMenu()
}

const startEditing = () => {
  const list = conversationHistory[activeContactId.value]
  const msg = list?.find(m => m.id === contextMenu.messageId)

  if (msg) {
    editingMessageId.value = msg.id
    editingText.value = msg.text
    
    nextTick(() => {
      if (inlineInput.value) {
        const inputEl = Array.isArray(inlineInput.value) ? inlineInput.value[0] : inlineInput.value
        inputEl?.focus()
      }
    })
  }
  closeContextMenu()
}

const saveInlineEdit = (msg) => {
  if (editingText.value.trim() !== '') {
    if (editingText.value.trim() !== msg.text) {
      msg.text = editingText.value.trim()
      msg.edited = true
    }
    cancelInlineEdit()
  }
}

const cancelInlineEdit = () => {
  editingMessageId.value = null
  editingText.value = ''
}
</script>

<style scoped>
.chat-wrapper {
  --chat-background: #f1edd2;
  --chat-surface: #ebe2cc;
  --chat-border: #8c7355;
  --chat-green: #536236;
  --chat-green-dark: #43502a;
  --chat-text: #4a5435;
  --chat-heading: #705335;
  --chat-accent: #b86b4b;
  width: 100%;
  height: calc(100vh - 85px); 
  background-color: var(--chat-background);
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
  margin-top: 85px; 
  overflow: hidden; 
}

.app-container {
  width: 100%;
  max-width: 100%;
  height: 100%; 
  background-color: var(--chat-background);
  border-radius: 0;
  box-shadow: none;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 56px;
  background-color: var(--chat-green);
  color: #f1ebd9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
  flex-shrink: 0; 
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
}

.chat-target-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--chat-surface);
  color: var(--chat-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.95rem;
}

.settings-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #f1ebd9;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin-left: 2px;
}

.settings-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.chat-view {
  display: flex;
  flex: 1;
  height: calc(100% - 56px); 
  overflow: hidden;
}

.sidebar {
  width: 270px;
  background-color: var(--chat-surface);
  border-right: 1.5px solid var(--chat-border);
  overflow-y: auto;
  flex-shrink: 0;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  color: var(--chat-text);
  border-bottom: 1px solid rgba(140, 115, 85, 0.22);
}

.contact-card:hover, .contact-card.active {
  background-color: rgba(255, 255, 255, 0.46);
}

.contact-details {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-weight: bold;
  font-size: 0.92rem;
}

.contact-role {
  font-size: 0.8rem;
  opacity: 0.8;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: space-between;
  background-color: var(--chat-background);
  overflow: hidden; 
}

.messages-container {
  flex: 1;
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
}

.message {
  max-width: 68%;
  padding: 11px 16px;
  border-radius: 14px;
  background-color: var(--chat-surface);
  border: 1.5px solid var(--chat-border);
  color: var(--chat-text);
  font-size: 0.92rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.sent {
  align-self: flex-end;
  background-color: #9A9E70;
  border-color: #9A9E70;
  color: #F1EDD2;
}

.message.received {
  align-self: flex-start;
}

.message-edited {
  font-size: 10px;
  opacity: 0.7;
  margin-left: 6px;
}

.edit-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.inline-edit-input {
  width: 100%;
  padding: 6px 10px;
  border: 1.5px solid var(--chat-border);
  border-radius: 10px;
  background-color: var(--chat-background);
  color: var(--chat-text);
  font-size: 0.92rem;
  outline: none;
  box-sizing: border-box;
}

.edit-hint {
  font-size: 0.7rem;
  opacity: 0.8;
  color: var(--chat-text);
}

.input-container {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  flex-shrink: 0; 
}

.input-container input {
  flex: 1;
  padding: 12px 14px;
  border: 1.5px solid var(--chat-border);
  border-radius: 14px;
  background-color: var(--chat-surface);
  color: var(--chat-text);
  font-size: 0.92rem;
  outline: none;
}

.input-container input::placeholder {
  color: var(--chat-heading);
  opacity: 0.7;
}

.input-container button {
  padding: 0 22px;
  background-color: var(--chat-green);
  color: #f1ebd9;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 0.92rem;
  cursor: pointer;
}

.input-container button:hover {
  background-color: var(--chat-green-dark);
}

.context-menu {
  position: fixed;
  background-color: var(--chat-green);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 1000;
  overflow: hidden;
  min-width: 110px;
}

.context-menu button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  color: #f1ebd9;
  text-align: left;
  cursor: pointer;
  font-size: 0.85rem;
}

.context-menu button:hover {
  background-color: var(--chat-accent);
  color: #fff8ef;
}

.profile-view {
  flex: 1;
  padding: 28px;
  background-color: var(--chat-background);
  color: var(--chat-text);
  overflow-y: auto;
}

.profile-header h2 {
  font-size: 1.35rem;
  margin-bottom: 20px;
  color: var(--chat-heading);
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.profile-card {
  background-color: var(--chat-surface);
  border: 1.5px solid var(--chat-border);
  padding: 14px;
  border-radius: 14px;
}

.profile-card label {
  display: block;
  font-weight: bold;
  font-size: 0.8rem;
  margin-bottom: 4px;
  text-transform: uppercase;
  color: var(--chat-text);
}

.profile-card p {
  font-size: 0.92rem;
  margin: 0;
  color: var(--chat-text);
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
}

.btn-cancel {
  padding: 10px 24px;
  background-color: var(--chat-surface);
  border: 1.5px solid var(--chat-border);
  color: var(--chat-heading);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.92rem;
}

.btn-cancel:hover {
  background-color: var(--chat-border);
  color: #fff8ef;
}
</style>