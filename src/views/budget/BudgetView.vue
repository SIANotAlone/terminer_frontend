<template>
  <div class="page-container">
    <Sidebar />

    <main>
      <header>
        <small style="color: var(--text-secondary)">Алекс, управление</small>
        <h1 style="color:darkslateblue;">Мои бюджеты</h1>
      </header>

      <div class="toolbar">
        <div class="toolbar-group">
          <button class="btn btn-primary" @click="openCreateModal">
            <i class="fas fa-plus"></i> <span>Создать</span>
          </button>
          <button class="btn btn-outline" :disabled="!selectedBudget" @click="openEditModal">
            <i class="fas fa-edit"></i> <span>Изменить</span>
          </button>
        </div>
          
        <div class="toolbar-group">
          <button 
    class="btn" 
    :class="isArchiveMode ? 'btn-primary' : 'btn-outline'" 
    @click="toggleArchiveMode"
  >
    <i class="fas fa-box-archive"></i> 
    <span>{{ isArchiveMode ? 'Выйти из архива' : 'Архив' }}</span>
  </button>
          <button 
  class="btn btn-outline" 
  :disabled="!selectedBudget" 
  @click="showAccessModal = true"
>
  <i class="fas fa-key"></i> <span>Доступ</span>
</button>
          
          <button 
  v-if="!selectedBudget || !selectedBudget.is_archived"
  class="btn btn-outline" 
  :disabled="!selectedBudget"
  @click="archiveBudget"
>
  <i class="fas fa-box-archive"></i> <span>Архивировать</span>
</button>

<button 
  v-else
  class="btn btn-outline" 
  @click="unarchiveBudget"
>
  <i class="fas fa-box-open"></i> <span>Разархивировать</span>
</button>
          <button class="btn btn-danger" :disabled="!selectedBudget" @click="openDeleteConfirm">
            <i class="fas fa-trash"></i> <span>Удалить</span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
  <i class="fas fa-spinner fa-spin"></i> Загрузка бюджетов...
</div>

<div v-else-if="budgets.length > 0">
  <div class="budget-grid">
    <div 
      v-for="budget in budgets" 
      :key="budget.id"
      class="budget-card" 
      :class="{ 
        'selected': selectedBudget && selectedBudget.id === budget.id,
        'archived': budget.is_archived 
      }"
      @click="selectCard(budget)"
      @dblclick="goToTransactions(budget.id)"
    >
      <div class="watermark" v-if="budget.is_archived">
        <i class="fas fa-archive"></i>
      </div>
      <div class="card-header">
        <span class="type-tag">{{ budget.type }}</span>
        <div class="status-indicator" :title="budget.is_archived ? 'В архиве' : 'Активен'"></div>
      </div>
      <div class="card-body">
        <h3>{{ budget.name }}</h3>
        <div class="date-range">
          <i :class="budget.is_archived ? 'far fa-calendar-check' : 'far fa-calendar'"></i> 
          {{ formatBudgetPeriod(budget) }}
        </div>
      </div>
      <div class="card-footer">
        <div class="currency-badge" :style="getCurrencyStyle(budget.currency_code)">
          {{ budget.currency_code }}
        </div>
      </div>
    </div>
  </div>

  <div class="pagination" v-if="isArchiveMode">
    <button class="btn btn-outline" :disabled="currentPage === 1" @click="changePage(-1)">
      <i class="fas fa-chevron-left"></i> Назад
    </button>
    <span class="page-num">Страница {{ currentPage }}</span>
    <button class="btn btn-outline" :disabled="budgets.length < pageSize" @click="changePage(1)">
      Вперед <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</div>

<div v-else class="empty-state">
  <div class="empty-icon">
    <i :class="isArchiveMode ? 'fas fa-box-open' : 'fas fa-folder-plus'"></i>
  </div>
  <h2>{{ isArchiveMode ? 'Архив пуст' : 'Бюджетов пока нет' }}</h2>
  <p>{{ isArchiveMode ? 'Здесь появятся ваши старые записи' : 'Создайте свой первый бюджет, чтобы начать работу' }}</p>
  <button v-if="!isArchiveMode" class="btn btn-primary" @click="openCreateModal" style="margin: 20px auto">
    Создать бюджет
  </button>
