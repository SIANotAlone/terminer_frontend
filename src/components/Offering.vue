<template>
  <div class="offering-wrapper">
    <h3>{{ offering.name }}</h3>
    <div class="offering-details">

      <p><strong class="description">Детальніше: </strong>{{ offering.description }}</p>
      <p class="meta"><strong class="description">Тип послуги: </strong>{{ offering.service_type }}</p>
      <p v-if="offering.massage_type !== ''" class="meta"><strong class="description">Тип масажу: </strong>{{ offering.massage_type }}</p>
      <p class="meta"><strong class="description">Дата закінчення: </strong>{{ formatDate(offering.date_end) }}</p>
      <p class="meta"><strong class="description">Виконавець: </strong>{{ offering.first_name }} {{ offering.last_name }}</p>

      <div class="button-wrapper">
        <button class="btn-record" @click="show_dialog">Записатись</button>
      </div>

    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h2>Оберіть доступний час в діапазоні</h2>

        <section class="radio-section">
          <div class="radio-list">
            <div v-for="item in available_time" :key="item.id" class="radio-item">
              <input type="radio" :id="item.id" :value="item.id" :name="'time_group'" @change="selected_time = item.id" />
              <label :for="item.id">З {{ extractTime(item.time_start) }} по {{ extractTime(item.time_end) }}</label>
            </div>
          </div>
        </section>

        <div class="modal-buttons">
          <button @click="make_record" class="btn-record">Записатись</button>
          <button @click="showModal = false" class="btn-cancel">Назад</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>


import { ref } from 'vue';
import axios from 'axios';
import ipconfig from "@/server_configs/config.js"
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


export default {
  setup() {

    const showModal = ref(false);


    const theme = 'dark';
    const notify = (message) => {
      toast.success(message, {
        autoClose: 2000,
        theme,
      }); // ToastOptions

    }
    return { showModal, notify }
  },
  components: {


  },
  name: "MyComponent",
  props: {
    offering: {
      type: Object,
      required: true,
    },
  },


  data() {
    return {
      available_time: [],
      selected_time: null,
      server_ip: ipconfig['backend_ip']
    }
  },
  emits: ["delete-offering"], // Добавляем событие для удаления
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('uk-UA'); // Преобразует дату в формат "17.11.2024"
    },
    extractTime(dateString) {
      const date = new Date(dateString);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');

      return `${hours}:${minutes}`;
    },
    show_dialog(id) {

      this.showModal = true
      this.get_available_time(id)
    },

    get_available_time(id) {

      axios.post(this.server_ip + "/api/service/availabletime", {

        "service_id": this.offering.id
      }, {

        headers: {
          'Authorization': `Bearer ` + localStorage.getItem('jwt_token'),
          'Content-Type': 'application/json'
        }
      }).then(response => {
        this.available_time = response.data
      }).catch(error => {
        console.error(error);
      });
    },
    make_record() {
      let service_id = this.offering.id
      let selected_time = this.selected_time
      // console.log(service_id, selected_time)
      axios.post(this.server_ip + "/api/record/create", {
        "service_id": service_id,
        "available_time_id": selected_time
      }, { 'headers': { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') } }).then(response => {
        console.log(response.data)
        console.log("success")
        this.$emit("delete-offering", this.offering.id); // Відправляємо подію в батьківський компонент
        this.showModal = false
        this.notify("Записано")

      })

    }

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

/* .offering-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(255, 154, 255, 0.4);
} */

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

/* Модалка */

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
  right: 15px;
  top: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #ff9aff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close:hover {
  color: #ff5aff;
}

h2 {
  margin-bottom: 20px;
  color: #ffb0ff;
  font-weight: 700;
}

/* Радио кнопки */

.radio-section {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 12px;
}

.radio-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.radio-item {
  margin: 8px 0;
  width: 100%;
  max-width: 320px;
}

.radio-item input[type="radio"] {
  display: none;
}

.radio-item label {
  display: block;
  padding: 15px 40px;
  background: #111122;
  border: 2px solid #ff9aff;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #ddd;
  transition: all 0.3s ease;
  user-select: none;
  text-align: center;
  position: relative;
}
/* 
.radio-item label:hover {
  background: #ff9aff;
  color: #1a001a;
  border-color: #ff6aff;
} */

.radio-item input[type="radio"]:checked + label {
  background: #ff9aff;
  color: #1a001a;
  border-color: #ff6aff;
  box-shadow: 0 0 12px 2px #ff6aff;
}

/* Кнопки в модалке */

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-cancel {
  background: transparent;
  border: 2px solid #ff9aff;
  border-radius: 30px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  color: #ff9aff;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-cancel:hover {
  background-color: #ff9aff;
  color: #1a001a;
}

/* Адаптивность */

@media (max-width: 480px) {
  .offering-wrapper {
    margin: 20px 10px;
    padding: 15px 20px;
  }

  h3 {
    font-size: 20px;
  }

  .offering-details p {
    font-size: 14px;
  }

  .btn-record, .btn-cancel {
    width: 100%;
    padding: 12px 0;
  }

  .radio-item label {
    font-size: 14px;
    padding: 12px 20px;
  }
}
</style>