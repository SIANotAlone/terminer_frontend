<template>
  <div class="budget-form">
    <div v-if="loadingDicts" class="loading-spinner">
      <i class="fas fa-circle-notch fa-spin"></i> Завантаження параметрів...
    </div>
    
    <form v-else @submit.prevent="submitForm" id="budgetForm">
      <div class="form-group">
        <label>Назва бюджету</label>
        <input v-model="form.name" type="text" required placeholder="Наприклад: Відпочинок 2026" class="form-input">
      </div>

      <div class="form-group">
        <label>Тип</label>
        <select v-model="form.type_id" required class="form-input">
          <option :value="null" disabled>Выберіть тип</option>
          <option v-for="t in types" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Початок</label>
          <input v-model="form.date_start" type="date" required class="form-input">
        </div>
        <div class="form-group">
          <label>Кінець</label>
          <input v-model="form.date_end" type="date" required class="form-input">
        </div>
      </div>

      <div class="form-group">
        <label>Валюта</label>
        <select v-model="form.currency_id" required class="form-input">
          <option :value="null" disabled>Выберіть валюту</option>
          <option v-for="c in currencies" :key="c.id" :value="c.id">
            {{ c.code }} — {{ c.name }}
          </option>
        </select>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import ipconfig from '@/server_configs/config.js';

export default {
  name: 'BudgetForm',
  props: {
    initialData: { type: Object, default: null },
    isEdit: { type: Boolean, default: false }
  },
  emits: ['submit', 'authError'],
  data() {
    return {
      loadingDicts: false,
      currencies: [],
      types: [],
      form: {
        name: '',
        type_id: null,
        date_start: '',
        date_end: '',
        currency_id: null
      }
    };
  },
  // Используем watch, чтобы поймать момент, когда данные загружены
  watch: {
    currencies: {
      handler(newVal) {
        if (newVal.length > 0 && this.initialData) {
          this.populateForm();
        }
      },
      immediate: true
    }
  },
  async mounted() {
    await this.fetchDictionaries();
  },
  methods: {
    async fetchDictionaries() {
      this.loadingDicts = true;
      const token = localStorage.getItem('jwt_token');
      try {
        const [currRes, typeRes] = await Promise.all([
          axios.get(`${ipconfig.backend_ip}/api/budget/currencies`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${ipconfig.backend_ip}/api/budget/types`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
        ]);
        this.currencies = currRes.data;
        this.types = typeRes.data;
        
        // Если данные уже были переданы в пропсах, заполняем форму после загрузки списков
        if (this.initialData) {
          this.populateForm();
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.data?.message === 'invalid token') {
          this.$emit('authError');
        }
      } finally {
        this.loadingDicts = false;
      }
    },

    populateForm() {
      const d = this.initialData;
      
      // 1. Приводим даты к формату YYYY-MM-DD
      const formatDate = (iso) => iso ? iso.split('T')[0] : '';

      // 2. Ищем ID валюты. 
      // В initialData приходит "currency_code": "EUR", а нам нужен ID из списка currencies
      const foundCurrency = this.currencies.find(c => c.code === d.currency_code);
      
      // 3. Ищем ID типа.
      // В initialData приходит "type": "Місячний", ищем его в списке типов
      const foundType = this.types.find(t => t.name === d.type);

      this.form = {
        name: d.name,
        type_id: foundType ? foundType.id : null,
        date_start: formatDate(d.date_start),
        date_end: formatDate(d.date_end),
        currency_id: foundCurrency ? foundCurrency.id : null
      };
    },

    submitForm() {
      // Подготавливаем чистый объект для сервера
      const payload = {
        name: this.form.name,
        raw_type_id: this.form.type_id, 
        date_start: `${this.form.date_start}T00:00:00Z`,
        date_end: `${this.form.date_end}T23:59:59Z`,
        base_currency: this.form.currency_id
      };
      this.$emit('submit', payload);
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px;
  color: #4318ff;
}
.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.form-input {
  width: 100%; padding: 12px 15px; border: 1px solid #e0e5f2; border-radius: 12px;
  font-size: 14px; color: #2b3674; background: #f4f7fe; transition: 0.2s;
}
.form-input:focus { border-color: #4318ff; background: #fff; outline: none; }
label { display: block; margin-bottom: 8px; font-weight: 700; font-size: 13px; color: #2b3674; }
</style>