<template>
  <div class="category-page-layout">
    <Sidebar />

    <main class="main-content">
      <header>
        <h1 style="color: black;">Налаштування системи</h1>
      </header>

      <section class="content-section settings-container">
        <div class="settings-nav">
          <button class="nav-item active">
            <i class="fas fa-user-cog"></i> <span>Профіль</span>
          </button>
          <button class="nav-item">
            <i class="fas fa-paint-brush"></i> <span>Зовнішній вигляд</span>
          </button>
          <button class="nav-item">
            <i class="fas fa-shield-alt"></i> <span>Безпека</span>
          </button>
          <button class="nav-item">
            <i class="fas fa-bell"></i> <span>Сповіщення</span>
          </button>
        </div>

        <div class="settings-content">
          <div class="empty-settings-state">
            <div class="icon-box">
              <i class="fas fa-tools"></i>
            </div>
            <h2>Розділ ще знаходиться у розробці</h2>
            <p>Тут скоро з’являться налаштування вашого облікового запису.</p>
            
            <div class="placeholder-cards">
              <div class="skeleton-card"></div>
              <div class="skeleton-card short"></div>
              <div class="skeleton-card"></div>
            </div>
          </div>

          <div class="settings-footer">
            <button class="btn btn-outline" disabled>Скасувати</button>
            <button class="btn btn-primary" disabled>Зберегти зміни</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from '@/components/budget/SideMenu.vue';

export default {
  name: 'SettingsPage',
  components: { Sidebar }
};
</script>

<style scoped>
/* Используем общую структуру из вашего компонента */
.category-page-layout {
  --text-main: #2b3674;
  --text-secondary: #a3aed0;
  --primary: #4318ff;
  --bg-color: #f4f7fe;
  --border: #e0e5f2;
  --radius: 20px;
  display: flex; 
  min-height: 100vh; 
  background-color: var(--bg-color);
  color: var(--text-main) !important;
}

.main-content { 
  flex: 1; 
  padding: 30px; 
  width: 100%; 
  max-width: 1400px; 
  margin: 0 auto; 
}

.settings-container {
  display: flex;
  gap: 0;
  padding: 0;
  overflow: hidden;
  min-height: 600px;
}

/* Боковая навигация внутри настроек */
.settings-nav {
  width: 250px;
  border-right: 1px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  text-align: left;
}

.nav-item i {
  width: 20px;
  font-size: 18px;
}

.nav-item:hover {
  background: #f8faff;
  color: var(--text-main);
}

.nav-item.active {
  background: var(--bg-color);
  color: var(--primary);
}

/* Контентная часть */
.settings-content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.empty-settings-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.icon-box {
  width: 80px;
  height: 80px;
  background: #f4f7fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--primary);
  margin-bottom: 20px;
}

.empty-settings-state h2 {
  margin-bottom: 10px;
  color: var(--text-main);
}

.empty-settings-state p {
  color: var(--text-secondary);
  max-width: 300px;
  margin-bottom: 30px;
}

/* Скелетоны для красоты */
.placeholder-cards {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skeleton-card {
  height: 40px;
  background: #f8faff;
  border-radius: 8px;
  width: 100%;
}

.skeleton-card.short {
  width: 60%;
}

/* Кнопки */
.settings-footer {
  margin-top: auto;
  padding-top: 30px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}

.btn-primary { background: var(--primary); color: white; }
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-main); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Адаптивность */
@media (max-width: 768px) {
  .settings-container {
    flex-direction: column;
  }
  
  .settings-nav {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 10px;
  }

  .nav-item span {
    display: none; /* Оставляем только иконки на мобилках */
  }
  
  .settings-content {
    padding: 20px;
  }
}
</style>