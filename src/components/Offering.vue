<template>


  <div class="offering-wrapper">
    <h3 align="center">{{ offering.name }}</h3>
    <div class="offering-details">

      <p><strong class="description">Детальніше: </strong>{{ offering.description }}</p>
      <p class="meta"><strong class="description">Тип послуги: </strong>{{ offering.service_type }}</p>

      <p class="meta"><strong class="description">Дата закінчення: </strong>{{ formatDate(offering.date_end) }}</p>
      <p class="meta"><strong class="description">Виконавець: </strong>{{ offering.first_name }} {{ offering.last_name
        }}</p>
      <div style="display: flex; justify-content: center;">
        <button class="knopka_neion lusa-10" @click="show_dialog">Записатись</button>

      </div>

    </div>



    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h2>Оберіть доступний час в діапазоні</h2>
        <br>

        <section class="radio-section">
          <div class="radio-list">

            <div v-for="item in available_time" :key="item.id" class="radio-item">
              <input type="radio" :id="item.id" :value="item.id" :name="'time_group'"
                @change="selected_time = item.id" />
              <label :for="item.id">З {{ extractTime(item.time_start) }} по {{ extractTime(item.time_end) }}</label>
            </div>
          </div>
        </section>

        <br>
        <div style="display: flex; justify-content: center; ">
          <button @click="make_record" class="knopka_neion lusa-10" style="width: 150px;">Записатись</button>
          <button @click="showModal = false" class="knopka_neion lusa-10" style="width: 150px;">Назад</button>
        </div>

      </div>
    </div>
  </div>
  <br>
  <br>
  <br>
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
  display: block;
  color: white;
  border-radius: 10px;
  border: 1px solid #ff9aff;
  margin-top: 20px;
  margin-left: 20%;
  margin-right: 20%;

}

.offering-details {
  display: inline;
}

.description {
  color: darkgray;
}

h3 {
  margin-top: 15px;
  font-weight: 700;
  font-size: 18px;
  font-style: bold;
}

p {
  font-size: 14px;
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 10px;
}

.lusa-10 {
  border: 1px solid #ff9aff;
  box-shadow: 0 0 5px #ff9aff, 0 0 5px #ff9aff inset;
  color: #ff9aff;
  background: #000;
  z-index: 2;
  transition: all 0.3s ease;
  overflow: hidden;
}

.lusa-10:after {
  position: absolute;
  content: " ";
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: #ff9aff;
  transition: all 0.3s ease;
  -webkit-transform: scale(0);
  transform: scale(0);
}

.lusa-10:hover {
  color: #fff;
}

.lusa-10:hover:after {
  -webkit-transform: scale(1);
  transform: scale(1);
}

.osnovanua {
  width: 90%;
  margin: 40px auto;
  text-align: center;
}

button {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.knopka_neion {
  color: #fff;
  width: 250px;
  height: 45px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: grey;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  text-decoration: none;
}

ul {
  list-style-type: none;
}

body {
  background-color: rgb(19, 18, 21);
  color: #ffffff;
}

.radio-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  margin-bottom: 20px;
}

.radio-item [type="radio"] {
  display: none;
}

.radio-item+.radio-item {
  margin-top: 15px;
}

.radio-item label {
  display: block;
  padding: 20px 60px;
  background: #050505;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 400;
  min-width: 250px;
  white-space: nowrap;
  position: relative;
  transition: 0.4s ease-in-out 0s;
}

.radio-item label:after,
.radio-item label:before {
  content: "";
  position: absolute;
  border-radius: 50%;
}

.radio-item label:after {
  height: 19px;
  width: 19px;
  border: 2px solid #ff9aff;
  left: 19px;
  top: calc(50% - 12px);
}

.radio-item label:before {
  background: #ff9aff;
  height: 20px;
  width: 20px;
  left: 21px;
  top: calc(50%-5px);
  transform: scale(5);
  opacity: 0;
  visibility: hidden;
  transition: 0.4s ease-in-out 0s;
}

.radio-item [type="radio"]:checked~label {
  border-color: #ff9aff;
}

.radio-item [type="radio"]:checked~label::before {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

/* Media Queries for Mobile Devices */
@media screen and (max-width: 768px) {
  .offering-wrapper {
    margin-left: 5%;
    margin-right: 5%;
  }

  .offering-details {
    text-align: center;
  }

  h3 {
    font-size: 16px;
  }

  p {
    font-size: 14px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .knopka_neion {
    width: 200px;
  }

  .modal-content {
    width: 90%;
    max-width: 400px;
  }

  button {
    width: 100%;
    margin: 10px 0;
  }
}

@media screen and (max-width: 480px) {
  .offering-wrapper {
    margin-left: 5%;
    margin-right: 5%;
  }

  .knopka_neion {
    width: 90%;
    height: 40px;
  }

  .modal-content {
    width: 90%;
    max-width: 350px;
  }

  .radio-item label {
    padding: 10px 30px;
    font-size: 16px;
  }

  p {
    font-size: 12px;
  }
}
</style>