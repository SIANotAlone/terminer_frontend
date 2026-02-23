<template>
  <div class="access-manager-container">
    
    <div class="toolbar">
      <button class="btn btn-primary" @click="openAddUserModal">
        <i class="fas fa-user-plus"></i> Запросити
      </button>
      
      <button 
        class="btn btn-danger" 
        :disabled="!selectedAccessId" 
        @click="openRevokeConfirm"
      >
        <i class="fas fa-user-minus"></i> Відкликати
      </button>
    </div>

    <section class="content-section">
      <div class="table-responsive">
        
        <div v-if="loading" class="loading-state">
            <i class="fas fa-spinner fa-spin"></i> Завантаження...
        </div>

        <table v-else>
          <thead>
            <tr>
              <th style="width: 50%">Користувач</th>
              <th style="width: 20%">Роль</th>
              <th style="width: 30%">Дата</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in usersWithAccess" 
              :key="user.id"
              :class="{ selected: selectedAccessId === user.id }"
              @click="selectUser(user.id)"
            >
              <td>
                <div class="user-info">
                  <div class="user-avatar" :style="{ background: getRandomColor(user.username) }">
                    {{ getInitials(user.username) }}
                  </div>
                  <div class="user-text-block">
                    <div class="user-name-text">{{ user.username }}</div>
                    <div class="user-email-text">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge role-viewer">Учасник</span>
              </td>
              <td class="date-cell">{{ formatDate(user.date) }}</td>
            </tr>

            <tr v-if="usersWithAccess.length === 0">
              <td colspan="3" class="empty-state">
                Доступ тільки у власника
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal v-if="showAddModal" title="Пригласить пользователя" @close="closeModals">
        <div v-if="loadingAllUsers" class="loading-state-modal">Завантаження...</div>
        <div v-else class="user-select-list">
            <div v-for="u in allUsers" :key="u.id" class="user-option" :class="{ active: targetUserId === u.id }" @click="targetUserId = u.id">
                <div class="user-avatar sm">{{ getInitials(u.username) }}</div>
                <div class="user-details"><span class="name">{{ u.username }}</span><span class="email">{{ u.email }}</span></div>
                <i v-if="targetUserId === u.id" class="fas fa-check check-icon"></i>
            </div>
        </div>
        <template #footer>
            <button class="btn btn-outline" @click="closeModals">Скасувати</button>
            <button class="btn btn-primary" :disabled="!targetUserId" @click="shareBudget">Додати</button>
        </template>
    </BaseModal>

    <BaseModal v-if="showRevokeModal" title="Відкликати доступ" @close="closeModals">
        <p>Закрити доступ для цього користувача?</p>
        <template #footer>
            <button class="btn btn-outline" @click="closeModals">Скасувати</button>
            <button class="btn btn-danger" @click="revokeAccess">Відкликати</button>
        </template>
    </BaseModal>

  </div>
</template>

<script>
import axios from 'axios';
import ipconfig from '@/server_configs/config.js';
import { toast } from 'vue3-toastify';
import BaseModal from './BaseModal.vue';

