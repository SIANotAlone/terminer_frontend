<template>
  <div class="goals-page-container">
    <Sidebar />

    <main class="goals-content">
      <header class="goals-header-section">
        <!-- <small class="text-secondary-forced">Ващі мрії та накопичення</small> -->
        <h1 class="text-main-forced">Цілі накопичення</h1>
      </header>

      <div class="goals-toolbar">
        <div class="btn-group">
          <button class="btn btn-primary" @click="openGoalModal('add')">
            <i class="fas fa-plus"></i> <span>Нова ціль</span>
          </button>
          <button class="btn btn-outline" @click="openGoalModal('edit')">
            <i class="fas fa-edit"></i> <span>Змінити</span>
          </button>
        </div>
        <div class="btn-group">
          <button class="btn btn-danger-light" @click="handleDeleteClick">
            <i class="fas fa-trash"></i> <span>Видалити</span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-status">Завантаження даних...</div>
      
      <div v-else class="goals-grid">
        <div 
          v-for="goal in goals" 
          :key="goal.id"
          class="goal-card" 
          :class="{ 'is-selected': selectedGoalId === goal.id }"
          @click="selectedGoalId = goal.id"
          @dblclick="openTransactions(goal)"
        >
          <div class="card-top">
            <div class="title-group">
              <h3 class="text-main-forced">{{ goal.target_name }}</h3>
              <small class="text-secondary-forced">{{ goal.currency_name }}</small>
            </div>
            <div class="goal-icon-box"><i class="fas fa-bullseye"></i></div>
          </div>
          
          <div class="progress-stats">
            <span class="text-main-forced">{{ getPercent(goal) }}%</span>
            <span class="text-main-forced">
              {{ formatVal(goal.current_saved) }} / {{ formatVal(goal.target_amount) }} {{ goal.currency_code }}
            </span>
          </div>
          
          <div class="progress-track">
            <div 
              class="progress-fill" 
              :style="{ width: getPercent(goal) + '%', backgroundColor: getBarColor(goal) }"
            ></div>
          </div>

          <div class="card-footer">
            <div class="footer-item">
              <small class="text-secondary-forced">Крайній термін</small>
              <b class="text-main-forced">{{ formatDate(goal.target_date) }}</b>
            </div>
            <div class="footer-item align-right">
              <small class="text-secondary-forced">В місяць потрібно</small>
              <b class="text-primary-forced">{{ formatVal(goal.required_monthly_save) }} {{ goal.currency_code }}</b>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BaseModal v-if="showGoalModal" @close="showGoalModal = false">
      <div class="modal-inner-content">
        <h2 class="text-main-forced">{{ modalMode === 'add' ? 'Додати ціль' : 'Редагувати ціль' }}</h2>
        
        <div class="form-row">
          <label>Назва цілі</label>
          <input type="text" v-model="form.target_name" placeholder="Напр: MacBook Pro">
        </div>
        
        <div class="form-grid-2">
          <div class="form-row">
            <label>Цільова сума</label>
            <input type="number" v-model="form.target_amount">
          </div>
          <div class="form-row">
            <label>Валюта</label>
            <select v-model="form.currency_id">
              <option v-for="c in currencies" :key="c.id" :value="c.id">{{ c.name }} ({{ c.symbol }})</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <label>Крайній термін</label>
          <input type="date" v-model="form.target_date">
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-primary flex-grow" @click="saveGoal">Зберегти</button>
          <button class="btn btn-outline" @click="showGoalModal = false">Скасувати</button>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-if="showDeleteModal" @close="showDeleteModal = false">
      <div class="delete-confirmation-modal">
        <div class="delete-header">
          <h2 class="text-main-forced">Небезпечна дія!</h2>
          <button class="close-x" @click="showDeleteModal = false">&times;</button>
        </div>
        
        <div class="delete-body">
          <div class="danger-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="delete-message">
            <p class="text-main-forced">
              Ви впевнені, що хочете видалити ціль <br>
              <strong>"{{ selectedGoal?.target_name }}"</strong>?
            </p>
            <div class="danger-alert-box">
              Увага! При видаленні цілі дані про необхідні щомісячні накопичення будуть втрачені.
            </div>
          </div>
        </div>

        <div class="delete-footer">
          <button class="btn btn-outline" @click="showDeleteModal = false">Скасувати</button>
          <button class="btn btn-danger-solid" @click="confirmDelete">Видалити все</button>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-if="showTransactionsModal" @close="showTransactionsModal = false">
  <div class="modal-inner-content">
    <div class="modal-header-custom">
      <h2 class="text-main-forced">Історія: {{ selectedGoal?.target_name }}</h2>
      <p class="text-secondary-forced">Список всіх поповнень та списань</p>
    </div>

    <div v-if="transactions.length" class="trx-container">
      <div v-for="t in transactions" :key="t.transaction_id" class="trx-item">
        <div class="trx-info">
          <div class="trx-icon" :class="t.direction.toLowerCase()">
            <i :class="t.direction === 'INCOME' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          </div>
          <div class="trx-details">
            <span class="trx-category text-main-forced">{{ t.budget }}</span>
            <small class="trx-date text-secondary-forced">{{ t.category }}</small>
            <small class="trx-date text-secondary-forced">{{ formatDateTime(t.date) }}</small>
          </div>
        </div>

        <div class="trx-side">
          <div class="trx-badges">
            <span :class="['badge-pill', 'status-' + t.intent.toLowerCase()]">
              {{ t.intent === 'ACTUAL' ? 'Факт' : 'План' }}
            </span>
            <span :class="['badge-pill', 'type-' + t.direction.toLowerCase()]">
              {{ t.direction === 'INCOME' ? 'Прибуток' : 'Витрата' }}
            </span>
          </div>
          <div :class="['trx-amount-value', t.direction.toLowerCase()]">
            {{ t.direction === 'INCOME' ? '+' : '-' }}{{ formatVal(t.amount) }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state-container">
      <div class="empty-icon">
        <i class="fas fa-piggy-bank"></i>
      </div>
      <h3 class="text-main-forced">Транзакцій поки що немає</h3>
      <p class="text-secondary-forced">
        За цією ціллю поки що не зафіксовано руху коштів.
      </p>
    </div>

    <div class="modal-actions">
      <button class="btn btn-outline flex-grow" @click="showTransactionsModal = false">Закрити</button>
    </div>
  </div>
</BaseModal>
  </div>
</template>

<script>
import axios from 'axios';
import ipconfig from '@/server_configs/config.js';
import Sidebar from '@/components/budget/SideMenu.vue';
import BaseModal from '@/components/budget/BaseModal.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  components: { Sidebar, BaseModal },
  data() {
    return {
      goals: [],
      currencies: [],
      transactions: [],
      loading: false,
      selectedGoalId: null,
      showGoalModal: false,
      showDeleteModal: false,
      showTransactionsModal: false,
      modalMode: 'add',
      form: {
        id: null,
        target_name: '',
        target_amount: 0,
        target_date: '',
        currency_id: 1
      }
    };
  },
  computed: {
    selectedGoal() {
      return this.goals.find(g => g.id === this.selectedGoalId);
    }
  },
  methods: {
    async apiReq(method, url, data = null) {
      const token = localStorage.getItem('jwt_token');
      if (!token) return this.$router.push('/sign-in');

      try {
        const config = {
          method,
          url: `${ipconfig.backend_ip}${url}`,
          headers: { Authorization: `Bearer ${token}` },
          data
        };
        const res = await axios(config);
        
        if (res.data && res.data.message === 'invalid token') {
          this.$router.push('/sign-in');
          return null;
        }
        return res.data;
      } catch (err) {
        toast.error("Ошибка сервера");
        return null;
      }
    },

    async loadData() {
      this.loading = true;
      const [goals, currencies] = await Promise.all([
        this.apiReq('get', '/api/goal/getavailablegoals'),
        this.apiReq('get', '/api/budget/currencies')
      ]);
      if (goals) this.goals = goals;
      if (currencies) this.currencies = currencies;
      this.loading = false;
    },

    getPercent(goal) {
      const saved = parseFloat(goal.current_saved) || 0;
      const target = parseFloat(goal.target_amount) || 1;
      const p = (saved / target) * 100;
      return Math.min(Math.round(p), 100);
    },

    getBarColor(goal) {
      const p = this.getPercent(goal);
      if (p < 30) return '#ffb547'; // Warning
      if (p >= 100) return '#05cd99'; // Success
      return '#4318ff'; // Primary
    },

    formatVal(val) {
      return parseFloat(val || 0).toFixed(2);
    },

    formatDate(d) {
      if (!d) return '';
      return new Date(d).toLocaleDateString('ru-RU');
    },

    formatDateTime(d) {
      if (!d) return '';
      return new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    openGoalModal(mode) {
      this.modalMode = mode;
      if (mode === 'edit') {
        if (!this.selectedGoal) return toast.info("Выберите цель");
        this.form = { 
          ...this.selectedGoal, 
          target_date: this.selectedGoal.target_date.split('T')[0],
          currency_id: this.currencies.find(c => c.code === this.selectedGoal.currency_code)?.id || 1
        };
      } else {
        const nextYear = new Date().getFullYear() + 1;
        this.form = { id: null, target_name: '', target_amount: 0, target_date: `${nextYear}-01-01`, currency_id: 1 };
      }
      this.showGoalModal = true;
    },

    async saveGoal() {
      const url = this.modalMode === 'add' ? '/api/goal/create' : '/api/goal/update';
      const payload = {
        ...this.form,
        target_amount: String(this.form.target_amount),
        target_date: `${this.form.target_date}T00:00:00Z`
      };
      const res = await this.apiReq(this.modalMode === 'add' ? 'post' : 'put', url, payload);
      if (res) {
        toast.success("Готово!");
        this.showGoalModal = false;
        this.loadData();
      }
    },

    handleDeleteClick() {
      if (!this.selectedGoalId) return toast.info("Выберите цель");
      this.showDeleteModal = true;
    },

    async confirmDelete() {
      const res = await this.apiReq('delete', '/api/goal/delete', { id: this.selectedGoalId });
      if (res) {
        toast.success("Удалено");
        this.showDeleteModal = false;
        this.selectedGoalId = null;
        this.loadData();
      }
    },

    async openTransactions(goal) {
  // Сначала выбираем цель и открываем окно, чтобы пользователь видел загрузку/пустое состояние
  this.selectedGoalId = goal.id;
  this.transactions = []; // Очищаем список от старых данных другой цели
  this.showTransactionsModal = true; 

  try {
    const res = await this.apiReq('get', `/api/goal/getgoalstransactions/${goal.id}`);
    
    // Если пришел массив (даже пустой), сохраняем его
    if (Array.isArray(res)) {
      this.transactions = res;
    } else {
      // Если сервер прислал null или ошибку, оставляем массив пустым
      this.transactions = [];
    }
  } catch (err) {
    console.error("Ошибка при получении транзакций:", err);
    this.transactions = [];
  }
}
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
/* Принудительное переопределение белого текста */
.text-main-forced { color: #2b3674 !important; }
.text-secondary-forced { color: #a3aed0 !important; }
.text-primary-forced { color: #4318ff !important; }

.goals-page-container {
  display: flex;
  background: #f4f7fe;
  min-height: 100vh;
  width: 100%;
}

.goals-content { flex: 1; padding: 40px; }

/* Toolbar */
.goals-toolbar {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 15px 25px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.btn-group { display: flex; gap: 12px; }

/* Buttons */
.btn { padding: 10px 20px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
.btn-primary { background: #4318ff; color: #fff; }
.btn-outline { background: #fff; border: 1px solid #e0e5f2; color: #2b3674; }
.btn-danger-light { background: #fee2e2; color: #ee5d50; }
.btn-danger-solid { background: #ee5d50; color: #fff; }

/* Grid & Cards */
.goals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
.goal-card {
  background: #fff;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.02);
  border: 2px solid transparent;
  cursor: pointer;
}
.goal-card.is-selected { border-color: #4318ff; background: #f8f9ff; }

.card-top { display: flex; justify-content: space-between; margin-bottom: 20px; }
.goal-icon-box { width: 45px; height: 45px; background: #f4f7fe; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #4318ff; }

.progress-stats { display: flex; justify-content: space-between; font-weight: 800; font-size: 14px; margin-bottom: 10px; }

/* Progress Bar Fix */
.progress-track {
  height: 12px;
  background: #eff4fb; /* Серый фон дорожки */
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}
.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.8s ease;
}

.card-footer { display: flex; justify-content: space-between; border-top: 1px solid #f4f7fe; padding-top: 15px; }
.footer-item b { display: block; font-size: 15px; margin-top: 4px; }
.align-right { text-align: right; }

/* Custom Delete Modal (Image Style) */
.delete-confirmation-modal { padding: 10px; width: 100%; max-width: 500px; }
.delete-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.close-x { border: none; background: none; font-size: 24px; color: #a3aed0; cursor: pointer; }

.delete-body { display: flex; gap: 20px; margin-bottom: 30px; }
.danger-icon { color: #ee5d50; font-size: 48px; }
.danger-alert-box {
  margin-top: 15px;
  background: #fff5f5;
  border: 1px solid #fee2e2;
  color: #ee5d50;
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}

.delete-footer { display: flex; justify-content: flex-end; gap: 12px; }

/* Trx List */
.trx-card { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f4f7fe; }
.trx-status-labels { display: flex; gap: 5px; }
.label { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase; }
.label.actual { background: #e6fcf5; color: #05cd99; }
.label.planned { background: #f4f7fe; color: #a3aed0; }
.label.income { color: #05cd99; border: 1px solid #05cd99; }
.label.expense { color: #ee5d50; border: 1px solid #ee5d50; }
.trx-amount { font-weight: 800; }
.trx-amount.income { color: #05cd99; }
.trx-amount.expense { color: #ee5d50; }

/* Forms */
.form-row { margin-bottom: 15px; display: flex; flex-direction: column; }
.form-row label { font-weight: 700; font-size: 14px; color: #2b3674; margin-bottom: 8px; }
.form-row input, .form-row select { padding: 12px; border: 1px solid #e0e5f2; border-radius: 12px; color: #2b3674; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.modal-actions { display: flex; gap: 10px; margin-top: 25px; }
.flex-grow { flex: 1; }
/* Улучшенные стили для списка транзакций */
.modal-header-custom {
  margin-bottom: 24px;
}

.trx-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px; /* отступ для скроллбара */
}

.trx-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #f4f7fe;
  border-radius: 16px;
  transition: transform 0.2s ease;
}

.trx-item:hover {
  background: #f8f9ff;
}

.trx-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trx-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.trx-icon.income { background: #e6fcf5; color: #05cd99; }
.trx-icon.expense { background: #fff5f5; color: #ee5d50; }

.trx-details {
  display: flex;
  flex-direction: column;
}

.trx-category {
  font-weight: 700;
  font-size: 15px;
}

.trx-date {
  font-size: 12px;
}

.trx-side {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.trx-badges {
  display: flex;
  gap: 4px;
}

.badge-pill {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-actual { background: #e2e8f0; color: #475569; }
.status-planned { background: #fff3e0; color: #ff9800; }

.type-income { background: rgba(5, 205, 153, 0.1); color: #05cd99; border: 1px solid rgba(5, 205, 153, 0.2); }
.type-expense { background: rgba(238, 93, 80, 0.1); color: #ee5d50; border: 1px solid rgba(238, 93, 80, 0.2); }

.trx-amount-value {
  font-size: 16px;
  font-weight: 800;
}

.trx-amount-value.income { color: #05cd99; }
.trx-amount-value.expense { color: #ee5d50; }

/* Empty State */
.empty-state-container {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #a3aed0;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state-container h3 {
  margin-bottom: 8px;
}
</style>