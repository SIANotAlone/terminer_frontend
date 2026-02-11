<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div 
      class="modal-content" 
      role="dialog" 
      aria-modal="true" 
      @click.stop
    >
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button 
          class="close-btn" 
          aria-label="Закрыть" 
          @click="$emit('close')"
        >
          &times;
        </button>
      </header>

      <div class="modal-body">
        <slot></slot>
      </div>

      <footer v-if="$slots.footer" class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    title: { 
      type: String, 
      default: 'Модальное окно' 
    }
  },
  emits: ['close']
}
</script>

<style scoped>
/* Твои стили остаются прежними, они корректны */
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5); z-index: 1000;
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: white; width: 500px; max-width: 90%;
  border-radius: 20px; padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  animation: fadeIn 0.2s ease-out;

}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
}
.modal-header h3 { margin: 0; color: #2b3674; font-size: 20px; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #a3aed0; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; }

@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(-20px); } 
  to { opacity: 1; transform: translateY(0); } 
}
</style>