</div>

    </main>

    <BaseModal 
      v-if="showFormModal" 
      :title="isEditMode ? 'Редактирование бюджета' : 'Новый бюджет'"
      @close="closeModals"
    >
      <BudgetForm 
        ref="budgetFormRef"
        :initialData="isEditMode ? selectedBudget : null"
        :isEdit="isEditMode"
        @submit="handleFormSubmit"
        @authError="redirectToAuth"
      />
      <template #footer>
        <button class="btn btn-outline" @click="closeModals">Отмена</button>
        <button class="btn btn-primary" @click="$refs.budgetFormRef.submitForm()">
          {{ isEditMode ? 'Сохранить' : 'Создать' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal v-if="showConfirmCreateModal" title="Подтверждение создания" @close="showConfirmCreateModal = false">
      <p>Вы действительно хотите создать бюджет <b>{{ pendingPayload?.name }}</b>?</p>
      <template #footer>
        <button class="btn btn-outline" @click="showConfirmCreateModal = false">Назад</button>
        <button class="btn btn-primary" @click="confirmCreate">Да, создать</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showConfirmEditModal" title="Подтверждение изменений" @close="showConfirmEditModal = false">
      <p>Внимание! Данные бюджета будут изменены. Продолжить?</p>
      <template #footer>
        <button class="btn btn-outline" @click="showConfirmEditModal = false">Назад</button>
        <button class="btn btn-primary" @click="confirmUpdate">Сохранить изменения</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showDeleteModal" title="Удаление бюджета" @close="showDeleteModal = false">
      <p style="color: var(--danger); font-weight: 500;">
        <i class="fas fa-exclamation-triangle"></i> Внимание!
      </p>
      <p>Вы собираетесь удалить бюджет <b>{{ selectedBudget?.name }}</b>.</p>
      <p>Будут удалены также <b>все транзакции</b>, связанные с этим бюджетом. Это действие необратимо.</p>
      <template #footer>
        <button class="btn btn-outline" @click="showDeleteModal = false">Отмена</button>
        <button class="btn btn-danger" @click="confirmDelete">Удалить</button>
      </template>
    </BaseModal>
    <BaseModal v-if="showConfirmArchiveModal" title="Архивация бюджета" @close="showConfirmArchiveModal = false">
  <p>Вы действительно хотите архивировать бюджет <b>{{ selectedBudget?.name }}</b>?</p>
  <p style="font-size: 0.9em; color: var(--text-secondary);">
    Он перестанет отображаться в основном списке, но данные сохранятся.
  </p>
  <template #footer>
    <button class="btn btn-outline" @click="showConfirmArchiveModal = false">Отмена</button>
    <button class="btn btn-primary" @click="confirmArchive">Да, архивировать</button>
  </template>
</BaseModal>

<BaseModal v-if="showConfirmUnarchiveModal" title="Восстановление бюджета" @close="showConfirmUnarchiveModal = false">
  <p>Вернуть бюджет <b>{{ selectedBudget?.name }}</b> в список активных?</p>
  <template #footer>
    <button class="btn btn-outline" @click="showConfirmUnarchiveModal = false">Назад</button>
    <button class="btn btn-primary" @click="confirmUnarchive">Да, восстановить</button>
  </template>
</BaseModal>

<BaseModal 
  v-if="showAccessModal" 
  :title="'Управление доступом: ' + (selectedBudget ? selectedBudget.name : '')" 
  @close="showAccessModal = false"
>
  <AccessManager 
    v-if="selectedBudget" 
    :budget="selectedBudget" 
  />
  
  <template #footer>
    <button class="btn btn-primary" @click="showAccessModal = false">Готово</button>
  </template>
</BaseModal>

  </div>
</template>

<script>
import axios from 'axios';
import ipconfig from '@/server_configs/config.js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import Sidebar from '@/components/budget/SideMenu.vue';
import BaseModal from '@/components/budget/BaseModal.vue';
import BudgetForm from '@/components/budget/BudgetForm.vue';
import AccessManager from '@/components/budget/AccessManager.vue';

export default {
  name: 'BudgetList',
  components: { Sidebar, BaseModal, BudgetForm, AccessManager },
  data() {
    return {
      budgets: [],
      selectedBudget: null,
      loading: false,
      isArchiveMode: false, // Переключатель режима
      currentPage: 1,      // Текущая страница
      pageSize: 10,        // Лимит для пагинации

      // Modal States
      showFormModal: false,
      isEditMode: false,
      showConfirmCreateModal: false,
      showConfirmEditModal: false,
      showDeleteModal: false,
      showConfirmArchiveModal: false,
      showConfirmUnarchiveModal: false, 
      showAccessModal: false, 

      // Data buffer for confirmations
      pendingPayload: null
    };
  },
  mounted() {
    this.fetchBudgets();
  },
  methods: {
    // --- API Calls ---
   async fetchBudgets() {
  this.loading = true;
  const token = localStorage.getItem('jwt_token');
  if (!token) return this.redirectToAuth();

  try {
    // Формируем URL с параметрами, если включен архив
    let url = `${ipconfig.backend_ip}/api/budget/getall`;
    if (this.isArchiveMode) {
      const offset = (this.currentPage - 1) * this.pageSize;
      url += `?limit=${this.pageSize}&offset=${offset}&archived=true`;
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data && response.data.message === 'invalid token') {
      return this.redirectToAuth();
    }

    // Обработка данных (сервер может вернуть массив напрямую или объект с полем items)
    this.budgets = Array.isArray(response.data) ? response.data : (response.data.items || []);
  } catch (err) {
    this.handleError(err);
    this.budgets = []; // Очищаем список при ошибке
  } finally {
    this.loading = false;
  }
},

    async confirmDelete() {
      if (!this.selectedBudget) return;
      
      const token = localStorage.getItem('jwt_token');
      try {
        await axios.delete(`${ipconfig.backend_ip}/api/budget/delete`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: this.selectedBudget.id }
        });
        
        toast.success("Бюджет успешно удален");
        this.selectedBudget = null;
        this.showDeleteModal = false;
        this.fetchBudgets();
      } catch (err) {
        this.handleError(err);
      }
    },

    async confirmCreate() {
      const token = localStorage.getItem('jwt_token');
      
      // Формируем JSON строго как в задании
      const body = {
        name: this.pendingPayload.name,
        type: this.pendingPayload.raw_type_id, // "type" (int)
        date_start: this.pendingPayload.date_start,
        date_end: this.pendingPayload.date_end,
        base_currency: this.pendingPayload.base_currency
      };

      try {
        // Предполагаемый эндпоинт создания (если отличается, поправь тут)
        await axios.post(`${ipconfig.backend_ip}/api/budget/create`, body, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("Бюджет успешно создан");
        this.closeModals();
        this.fetchBudgets();
      } catch (err) {
        this.handleError(err);
      }
    },

    async confirmUpdate() {
      const token = localStorage.getItem('jwt_token');
      
      // Формируем JSON для обновления
      const body = {
        id: this.selectedBudget.id, // ID скрыт от UI, но отправляется
        name: this.pendingPayload.name,
        type_id: this.pendingPayload.raw_type_id, // "type_id" (int)
        date_start: this.pendingPayload.date_start,
        date_end: this.pendingPayload.date_end,
        base_currency: this.pendingPayload.base_currency
      };

      try {
        await axios.put(`${ipconfig.backend_ip}/api/budget/update`, body, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("Бюджет обновлен");
        this.closeModals();
        this.fetchBudgets();
      } catch (err) {
        this.handleError(err);
      }
    },

    // --- Handlers ---
    openCreateModal() {
      this.isEditMode = false;
      this.showFormModal = true;
    },
    
    openEditModal() {
      this.isEditMode = true;
      this.showFormModal = true;
    },

    openDeleteConfirm() {
      this.showDeleteModal = true;
    },

    handleFormSubmit(payload) {
      this.pendingPayload = payload;
      this.showFormModal = false; // Скрываем форму

      if (this.isEditMode) {
        this.showConfirmEditModal = true;
      } else {
        this.showConfirmCreateModal = true;
      }
    },

    closeModals() {
      this.showFormModal = false;
      this.showConfirmCreateModal = false;
      this.showConfirmEditModal = false;
      this.showDeleteModal = false;
      this.showConfirmArchiveModal = false;   
    this.showConfirmUnarchiveModal = false; 
      this.pendingPayload = null;
    },

    handleError(err) {
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.data.message === 'invalid token')) {
        this.redirectToAuth();
      } else {
        toast.error("Произошла ошибка операции");
      }
    },

    redirectToAuth() {
      localStorage.removeItem('jwt_token');
      this.$router.push('/sign-in');
    },

    // --- Helpers (Formatters) ---
    selectCard(budget) {
      if (this.selectedBudget && this.selectedBudget.id === budget.id) {
        this.selectedBudget = null;
      } else {
        this.selectedBudget = budget;
      }
    },
    formatDate(isoString) {
      if (!isoString) return '';
      return new Date(isoString).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    },
    goToTransactions(budgetId) {
    this.$router.push(`/transactions/${budgetId}`);
  },
    formatBudgetPeriod(budget) {
      const start = this.formatDate(budget.date_start);
      const end = this.formatDate(budget.date_end);
      return `${start} — ${end}`;
    },
    getCurrencyStyle(code) {
      if (code === 'USD') return { color: '#05cd99', background: '#e6fcf5' };
      if (code === 'UAH') return { color: '#ffc107', background: '#fff9db' };
      return {}; 
    },
   archiveBudget() {
  if (!this.selectedBudget) return;
  this.showConfirmArchiveModal = true;
},

unarchiveBudget() {
  if (!this.selectedBudget) return;
  this.showConfirmUnarchiveModal = true;
},

// 2. Методы реального выполнения запроса (Confirm)
async confirmArchive() {
  const token = localStorage.getItem('jwt_token');
  try {
    await axios.put(`${ipconfig.backend_ip}/api/budget/archive`, 
      { id: this.selectedBudget.id },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    toast.success("Бюджет перемещен в архив");
    this.showConfirmArchiveModal = false; // Закрываем модалку
    this.selectedBudget = null;           // Снимаем выделение
    this.fetchBudgets();                  // Обновляем список
  } catch (err) {
    this.handleError(err);
  }
},

async confirmUnarchive() {
  const token = localStorage.getItem('jwt_token');
  try {
    await axios.put(`${ipconfig.backend_ip}/api/budget/unarchive`, 
      { id: this.selectedBudget.id },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    toast.success("Бюджет восстановлен");
    this.showConfirmUnarchiveModal = false; // Закрываем модалку
    this.selectedBudget = null;
    this.fetchBudgets();
  } catch (err) {
    this.handleError(err);
  }
},

// Вспомогательные методы для управления UI
toggleArchiveMode() {
  this.isArchiveMode = !this.isArchiveMode;
  this.currentPage = 1; // Сброс на первую страницу
  this.selectedBudget = null;
  this.fetchBudgets();
},

changePage(step) {
  this.currentPage += step;
  this.selectedBudget = null;
  this.fetchBudgets();
}
  }
}
</script>



<style>
/* Глобальные CSS переменные. 
  Лучше вынести это в global.css или App.vue, но оставил здесь для автономности компонента.
*/
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

:root {
    --bg-color: #f4f7fe;
    --sidebar-color: #ffffff;
    --card-bg: #ffffff;
    --primary: #4318ff;
    --primary-bg: #eff4fb;
    --success: #05cd99;
    --danger: #ee5d50;
    --text-main: #2b3674;
    --text-secondary: #a3aed0;
    --border-color: #e0e5f2;
    --shadow: 0px 6px 18px rgba(0,0,0,0.06);
    --radius: 20px;
}
</style>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-top: 20px;
}
.empty-icon {
  font-size: 80px;
  color: #e0e5f2;
  margin-bottom: 20px;
}
.empty-state h2 {
  color: var(--text-main);
  margin-bottom: 10px;
}
.empty-state p {
  color: var(--text-secondary);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding-bottom: 50px;
}
.page-num {
  font-weight: 700;
  color: var(--text-main);
}
/* Стили остались прежними, только убедись, что Font Awesome подключен в index.html */
.page-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-main);
    display: flex;
    flex-direction: row;
    min-height: 100vh;
}