export default {
  name: 'AccessManager',
  components: { BaseModal },
  props: {
    budget: { type: Object, required: true }
  },
  data() {
    return {
      usersWithAccess: [],
      allUsers: [],
      loading: false,
      loadingAllUsers: false,
      selectedAccessId: null,
      targetUserId: null,
      showAddModal: false,
      showRevokeModal: false
    };
  },
  watch: {
    budget: {
      handler(newVal) {
        if (newVal && newVal.id) this.fetchBudgetUsers();
      },
      immediate: true
    }
  },
  methods: {
    async fetchBudgetUsers() {
      this.loading = true;
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await axios.get(`${ipconfig.backend_ip}/api/access/getbudgetusers/${this.budget.id}`, { headers: { Authorization: `Bearer ${token}` } });
        this.usersWithAccess = response.data.users || [];
        this.selectedAccessId = null;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async fetchAllUsers() {
      this.loadingAllUsers = true;
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await axios.get(`${ipconfig.backend_ip}/api/access/getallusers`, { headers: { Authorization: `Bearer ${token}` } });
        this.allUsers = response.data.users || [];
      } catch (err) {
        toast.error("Ошибка загрузки пользователей");
      } finally {
        this.loadingAllUsers = false;
      }
    },
    async shareBudget() {
      const token = localStorage.getItem('jwt_token');
      try {
        await axios.post(`${ipconfig.backend_ip}/api/access/sharebudget`, { budget_id: this.budget.id, target_user: this.targetUserId }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Пользователь добавлен");
        this.closeModals();
        this.fetchBudgetUsers();
      } catch (err) {
        toast.error("Ошибка добавления");
      }
    },
    async revokeAccess() {
      const token = localStorage.getItem('jwt_token');
      try {
        await axios.delete(`${ipconfig.backend_ip}/api/access/revokeaccess`, { headers: { Authorization: `Bearer ${token}` }, data: { access_id: this.selectedAccessId } });
        toast.success("Доступ отозван");
        this.closeModals();
        this.fetchBudgetUsers();
      } catch (err) {
        toast.error("Ошибка удаления");
      }
    },
    selectUser(accessId) {
      this.selectedAccessId = (this.selectedAccessId === accessId) ? null : accessId;
    },
    openAddUserModal() {
      this.showAddModal = true;
      this.fetchAllUsers();
    },
    openRevokeConfirm() {
      this.showRevokeModal = true;
    },
    closeModals() {
      this.showAddModal = false;
      this.showRevokeModal = false;
      this.targetUserId = null;
    },
    getInitials(name) {
      return name ? name.charAt(0).toUpperCase() : '?';
    },
    formatDate(isoString) {
      if (!isoString) return '';
      // Убрал время, чтобы сэкономить место в таблице
      return new Date(isoString).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    },
    getRandomColor(name) {
       const colors = ['#4318ff', '#05cd99', '#ffb547', '#ee5d50', '#2b3674'];
       if (!name) return colors[0];
       let hash = 0;
       for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
       return colors[Math.abs(hash) % colors.length];
    }
  }
}
</script>

<style scoped>
:root {
    --primary: #4318ff;
    --primary-bg: #eff4fb;
    --text-main: #2b3674;
    --text-secondary: #a3aed0;
    --border-color: #e0e5f2;
    --radius: 20px;
}

.access-manager-container {
  display: flex;
  flex-direction: column;
  /* Убираем фиксированную высоту, пусть тянется от контента */
  height: 100%; 
}

/* --- Toolbar --- */
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    /* Уменьшил паддинги тулбара */
    padding: 10px 15px; 
    border-radius: var(--radius);
    box-shadow: 0px 6px 18px rgba(0,0,0,0.06);
    margin-bottom: 20px;
}

.btn {
    padding: 8px 16px; /* Чуть компактнее кнопки */
    border-radius: 12px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px;
    transition: 0.2s;
}
.btn-primary { background: var(--primary); color: white; }
.btn-danger { background: #fff0f0; color: #ee5d50; }
.btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(100%); }

/* --- Table Area --- */
.content-section {
    background: #ffffff;
    /* Уменьшил паддинг контейнера таблицы */
    padding: 15px; 
    border-radius: var(--radius);
    box-shadow: 0px 6px 18px rgba(0,0,0,0.06);
    flex: 1;
}

.table-responsive { 
    overflow-x: auto;
    /* Делаем скроллбар аккуратным */
    scrollbar-width: thin;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 400px; /* Минимальная ширина, чтобы не схлопывалась совсем */
}

th {
    text-align: left;
    color: var(--text-secondary);
    font-weight: 600;
    padding: 10px; /* Компактнее */
    border-bottom: 1px solid var(--border-color);
    font-size: 11px; /* Чуть меньше шрифт заголовков */
    text-transform: uppercase;
}

td {
    padding: 10px; /* Компактнее */
    border-bottom: 1px solid var(--border-color);
    vertical-align: middle;
}

tr { cursor: pointer; transition: 0.2s; }
tr:hover { background: #fcfdff; }
tr.selected { background: var(--primary-bg); }

/* User Info */
.user-info { display: flex; align-items: center; gap: 10px; }
.user-avatar {
    width: 32px; height: 32px; /* Чуть меньше аватар */
    border-radius: 50%;
    color: white;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 12px;
    flex-shrink: 0;
}
.user-text-block { min-width: 0; } /* Для правильной обрезки текста если нужно */
.user-name-text { font-weight: 600; font-size: 13px; color: var(--text-main); white-space: nowrap; }
.user-email-text { font-size: 11px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }

/* Badge */
.badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    display: inline-block;
    background: #f1f5f9; color: var(--text-secondary);
}

.date-cell {
    font-size: 12px;
    color: var(--text-main);
    white-space: nowrap;
}

/* Модальные стили списка */
.user-select-list { max-height: 250px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 10px; margin-top: 10px; }
.user-option { display: flex; align-items: center; gap: 10px; padding: 10px; cursor: pointer; border-bottom: 1px solid #f4f7fe; }
.user-option:hover { background: #f9f9f9; }
.user-option.active { background: var(--primary-bg); }
.user-avatar.sm { width: 28px; height: 28px; font-size: 11px; background: #a3aed0; }
.user-details { display: flex; flex-direction: column; flex: 1; }
.user-details .name { font-size: 13px; font-weight: 600; }
.user-details .email { font-size: 11px; color: var(--text-secondary); }
.check-icon { color: var(--primary); font-size: 12px; }

.loading-state { text-align: center; padding: 20px; color: var(--text-secondary); }
</style>