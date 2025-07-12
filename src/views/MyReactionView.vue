<template>
    <Menu />
    <div class="myTermin">
      <h1 class="centered-title">
        Терміни, які потребують вашої уваги:
      </h1>
  
      <div class="selector-wrapper">
        <button
          :class="['selector-button', selected_regime === '1' ? 'active' : '']"
          @click="selectRegime('1')"
        >
          Мої терміни
        </button>
        <button
          :class="['selector-button', selected_regime === '2' ? 'active' : '']"
          @click="selectRegime('2')"
        >
          До мене, як виконавця
        </button>
      </div>
  
      <div
        v-if="(selected_regime == 1 && my_termins.length === 0) ||
               (selected_regime == 2 && performer_termins.length === 0)"
      >
        <br />
        <p class="centered-paragraph">
          Покищо немає термінів, які потребують вашої уваги.
        </p>
      </div>
  
      <div v-if="selected_regime == 1">
        <MyReaction
          :my_termins="my_termins"
          :server_ip="server_ip"
          @confirm="confirmUserTermin"
        />
      </div>
      <div v-if="selected_regime == 2">
        <PerformerReaction
          :performer_termins="performer_termins"
          :server_ip="server_ip"
          @confirm="confirmPerformerTermin"
        />
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import Menu from "@/components/Menu.vue";
  import MyReaction from "@/components/MyReaction.vue";
  import PerformerReaction from "@/components/PerformerReaction.vue";
  import ipconfig from "@/server_configs/config.js";
  import { toast } from "vue3-toastify";
  import "vue3-toastify/dist/index.css";
  
  export default {
    components: { Menu, MyReaction, PerformerReaction },
    mounted() {
      this.fetchMyTermins();
      this.fetchPerformerTermins();
    },
    data() {
      return {
        server_ip: ipconfig["backend_ip"],
        my_termins: [],
        performer_termins: [],
        selected_regime: "1",
      };
    },
    methods: {
      fetchMyTermins() {
        axios
          .get(this.server_ip + "/api/termin/getallusertermins", {
            headers: { Authorization: "Bearer " + localStorage.getItem("jwt_token") },
          })
          .then((res) => {
            this.my_termins = res.data || [];
          })
          .catch(() => this.$router.push({ path: "/sign-in" }));
      },
      fetchPerformerTermins() {
        axios
          .get(this.server_ip + "/api/termin/getallperformertermins", {
            headers: { Authorization: "Bearer " + localStorage.getItem("jwt_token") },
          })
          .then((res) => {
            this.performer_termins = res.data || [];
          })
          .catch(() => this.$router.push({ path: "/sign-in" }));
      },
      selectRegime(regime) {
        this.selected_regime = regime;
        if (regime === "1") this.fetchMyTermins();
        else this.fetchPerformerTermins();
      },
      confirmUserTermin(id) {
        axios
          .post(
            this.server_ip + "/api/record/confirm",
            { id },
            { headers: { Authorization: "Bearer " + localStorage.getItem("jwt_token") } }
          )
          .then(() => {
            this.my_termins = this.my_termins.filter((item) => item.record_id !== id);
            this.notify("Виконано");
          });
      },
      confirmPerformerTermin(id) {
        axios
          .post(
            this.server_ip + "/api/record/done",
            { id },
            { headers: { Authorization: "Bearer " + localStorage.getItem("jwt_token") } }
          )
          .then(() => {
            this.performer_termins = this.performer_termins.filter((item) => item.record_id !== id);
            this.notify("Виконано");
          });
      },
      notify(message) {
        toast.success(message, { autoClose: 2000, theme: "dark" });
      },
    },
  };
  </script>
  
  <style>
  .myTermin {
    margin: 20px auto;
    max-width: 600px;
    padding: 0 15px;
  }
  
  .centered-title,
  .centered-paragraph {
    color: aliceblue;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .selector-wrapper {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 25px;
  }
  
  /* Кнопки одинакового размера */
  .selector-button {
    flex: 1 1 0; /* растягиваются равномерно */
    max-width: 250px;
    height: 50px;
    border: 2px solid #ff9aff;
    border-radius: 8px;
    background-color: transparent;
    color: #ff9aff;
    font-family: "Lato", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .selector-button:hover {
    background-color: #ff9aff;
    color: #000;
  }
  
  .selector-button.active {
    background-color: #ff9aff;
    color: #000;
    box-shadow: 0 0 10px #ff9affaa;
  }
  
  /* Адаптив для мобильных */
  @media (max-width: 480px) {
    .selector-wrapper {
      flex-direction: column;
      gap: 12px;
    }
    .selector-button {
      max-width: 100%;
      width: 100%;
      height: 45px;
      font-size: 14px;
    }
  }
  </style>
  