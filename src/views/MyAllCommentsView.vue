<template>
    <Menu />
    <div class="chat-wrapper">
      <h3>Список ваших термінів з коментарями:</h3>
      <ul class="chat-list">
        <li v-for="termin in TerminsWithComments" :key="termin.id" class="chat-item" @click="selectService(termin)">
          <div class="chat-content">
            <p class="service-name">{{ termin.service }}</p>
            <p class="meta">
              Створено: {{ formatDate(termin.created) }}
              <span v-if="termin.done"> • Завершено</span>
              <span v-if="termin.user_confirm"> • Підтверджено</span>
            </p>
          </div>
        </li>
      </ul>
  
      <div v-if="showComments" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeComments">&times;</span>
          <h2>Коментарі:</h2>
          <Comments v-if="SelectedTermin" :id="SelectedTermin.toString()" />
          <div class="modal-buttons">
            <button class="btn-cancel" @click="closeComments">Назад</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ipconfig from "@/server_configs/config.js";
  import Menu from '@/components/Menu.vue';
  import Comments from '@/components/Comments.vue';
  import axios from 'axios';
  
  export default {
    name: 'MyAllCommentsPage',
    components: { Menu, Comments },
    data() {
      return {
        TerminsWithComments: [],
        SelectedTermin: null,
        showComments: false
      }
    },
    mounted() {
      axios.get(`${ipconfig.backend_ip}/api/comment/getterminswithcomments`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('jwt_token')
        }
      }).then(response => {
        this.TerminsWithComments = response.data;
      }).catch(error => {
        console.error(error);
        this.$router.push({ path: '/sign-in' });
      });
    },
    methods: {
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
      },
      selectService(termin) {
        console.log('Выбран термин:', termin.id);
        this.SelectedTermin = termin.id;
        this.showComments = true;
      },
      closeComments() {
        this.showComments = false;
        this.SelectedTermin = null;
      }
    }
  }
  </script>

<style scoped>
.chat-wrapper {
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
    font-weight: 700;
    margin-bottom: 15px;
    color: #ff9aff;
}

.chat-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.chat-item {
    padding: 15px;
    border-bottom: 1px solid #333;
    cursor: pointer;
    transition: background 0.3s ease;
}

.chat-item:hover {
    background: rgba(255, 154, 255, 0.1);
}

.chat-content {
    display: flex;
    flex-direction: column;
}

.service-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #ff9aff;
}

.meta {
    font-size: 14px;
    color: #bbb;
    margin-top: 5px;
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
    right: 15px;
    top: 15px;
    font-size: 28px;
    cursor: pointer;
    color: #ff9aff;
  }
   
  .btn-cancel {
    background: #444;
    border: none;
    color: #ddd;
    padding: 12px 28px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    margin-left: 10px;
    transition: background 0.3s ease;
  }
  
  .btn-cancel:hover {
    background: #666;
  }
  
</style>
