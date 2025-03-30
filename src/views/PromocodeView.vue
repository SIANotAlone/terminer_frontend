<template>
    <Menu class="menu" />
    <div class="PromocodePage">
        <div class="form__group">
            <input type="text" class="form__field" placeholder="введіть промокод" name="name" id="name" required
                v-model="promocode" />
            <label for="name" class="form__label">Введіть дійсний промокод: </label>
        </div>
        <button @click="validatePromocode" class="knopka_neion lusa-10">Перевірити</button>
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="showModal = false">&times;</span>
                <h2 style="color: aliceblue; font-size: 24px;">Ваш промокод дійсний
                </h2>
                <br>
                <p style="font-size: 18px; font-weight: bold;">За вашим промокодом доступна послуга:</p>
                <p>Назва послуги: {{ promoservice.name }}</p>
                <p>Опис послуги: {{ promoservice.description }}</p>
                <p>Виконавець: {{ promoservice.performer }}</p>
                <p>Дата створення: {{ formatDate(promoservice.date) }} </p>
                <p>Дата закінчення: {{ formatDate(promoservice.date_end) }} </p>
                <div style="display: flex; justify-self: center;">
                    <button class="knopka_neion lusa-10" @click="activate_promocode">
                        Активувати
                    </button>
                    <button class="knopka_neion lusa-10" @click="showModal = false">Закрити</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from '@/components/Menu.vue';
import axios from 'axios';
import ipconfig from "@/server_configs/config.js"
import { ref } from "vue";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    components: {
        Menu
    },
    setup() {

        const showModal = ref(false);
        const theme = 'dark';
        const notify = (message) => {
            toast.warning(message, {
                autoClose: 2000,
                theme,
            }); // ToastOptions

        }

        return { showModal, notify }
    },
    data() {
        return {
            promocode: '',
            promoservice: {},

        };
    },
    methods: {
        validatePromocode() {
            axios.post(ipconfig['backend_ip'] + '/api/service/validate_promo', {
                "promocode": this.promocode
            }, { 'headers': { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') } }).then(response => {
                if (response.data["valid"] == true) {
                    this.showModal = true;
                    this.promoservice = response.data.promoservice
                }
            }).catch(error => {
                this.notify("Промокод не дійсний")

            });

        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("uk-UA");
        },
        activate_promocode() {
            axios.post(ipconfig['backend_ip'] + '/api/service/activate_promo', {
                "promocode": this.promocode
            }, { 'headers': { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') } }).then(response => {
                if (response.data["status"] == "ok") {
                    this.$router.push({ path: '/service/available', query: { message: "Промокод активовано" } })
                }
            })
        }
    },

};
</script>

<style scoped>
.PromocodePage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70vh;
    padding: 20px;
}

.form__group {
    width: 100%;
    max-width: 300px;
    text-align: center;
    position: relative;
}

.form__field {
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

.knopka_neion {
    margin-top: 20px;
    width: 250px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (max-width: 600px) {
    .PromocodePage {
        padding: 10px;
    }

    .form__group {
        max-width: 250px;
    }

    .knopka_neion {
        width: 200px;
        height: 40px;
    }
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
</style>
