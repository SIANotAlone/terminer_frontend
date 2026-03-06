<template>
  <div class="dashboard-container">
    <Sidebar />

    <main>
      <header>
        <div>
          <!-- <small style="color: var(--text-secondary)">Фінанси</small> -->
          <h1>Транзакції бюджета</h1>
        </div>
        <!-- <div class="user-pill">
          <span>Користувач</span>
          <div class="avatar-placeholder">
            <i class="fas fa-user"></i>
          </div>
        </div> -->
      </header>

      <div class="stats-grid">
  <div class="stat-card">
    <small style="color: var(--text-secondary)">Доступний залишок (Вільні кошти)</small>
    <h2 :style="{ color: stats.freeMoney >= 0 ? 'var(--text-main)' : 'var(--danger)' }">
      {{ formatCurrency(stats.freeMoney) }}
    </h2>
    <span class="category-sub">За вирахуванням планових витрат</span>
  </div>

  <div class="stat-card">
    <small style="color: var(--text-secondary)">Прибутки (Факт / План)</small>
    <h2 style="color: var(--success)">
      {{ formatCurrency(stats.actualInc) }}
      <span style="color: var(--text-secondary); font-size: 16px; font-weight: 400;">
        / {{ formatCurrency(stats.plannedInc) }}
      </span>
    </h2>
  </div>

  <div class="stat-card">
    <small style="color: var(--text-secondary)">Витрати (Факт / План)</small>
    <h2 style="color: var(--danger)">
      {{ formatCurrency(stats.actualExp) }}
      <span style="color: var(--text-secondary); font-size: 16px; font-weight: 400;">
        / {{ formatCurrency(stats.plannedExp) }}
      </span>
    </h2>
  </div>

  <div class="stat-card">
    <small style="color: var(--text-secondary)">Антирекорд: {{ stats.topCat.name }}</small>
    <h2 style="font-size: 20px; margin-bottom: 5px;">{{ formatCurrency(stats.topCat.amount) }}</h2>
    <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 8px 0;">
    <small style="color: var(--text-secondary)">Нерозподілений прибуток: 
      <b :style="{ color: stats.undistributed >= 0 ? 'var(--success)' : 'var(--danger)' }">
        {{ formatCurrency(stats.undistributed) }}
      </b>
    </small>
  </div>
