<template>
  <div class="offering-wrapper">
    <div class="card-content">
      <h3>{{ offering.name }}</h3>
      <div class="offering-details">
        <p><strong class="description">Детальніше: </strong>{{ offering.description }}</p>
        <p class="meta"><strong class="description">Тип послуги: </strong>{{ offering.service_type }}</p>
        <p v-if="offering.massage_type !== ''" class="meta"><strong class="description">Тип масажу: </strong>{{ offering.massage_type }}</p>
        <p class="meta"><strong class="description">Дата створення: </strong>{{ formatDate(offering.date) }}</p>
        <p class="meta"><strong class="description">Дата закінчення: </strong>{{ formatDate(offering.date_end) }}</p>
        <p class="meta"><strong class="description">Виконавець: </strong>{{ offering.performer }} {{ offering.last_name }}</p>
        <p><strong class="description">Заброньовано термінів: </strong>{{ offering.booked_slots }} з {{ offering.total_slots }}</p>
  
        <div class="button-wrapper">
          <button class="btn-record" @click="showRecordsButton">Показати записи</button>
        </div>
      </div>
    </div>

    <router-link :to="'/service/edit/' + offering.id" class="btn-edit">
      Редагувати ✏️
    </router-link>
    
    <div v-if="showRecords" class="modal-overlay" @click.self="showRecords = false">
      <div class="modal-content">
        <span class="close" @click="showRecords = false">&times;</span>
        
        <div class="modal-header">
          <h2>Записи на послугу:</h2>
          <h2 v-if="termins.length === 0" style="color: orangered; font-size: 18px; margin-top: 10px;">
            Записів поки що немає
          </h2>
        </div>

        <div class="modal-body" v-if="termins.length > 0">
          <section class="radio-section">
            <div class="radio-list">
              <div v-for="item in termins" :key="item.id" class="radio-item">
                <input
                  type="radio"
                  :id="'termin-' + item.id"
                  :value="item.id"
                  name="time_group"
                  v-model="selectedTermin"
                />
                <label :for="'termin-' + item.id">{{ formatDate(item.date) }} ({{ item.client }})</label>
              </div>
            </div>
          </section>
        </div>
  
        <div class="modal-footer">
          <button
            v-if="termins.length > 0"
            class="btn-record"
            @click="selectTermin"
            :disabled="!selectedTermin"
          >Коментарі</button>
          <button class="btn-cancel" @click="showRecords = false">Назад</button>
        </div>
      </div>
    </div>
  
    <div v-if="showComments" class="modal-overlay" @click.self="showComments = false">
      <div class="modal-content">
        <span class="close" @click="showComments = false">&times;</span>
        <div class="modal-header">
          <h2>Коментарі:</h2>
        </div>
        <div class="modal-body">
          <comment :id="selectedTermin"></comment>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showComments = false">Назад</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import ipconfig from '@/server_configs/config.js';
import comment from '@/components/Comments.vue';
 
export default {
  props: {
    offering: {
      type: Object,
      required: true,
    },
  },
  components: { comment },
  setup() {
    const showRecords = ref(false);
    const showComments = ref(false);
    return { showRecords, showComments };
  },
  data() {
    return {
      termins: [],
      selectedTermin: null,
    };
  },
  methods: {
    showRecordsButton() {
      this.showRecords = true;
      axios
        .post(
          ipconfig.backend_ip + '/api/record/termins',
          { service_id: this.offering.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
            },
          }
        )
        .then((response) => {
          this.termins = response.data.termins || [];
          this.selectedTermin = null;
        })
        .catch((error) => {
          console.error(error);
          this.termins = [];
          this.selectedTermin = null;
        });
    },
    selectTermin() {
      if (this.selectedTermin) {
        this.showRecords = false;
        this.showComments = true;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('uk-UA');
    },
  },
};
</script>
 
<style scoped>
/* -------------------- КАРТКА -------------------- */
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
  display: flex;
  align-items: center;
  justify-content: space-between; 
}

.card-content { flex-grow: 1; padding-right: 20px; }
h3 { text-align: center; font-size: 22px; color: #ff9aff; margin-bottom: 15px; }
.offering-details p { font-size: 15px; margin: 8px 0; color: #ccc; }
.description { color: #ff9aff; font-weight: 600; }
.meta { color: #bbb; font-size: 14px; margin-left: 5px; }

.btn-edit {
  border: 2px solid #ff9aff; 
  color: #ff9aff; 
  padding: 10px 15px;
  border-radius: 20px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

/* -------------------- МОДАЛЬНІ ВІКНА -------------------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 30, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: #2c2c44;
  border-radius: 12px;
  padding: 20px;
  max-width: 480px;
  width: 100%;
  max-height: 85vh; /* Обмеження висоти */
  color: #ddd;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  position: relative;
  display: flex;
  flex-direction: column; /* Колонкова структура */
}

.modal-header {
  flex-shrink: 0;
  padding-bottom: 15px;
}

.modal-body {
  flex-grow: 1;
  overflow-y: auto; /* СКРОЛ ТУТ */
  padding: 10px 5px;
}

.modal-footer {
  flex-shrink: 0;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  border-top: 1px solid rgba(255, 154, 255, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 28px;
  cursor: pointer;
  color: #ff9aff;
}

/* -------------------- ЕЛЕМЕНТИ СПИСКУ -------------------- */
.radio-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-item input[type='radio'] { display: none; }

.radio-item label {
  display: block;
  padding: 15px;
  background: #050505;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.radio-item input[type='radio']:checked + label {
  border-color: #ff9aff;
  background: linear-gradient(135deg, #ff6aff, #ff00ff);
  color: white;
}

.btn-record {
  background: linear-gradient(135deg, #ff6aff, #ff00ff);
  border: none;
  color: white;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;

}

.btn-record:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  border: 2px solid #ff9aff;
  color: #ff9aff;
  padding: 12px 25px;
  border-radius: 30px;
  cursor: pointer;
}
.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Скроллбар */
.modal-body::-webkit-scrollbar { width: 5px; }
.modal-body::-webkit-scrollbar-thumb { background: #ff9aff; border-radius: 10px; }

/* -------------------- МОБІЛКА -------------------- */
@media (max-width: 500px) {
  .offering-wrapper { flex-direction: column; align-items: stretch; }
  .btn-edit { order: 10; margin-top: 20px; text-align: center; }
  .modal-footer { flex-direction: column; }
}
</style>