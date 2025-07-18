<template>
    <div class="component_for_termin">
      <div v-for="item in my_termins" :key="item.id" class="termin">
        <p class="termin-title">{{ item.service }}</p>
  
        <div class="card">
          <p><span class="details">Детальніше: </span>{{ item.description }}</p>
          <p><span class="details">Тип послуги: </span>{{ item.type }}</p>
          <p><span class="details">У проміжку: </span> з {{ extractTime(item.time_start) }} до {{ extractTime(item.time_end) }}</p>
          <p><span class="details">Виконавець: </span>{{ item.performer }}</p>
  
          <p v-if="item.done" class="done-text">
            Виконано:
            <span style="color: aliceblue;">
              Запис від {{ formatDate(item.date) }} на {{ extractTime(item.record_time) }}
            </span>
          </p>
  
          <p>
            <a :href="generateGoogleCalendarLink(item.service, item.description, item.date, item.date)"
               target="_blank" rel="noopener noreferrer" class="google-calendar-link">
              📅 Додати до Google календаря
            </a>
          </p>
  
          <button class="knopka_neion lusa-10" @click="show_comments(item)">Коментарі</button>
  
          <button v-if="item.done" class="knopka_neion lusa-10" @click="reaction(item)">Реакція</button>
        </div>
      </div>
  
      <!-- Модальне вікно підтвердження -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showModal = false">&times;</span>
          <h2>Підтвердіть виконання послуги</h2>
          <p>
            Я погоджуюся з тим, що послуга "{{ selected_item.service }}" у проміжку від
            {{ extractTime(selected_item.time_start) }} до {{ extractTime(selected_item.time_end) }}
            була виконавцем {{ selected_item.performer }} виконана.
          </p>
          <div class="modal-actions">
            <button class="knopka_neion lusa-10" @click="confirmUserTermin(selected_item.record_id)">Підтвердити</button>
            <button class="knopka_neion lusa-10" @click="showModal = false">Закрити</button>
          </div>
        </div>
      </div>
  
      <!-- Модальне вікно коментарів -->
      <div v-if="showComments" class="modal show-comments">
        <div class="modal-content">
          <span class="close" @click="showComments = false">&times;</span>
          <h2>Коментарі</h2>
          <comment :id="selected_service_id"></comment>
          <button class="knopka_neion lusa-10" @click="showComments = false">Закрити</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import comment from "@/components/Comments.vue";
  
  export default {
    props: {
      my_termins: {
        type: Array,
        required: true,
      },
      server_ip: {
        type: String,
        required: true,
      },
    },
    components: { comment },
    setup() {
      const showModal = ref(false);
      const showComments = ref(false);
      return { showModal, showComments };
    },
    data() {
      return {
        selected_item: {},
        selected_service_id: null,
      };
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("uk-UA");
      },
      extractTime(dateString) {
        return dateString.split("T")[1].split(".")[0].split(":").slice(0, 2).join(":");
      },
      confirmUserTermin(id) {
        this.$emit("confirm", id);
        this.showModal = false;
      },
      reaction(item) {
        this.selected_item = item;
        this.showModal = true;
      },
      show_comments(item) {
        this.selected_service_id = item.record_id;
        this.showComments = true;
      },
      generateGoogleCalendarLink(title, description, dateStart, dateEnd) {
        const startDate = new Date(dateStart).toISOString().replace(/-|:|\.\d+/g, "");
        const endDate = new Date(dateEnd).toISOString().replace(/-|:|\.\d+/g, "");
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${startDate}/${endDate}`;
      },
    },
  };
  </script>
  
  <style scoped>
  .component_for_termin {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    box-sizing: border-box;
  }
  
  .termin {
    width: 100%;
    max-width: 600px;
    margin: 24px 0;
    border: 1px solid #ff9aff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
    padding: 24px;
    color: #e0e0e0;
    box-sizing: border-box;
  }
  
  .termin-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 16px;
    color: #4db8ff;
  }
  
  .card {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .details {
    color: darkgray;
    font-weight: 500;
  }
  
  .done-text {
    color: greenyellow;
  }
  
  .google-calendar-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background-color: #4285f4;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    border-radius: 6px;
    transition: background-color 0.3s ease;
  }
  
  .google-calendar-link:hover {
    background-color: #357ae8;
  }
  
  .lusa-10 {
    display: block;
    margin: 12px auto;
    padding: 10px 20px;
    font-size: 1rem;
    border: 1px solid #ff9aff;
    box-shadow: 0 0 5px #ff9aff, inset 0 0 5px #ff9aff;
    background: inherit;
    color: #ff9aff;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
  .lusa-10:hover {
    background: #ff9aff;
    color: #000;
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
  
  @media (max-width: 768px) {
    .termin {
      padding: 16px;
    }
    .termin-title {
      font-size: 1.1rem;
    }
    .details,
    .modal-content p {
      font-size: 0.9rem;
    }
    .card {
      align-items: center;
    }
    .lusa-10 {
      width: 140px;
      padding: 8px 0;
      font-size: 0.9rem;
      margin: 8px auto;
      text-align: center;
    }
    .modal-content {
      padding: 16px;
    }
    .modal-content h2 {
      font-size: 1.25rem;
    }
    .close {
      font-size: 1.25rem;
    }
  }
  </style>
  