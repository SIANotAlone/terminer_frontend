<template>
  <Menu></Menu>
  <div class="create_page" style="margin-top: 60px;">

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
    <label for="date_end" class="metainfo centered-label">Оберіть дату закінчення послуги:</label>
<input type="date" class="date_end centered-input" v-model="date_end">

<label for="selected_service_type" class="metainfo centered-label">Оберіть тип послуг:</label>
<select name="service_type" id="service_type" v-model="selected_service_type" class="metainfo centered-input">
  <option v-for="service_type in service_types" :key="service_type.id" :value="service_type.id">
    {{ service_type.name }}
  </option>
</select>

<div v-if="selected_service_type === 1">
  <label for="selected_massage_type" class="metainfo centered-label">Оберіть тип масажу:</label>
  <select name="massage_type" id="massage_type" v-model="selected_massage_type" class="metainfo centered-input">
    <option v-for="massage_type in massage_types" :key="massage_type.id" :value="massage_type.id">
      {{ massage_type.name  }}  <span v-if="massage_type.casual_name">({{ massage_type.casual_name }})</span>
    </option>
  </select>
</div>



    <div class="for_all_container" v-if ="promo_service == false">
      <label for="for_all" class="for_all_label" style="margin-right: 10px;">Доступно для всіх: </label>
      <input type="checkbox" id="for_all" name="for_all" class="for_all" v-model="for_all"
        @change="change_for_all_event">

    </div>
    <fieldset v-if="!for_all">
      <div style="margin: 20px;">
        <legend style="color: aliceblue;">Оберіть користувачей, яким буде доступна послуга:</legend>
        <select name="" id="select_user" v-model="selected_user">
          <option v-for="user in users" :key="user.id" :value="user">{{ user.last_name + " " + user.first_name }}
          </option>
        </select>
        <button @click="add_user" class="knopka_neion lusa-10" style="width: 100px;">Додати</button>
        <p>Список доданих користувачей: </p>
        <p v-if="selected_users.length == 0" style="color:salmon;">Поки що немає</p>
        <div v-for="(item, index) in selected_users" :key="item in selected_users"
          style="display: flex; align-items: center; justify-content: space-between;">
          <li style="color: aliceblue; list-style: none; margin: 0;">{{ index + 1 + ')' }} {{ item.last_name + " " +
            item.first_name }}</li>
          <button @click="delete_selected_user(index)" class="knopka_neion lusa-10"
            style="width: 100px;">Видалити</button>
        </div>

      </div>
    </fieldset>
    <div style="margin-top: 20px;"></div>
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
    <div class="promoservice" style="margin-top: 20px; margin-bottom: 20px;" v-if="for_all">
      <label for="promoservice" class="promoservice_label" style="margin-right: 10px;">Створити промосервіс: </label>
      <input type="checkbox" id="promoservice" name="promoservice" class="promoservice" v-model="promo_service">

    </div>
    <div style="display: flex; justify-content: center;">
      <button @click="button_create_click" class="knopka_neion lusa-10">Створити послугу</button>


      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showModal = false">&times;</span>
          <h2 style="color: aliceblue; font-size: 24px;">Підвердіть будь ласка створення послуги:
          </h2>
          <br>
          <h2 v-if="promo_service == true" style="color: chocolate;">Пропомо-послуга</h2>
          <p>Назва послуги: {{ this.name }}</p>
          <p>Опис послуги: {{ this.description }}</p>
          <p>Дата закінчення: {{ this.formatted_date_end }}</p>
          <p>Тип послуги: {{ this.selected_service_type_text }}</p>
          <p v-if="selected_service_type===1">Тип масажу: {{ this.selected_massage_type_text }}</p>
          <div v-if="!for_all">
            <p>Послуга буде доступна для користувачей</p>
            <div v-for="(item, index) in selected_users" :key="item in selected_users"
              style="display: flex; align-items: center; gap: 10px;">
              <li style="color: aliceblue; list-style: none; margin: 0;">{{ index + 1 + ')' }} {{ item.last_name + " " +
                item.first_name }}</li>
            </div>
          </div>
          <p>Доступний час запису на послугу:</p>
          <p v-for="(item, index) in selected_time" :key="item in selected_time" style="color: aliceblue;">{{ index + 1
            + ') ' }} {{ item.time_start }} - {{ item.time_end }}</p>
          <div style="display: flex; justify-self: center;">
            <button class="knopka_neion lusa-10" @click="button_submit_click">
              Підтвердити
            </button>
            <button class="knopka_neion lusa-10" @click="showModal = false">Закрити</button>
          </div>
        </div>
      </div>
    </div>
    


      <div v-if="showCreatePromoModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showCreatePromoModal = false">&times;</span>
          <h2 style="color: aliceblue; font-size: 24px;">Послуга успішно створена:
          </h2>
          <br>
          <h1>Ваш промокод: {{ this.promo_code }}</h1>
          <div style="display: flex; justify-self: center;">
            
            <button class="knopka_neion lusa-10" style="display: flex; justify-content: center;" @click="showCreatePromoModal = false">Закрити</button>
          </div>
        </div>
      </div>
    


  </div>
