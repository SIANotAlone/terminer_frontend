<template>
    <div class="component_for_termin">
        <div v-for="item in my_termins" :key="item.id" class="termin">
            <div style="display: inline;">
                <p style="display: flex; justify-content: center;">{{ item.service }}</p>
                <div class="card">
                    <div style="display: inline;">
                        <p><span class="details">Детальніше: </span>{{ item.description }}</p>
                        <p><span class="details">Тип послуги: </span>{{ item.type }}</p>
                        <p><span class="details">У проміжку: </span> з {{ extractTime(item.time_start) }} до {{ extractTime(item.time_end) }}</p>
                        <p><span class="details">Виконавець: </span>{{ item.performer }}</p>
                        <p v-if="item.done" style="color:greenyellow;">
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
                    </div>
                    <div style="display: flex;">
                        <button v-if="item.done==true" class="knopka_neion lusa-10" @click="reaction(item)">Реакція</button>
                        <div v-if="showModal" class="modal">
                            <div class="modal-content">
                                <span class="close" @click="showModal = false">&times;</span>
                                <h2 style="color: aliceblue; font-size: 24px;">Підвердіть будь ласка виконання послуги
                                </h2>
                                <br>
                                <p>
                                    Я погоджуюся з тим, що послуга "{{ selected_item.service }}" у проміжку від {{
                                        extractTime(selected_item.time_start) }} до {{ extractTime(selected_item.time_end) }} була виконавцем {{ selected_item.performer }} виконана.
                                </p>
                                <div style="display: flex; justify-self: center;">
                                    <button class="knopka_neion lusa-10" @click="confirmUserTermin(selected_item.record_id)">
                                        Підтвердити
                                    </button>
                                    <button class="knopka_neion lusa-10" @click="showModal = false">Закрити</button>
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
import { ref } from "vue";


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
    setup() {
        const showModal = ref(false);

        

        return { showModal };
    },
    data() {
        return {
            selected_item: {},
        }
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("uk-UA");
        },
        extractTime(dateString) {
            const time = dateString.split('T')[1].split('.')[0].split(':').slice(0, 2).join(':');
            return time;
        },
        confirmUserTermin(id) {

            this.$emit("confirm", id);
            this.showModal = false;
        },
        reaction(item){
            this.selected_item = item;
            this.showModal = true;
        },
        generateGoogleCalendarLink(title, description, dateStart, dateEnd) {
            // Форматуємо дати у вигляді YYYYMMDDTHHMMSSZ для Google Календаря
            const startDate = new Date(dateStart).toISOString().replace(/-|:|\.\d+/g, "");
            const endDate = new Date(dateEnd).toISOString().replace(/-|:|\.\d+/g, "");

            // Створюємо URL для події
            const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
            const text = encodeURIComponent(title);
            const details = encodeURIComponent(description);
            const dates = `dates=${startDate}/${endDate}`;

            const calendarUrl = `${baseUrl}&text=${text}&details=${details}&${dates}`;
            return calendarUrl;
        }
    },
};
</script>

<style>
.details {
    color: darkgray;
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
    transition: all 0.3s ease;
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
.card {
    display: flex; 
    justify-content: space-between;
}




@media only screen and (max-width: 768px) {
    .termin {
        margin-left: 5%;
        margin-right: 5%;
        padding: 15px;
    }

    .details {
        font-size: 14px;
    }

    .lusa-10 {
        font-size: 14px;
        padding: 10px;
    }

    .modal-content {
        width: 95%;
        padding: 15px;
        font-size: 14px;
    }

    .modal-content h2 {
        font-size: 18px;
    }

    .modal-content p {
        font-size: 14px;
    }

    .close {
        font-size: 20px;
    }
    .card{
        display: inline-block;
    }
}
</style>