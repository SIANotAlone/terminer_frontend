<template>
  <aside class="sidebar">
    <div class="logo">
      <i class="fa-solid fa-book"></i> <span>Terminer</span>
    </div>
    <nav>
      <ul>
        <router-link to="/budgets" custom v-slot="{ navigate }">
          <li @click="navigate" :class="{ active: isPathActive('/budgets') }">
            <i class="fas fa-wallet"></i> <span>Бюджети</span>
          </li>
        </router-link>

        <router-link 
          v-if="currentBudgetId" 
          :to="`/transactions/${currentBudgetId}`" 
          custom 
          v-slot="{ navigate }"
        >
          <li @click="navigate" :class="{ active: isPathActive('/transactions') }">
            <i class="fas fa-exchange-alt"></i> <span>Транзакції</span>
          </li>
        </router-link>

        <router-link to="/categories" custom v-slot="{ navigate }">
          <li @click="navigate" :class="{ active: isPathActive('/categories') }">
            <i class="fas fa-list"></i> <span>Категорії</span>
          </li>
        </router-link>

        <router-link to="/goals" custom v-slot="{ navigate }">
          <li @click="navigate" :class="{ active: isPathActive('/goals') }">
            <i class="fas fa-bullseye"></i> <span>Цілі</span>
          </li>
        </router-link>

        <router-link to="/settings" custom v-slot="{ navigate }">
          <li @click="navigate" :class="{ active: isPathActive('/settings') }">
            <i class="fas fa-cog"></i> <span>Налаштування</span>
          </li>
        </router-link>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Определяем ID бюджета из URL (из любого места пути)
const currentBudgetId = computed(() => {
  return route.params.budget_id || route.path.split('/')[2]; 
});

// Функция для проверки, активен ли пункт меню
const isPathActive = (pathSegment) => {
  return route.path.includes(pathSegment);
};
</script>
<style scoped>
.sidebar {
  width: 280px;
  background-color: #ffffff;
  /* Убираем стандартный бордер, если он слишком яркий */
  border-right: 1px solid #F4F7FE; 
  display: flex;
  flex-direction: column;
  padding: 30px 0; /* Паддинги по бокам лучше перенести на элементы */
  height: 100vh;
  position: sticky;
  top: 0;
}

.logo {
  font-size: 26px;
  font-weight: 800;
  color: #2b3674;
  margin-bottom: 40px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.5px;
}
.logo span { color: #4318ff; }

nav ul { list-style: none; padding: 0; margin: 0; }

nav li {
  position: relative;
  padding: 12px 32px;
  margin-bottom: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  /* Цвет текста по умолчанию (серый как на скрине) */
  color: #A3AED0; 
  font-weight: 500;
}

nav li i {
  margin-right: 12px;
  font-size: 18px;
  width: 24px;
  text-align: center;
  transition: color 0.2s ease;
}

/* Эффект при наведении */
nav li:hover {
  color: #2B3674;
}

/* Активное состояние */
nav li.active {
  color: #2B3674; /* Темно-синий текст */
  font-weight: 700;
}

/* Синий индикатор справа (как на скриншоте) */
nav li.active::after {
  content: "";
  position: absolute;
  right: 0;
  top: 5px;
  bottom: 5px;
  width: 4px;
  background-color: #4318ff;
  border-radius: 4px 0 0 4px;
}

/* Иконка активного пункта тоже синяя */
nav li.active i {
  color: #4318ff;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .sidebar {
    /* Фиксируем строго внизу */
    position: fixed !important; 
    bottom: 0 !important;
    top: auto !important; /* Отменяем верхнюю привязку, если она была */
    left: 0;
    width: 100%;
    height: 65px;
    flex-direction: row;
    padding: 0;
    z-index: 100;
    border-top: 1px solid #E0E5F2;
    border-right: none;
  }
  nav { width: 100%; }
  nav ul { 
    display: flex; 
    justify-content: space-around; 
    align-items: center; 
    height: 100%; 
  }
  nav li { 
    padding: 0; 
    margin: 0; 
    flex-direction: column; 
    gap: 2px;
  }
  nav li.active::after {
    top: auto;
    bottom: 0;
    right: 20%;
    left: 20%;
    width: auto;
    height: 3px;
    border-radius: 3px 3px 0 0;
  }
  nav li span { font-size: 10px; }
  .logo { display: none; }
}
</style>