</template>


<script>
import axios from 'axios';
import Menu from '@/components/Menu.vue'
import { ref } from "vue";

import ipconfig from "@/server_configs/config.js"

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  setup() {
    const showModal = ref(false);
    const showCreatePromoModal = ref(false);

    const theme = 'dark';
    const notify = (message) => {
      toast.success(message, {
        autoClose: 2000,
        theme,
      }); // ToastOptions

    }
    return { notify, showModal, showCreatePromoModal }
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
        // console.log(this.service_types)
        if (this.service_types.length > 0) {
          this.selected_service_type = this.service_types[0].id;
        }

      }).catch(error => {
        console.error(error);
        this.$router.push({ path: '/sign-in' })

      })
    axios.get(ipconfig['backend_ip'] + '/api/user/getallusers', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt_token')
      }
    }).then(response => {
      this.users = response.data;
      // console.log(this.users)
    }).catch(error => {
      console.error(error);
      this.$router.push({ path: '/sign-in' })
    })

    axios.get(ipconfig['backend_ip'] + '/api/service/getmassagetypes', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt_token')
      }
    }).then(response => {
      this.massage_types = response.data;
      this.selected_massage_type = this.massage_types[0].id
      // console.log(this.massage_types)
    }).catch(error => {
      console.error(error);
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
      selected_service_type_text: '',
      available_for: [],
      for_all: true,
      selected_time: [],
      users: [],
      selected_users: [],
      selected_user: {},
      promo_service: false,
      promo_code: '',
      massage_types: [],
      selected_massage_type: null,
      selected_massage_type_text: '',
    }
  },
  computed: {
    formatted_date_end() {
      // Перевіряємо, чи є дата і чи вона відповідає очікуваному формату ISO
      if (this.date_end && this.date_end.includes('-')) {
        const parts = this.date_end.split('-'); // ['YYYY', 'MM', 'DD']
        // Форматуємо в DD.MM.YYYY
        return `${parts[2]}.${parts[1]}.${parts[0]}`; 
      }
      return this.date_end; // Повертаємо, як є, якщо не вдалося сформувати
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
    delete_selected_user(index) {
      this.selected_users.splice(index, 1)
    },
    add_user() {
      this.selected_users.push(this.selected_user)
      // console.log(this.selected_users)
    },
    button_create_click() {
      for (let i = 0; i < this.service_types.length; i++) {
        if (this.service_types[i].id == this.selected_service_type) {
          this.selected_service_type_text = this.service_types[i].name
        }
      }
        this.selected_massage_type_text = ''; // Обов'язково скидаємо, якщо послуга не масаж

      if (this.selected_service_type === 1 && this.selected_massage_type) {
        const found_massage = this.massage_types.find(m => m.id === this.selected_massage_type);
        if (found_massage) {
          // Якщо знайдено, зберігаємо його назву для відображення
          this.selected_massage_type_text = found_massage.name + (found_massage.casual_name ? ` (${found_massage.casual_name})` : '');
        }
      }

      this.showModal = true
    },
    button_submit_click() {

      if (this.promo_service == true) {
        this.create_promo_service()
      } else {
        this.create_service()
      }
      this.showModal = false
      this.clean_all()
    },
    create_promo_service() {
      const date = new Date(this.date_end);

      let data = {
        "promoservice": {
          "name": this.name,
          "description": this.description,
          "date_end": date.toISOString(),
          "service_type": this.selected_service_type,
        },
        "available_time": this.selected_time
      }
      // console.log(data)
      axios.post(ipconfig['backend_ip'] + "/api/service/create_promo", data, { 'headers': { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') } }).then(response => {
        this.notify("Послуга створена")
        this.promo_code = response.data.service_info.promocode
        this.showModal = false
        this.showCreatePromoModal = true
      })
      
    },
    clean_all() {
      this.name = ''
      this.description = ''
      this.date_end = this.getCurentDatePlusDay()
      this.selected_service_type = this.service_types[0].id
      this.selected_time = []
      this.available_for = []
      this.for_all = true
      this.selected_users = []
      this.selected_user = {}
      this.promo_service = false
      this.selected_massage_type = this.massage_types[0].id
    },
    change_for_all_event() {
      if (this.for_all == false) {
        this.promo_service = false
      }
    },
    create_service() {
      const date = new Date(this.date_end);
      let available_for = []
      if (this.for_all == false) {
        for (let i = 0; i < this.selected_users.length; i++) {
          available_for.push({ "user_id": this.selected_users[i].id })
        }
      } else {
        available_for = this.available_for
      }

      let massage_type = null
      if (this.selected_service_type ===1){
        massage_type = this.selected_massage_type
      }

      let data = {
        "service": {
          "name": this.name,
          "description": this.description,
          "date_end": date.toISOString(),
          "service_type": this.selected_service_type,
          "for_all": this.for_all,
          "massage_type": massage_type
        },
        "available_for": available_for,
        "available_time": this.selected_time
      }
      // console.log(data)
      axios.post(ipconfig['backend_ip'] + "/api/service/create", data, { 'headers': { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') } }).then(response => {
        this.notify("Послуга створена")
      })
    }
  }




}

</script>



<style scoped>
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

@media only screen and (max-width: 600px) {
  fieldset {
    margin: 10px !important;
    padding: 15px;
    border: 1px solid #444;
    border-radius: 8px;
    background-color: #222;
  }

  legend {
    font-size: 1.2em;
    color: #fff;
    margin-bottom: 10px;
  }

  /* Располагаем инпуты и кнопки в колонку */
  input[type="time"],
  .label_time,
  .knopka_neion {
    display: block;
    width: 100% !important;
    margin: 8px 0 !important;
    box-sizing: border-box;
  }

  /* Увеличим кликабельную область кнопки */
  .knopka_neion {
    padding: 12px;
    font-size: 1em;
  }

  /* Список выбранных времен: flex → column */
  ul > div {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 12px;
  }

  ul li {
    margin: 0;
    padding: 0;
  }

  /* Удаляем фиксированную ширину, чтобы кнопка занимала всю ширину */
  .knopka_neion {
    width: 100% !important;
  }
}




@media (max-width: 767px) {
  .modal {
    padding: 0 10px;
  }

  .modal-content {
    width: 100%;
    max-width: 360px;
    margin: 20px auto;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 12px;
  }

  .modal-content h2 {
    font-size: 20px;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  .modal-content p {
    font-size: 16px;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .modal-content .close {
    font-size: 24px;
    top: 8px;
    right: 8px;
  }

  .modal-content [v-for] li {
    font-size: 16px;
  }

  .modal-content button.knopka_neion {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    border-radius: 8px;
    margin-top: 8px;
  }

  .modal-content button.knopka_neion + button.knopka_neion {
    margin-top: 4px;
  }

  /* Контейнер кнопок */
  .modal-content > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    z-index: 1000;
  }
  .modal.show-comments {
    z-index: 1100;
  }
  .modal-content {
    position: relative;
    background: grey;
    border-radius: 12px;
    padding: 24px;
    max-width: 480px;
    width: 90%;
    color: #e0e0e0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.8);
  }
  .modal-content h2 {
    margin-top: 0;
    font-size: 1.5rem;
    color: #ff9aff;
  }
  .modal-content p {
    line-height: 1.5;
    margin: 16px 0;
  }
  .modal-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .close {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .close:hover {
    color: #ff9aff;
  }
  .create_page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1e1e2f;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.title {
  color: aliceblue;
  margin: 20px 0;
  font-size: 28px;
  text-align: center;
}

.name_container,
.description_container {
  margin-bottom: 20px;
}

label {
  color: aliceblue;
  font-size: 14px;
}

input[type="date"],
select,
input[type="time"] {
  display: block;
  width: 60%;
  margin: 10px auto;
  padding: 10px;
  background-color: #2a2a40;
  border: 1px solid #555;
  border-radius: 8px;
  color: white;
}

.metainfo {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  color: aliceblue;
}

.for_all_container,
.promoservice {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
}

fieldset {
  border-color: #ff9aff;
  border-width: 1px;
  border-style: solid;
  border-radius: 8px;
  margin: 20px 0;
  padding: 15px;
}

legend {
  color: aliceblue;
  font-weight: bold;
}



ul {
  padding: 0;
}

li {
  color: aliceblue;
  list-style: none;
  margin: 5px 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2a2a40;
  padding: 20px;
  border-radius: 12px;
  width: 500px;
  max-width: 80%;
  color: aliceblue;
}

.modal-content h2 {
  text-align: center;
  font-size: 22px;
}

.modal-content p {
  margin: 10px 0;
}

.close {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover {
  color: #ccc;
}

.label_time {
  color: aliceblue;
  display: block;
  margin-top: 10px;
}

.selected-time {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
}

@media (max-width: 600px) {
  input[type="date"],
  select,
  input[type="time"] {
    width: 90%;
  }

  .modal-content {
    width: 90%;
  }
}

/* ---------- Для экранов до 600px ---------- */
@media only screen and (max-width: 600px) {
  fieldset {
    margin: 10px !important;
    padding: 15px;
    border: 1px solid #444;
    border-radius: 8px;
    background-color: #222;
  }

  legend {
    font-size: 1.2em;
    color: #fff;
    margin-bottom: 10px;
  }

  input[type="time"],
  .label_time,
  .knopka_neion {
    display: block;
    width: 100% !important;
    margin: 8px 0 !important;
    box-sizing: border-box;
  }

  .knopka_neion {
    padding: 12px;
    font-size: 1em;
    width: 100% !important;
  }

  ul > div {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 12px;
  }

  ul li {
    margin: 0;
    padding: 0;
  }

  input[type="date"],
  select,
  input[type="time"] {
    width: 90%;
  }

  .modal-content {
    width: 90%;
  }
}

/* ---------- Для экранов до 768px ---------- */
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

/* ---------- Для экранов до 480px ---------- */
@media (max-width: 480px) {
  input[type="date"],
  select {
    font-size: 14px;
    padding: 8px;
  }
}

/* ---------- Для модальных окон на маленьких экранах ---------- */
@media (max-width: 767px) {
  .modal {
    padding: 0 10px;
  }

  .modal-content {
    width: 100%;
    max-width: 360px;
    margin: 20px auto;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 12px;
  }

  .modal-content h2 {
    font-size: 20px;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  .modal-content p {
    font-size: 16px;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .modal-content .close {
    font-size: 24px;
    top: 8px;
    right: 8px;
  }

  .modal-content [v-for] li {
    font-size: 16px;
  }

  .modal-content button.knopka_neion {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    border-radius: 8px;
    margin-top: 8px;
  }

  .modal-content button.knopka_neion + button.knopka_neion {
    margin-top: 4px;
  }

  .modal-content > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.centered-label {
  margin: 20px 0 10px 0;
  display: flex;
  justify-content: center;
  color: aliceblue;
}

.centered-input {
  display: block;
  margin: 0 auto 20px auto;
  width: 40%;
  min-width: 200px;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .centered-input {
    display: block;
    margin: 0 auto !important;
    width: 80% !important;
    text-align: center;
    float: none;
  }
}

input[type="time"]{
text-align: center;
width: 60%; 
  max-width: 300px;
}

</style>