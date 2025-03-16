<template>
  <Menu></Menu>
  <div class="create_page">

    <h1 class="title">Створити послугу</h1>

    <div class="name_container">
      <div class="form__group field">
        <input type="input" class="form__field" placeholder="Назва послуги" name="name" id='name' required value=""
          v-model="name" />
        <label for="name" class="form__label">Назва послуги</label>
      </div>
    </div>


    <div class="description_container">

      <div class="form__group field">
        <input type="input" class="form__field" placeholder="Опис послуги" name="description" id='description' required
          value="" v-model="description" />
        <label for="description" class="form__label">Опис послуги</label>
      </div>
    </div>
    <label for="date_end" style="margin-bottom: 10px; margin-top: 20px; display: flex; justify-content: center;"
      class="metainfo">Оберіть дату закінчення послуги:</label>
    <input type="date" class="date_end" style="margin-left: 40%; margin-right: 40%;" v-model="date_end">
    <label for="selected_service_type"
      style="color: aliceblue; margin-bottom: 10px; margin-top: 20px; display: flex; justify-content: center;"
      class="metainfo"> Оберіть тип послуг:</label>
    <select name="service_type" id="service_type" v-model="selected_service_type"
      style="margin-left: 40%; margin-right: 40%;" class="metainfo">
      <option v-for="service_type in service_types" :key="service_type.id" :value="service_type.id">{{ service_type.name
        }}</option>

    </select>

    <div class="for_all_container">
      <label for="for_all" class="for_all_label" style="margin-right: 10px;">Доступно для всіх: </label>
      <input type="checkbox" id="for_all" name="for_all" class="for_all" v-model="for_all">

    </div>


    <fieldset>
      <div style="margin: 20px;">
        <legend style="color: aliceblue;">Оберіть доступний час:</legend>
        <input type="time" name="time_start" id="selected_time_start">
        <label for="selected_time_start" class="label_time">Оберіть час початку</label>
        <input type="time" name="time_end" id="selected_time_end">
        <label for="selected_time_start" class="label_time">Оберіть час закінчення</label>
        <button @click="add_time" class="knopka_neion lusa-10" style="width: 100px;">Додати</button>
        <ul>
          <p style="color: aliceblue;">Обрані часи запису на послугу:</p>
          <p v-if="selected_time.length == 0" style="color:salmon;">Покищо немає</p>
          <div v-for="(item, index) in selected_time" :key="item in selected_time"
            style="display: flex; align-items: center; gap: 10px;">
            <li style="color: aliceblue; list-style: none; margin: 0;">
              {{ index + 1 + ') ' }} Послуга буде доступна в діапазоні з : {{ item.time_start }} по: {{ item.time_end }}
            </li>
            <button @click="delete_time(index)" class="knopka_neion lusa-10" style="width: 100px;">Видалити</button>
          </div>

        </ul>
      </div>


    </fieldset>
    <div style="display: flex; justify-content: center;">
      <button @click="create_service" class="knopka_neion lusa-10">Створити послугу</button>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
import Menu from '@/components/Menu.vue'

import ipconfig from "@/server_configs/config.js"

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  setup() {
    const theme = 'dark';
    const notify = (message) => {
      toast.success(message, {
        autoClose: 2000,
        theme,
      }); // ToastOptions

    }
    return { notify }
  },
  mounted() {
    this.date_end = this.getCurentDatePlusDay()
    document.getElementById('selected_time_start').value = this.getCurrentTime()
    axios.get(ipconfig['backend_ip'] + '/api/service/gettypes', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt_token')
      }
    })
      .then(response => {
        this.service_types = response.data;
        console.log(this.service_types)
        if (this.service_types.length > 0) {
          this.selected_service_type = this.service_types[0].id;
        }

      }).catch(error => {
        console.error(error);
        this.$router.push({ path: '/sign-in' })

      })

  },

  components: {
    Menu
  },

  data() {
    return {
      name: '',
      description: '',
      date_end: '',
      service_types: [],
      selected_service_type: null,
      available_for: [],
      for_all: true,
      selected_time: [],

    }
  },

  methods: {
    get_selected_service_type(id) {

      this.selected_service_type = id
      console.log(this.selected_service_type)

    },

    add_time() {
      let t_start = document.getElementById('selected_time_start').value
      let t_end = document.getElementById('selected_time_end').value
      let selected_time = {
        "time_start": t_start,
        "time_end": t_end
      }
      this.selected_time.push(selected_time)
      document.getElementById('selected_time_start').value = null
      document.getElementById('selected_time_end').value = null
      console.log(this.selected_time)
      document.getElementById('selected_time_start').value = this.getCurrentTime()
    },
    getCurentDatePlusDay() {
      const today = new Date(); // Получаем текущую дату
      today.setDate(today.getDate());
      const tomorrow = today.toISOString().split('T')[0]; // Преобразуем в строку в формате YYYY-MM-DD
      return tomorrow;
    },
    getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes}`;
    },
    delete_time(index) {
      this.selected_time.splice(index, 1)
    },
    create_service() {
      const date = new Date(this.date_end);
      let data = {
        "service": {
          "name": this.name,
          "description": this.description,
          "date_end": date.toISOString(),
          "service_type": this.selected_service_type,
          "for_all": this.for_all,
        },
        "available_for": this.available_for,
        "available_time": this.selected_time
      }
      console.log(data)
      axios.post(ipconfig['backend_ip'] + "/api/service/create", data, { 'headers': { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') } }).then(response => {
        this.notify("Послуга створена")
      })
    }
  }




}

</script>



<style>
fieldset {
  border-color: #ff9aff;
  /* Light blue border */
  border-width: 1px;
  /* Optional: customize the width */
  border-style: solid;
  /* Optional: set the border style */
}

label {
  color: aliceblue;
}

.name_container {

  margin-bottom: 20px;
}

.description_container {
  margin-top: 20px;
  margin-bottom: 20px;
}

.title {
  color: aliceblue;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 24px;
  display: flex;
  justify-content: center;
}

.create_page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20%;
  margin-right: 20%;


}

.for_all_container {
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin-top: 20px;
  margin-bottom: 20px;
}

p {
  color: aliceblue;
}

.for_all_label {
  color: aliceblue;
}

.label_time {
  color: aliceblue;
}


/* Выровняйте редакторы */
.editors {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Стили для группы ввода */
.form__group {
  position: relative;
  width: 100%;
}

.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid #9b9b9b;
  outline: 0;
  font-size: 1.1rem;
  color: #fff;
  padding: 10px 0;
  background: transparent;
  text-align: center;
  transition: border-color 0.2s;

}

.form__field::placeholder {
  color: transparent;
}

.form__label {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  color: #9b9b9b;
  transition: all 0.3s ease-in-out;
}

.form__field:focus,
.form__field:not(:placeholder-shown) {
  border-bottom: 2px solid #5dbdff;
}

.form__field:focus+.form__label,
.form__field:not(:placeholder-shown)+.form__label {
  color: #5dbdff;
  font-size: 0.9rem;
  top: -10px;
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

@media (max-width: 768px) {

  input[type="date"],
  select {
    margin-left: 0;
    margin-right: 0;
    width: 50%;
    text-align: center;
    font-size: 16px;
    padding: 10px;
    border-radius: 5px;
  }
}

@media (max-width: 480px) {

  input[type="date"],
  select {
    font-size: 14px;
    padding: 8px;
  }
}
</style>