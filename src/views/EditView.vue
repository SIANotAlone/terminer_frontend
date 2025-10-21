<template>
  <Menu></Menu>
  <div class="create_page">

    <h1 class="title">Редагувати послугу</h1>
    <p v-if="loading" style="color: #ff9aff; text-align: center;">Завантаження даних послуги...</p>
    <p v-if="error" style="color: salmon; text-align: center;">Помилка завантаження: {{ error }}</p>

    <div v-if="!loading && !error">
      <div class="name_container">
        <div class="form__group field">
          <input type="input" class="form__field" placeholder="Назва послуги" name="name" id='name' required
            v-model="name" />
          <label for="name" class="form__label">Назва послуги</label>
        </div>
      </div>

      <div class="description_container">
        <div class="form__group field">
          <input type="input" class="form__field" placeholder="Опис послуги" name="description" id='description' required
            v-model="description" />
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
            {{ massage_type.name }} <span v-if="massage_type.casual_name">({{ massage_type.casual_name }})</span>
          </option>
        </select>
      </div>

      <div class="for_all_container">
        <label for="for_all" class="for_all_label" style="margin-right: 10px;">Доступно для всіх: </label>
        <input type="checkbox" id="for_all" name="for_all" class="for_all" v-model="for_all">
      </div>

      <fieldset v-if="!for_all">
        <div style="margin: 20px;">
          <legend style="color: aliceblue;">Користувачі, для яких доступна послуга:</legend>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <select name="select_user" id="select_user" v-model="selected_user" style="flex-grow: 1;">
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.last_name + " " + user.first_name }}
              </option>
            </select>
            <button @click="confirm_add_user" class="knopka_neion lusa-10" style="width: 80px;">Додати</button>
          </div>

          <p>Список доданих користувачей: </p>
          <p v-if="selected_users.length === 0" style="color:salmon;">Поки що немає</p>

          <div v-for="(item, index) in selected_users" :key="item.id"
            style="display: flex; align-items: center; justify-content: space-between;">
            <li style="color: aliceblue; list-style: none; margin: 0;">
              {{ index + 1 + ')' }} {{ item.name }}
            </li>
            <button @click="confirm_delete_user(item.id, index, item.name)" class="knopka_neion lusa-10"
              style="width: 100px;">Видалити</button>
          </div>

        </div>
      </fieldset>

      <fieldset>
        <div style="margin: 20px;">
          <legend style="color: aliceblue;">Оберіть доступний час:</legend>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 20px;">
            <label for="selected_time_start" class="label_time">Оберіть час початку</label>
            <input type="time" name="time_start" id="selected_time_start" style="width: 100%;">
            <label for="selected_time_end" class="label_time">Оберіть час закінчення</label>
            <input type="time" name="time_end" id="selected_time_end" style="width: 100%;">
            <button @click="confirm_add_time" class="knopka_neion lusa-10" style=" margin: 5px 0 0 0;">Додати час</button>
          </div>

          <ul>
            <p style="color: aliceblue;">Обрані часи запису на послугу:</p>
            <p v-if="selected_time.length === 0" style="color:salmon;">Поки що немає</p>
            
            <div v-for="(item, index) in selected_time" :key="item.id"
              style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <li style="color: aliceblue; list-style: none; margin: 0; flex-grow: 1;">
                {{ index + 1 + ') ' }} {{ formatTime(item.time_start) }} - {{ formatTime(item.time_end) }}
                <span v-if="item.booked" style="color: #ff5733; font-weight: bold;">(Заброньовано)</span>
              </li>
              <button 
                @click="confirm_delete_time(item.id, index, item.time_start, item.time_end, item.booked)" 
                class="knopka_neion lusa-10"
                style="width: 100px;"
                :disabled="item.booked" 
                :class="{ 'disabled-booked': item.booked }" 
              >
                Видалити
              </button>
            </div>

          </ul>
        </div>
      </fieldset>

      <div style="display: flex; justify-content: center;">
        <button @click="button_edit_click" class="knopka_neion lusa-10">Зберегти зміни</button>

        <div v-if="showModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="showModal = false">&times;</span>
            <h2 style="color: aliceblue; font-size: 24px;">Підтвердіть будь ласка редагування послуги:</h2>
            <br>
            <p>Назва послуги: {{ this.name }}</p>
            <p>Опис послуги: {{ this.description }}</p>
            <p>Дата закінчення: {{ this.formatted_date_end }}</p>
            <p>Тип послуги: {{ this.selected_service_type_text }}</p>
            <p v-if="selected_service_type === 1">Тип масажу: {{ this.selected_massage_type_text }}</p>
            <p>Доступно для всіх: {{ this.for_all ? 'Так' : 'Ні' }}</p>

            <div style="display: flex; justify-self: center;">
              <button class="knopka_neion lusa-10" @click="button_submit_edit">
                Підтвердити
              </button>
              <button class="knopka_neion lusa-10" @click="showModal = false">Закрити</button>
            </div>
          </div>
        </div>

        <div v-if="showUserDeleteModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="showUserDeleteModal = false">&times;</span>
            <h2 style="color: #ff9aff; font-size: 24px;">УВАГА! Підтвердіть видалення</h2>
            <br>
            <p style="color: aliceblue;">Ви впевнені, що хочете видалити користувача {{ userToDeleteName }} зі списку доступних для цієї послуги?</p>
            <p style="color: salmon; font-weight: bold;">Видалення відбудеться негайно і не потребує збереження основних змін послуги.</p>

            <div style="display: flex; justify-self: center;">
              <button class="knopka_neion lusa-10" @click="execute_delete_user">
                Видалити
              </button>
              <button class="knopka_neion lusa-10" @click="showUserDeleteModal = false">Скасувати</button>
            </div>
          </div>
        </div>
        
        <div v-if="showTimeDeleteModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="showTimeDeleteModal = false">&times;</span>
            <h2 style="color: #ff9aff; font-size: 24px;">УВАГА! Підтвердіть видалення</h2>
            <br>
            <p style="color: aliceblue;">Ви впевнені, що хочете видалити часовий слот {{ timeToDeleteStart }} - {{ timeToDeleteEnd }}?</p>
            <p style="color: salmon; font-weight: bold;">Видалення відбудеться негайно і не потребує збереження основних змін послуги.</p>

            <div style="display: flex; justify-self: center;">
              <button class="knopka_neion lusa-10" @click="execute_delete_time">
                Видалити
              </button>
              <button class="knopka_neion lusa-10" @click="showTimeDeleteModal = false">Скасувати</button>
            </div>
          </div>
        </div>

        <div v-if="showUserAddModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="showUserAddModal = false">&times;</span>
            <h2 style="color: #ff9aff; font-size: 24px;">Підтвердіть додавання користувача</h2>
            <br>
            <p style="color: aliceblue;">Ви впевнені, що хочете додати користувача <strong style="color: #5dbdff;">{{ userToAddName }}</strong> до списку доступних для цієї послуги?</p>
            <p style="color: #ff9aff; font-weight: bold;">Додавання відбудеться негайно і не потребує збереження основних змін послуги.</p>

            <div style="display: flex; justify-self: center;">
              <button class="knopka_neion lusa-10" @click="execute_add_user">
                Додати
              </button>
              <button class="knopka_neion lusa-10" @click="showUserAddModal = false">Скасувати</button>
            </div>
          </div>
        </div>
        
        <div v-if="showTimeAddModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="showTimeAddModal = false">&times;</span>
            <h2 style="color: #ff9aff; font-size: 24px;">Підтвердіть додавання часу</h2>
            <br>
            <p style="color: aliceblue;">Ви впевнені, що хочете додати часовий слот <strong style="color: #5dbdff;">{{ timeToAddStart }} - {{ timeToAddEnd }}</strong> до цієї послуги?</p>
            <p style="color: #ff9aff; font-weight: bold;">Додавання відбудеться негайно і не потребує збереження основних змін послуги.</p>

            <div style="display: flex; justify-self: center;">
              <button class="knopka_neion lusa-10" @click="execute_add_time">
                Додати час
              </button>
              <button class="knopka_neion lusa-10" @click="showTimeAddModal = false">Скасувати</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Menu from '@/components/Menu.vue'
