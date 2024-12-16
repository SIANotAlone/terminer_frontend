<template>
    <Menu></Menu>
    <div class="myTermin">
        <h1 style="display: flex; justify-content: center;">Терміни, які потребують вашої уваги:</h1>
        <div v-if="my_termins.length == 0">
            <br>
            <p style="display: flex; justify-content: center;">Покищо немає термінів, які потребують вашої уваги. </p>
        </div>
        <div>
            <div v-for="item in my_termins" :key="item.id" class="termin">
                <div style="display: inline;">
                    <p style="display: flex; justify-content: center;">{{ item.service }}</p>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="display: inline;">
                            <p><span class="details">Детальніше: </span>{{ item.description }}</p>
                            <p><span class="details">Тип послуги: </span>{{ item.type }}</p>
                            <p><span class="details">Запис на: </span>{{ extractTime(item.time_start) }}</p>

                            <!-- <p>{{ formatDate(item.date) }} </p>
                            <p>{{ extractTime(item.record_time) }}  </p> -->
                            <p v-if="item.done == true" style="color:greenyellow;">Виконано:
                                <span style="color: aliceblue;">Запис від {{ formatDate(item.date) }} на {{
                                    extractTime(item.record_time) }}</span>
                            </p>
                            <!-- <p v-else style="color:orangered;">Не виконано</p> -->

                        </div>
                        <div style="display: flex;">
                            <button class="knopka_neion lusa-10" @click="showModal = true">Реакція</button>
                            <div v-if="showModal" class="modal">
                                <div class="modal-content">
                                    <span class="close" @click="showModal = false">&times;</span>
                                    <h2 style="color: aliceblue; font-size: 24px;">Підвердіть будь ласка виконання
                                        послуги</h2>
                                    <br>
                                    <p>Я погоджуюся з тим, що послуга "{{ item.service }}" на {{
                                        extractTime(item.time_start) }} була виконана.</p>
                                    <div style="display: flex; justify-self: center;">
                                        <button class="knopka_neion lusa-10"
                                            @click="confirmUserTermin(item.record_id)">Підтвердити</button>
                                        <button class="knopka_neion lusa-10" @click="showModal = false">Закрити</button>
                                    </div>

                                </div>
                            </div>
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
import ipconfig from "@/server_configs/config.js"

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


import { ref } from 'vue';

export default {
    mounted() {
        axios.get(this.server_ip + '/api/termin/getallusertermins', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt_token')
            }
        }).then(response => {
            this.my_termins = response.data
        }).catch(error => {
            console.error(error);
            this.$router.push({ path: '/sign-in' })

        })
    },
    components: {
        Menu
    },
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
    data() {
        return {
            server_ip: ipconfig['backend_ip'],
            my_termins: [],

        }
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('uk-UA'); // Преобразует дату в формат "17.11.2024"
        },
        extractTime(dateString) {
            // Создаем объект Date из строки даты
            const date = new Date(dateString);

            // Проверяем, является ли дата валидной
            if (isNaN(date.getTime())) {
                throw new Error("Некорректная дата");
            }

            // Форматируем время в формате HH:mm:ss
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');

            return `${hours}:${minutes}`;
        },
        confirmUserTermin(id) {
            axios.post(this.server_ip + '/api/record/confirm', {
                "id": id
            }, { 'headers': { 'Authorization': `Bearer ` + localStorage.getItem('jwt_token') } }).then(response => {
                console.log(response.data)
                this.showModal = false
                this.my_termins = this.my_termins.filter(item => item.record_id !== id);
                this.notify("Підтверджено")
            })

        }
    }
}

</script>


<style>
.details {
    color: darkgray;
}

h1 {
    color: aliceblue;
}

p {
    color: aliceblue;
}

.myTermin {
    justify-content: center;
    margin: 20px;
}

.termin {
    border: 1px solid #ff9aff;
    padding: 20px;
    margin-top: 20px;
    border-radius: 10px;
    margin-left: 20%;
    margin-right: 20%;
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
</style>