main {
    flex: 1;
    padding: 30px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

header { margin-bottom: 30px; }
header h1 { font-size: 32px; font-weight: 700; margin: 5px 0 0 0; letter-spacing: -0.5px; }

/* Toolbar */
.toolbar {
    display: flex;
    flex-wrap: wrap; 
    justify-content: space-between;
    align-items: center;
    background: var(--card-bg);
    padding: 15px 20px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    margin-bottom: 30px;
    gap: 15px;
}

.toolbar-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 20px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
    font-size: 14px;
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2); }
.btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
.btn-outline:hover:not(:disabled) { background: var(--bg-color); border-color: var(--text-secondary); }
.btn-danger { background: #fff0f0; color: var(--danger); }
.btn-danger:hover:not(:disabled) { background: #fee2e2; }

/* Grid */
.budget-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
    padding-bottom: 100px;
}

.loading-state {
    text-align: center;
    color: var(--text-secondary);
    font-size: 18px;
    margin-top: 50px;
}
.error-msg {
    color: var(--danger);
    text-align: center;
    margin-top: 20px;
}

/* Card */
.budget-card {
    background: var(--card-bg);
    border-radius: 24px;
    padding: 25px;
    box-shadow: var(--shadow);
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 200px;
    overflow: hidden;
}

.budget-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
    border-color: var(--primary);
}