import { ref } from "vue";
import ipconfig from "@/server_configs/config.js" // Припускаємо, що цей файл існує і містить backend_ip
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  setup() {
    const showModal = ref(false);
    const showUserDeleteModal = ref(false);
    const showTimeDeleteModal = ref(false);
    // НОВІ ref для модальних вікон ДОДАВАННЯ
    const showUserAddModal = ref(false);
    const showTimeAddModal = ref(false);

    const theme = 'dark';
    const notify = (message) => {
      toast.success(message, { autoClose: 2000, theme, });
    }
    const notifyError = (message) => {
      toast.error(message, { autoClose: 3000, theme, });
    }
    return { 
        notify, 
        notifyError, 
        showModal, 
        showUserDeleteModal, 
        showTimeDeleteModal,
        showUserAddModal,
        showTimeAddModal
    }
  },

  components: {
    Menu
  },

  data() {
    return {
      service_uuid: this.$route.params.uuid, 
      name: '',
      description: '',
      date_end: '', 
      selected_service_type: null, 
      for_all: true, 
      selected_massage_type: null, 

      service_types: [],
      massage_types: [],
      users: [],
      selected_user: null, 
      selected_users: [], 
      selected_time: [], 

      selected_service_type_text: '',
      selected_massage_type_text: '',

      loading: true,
      error: null,
      
      // Дані для модальних вікон видалення
      userToDeleteId: null,
      userToDeleteIndex: null,
      userToDeleteName: '',
      timeToDeleteId: null,
      timeToDeleteIndex: null,
      timeToDeleteStart: '',
      timeToDeleteEnd: '',
      timeToDeleteBooked: false,

      // Дані для модальних вікон ДОДАВАННЯ
      userToAddId: null,
      userToAddName: '',
      timeToAddStart: '',
      timeToAddEnd: '',
    }
  },

  computed: {
    formatted_date_end() {
      if (this.date_end && this.date_end.includes('-')) {
        const parts = this.date_end.split('-');
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
      return this.date_end;
    }
  },

  methods: {
    // ---------------------- Утилітарні функції ----------------------
    formatTime(isoTimeStr) {
      try {
        if (isoTimeStr) {
          return isoTimeStr.split('T')[1].substring(0, 5);
        }
      } catch (e) {
        return isoTimeStr; 
      }
      return '';
    },

    // ---------------------- Завантаження даних ----------------------
    async loadServiceInfo() {
      try {
        const response = await axios.get(`${ipconfig['backend_ip']}/api/service/getfullserviceinfo/${this.service_uuid}`, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt_token')
          }
        });

        const serviceData = response.data.service;
        this.name = serviceData.name;
        this.description = serviceData.description;
        this.date_end = serviceData.date_end ? serviceData.date_end.split('T')[0] : '';
        this.selected_service_type = serviceData.service_type_id;
        this.for_all = serviceData.available_for_all;
        this.selected_massage_type = serviceData.massage_type_id;

        this.selected_users = response.data.available_for || [];
        this.selected_time = response.data.available_time;
      } catch (error) {
        console.error("Помилка завантаження послуги:", error);
        this.error = 'Не вдалося завантажити дані послуги.';
        this.notifyError("Помилка завантаження послуги");
        if (error.response && error.response.status === 401) {
          this.$router.push({ path: '/sign-in' });
        }
      } finally {
        this.loading = false;
      }
    },

    async loadMetaInfo() {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers = { "Authorization": "Bearer " + token };

        const serviceTypesResponse = await axios.get(ipconfig['backend_ip'] + '/api/service/gettypes', { headers });
        this.service_types = serviceTypesResponse.data;

        const massageTypesResponse = await axios.get(ipconfig['backend_ip'] + '/api/service/getmassagetypes', { headers });
        this.massage_types = massageTypesResponse.data;

        const usersResponse = await axios.get(ipconfig['backend_ip'] + '/api/user/getallusers', { headers });
        this.users = usersResponse.data;
        if (this.users.length > 0) {
          this.selected_user = this.users[0].id; 
        }

      } catch (error) {
        console.error("Помилка завантаження метаінформації:", error);
        if (error.response && error.response.status === 401) {
          this.$router.push({ path: '/sign-in' });
        }
      }
    },
    
    // ---------------------- Редагування користувачів ----------------------

    /**
     * Відображає модальне вікно для підтвердження додавання користувача.
     */
    confirm_add_user() {
      if (!this.selected_user) {
        this.notifyError("Оберіть користувача для додавання.");
        return;
      }

      const userAlreadyAdded = this.selected_users.some(item => item.user_id === this.selected_user);
      if (userAlreadyAdded) {
        this.notifyError("Цей користувач вже доданий до послуги.");
        return;
      }
      
      const userToAdd = this.users.find(u => u.id === this.selected_user);
      if (!userToAdd) {
          this.notifyError("Обраний користувач не знайдений.");
          return;
      }

      this.userToAddId = this.selected_user;
      this.userToAddName = `${userToAdd.last_name} ${userToAdd.first_name}`;
      this.showUserAddModal = true;
    },

    /**
     * Виконує фактичне додавання користувача після підтвердження.
     */
    async execute_add_user() {
      this.showUserAddModal = false;
      
      if (!this.userToAddId) return;

      try {
        const data = {
          "service_id": this.service_uuid,
          "user_id": this.userToAddId
        };

        const response = await axios.post(ipconfig['backend_ip'] + "/api/service/newavailablefor", data, {
          headers: { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') }
        });
        
        // 👇 ОНОВЛЕННЯ: Використовуємо response.data.id для унікального id елемента
        const newUser = this.users.find(u => u.id === this.userToAddId);
        this.selected_users.push({
          id: response.data.id,
          user_id: this.userToAddId,
          name: `${newUser.last_name} ${newUser.first_name}` 
        });
        this.notify("Користувач успішно доданий.");

      } catch (error) {
        console.error("Помилка додавання користувача:", error);
        this.notifyError("Помилка при додаванні користувача.");
      } finally {
        this.userToAddId = null;
        this.userToAddName = '';
      }
    },
    
    // Відображення модального вікна перед видаленням користувача
    confirm_delete_user(id_to_delete, index, name) {
      this.userToDeleteId = id_to_delete;
      this.userToDeleteIndex = index;
      this.userToDeleteName = name;
      this.showUserDeleteModal = true;
    },

    // Виконання видалення користувача (оновлено для пошуку по ID)
    async execute_delete_user() {
      this.showUserDeleteModal = false;
      
      const id_to_delete = this.userToDeleteId;

      if (!id_to_delete) {
          this.notifyError("Помилка: не знайдено ID для видалення користувача.");
          return;
      }

      try {
        const data = { "id": id_to_delete };

        await axios.post(ipconfig['backend_ip'] + "/api/service/deleteavailablefor", data, {
          headers: { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') }
        });

        // 👇 ЗМІНЕНО: Видаляємо елемент за унікальним ID
        const index_to_delete = this.selected_users.findIndex(item => item.id === id_to_delete);
        if (index_to_delete !== -1) {
            this.selected_users.splice(index_to_delete, 1);
            this.notify("Користувач успішно видалений.");
        } else {
            this.notifyError("Користувача не знайдено в локальному списку.");
        }

      } catch (error) {
        console.error("Помилка видалення користувача:", error);
        this.notifyError("Помилка при видаленні користувача.");
      } finally {
        this.userToDeleteId = null;
        this.userToDeleteIndex = null;
        this.userToDeleteName = '';
      }
    },
    
    // ---------------------- Редагування часу ----------------------

    /**
     * Відображає модальне вікно для підтвердження додавання часу.
     */
    confirm_add_time() {
      let t_start = document.getElementById('selected_time_start').value
      let t_end = document.getElementById('selected_time_end').value

      if (!t_start || !t_end) {
        this.notifyError("Оберіть час початку та час закінчення.");
        return;
      }
      if (t_start >= t_end) {
        this.notifyError("Час початку має бути раніше часу закінчення.");
        return;
      }
      
      this.timeToAddStart = t_start;
      this.timeToAddEnd = t_end;
      this.showTimeAddModal = true;
    },
    
    /**
     * Виконує фактичне додавання часового слоту після підтвердження.
     */
    async execute_add_time() {
      this.showTimeAddModal = false;
      
      let t_start = this.timeToAddStart;
      let t_end = this.timeToAddEnd;
      
      if (!t_start || !t_end || t_start >= t_end) {
          this.notifyError("Некоректно обраний час.");
          return;
      }

      try {
        const data = {
          "service_id": this.service_uuid,
          "time_start": t_start,
          "time_end": t_end
        };

        const response = await axios.post(ipconfig['backend_ip'] + "/api/service/newavailabletime", data, {
          headers: { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') }
        });

        // 👇 ОНОВЛЕННЯ: Використовуємо response.data.id для унікального id елемента
        this.selected_time.push({
            id: response.data.id, 
            time_start: `0000-01-01T${t_start}:00Z`, 
            time_end: `0000-01-01T${t_end}:00Z`,
            booked: false
        });
        this.notify("Часовий слот успішно доданий.");
        
        document.getElementById('selected_time_start').value = '';
        document.getElementById('selected_time_end').value = '';

      } catch (error) {
        console.error("Помилка додавання часу:", error);
        this.notifyError("Помилка при додаванні часового слоту.");
      } finally {
        this.timeToAddStart = '';
        this.timeToAddEnd = '';
      }
    },
    
    // Відображення модального вікна перед видаленням часу
    confirm_delete_time(id_to_delete, index, time_start_iso, time_end_iso, booked) {
      if (booked) {
        this.notifyError("Неможливо видалити заброньований час.");
        return;
      }
      
      this.timeToDeleteId = id_to_delete;
      this.timeToDeleteIndex = index;
      this.timeToDeleteStart = this.formatTime(time_start_iso);
      this.timeToDeleteEnd = this.formatTime(time_end_iso);
      this.timeToDeleteBooked = booked;
      this.showTimeDeleteModal = true;
    },

    // Виконання видалення часу (оновлено для пошуку по ID)
    async execute_delete_time() {
      this.showTimeDeleteModal = false;

      if (this.timeToDeleteBooked) {
          this.notifyError("Неможливо видалити заброньований час.");
          return;
      }
      
      const id_to_delete = this.timeToDeleteId;

      if (!id_to_delete) {
          this.notifyError("Помилка: не знайдено ID для видалення часу.");
          return;
      }

      try {
        const data = { "id": id_to_delete };

        await axios.post(ipconfig['backend_ip'] + "/api/service/deleteavailabletime", data, {
          headers: { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') }
        });

        // 👇 ЗМІНЕНО: Видаляємо елемент за унікальним ID
        const index_to_delete = this.selected_time.findIndex(item => item.id === id_to_delete);
        if (index_to_delete !== -1) {
            this.selected_time.splice(index_to_delete, 1);
            this.notify("Часовий слот успішно видалений.");
        } else {
            this.notifyError("Часовий слот не знайдено в локальному списку.");
        }

      } catch (error) {
        console.error("Помилка видалення часу:", error);
        this.notifyError("Помилка при видаленні часового слоту.");
      } finally {
        this.timeToDeleteId = null;
        this.timeToDeleteIndex = null;
        this.timeToDeleteStart = '';
        this.timeToDeleteEnd = '';
        this.timeToDeleteBooked = false;
      }
    },
    
    // ---------------------- Редагування основних даних (PUT) ----------------------

    button_edit_click() {
      if (!this.name || !this.description || !this.date_end || this.selected_service_type === null) {
        this.notifyError("Заповніть, будь ласка, всі обов'язкові поля.");
        return;
      }

      const selectedService = this.service_types.find(s => s.id === this.selected_service_type);
      this.selected_service_type_text = selectedService ? selectedService.name : 'Невідомий тип';

      this.selected_massage_type_text = '';
      if (this.selected_service_type === 1 && this.selected_massage_type) {
        const found_massage = this.massage_types.find(m => m.id === this.selected_massage_type);
        if (found_massage) {
          this.selected_massage_type_text = found_massage.name + (found_massage.casual_name ? ` (${found_massage.casual_name})` : '');
        }
      }

      this.showModal = true;
    },

    async button_submit_edit() {
      this.showModal = false;

      const date = new Date(this.date_end);
      const date_end_iso = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString(); 

      let massage_type_id = null;
      if (this.selected_service_type === 1) {
        massage_type_id = this.selected_massage_type;
      }

      const data = {
        "id": this.service_uuid,
        "name": this.name,
        "description": this.description,
        "date_end": date_end_iso,
        "service_type_id": this.selected_service_type,
        "available_for_all": this.for_all,
        "massage_type_id": massage_type_id
      };

      try {
        await axios.put(ipconfig['backend_ip'] + "/api/service/edit", data, {
          headers: { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') }
        });
        this.notify("Основна інформація послуги успішно оновлена! 🎉");
      } catch (error) {
        console.error("Помилка оновлення послуги:", error);
        this.notifyError("Помилка при оновленні основної інформації послуги.");
      }
    }
  },

  async created() {
    await this.loadMetaInfo();
    await this.loadServiceInfo();
  }
}
</script>


<style scoped>
/* ------------------------------------------------------------- */
/* ДОДАНІ СТИЛІ ДЛЯ НЕАКТИВНОЇ КНОПКИ */
/* ------------------------------------------------------------- */
.knopka_neion:disabled,
.knopka_neion.disabled-booked {
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none !important;
  border-color: #6c757d !important;
  color: #6c757d !important;
  background: #343a40 !important;
}

/* Прибираємо ефект наведення для неактивної кнопки */
.knopka_neion:disabled:after {
  content: none;
}

.knopka_neion:disabled:hover {
    color: #6c757d !important;
    background: #343a40 !important;
}

/* ------------------------------------------------------------- */
/* РЕШТА ВАШИХ СТИЛІВ */
/* ------------------------------------------------------------- */
fieldset {
  border-color: #ff9aff;
  border-width: 1px;
  border-style: solid;
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
  position: relative;
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

.lusa-10:hover:not([disabled]) {
  color: #fff;
}

.lusa-10:hover:not([disabled]):after {
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
  ul>div {
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

  .modal-content button.knopka_neion+button.knopka_neion {
    margin-top: 4px;
  }

  /* Контейнер кнопок */
  .modal-content>div:last-child {
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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

  /* Располагаем инпуты и кнопки в колонку */
  input[type="time"],
  .label_time {
    display: block;
    width: 100% !important;
    margin: 8px 0 !important;
    box-sizing: border-box;
  }
  
  /* Кнопка "Додати час" */
  fieldset .knopka_neion.lusa-10 {
    margin: 5px auto 0 auto !important; /* Центруємо */
  }

  /* Увеличим кликабельную область кнопки */
  .knopka_neion {
    padding: 12px;
    font-size: 1em;
  }

  /* Список выбранных времен: flex → column */
  ul>div {
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
  
  /* Кнопка "Видалити" в списку часу/користувачів */
  ul .knopka_neion.lusa-10 {
    width: 100% !important; 
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

  .modal-content button.knopka_neion+button.knopka_neion {
    margin-top: 4px;
  }

  /* Контейнер кнопок */
  .modal-content>div:last-child {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

input[type="time"]{
text-align: center;
width: 60%; 
  max-width: 300px;
}
</style>