</div>

      <div class="toolbar">
        <div class="toolbar-group">
          <button class="btn btn-primary" @click="openModal('create')">
            <i class="fas fa-plus"></i> <span>Додати</span>
          </button>

          <select v-model="filterType" class="select-filter">
            <option value="ALL">Всі операції</option>
            <option value="INCOME">Прибуток</option>
            <option value="EXPENSE">Витрата</option>
          </select>
          <select v-model="filterIntent" class="select-filter">
            <option value="ALL">Всі</option>
            <option value="ACTUAL">Факт</option>
            <option value="PLANNED">План</option>
          </select>
        </div>

        <div class="toolbar-group">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input type="text" v-model="searchQuery" placeholder="Пошук..." class="search-input">
          </div>
        </div>

        <div class="toolbar-group">
          <button class="btn btn-outline" :disabled="!selectedTransaction" @click="openModal('edit')">
            <i class="fas fa-pen"></i> <span>Змінити</span>
          </button>

          <button class="btn btn-outline" @click="openAnalytics" style="border-color: var(--primary); color: var(--primary);">
            <i class="fas fa-pie-chart"></i> <span>Дашборд</span>
          </button>

          <button class="btn btn-danger" :disabled="!selectedTransaction" @click="openModal('delete')">
            <i class="fas fa-trash"></i> <span>Видалити</span>
          </button>
        </div>
      </div>

      <section class="content-section">
        <h3 style="margin: 0 0 15px 0; color: #000;">Історія операцій</h3>

        <div class="table-responsive">
          <div v-if="loading" class="loading-state">Завантаження даних...</div>

          <table v-else>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Користувач</th>
                <th>Категорія / Коментар</th>
                <th>Ціль / Тип</th>
                <th style="text-align: right">Сума</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in filteredTransactions" :key="t.id" :class="{ selected: selectedTransaction?.id === t.id }"
                @click="selectRow(t)">
                <td style="white-space: nowrap;">{{ formatDate(t.date || t.created_at) }}</td>
                <td>
                  <span class="badge badge-user">
                    <i class="fas fa-user"></i> {{ t.user || 'Me' }}
                  </span>
                </td>
                <td>
                  <span class="category-main">{{ t.category || 'Без категорії' }}</span>
                  <span class="category-sub">{{ t.comment || 'Без комментарів' }}</span>
                </td>

                <td>
                  <div v-if="t.goal_id"
                    style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">
                    <i class="fas fa-bullseye"></i> {{ getGoalName(t.goal_id) }}
                  </div>
                  <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                    <span class="badge" :class="t.direction === 'INCOME' ? 'badge-inc' : 'badge-exp'">
                      {{ t.direction === 'INCOME' ? 'Прибуток' : 'Витрата' }}
                    </span>
                    <span class="badge badge-intent">
                      {{ t.intent === 'PLANNED' ? 'План' : 'Факт' }}
                    </span>
                  </div>
                </td>
                <td style="text-align: right" :class="t.direction === 'INCOME' ? 'amount-inc' : 'amount-exp'">
                  {{ t.direction === 'INCOME' ? '+' : '-' }}{{ formatNumber(t.amount) }}
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 30px;">
                  Транзакції не знайдено
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div class="goals-grid" v-if="goals.length">
        <section v-for="goal in goals" :key="goal.id" class="content-section goal-item">
          <h3 style="color: var(--text-main)">🎯 Ціль: {{ goal.target_name }}</h3>
          <div class="goal-progress-info">
            <small style="color: var(--text-secondary)">Прогрес: {{ calculateProgress(goal) }}%</small>
            <small style="color: var(--text-main)"><b>{{ formatNumber(goal.current_saved) }} / {{
              formatNumber(goal.target_amount) }}</b></small>
          </div>
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: calculateProgress(goal) + '%', background: getGoalColor(goal) }">
            </div>
          </div>
        </section>
      </div>
    </main>

    <BaseModal v-if="isModalOpen" :title="modalTitle" @close="closeModal">
      <div v-if="modalType === 'delete'">
        <p>Ви впевнені, що хочете видалити цю транзакцію? Ця дія не може бути скасована.</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="closeModal">Скасувати</button>
          <button class="btn btn-danger" @click="handleDelete">Видалити</button>
        </div>
      </div>

      <div v-else class="form-grid">
        <div class="form-group">
          <label>Напрямок</label>
          <div class="radio-group">
            <label :class="{ active: formData.direction === 'INCOME' }">
              <input type="radio" v-model="formData.direction" value="INCOME"> Прибуток
            </label>
            <label :class="{ active: formData.direction === 'EXPENSE' }">
              <input type="radio" v-model="formData.direction" value="EXPENSE"> Витрата
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Тип</label>
          <select v-model="formData.intent" class="form-control">
            <option value="ACTUAL">Факт</option>
            <option value="PLANNED">План</option>
          </select>
        </div>

        <div class="form-group">
          <label>Категорія</label>
          <select v-model="formData.category_id" class="form-control">
            <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Ціль (опціонально)</label>
          <select v-model="formData.goal_id" class="form-control">
            <option :value="null">Без цілі</option>
            <option v-for="goal in goals" :key="goal.id" :value="goal.id">
              {{ goal.target_name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Сума</label>
          <input type="number" v-model="formData.amount" class="form-control" placeholder="0.00" step="0.01">
        </div>

        <div class="form-group full-width">
          <label>Коментар</label>
          <textarea v-model="formData.comment" class="form-control" rows="2"></textarea>
        </div>

        <div class="modal-actions full-width">
          <button class="btn btn-outline" @click="closeModal">Скасувати</button>
          <button class="btn btn-primary" @click="handleSubmit">
            {{ modalType === 'create' ? 'Створити' : 'Зберегти' }}
          </button>
        </div>
      </div>
    </BaseModal>

    <AnalyticsModal 
  v-if="isAnalyticsOpen" 
  @close="isAnalyticsOpen = false"
>
  <AnalyticsDashboard :budget_id="budgetId" />
</AnalyticsModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Конфиг и компоненты
import ipconfig from '@/server_configs/config.js';
import Sidebar from '@/components/budget/SideMenu.vue';
import BaseModal from '@/components/budget/BaseModal.vue';
import AnalyticsDashboard from '@/components/budget/AnalyticsDashboard.vue';
import AnalyticsModal from '@/components/budget/AnalyticsModal.vue';
// Создаем переменную состояния для управления модальным окном
const isAnalyticsOpen = ref(false);

// Метод для открытия
const openAnalytics = () => {
  isAnalyticsOpen.value = true;
};

const filterIntent = ref('ALL'); // ALL, ACTUAL, PLANNED
// --- State ---
const route = useRoute();
const router = useRouter();
const budgetId = computed(() => route.params.budget_id || route.path.split('/').pop());
const transactions = ref([]);
const categories = ref([]);
const goals = ref([]);
const loading = ref(false);

const selectedTransaction = ref(null);
const filterType = ref('ALL'); // ALL, INCOME, EXPENSE
const searchQuery = ref('');

// Modal State
const isModalOpen = ref(false);
const modalType = ref('create'); // 'create', 'edit', 'delete'
const formData = reactive({
  category_id: '',
  goal_id: null,
  amount: '',
  intent: 'ACTUAL',
  direction: 'EXPENSE',
  comment: ''
});

// --- API Request Wrapper (Provided Pattern) ---
const apiReq = async (method, url, data = null) => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    router.push('/sign-in');
    return null;
  }

  try {
    const config = {
      method,
      url: `${ipconfig.backend_ip}${url}`,
      headers: { Authorization: `Bearer ${token}` },
      data
    };
    const res = await axios(config);

    if (res.data && res.data.message === 'invalid token') {
      localStorage.removeItem('jwt_token'); // Clean up
      router.push('/sign-in');
      return null;
    }
    return res.data;
  } catch (err) {
    console.error(err);
    // Обработка 401/403 если сервер их возвращает статусами
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      router.push('/sign-in');
    } else {
      toast.error("Ошибка соединения с сервером");
    }
    return null;
  }
};

