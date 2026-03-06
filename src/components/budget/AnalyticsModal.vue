<template>
  <Transition name="fade">
    <div class="analytics-overlay" @click.self="$emit('close')">
      <div class="analytics-container">
        <header class="analytics-header">
          <div class="title-group">
            <div class="icon-box">
              <i class="fas fa-chart-line"></i>
            </div>
            <div>
              <h2>Аналітичний дашборд</h2>
              <p>Візуалізація ваших доходів та витрат</p>
            </div>
          </div>
          <button class="close-btn" @click="$emit('close')" aria-label="Закрити">
            <i class="fas fa-times"></i>
          </button>
        </header>

        <main class="analytics-body">
          <slot></slot> 
          </main>

        <footer class="analytics-footer">
          <div class="footer-info">
            <i class="fas fa-info-circle"></i>
            <span>Дані не оновлюються в режимі реального часу</span>
          </div>
          <button class="btn-close" @click="$emit('close')">Зрозуміло</button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// Никакой лишней логики, только каркас
defineEmits(['close']);
</script>

<style scoped>
.analytics-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 11, 41, 0.75); /* Темный элегантный фон */
  backdrop-filter: blur(12px); /* Эффект стекла */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.analytics-container {
  background: #f4f7fe;
  width: 100%;
  max-width: 1320px; /* Идеальная ширина для дашборда */
  height: 90vh;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.analytics-header {
  padding: 24px 40px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e5f2;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-box {
  width: 48px;
  height: 48px;
  background: #4318ff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.title-group h2 {
  margin: 0;
  font-size: 22px;
  color: #2b3674;
  font-weight: 800;
}

.title-group p {
  margin: 4px 0 0;
  color: #a3aed0;
  font-size: 14px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #a3aed0;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover { color: #ee5d50; }

.analytics-body {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e0e5f2 transparent;
}

.analytics-footer {
  padding: 20px 40px;
  background: white;
  border-top: 1px solid #e0e5f2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a3aed0;
  font-size: 13px;
}

.btn-close {
  background: #2b3674;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-close:hover { transform: translateY(-2px); }

/* Анимации */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .analytics-container { height: 100vh; border-radius: 0; }
  .analytics-header { padding: 20px; }
  .analytics-body { padding: 20px; }
}
</style>