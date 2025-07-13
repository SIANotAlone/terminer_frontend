<template>
    <div class="offering-wrapper">
      <h3>{{ offering.name }}</h3>
      <div class="offering-details">
  
        <p><strong class="description">Детальніше: </strong>{{ offering.description }}</p>
        <p class="meta"><strong class="description">Тип послуги: </strong>{{ offering.service_type }}</p>
        <p class="meta"><strong class="description">Дата створення: </strong>{{ formatDate(offering.date) }}</p>
        <p class="meta"><strong class="description">Дата закінчення: </strong>{{ formatDate(offering.date_end) }}</p>
        <p class="meta"><strong class="description">Виконавець: </strong>{{ offering.performer }} {{ offering.last_name }}</p>
        <p><strong class="description">Заброньовано термінів: </strong>{{ offering.booked_slots }} з {{ offering.total_slots }}</p>
  
        <div class="button-wrapper">
          <button class="btn-record" @click="showRecordsButton">Показати записи</button>
        </div>
  
      </div>
  
      <!-- Модальное окно с записями -->
      <div v-if="showRecords" class="modal">
        <div class="modal-content">
          <span class="close" @click="showRecords = false">&times;</span>
          <h2>Записи на послугу:</h2>
          <h2 v-if="termins.length === 0" style="color: orangered;">Записів поки що немає</h2>
          <br v-if="termins.length === 0">
          <button v-if="termins.length === 0" class="btn-cancel" @click="showRecords = false">Назад</button>
          <section class="radio-section" v-if="termins.length > 0">
            <div class="radio-list">
              <div v-for="item in termins" :key="item.id" class="radio-item">
                <input
                  type="radio"
                  :id="item.id"
                  :value="item.id"
                  name="time_group"
                  v-model="selectedTermin"
                />
                <label :for="item.id">{{ formatDate(item.date) }} ({{ item.client }})</label>
              </div>
            </div>
          </section>
  
          <div class="modal-buttons" v-if="termins.length > 0">
            <br>
            <button
              class="btn-record"
              @click="selectTermin"
              :disabled="!selectedTermin"
            >Коментарі</button>
            <button class="btn-cancel" @click="showRecords = false">Назад</button>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно с комментариями -->
      <div v-if="showComments" class="modal">
        <div class="modal-content">
          <span class="close" @click="showComments = false">&times;</span>
          <h2>Коментарі:</h2>
          <comment :id="selectedTermin"></comment>
          <div class="modal-buttons">
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
    transition: transform 0.3s ease;
  }
  
  h3 {
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 15px;
    color: #ff9aff;
  }
  
  .offering-details p {
    font-size: 15px;
    margin: 8px 0;
    color: #ccc;
  }
  
  .description {
    color: #ff9aff;
    font-weight: 600;
  }
  
  .meta {
    color: #bbb;
    margin-left: 5px;
    font-size: 14px;
  }
  
  .button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .btn-record {
    background: linear-gradient(135deg, #ff6aff, #ff00ff);
    border: none;
    color: white;
    padding: 12px 28px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 5px 10px rgba(255, 105, 180, 0.6);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  
  .btn-record:hover {
    background: linear-gradient(135deg, #ff00ff, #ff6aff);
    box-shadow: 0 8px 20px rgba(255, 0, 255, 0.8);
    transform: scale(1.05);
  }
  
  .btn-record:focus {
    outline: none;
    box-shadow: 0 0 8px 3px rgba(255, 154, 255, 0.7);
  }
  
  .btn-cancel {
    background: transparent;
    border: 2px solid #ff9aff;
    color: #ff9aff;
    padding: 10px 26px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    margin: 0 10px;
    transition: all 0.3s ease;
  }
  
  .btn-cancel:hover {
    background: #ff9aff;
    color: #1e1e2f;
  }
  
  .modal {
    position: fixed;
    inset: 0;
    background: rgba(20, 20, 30, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .modal-content {
    background: #2c2c44;
    border-radius: 12px;
    padding: 25px 30px;
    max-width: 480px;
    width: 90%;
    color: #ddd;
    box-shadow: 0 8px 30px rgba(255, 154, 255, 0.4);
    position: relative;
    text-align: center;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
    color: #ddd;
  }
  
  .radio-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  
  .radio-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .radio-item [type='radio'] {
    display: none;
  }
  
  .radio-item label {
    display: block;
    padding: 15px 60px;
    background: #050505;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #eee;
    cursor: pointer;
    transition: background 0.3s ease, border-color 0.3s ease;
    position: relative;
    user-select: none;
  }
  
  .radio-item input[type='radio']:checked + label {
    border-color: #ff9aff;
    background: linear-gradient(135deg, #ff6aff, #ff00ff);
    color: white;
  }
  
  .modal-buttons {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  </style>
  