// Расчет процента выполнения цели
const calculateProgress = (goal) => {
  const current = parseFloat(goal.current_saved) || 0;
  const target = parseFloat(goal.target_amount) || 1; // Защита от деления на 0
  if (target <= 0) return 0;
  const percent = Math.round((current / target) * 100);
  return percent > 100 ? 100 : percent;
};

// Цвет полоски в зависимости от прогресса
const getGoalColor = (goal) => {
  const progress = calculateProgress(goal);
  if (progress < 30) return '#ee5d50'; // danger
  if (progress < 70) return '#ffb547'; // warning
  return '#4318ff'; // primary
};
// --- Data Fetching ---
const fetchData = async () => {
  if (!budgetId.value) return;
  loading.value = true;

  try {
    // 1. Transactions
    const txRes = await apiReq('GET', `/api/transaction/getbybudget/${budgetId.value}`);
    // Сервер возвращает массив напрямую или внутри объекта? 
    // Предположим, что API GET /getbybudget возвращает { transactions: [...] } или [...]
    // Исходя из примера create (message: ok), предположу что тут может быть массив.
    // Если структура ответа { transactions: [...] }, то поправьте ниже.
    // Обычно в REST это просто массив, но в "вспомогательных" был ключ.
    // Сделаю универсально:
    transactions.value = Array.isArray(txRes) ? txRes : (txRes?.transactions || []);

    // 2. Categories
    const catRes = await apiReq('GET', `/api/category/getavailablecategories`);
    if (catRes && catRes.categories) {
      categories.value = catRes.categories;
    }

    // 3. Goals
    const goalRes = await apiReq('GET', `/api/goal/getavailablegoals`);
    // Пример показал массив напрямуюы
    goals.value = Array.isArray(goalRes) ? goalRes : (goalRes?.goals || []);

  } finally {
    loading.value = false;
    selectedTransaction.value = null; // Reset selection
  }
};

// --- Computed Logic ---

