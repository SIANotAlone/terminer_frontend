<template>
    <Menu></Menu>
    <div class="myTermin">
        <h1 style="display: flex; justify-content: center;">
            Терміни, які потребують вашої уваги:
        </h1>
        <div style="display: flex; justify-content: center;">
            <select name="" id="" v-model="selected_regime" @change="changeRegime">
                <option value="1">Мої терміни</option>
                <option value="2">До мене, як виконавця</option>
            </select>
        </div>

        <div v-if="my_termins.length == 0 && this.selected_regime == 1 || performer_termins.length == 0 && this.selected_regime == 2">
            <br />
            <p style="display: flex; justify-content: center;">
                Покищо немає термінів, які потребують вашої уваги.
            </p>
        </div>
        <div v-if="selected_regime == 1">
            <MyReaction :my_termins="my_termins" :server_ip="server_ip" @confirm="confirmUserTermin" />
        </div>
        <div v-if="selected_regime == 2">
            <PerformerReaction :performer_termins="performer_termins" :server_ip="server_ip"
                @confirm="confirmPerformerTermin" />
        </div>


    </div>
</template>

<script>
import axios from "axios";
import Menu from "@/components/Menu.vue";
import MyReaction from "@/components/MyReaction.vue";
import PerformerReaction from "@/components/PerformerReaction.vue";
import ipconfig from "@/server_configs/config.js";
import { ref } from "vue";

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    components: {
        Menu,
        MyReaction,
        PerformerReaction,
    },
    mounted() {
        axios.get(this.server_ip + "/api/termin/getallusertermins", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            },
        })
            .then((response) => {
                if (response.data == null) {
                    this.my_termins = [];
                } else {
                    this.my_termins = response.data;
                }
                
            })
            .catch((error) => {
                console.error(error);
                this.$router.push({ path: "/sign-in" });
            });

        axios.get(this.server_ip + "/api/termin/getallperformertermins", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            },
        }).then((response) => {
            if (response.data != null) {
                this.performer_termins = response.data;
            }
            
        }).catch((error) => {
            console.error(error);
            this.$router.push({ path: "/sign-in" });
        })
    },
    setup() {
        const theme = "dark";
        const notify = (message) => {
            toast.success(message, {
                autoClose: 2000,
                theme,
            }); // ToastOptions

        }

        return { notify };

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
        changeRegime() {
            if (this.selected_regime == 1) {
                axios.get(this.server_ip + "/api/termin/getallusertermins", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            },
        })
            .then((response) => {
                if (response.data == null) {
                    this.my_termins = [];
                }
                else {
                    this.my_termins = response.data;
                }
                
            })
            .catch((error) => {
                console.error(error);
                this.$router.push({ path: "/sign-in" });
            });

            } else if (this.selected_regime == 2) {
                axios.get(this.server_ip + "/api/termin/getallperformertermins", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            },
        }).then((response) => {

            if (response.data == null) {
                this.performer_termins = [];
            } else{
                this.performer_termins = response.data;
            }
            
        }).catch((error) => {
            console.error(error);
            this.$router.push({ path: "/sign-in" });
        })
            }
        },
        confirmUserTermin(id) {
            axios
                .post(
                    this.server_ip + "/api/record/confirm",
                    { id },
                    {
                        headers: {
                            Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
                        },
                    }
                )
                .then((response) => {
                    this.my_termins = this.my_termins.filter(
                        (item) => item.record_id !== id,
                        this.notify("Виконано")
                    );
                });
        },
        confirmPerformerTermin(id) {
            axios.post(
                this.server_ip + '/api/record/done',{
                    "id": id
                },
                {
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("jwt_token"),
                    },
                }).then((response) => {
                    this.performer_termins = this.performer_termins.filter(
                        (item) => item.record_id !== id,
                        this.notify("Виконано")
                    )
                })
        }
    },
};
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



/* Mobile styles */
@media (max-width: 600px) {
    h1 {
        font-size: 1.2rem;
        text-align: center;
    }

    p {
        font-size: 1rem;
        text-align: center;
    }

    .myTermin {
        margin: 10px;
    }

    .termin {
        margin: 10px;
        padding: 15px;
        margin-left: 10%;
        margin-right: 10%;
    }

    select {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
    }

    button {
        width: 100%;
        height: 50px;
    }

    .osnovanua {
        width: 90%;
        margin: 20px auto;
    }

    .lusa-10 {
        width: 100%;
        padding: 15px;
    }

    .modal-content {
        width: 90%;
        max-width: 400px;
        padding: 15px;
    }

    .modal {
        padding: 10px;
    }

    .close {
        font-size: 18px;
        top: 5px;
        right: 5px;
    }
}

</style>