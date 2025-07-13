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
        v-if="(selected_regime == '1' && my_termins.length === 0) ||
               (selected_regime == '2' && performer_termins.length === 0)"
      >
        <br />
        <p class="centered-paragraph">
          Поки немає термінів, які потребують вашої уваги.
        </p>
      </div>
  
      <div v-if="selected_regime == '1'">
        <MyReaction
          :my_termins="my_termins"
          :server_ip="server_ip"
          @confirm="confirmUserTermin"
          @notify="handleNotify"
        />
      </div>
      <div v-if="selected_regime == '2'">
        <PerformerReaction
          :performer_termins="performer_termins"
          :server_ip="server_ip"
          @confirm="confirmPerformerTermin"
          @notify="handleNotify"
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
    name: "TerminsPage",
    components: { Menu, MyReaction, PerformerReaction },
    mounted() {
      this.fetchMyTermins();
      this.fetchPerformerTermins();
    },
    data() {
      return {
        server_ip: ipconfig.backend_ip,
        my_termins: [],
        performer_termins: [],
        selected_regime: "1",
      };
    },
    methods: {
      fetchMyTermins() {
        axios
          .get(`${this.server_ip}/api/termin/getallusertermins`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
          })
          .then(res => (this.my_termins = res.data || []))
          .catch(() => this.$router.push("/sign-in"));
      },
      fetchPerformerTermins() {
        axios
          .get(`${this.server_ip}/api/termin/getallperformertermins`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
          })
          .then(res => (this.performer_termins = res.data || []))
          .catch(() => this.$router.push("/sign-in"));
      },
      selectRegime(regime) {
        this.selected_regime = regime;
        regime === "1" ? this.fetchMyTermins() : this.fetchPerformerTermins();
      },
      confirmUserTermin(id) {
        axios
          .post(`${this.server_ip}/api/record/confirm`, { id }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` }
          })
          .then(() => {
            this.my_termins = this.my_termins.filter(item => item.record_id !== id);
            this.handleNotify({ message: "Підтверджено", id });
          });
      },
      confirmPerformerTermin(id) {
        axios
          .post(`${this.server_ip}/api/record/done`, { id }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` }
          })
          .then(() => {
            this.performer_termins = this.performer_termins.filter(item => item.record_id !== id);
            this.handleNotify({ message: "Виконано", id });
          });
      },
      handleNotify({ message, id }) {
        // показуємо toast
        toast.success(message, { autoClose: 2000, theme: "dark" });
        // видаляємо запис з потрібного масиву
        if (this.selected_regime === "1") {
          this.my_termins = this.my_termins.filter(item => item.record_id !== id);
        } else {
          this.performer_termins = this.performer_termins.filter(item => item.record_id !== id);
        }
      }
    }
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
  .selector-button {
    flex: 1 1 0;
    max-width: 250px;
    height: 50px;
    border: 2px solid #ff9aff;
    border-radius: 8px;
    background-color: transparent;
    color: #ff9aff;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }
  .selector-button.active,
  .selector-button:hover {
    background-color: #ff9aff;
    color: #000;
  }
  @media (max-width: 480px) {
    .selector-wrapper { flex-direction: column; gap: 12px; }
    .selector-button { width: 100%; height: 45px; font-size: 14px; }
  }
  </style>
  