// Фильтрация списка для показа в таблице
const filteredTransactions = computed(() => {
  // Создаем копию массива, чтобы sort() не мутировал оригинал
  let res = [...transactions.value];

  // 1. Фильтр по типу транзакции (ALL, ACTUAL, PLAN)
  if (filterIntent.value !== 'ALL') {
    res = res.filter(t => t.intent === filterIntent.value);
  }
  // 2. Фильтр по типу (ALL, INCOME, EXPENSE)
  if (filterType.value !== 'ALL') {
    res = res.filter(t => t.direction === filterType.value);
  }

  // 3. Поиск (теперь ищем напрямую по t.category, где лежит "Подарунки" и т.д.)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    res = res.filter(t =>
      (t.comment && t.comment.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  }

  // 4. Сортировка по дате (свежие сверху)
  return res.sort((a, b) => {
    const dateA = new Date(a.date || a.created_at);
    const dateB = new Date(b.date || b.created_at);
    return dateB - dateA;
  });
});

// Фильтрация категорий в форме на основе выбранного направления (Income/Expense)
const availableCategories = computed(() => {
  // Если у категории есть поле type, фильтруем по нему.
  // Если нет, показываем все.
  return categories.value.filter(c => c.type === formData.direction);
});

// Динамический заголовок модалки
const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'create': return 'Нова транзакція';
    case 'edit': return 'Редагування транзакції';
    case 'delete': return 'Підтвердження видалення';
    default: return '';
  }
});

const stats = computed(() => {
  let actualInc = 0;
  let plannedInc = 0;
  let actualExp = 0;
  let plannedExp = 0;

  const categoryTotals = {}; // Для пошуку антирекорду

  transactions.value.forEach(t => {
    const amt = parseFloat(t.amount) || 0;

    if (t.direction === 'INCOME') {
      if (t.intent === 'ACTUAL') actualInc += amt;
      else plannedInc += amt; // План
    } else {
      if (t.intent === 'ACTUAL') {
        actualExp += amt;
        // Групуємо для антирекорду (за фактом)
        const catName = t.category || 'Без категорії';
        categoryTotals[catName] = (categoryTotals[catName] || 0) + amt;
      } else {
        plannedExp += amt; // План
      }
    }
  });

  // Шукаємо антирекорд (категорія з макс. фактичною витратою)
  let topCat = { name: '—', amount: 0 };
  for (const [name, val] of Object.entries(categoryTotals)) {
    if (val > topCat.amount) topCat = { name, amount: val };
  }

  return {
    // 1. Доступний залишок: дохід факт - планові витрати
    freeMoney: actualInc - plannedExp,
    
    // 2 та 3. Прибутки та Витрати (чисті Факт та План, не змішуємо їх)
    actualInc,
    plannedInc, 
    actualExp,
    plannedExp, 
    
    // 4. Нерозподілений прибуток: тільки факт (дохід факт - витрати факт)
    topCat,
    undistributed: actualInc - actualExp 
  };
});

// --- Helpers ---
const getCategoryName = (id) => {
  const c = categories.value.find(x => x.id === id);
  return c ? c.name : 'Неизвестно';
};

const getGoalName = (id) => {
  if (!id) return '';
  // Приводим оба значения к строке для сравнения
  const g = goals.value.find(x => String(x.id) === String(id));
  return g ? g.target_name : 'Цель не найдена';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const formatNumber = (val) => {
  return parseFloat(val).toFixed(2) + ' €';
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'EUR' }).format(val);
};

// --- Actions ---

const selectRow = (t) => {
  if (selectedTransaction.value && selectedTransaction.value.id === t.id) {
    selectedTransaction.value = null; // Deselect
  } else {
    selectedTransaction.value = t;
  }
};

