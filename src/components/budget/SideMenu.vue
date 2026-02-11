<template>
  <aside class="sidebar">
    <div class="logo">
      <i class="fas fa-shapes"></i> <span>BudgetFlow</span>
    </div>
    <nav>
      <ul>
        <router-link to="/dashboard" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ active: isActive }">
            <i class="fas fa-chart-pie"></i> <span>Дашборд</span>
          </li>
        </router-link>

        <router-link to="/budgets" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ active: isActive }">
            <i class="fas fa-wallet"></i> <span>Бюджеты</span>
          </li>
        </router-link>

        <router-link 
          v-if="currentBudgetId" 
          :to="`/transactions/${currentBudgetId}`" 
          custom 
          v-slot="{ navigate, isActive }"
        >
          <li @click="navigate" :class="{ active: isActive }">
            <i class="fas fa-exchange-alt"></i> <span>Транзакции</span>
          </li>
        </router-link>

        <router-link to="/categories" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ active: isActive }">
            <i class="fas fa-list"></i> <span>Категорії</span>
          </li>
        </router-link>

        <router-link to="/goals" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ active: isActive }">
            <i class="fas fa-bullseye"></i> <span>Цели</span>
          </li>
        </router-link>

        <router-link to="/settings" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="{ active: isActive }">
            <i class="fas fa-cog"></i> <span>Настройки</span>
          </li>
        </router-link>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    // Эта функция автоматически следит за URL
    currentBudgetId() {
      // Возвращает ID, если мы в /budgets/:budget_id или /transactions/:budget_id
      return this.$route.params.budget_id;
    }
  }
}
</script>

<style scoped>
/* Стили Sidebar перенесены из твоего макета */
.sidebar {
  width: 280px;
  background: var(--sidebar-color, #ffffff);
  border-right: 1px solid var(--border-color, #e0e5f2);
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex-shrink: 0;
  height: 100vh; /* Фикс высоты для компонента */
}

.logo {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main, #2b3674);
  margin-bottom: 40px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.logo span { color: var(--primary, #4318ff); }

nav ul { list-style: none; padding: 0; margin: 0; }
nav li {
  padding: 15px 20px;
  margin-bottom: 5px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  color: var(--text-secondary, #a3aed0);
  font-weight: 500;
  display: flex;
  align-items: center;
}
nav li i { margin-right: 15px; font-size: 18px; width: 20px; text-align: center; }
nav li:hover, nav li.active { background: var(--bg-color, #f4f7fe); color: var(--primary, #4318ff); font-weight: 700; }
nav li.active { border-right: 3px solid var(--primary, #4318ff); }

@media (max-width: 1024px) {
    .sidebar { width: 80px; padding: 20px 10px; }
    .logo span, nav li span { display: none; }
    .logo { font-size: 16px; }
    nav li { justify-content: center; }
    nav li i { margin: 0; }
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed; bottom: 0; left: 0; width: 100%; height: 65px;
        flex-direction: row; border-top: 1px solid var(--border-color);
        border-right: none;
        padding: 0; z-index: 100; background: white;
    }
    nav { width: 100%; }
    nav ul { display: flex; justify-content: space-around; height: 100%; align-items: center; }
    nav li { flex-direction: column; gap: 4px; border: none; padding: 5px; margin: 0; }
    nav li.active { border: none; color: var(--primary); }
    nav li span { display: block; font-size: 10px; }
    .logo { display: none; } /* Лого обычно скрывают в нижнем меню */
}
</style>