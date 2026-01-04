<template>
  <div class="offering-wrapper">
    <h3>{{ offering.name }}</h3>
    <div class="offering-details">
      <p><strong class="description">Детальніше: </strong>{{ offering.description }}</p>
      <p class="meta"><strong class="description">Тип послуги: </strong>{{ offering.service_type }}</p>
      <p v-if="offering.massage_type !== ''" class="meta">
        <strong class="description">Тип масажу: </strong>{{ offering.massage_type }}
      </p>
      <p class="meta">
        <strong class="description">Дата закінчення: </strong>{{ formatDate(offering.date_end) }}
      </p>
      <p class="meta">
        <strong class="description">Виконавець: </strong>{{ offering.first_name }} {{ offering.last_name }}
      </p>

      <div class="button-wrapper">
        <button class="btn-record" @click="show_dialog">Записатись</button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <span class="close-icon" @click="closeModal">&times;</span>
        
        <div class="modal-header">
          <h2>Оберіть доступний час</h2>
        </div>

        <div class="modal-body">
          <section class="radio-list">
            <div v-for="item in available_time" :key="item.id" class="radio-item">
              <input 
                type="radio" 
                :id="'time-' + item.id" 
                :value="item.id" 
                name="time_group" 
                v-model="selected_time" 
              />
              <label :for="'time-' + item.id">
                З {{ extractTime(item.time_start) }} по {{ extractTime(item.time_end) }}
              </label>
            </div>
            <p v-if="available_time.length === 0" class="no-time">Немає доступного часу</p>
          </section>
        </div>

        <div class="modal-footer">
          <button 
            @click="make_record" 
            class="btn-record" 
            :disabled="!selected_time"
          >
            Обрати
          </button>
          <button @click="closeModal" class="btn-cancel">Назад</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import ipconfig from "@/server_configs/config.js";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "MyComponent",
  props: {
    offering: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const showModal = ref(false);
    const notify = (message) => {
      toast.success(message, {
        autoClose: 2000,
        theme: 'dark',
      });
    };
    return { showModal, notify };
  },
  data() {
    return {
      available_time: [],
      selected_time: null,
      server_ip: ipconfig['backend_ip']
    };
  },
  emits: ["delete-offering"],
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('uk-UA');
    },
    extractTime(dateString) {
      if (!dateString) return "00:00";
      const date = new Date(dateString);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    show_dialog() {
      this.showModal = true;
      this.get_available_time();
    },
    closeModal() {
      this.showModal = false;
      this.selected_time = null;
    },
    get_available_time() {
      axios.post(`${this.server_ip}/api/service/availabletime`, {
        "service_id": this.offering.id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        this.available_time = response.data;
      }).catch(error => {
        console.error("Error fetching time:", error);
      });
    },
    make_record() {
      if (!this.selected_time) return;

      axios.post(`${this.server_ip}/api/record/create`, {
        "service_id": this.offering.id,
        "available_time_id": this.selected_time
      }, { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` } 
      }).then(() => {
        this.$emit("delete-offering", this.offering.id);
        this.closeModal();
        this.notify("Записано успішно!");
      }).catch(err => {
        console.error("Booking error:", err);
      });
    }
  },
};
</script>

<style scoped>
/* Картка послуги */
.offering-wrapper {
  background: #1e1e2f;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(255, 154, 255, 0.2);
  border: 1px solid #ff9aff;
  max-width: 500px;
  margin: 25px auto;
  padding: 20px 30px;
  color: #eee;
  font-family: 'Lato', sans-serif;
}

h3 {
  text-align: center;
  font-size: 22px;
  color: #ff9aff;
  margin-bottom: 15px;
}

.description { color: #ff9aff; font-weight: 600; }
.meta { color: #bbb; font-size: 14px; margin: 8px 0; }

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Кнопки */
.btn-record {
  background: linear-gradient(135deg, #ff6aff, #ff00ff);
  border: none;
  color: white;
  padding: 12px 28px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-record:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 0, 255, 0.6);
}

.btn-record:disabled {
  background: #444;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-cancel {
  background: transparent;
  border: 2px solid #ff9aff;
  color: #ff9aff;
  padding: 12px 28px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
}

/* Модальне вікно (Fixed) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 20, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: #2c2c44;
  border-radius: 15px;
  width: 100%;
  max-width: 450px;
  max-height: 85vh; /* Обмеження висоти */
  display: flex;
  flex-direction: column; /* Важливо для внутрішнього скролу */
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 154, 255, 0.2);
}

.modal-header {
  padding: 20px;
  flex-shrink: 0;
  text-align: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #ffb0ff;
}

.modal-body {
  padding: 0 25px;
  overflow-y: auto; /* Вмикаємо прокрутку тільки тут */
  flex-grow: 1;
}

.modal-footer {
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 154, 255, 0.1);
}

/* Радіо кнопки */
.radio-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
}

.radio-item input[type="radio"] {
  display: none;
}

.radio-item label {
  display: block;
  padding: 14px;
  background: #1a1a2e;
  border: 2px solid #3f3f5f;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  color: #ccc;
}

.radio-item input[type="radio"]:checked + label {
  background: rgba(255, 154, 255, 0.2);
  border-color: #ff9aff;
  color: #fff;
  box-shadow: 0 0 10px rgba(255, 154, 255, 0.3);
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  color: #ff9aff;
  cursor: pointer;
  z-index: 1;
}

.no-time {
  text-align: center;
  padding: 20px;
  color: #888;
}

/* Скроллбар */
.modal-body::-webkit-scrollbar {
  width: 6px;
}
.modal-body::-webkit-scrollbar-thumb {
  background: #ff9aff;
  border-radius: 10px;
}

@media (max-width: 480px) {
  .modal-footer {
    flex-direction: column;
  }
  .btn-record, .btn-cancel {
    width: 100%;
  }
}
</style>