.budget-card.selected {
    border-color: var(--primary);
    background: #fcfdff;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.type-tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    background: var(--bg-color);
    padding: 6px 12px;
    border-radius: 12px;
}

.status-indicator {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 0 4px rgba(5, 205, 153, 0.1);
}

.card-body h3 {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-main);
    margin: 0 0 8px 0;
    line-height: 1.4;
    word-break: break-word; /* на случай длинных имен */
}

.date-range {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    font-size: 13px;
    margin-bottom: 30px;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
}

.currency-badge {
    font-size: 18px;
    font-weight: 800;
    color: var(--primary);
    background: var(--primary-bg);
    padding: 12px 18px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.currency-badge::before {
    content: '\f51e';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    font-size: 14px;
    opacity: 0.5;
}

/* Archived */
.budget-card.archived {
    background: #f8f9fa;
    border: 2px dashed var(--border-color);
    box-shadow: none;
    opacity: 0.8;
}

.budget-card.archived:hover {
    transform: none;
    border-color: var(--text-secondary);
    opacity: 1;
}
.budget-card.archived h3 { color: #718096; text-decoration: line-through; text-decoration-color: var(--border-color); }
.budget-card.archived .status-indicator { background: var(--text-secondary); box-shadow: none; }
.budget-card.archived .currency-badge { background: #e2e8f0; color: #718096; }

.watermark {
    position: absolute;
    right: -10px;
    top: 40%;
    font-size: 80px;
    color: rgba(0,0,0,0.03);
    transform: rotate(-15deg);
    pointer-events: none;
}

@media (max-width: 768px) {
    .page-container { flex-direction: column; }
    main { padding: 15px; padding-bottom: 80px; }
    .toolbar { flex-direction: column; align-items: stretch; gap: 10px; padding: 15px; }
    .toolbar-group { display: grid; grid-template-columns: 1fr 1fr; }
    .btn-danger { grid-column: span 2; justify-content: center; }
}


/* Специфичное правило для выбранного архивного бюджета */
.budget-card.archived.selected {
    border: 2px solid var(--primary); /* Сплошная линия вместо пунктира */
    background: #f0f3ff;            /* Чуть более насыщенный фон */
    opacity: 1;                     /* Убираем прозрачность при выборе */
    box-shadow: 0 10px 20px rgba(67, 24, 255, 0.15);
}

/* Чтобы иконка водяного знака тоже подсвечивалась */
.budget-card.selected .watermark {
    color: rgba(67, 24, 255, 0.1);
}
</style>