const openModal = (type) => {
  modalType.value = type;
  isModalOpen.value = true;

  if (type === 'create') {
    Object.assign(formData, {
      category_id: categories.value.length ? categories.value[0].id : '',
      goal_id: null,
      amount: '',
      intent: 'ACTUAL',
      direction: 'EXPENSE',
      comment: ''
    });
  } else if (type === 'edit' && selectedTransaction.value) {
    const t = selectedTransaction.value;
    console.log('Редактируемая транзакция:', t); // Для отладки в консоли

    // 1. Поиск ID категории (по ID или по имени)
    let foundCatId = t.category_id;
    if (!foundCatId && t.category) {
      const cat = categories.value.find(c => c.name === t.category);
      if (cat) foundCatId = cat.id;
    }

    // 2. Поиск ID цели (самое важное!)
    // Проверяем t.goal_id, а если его нет — ищем в списке целей по названию
    let foundGoalId = t.goal_id || null;

    // Если id нет, но есть название цели в каком-то поле (например, t.goal или t.target_name)
    if (!foundGoalId) {
      const goalName = t.goal || t.target_name;
      if (goalName) {
        const goalObj = goals.value.find(g => g.target_name === goalName);
        if (goalObj) foundGoalId = goalObj.id;
      }
    }

    // 3. Заполняем форму (Direction ставим ПЕРВЫМ)
    formData.direction = t.direction || 'EXPENSE';

    // Используем nextTick или небольшую задержку не обязательно, 
    // но важно, чтобы direction обновил availableCategories
    formData.category_id = foundCatId;
    formData.goal_id = foundGoalId;
    formData.amount = t.amount;
    formData.intent = t.intent || 'ACTUAL';
    formData.comment = t.comment || '';
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

// --- CRUD Operations ---

const handleSubmit = async () => {
  // Валидация
  if (!formData.amount || !formData.category_id) {
    toast.warning("Заполните сумму и категорию");
    return;
  }

  const payload = {
    budget_id: budgetId.value,
    category_id: formData.category_id,
    amount: formData.amount.toString(),
    intent: formData.intent,
    direction: formData.direction,
    comment: formData.comment
  };
  if (formData.goal_id) {
    payload.goal_id = formData.goal_id;
  }
  let res;

  if (modalType.value === 'create') {
    res = await apiReq('POST', '/api/transaction/create', payload);
  } else if (modalType.value === 'edit') {
    // Для update нужен ID транзакции
    payload.transaction_id = selectedTransaction.value.id;
    // Убираем budget_id если он не нужен в update (судя по API примеру - не нужен)
    delete payload.budget_id;
    res = await apiReq('PUT', '/api/transaction/update', payload);
  }

  if (res && res.message === 'ok') {
    toast.success(modalType.value === 'create' ? 'Транзакція створена' : 'Транзакція оновлена');
    closeModal();
    fetchData(); // Refresh list
  }
};

const handleDelete = async () => {
  if (!selectedTransaction.value) return;

  const id = selectedTransaction.value.id;
  const res = await apiReq('DELETE', `/api/transaction/delete/${id}`);

  if (res && res.message === 'ok') {
    toast.success("Транзакциі видалена");
    closeModal();
    fetchData();
  }
};

// --- Lifecycle ---
onMounted(() => {
  fetchData();
});

// Если id бюджета меняется в URL без перезагрузки страницы
watch(() => route.params.budget_id, (newId) => {
  if (newId) fetchData();
});

</script>

<style scoped>
/* CSS Variables & Reset */
:root {
  --bg-color: #f4f7fe;
  --sidebar-color: #ffffff;
  --card-bg: #ffffff;
  --primary: #4318ff;
  --primary-bg: #eff4fb;
  --success: #05cd99;
  --danger: #ee5d50;
  --warning: #ffb547;
  --text-main: #2b3674;
  --text-secondary: #a3aed0;
  --border-color: #e0e5f2;
  --shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
  --radius: 20px;
}

.dashboard-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7fe;
  /* Fallback variable usage */
  color: #2b3674;
  display: flex;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 5px 0 0 0;
}

.user-pill {
  background: white;
  padding: 8px 15px;
  border-radius: 30px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-placeholder {
  width: 30px;
  height: 30px;
  background: #4318ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
  border: none !important;
  /* Убираем обводку принудительно */
}

.content-section {
  background: white;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
  border: none !important;
  /* Убираем обводку здесь тоже */
}

/* Стили для прогресс-бара, чтобы он был "сочным" */
.progress-container {
  height: 12px;
  /* Чуть увеличим высоту для красоты */
  background: #eff4fb;
  /* Светлый фон подложки */
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-bar {
  height: 100%;
  border-radius: 10px;
  /* Скругление самой полоски */
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  /* Плавная анимация */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Легкая тень для объема */
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-card small {
  color: #a3aed0;
  font-size: 14px;
  font-weight: 500;
}

.stat-card h2 {
  margin: 10px 0;
  font-size: 26px;
  font-weight: 700;
}

.trend-up {
  color: #05cd99;
  font-size: 13px;
  font-weight: 600;
}

.trend-down {
  color: #ee5d50;
  font-size: 13px;
  font-weight: 600;
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 20px;
  border-radius: 20px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  gap: 15px;
}

.toolbar-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Buttons */
.btn {
  padding: 10px 20px;
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

.btn-sm {
  padding: 8px 12px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4318ff;
  color: white;
  box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2);
}

.btn-outline {
  background: transparent;
  border: 1px solid #e0e5f2;
  color: #2b3674;
}

.btn-outline:hover:not(:disabled) {
  background: #f4f7fe;
}

.btn-danger {
  background: #fff0f0;
  color: #ee5d50;
}

.btn-danger:hover:not(:disabled) {
  background: #fee2e2;
}

/* Search */
.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a3aed0;
}

.search-input {
  padding: 10px 10px 10px 35px;
  border: 1px solid #e0e5f2;
  border-radius: 12px;
  outline: none;
  color: #2b3674;
}

/* Table */
.content-section {
  background: white;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;
}

th {
  text-align: left;
  color: #a3aed0;
  font-weight: 600;
  padding: 15px;
  border-bottom: 1px solid #e0e5f2;
  text-transform: uppercase;
  font-size: 12px;
}

td {
  padding: 15px;
  border-bottom: 1px solid #e0e5f2;
  vertical-align: middle;
}

tr {
  cursor: pointer;
  transition: 0.2s;
}

tbody tr:hover {
  background-color: #f8f9fa;
}

tbody tr.selected {
  background-color: #eff4fb;
}

tbody tr.selected td:first-child {
  border-left: 3px solid #4318ff;
}

/* Badges */
.badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
}

.badge-intent {
  background: #e2e8f0;
  color: #2b3674;
}

.badge-user {
  background: #e0e7ff;
  color: #4318ff;
  border-radius: 20px;
  font-size: 11px;
}

.amount-inc {
  color: #05cd99;
  font-weight: 700;
}

.amount-exp {
  color: #ee5d50;
  font-weight: 700;
}

.category-main {
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.category-sub {
  font-size: 12px;
  color: #a3aed0;
}

/* Form Styles inside Modal */
.form-grid {
  display: grid;
  gap: 15px;
  grid-template-columns: 1fr 1fr;
}

.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e5f2;
  border-radius: 10px;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Custom Radio Group */
.radio-group {
  display: flex;
  gap: 10px;
  background: #f4f7fe;
  padding: 5px;
  border-radius: 10px;
}

.radio-group label {
  flex: 1;
  text-align: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  margin: 0;
  transition: 0.2s;
}

.radio-group input {
  display: none;
}

.radio-group label.active {
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  color: #4318ff;
  font-weight: 700;
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  main {
    padding: 15px;
    padding-bottom: 80px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }
}

/* Исправление видимости текста в хедере */
header h1 {
  color: var(--text-main);
  /* Был слишком светлым на скриншоте */
  font-size: 32px;
  font-weight: 700;
}

header small {
  color: var(--text-secondary);
  display: block;
  margin-bottom: 4px;
}

/* Стили для выпадающего фильтра */
.select-filter {
  min-width: 160px;
  border-radius: 12px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  font-weight: 600;
  color: var(--text-main);
  padding: 8px 12px;
}

/* Стилизация сетки целей */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.goal-item {
  margin-bottom: 0;
}

.goal-progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-container {
  height: 10px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.5s ease;
}

/* Стиль для выпадающего списка */
.select-filter {
  padding: 10px 15px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-main);
  font-weight: 600;
  outline: none;
  cursor: pointer;
  min-width: 150px;
}

.select-filter:focus {
  border-color: var(--primary);
}

/* Сетка целей */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.goal-item {
  margin-bottom: 0;
}

.goal-progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-container {
  height: 10px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.5s ease;
}

/* Бейджи для направления транзакции */
.badge-inc {
  background: #e6fffb;
  color: var(--success);
  border: 1px solid rgba(5, 205, 153, 0.2);
}

.badge-exp {
  background: #fff1f0;
  color: var(--danger);
  border: 1px solid rgba(238, 93, 80, 0.2);
}

/* Улучшаем читаемость заголовков в статистике */
.stat-card h2 {
  color: var(--text-main) !important;
  /* Принудительно убираем белый цвет */
}
</style>