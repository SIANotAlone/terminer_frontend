<template>
  <div class="comments-wrapper">
    <div v-if="Comments.comments_list?.length" class="comments-list">
      <div v-for="item in Comments.comments_list" :key="item.id" :class="[
        'comment-card',
        item.is_my_comment ? 'my-comment' : 'other-comment'
      ]">
        <p v-if="item.is_my_comment == false" class="comment-author">{{ item.comment_owner }}</p>
        <p class="comment-text">{{ item.comment }}</p>
        <p class="comment-time">
          <span v-if="item.updated && item.updated !== item.created">
            відредаговано: {{ formatDate(item.updated) }}
          </span>
          <span v-else>
            {{ formatDate(item.created) }}
          </span>
        </p>

      </div>
    </div>
    <div v-else class="no-comments">Коментарів поки немає.</div>

    <div class="new-comment-section">
      <textarea v-model="new_comment" placeholder="Напишіть свій коментар..."></textarea>
      <button class="submit-button" @click="send_new_comment">
        Написати
      </button>
    </div>
  </div>
</template>

<script>
import ipconfig from "@/server_configs/config.js";
import axios from "axios";

export default {
  name: "Comments",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      Comments: {},
      new_comment: "",
    };
  },
  mounted() {
    this.update_comments();
  },
  methods: {
    send_new_comment() {
      if (!this.new_comment.trim()) return;
      axios
        .post(
          ipconfig.backend_ip + "/api/comment/create",
          {
            record_id: this.id,
            comment: this.new_comment,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            },
          }
        )
        .then(() => {
          this.new_comment = "";
          this.update_comments();
        })
        .catch((error) => {
          console.error("Помилка при додаванні коментаря:", error);
        });
    },
    update_comments() {
      axios
        .post(
          ipconfig.backend_ip + "/api/comment/getcomments",
          { record_id: this.id },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt_token"),
            },
          }
        )
        .then((response) => {
          this.Comments = response.data;
        })
        .catch((error) => {
          console.error("Ошибка при получении комментариев:", error);
        });
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      };
      return new Date(dateString).toLocaleString('uk-UA', options);
    }
  },
};
</script>

<style scoped>
.comments-wrapper {
  max-width: 700px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.comment-card {
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.my-comment {
  background-color: #e1ffc7;
  border-left: 4px solid #28a745;
  align-self: flex-end;
}

.other-comment {
  background-color: #f9f9f9;
  border-left: 4px solid #007bff;
  align-self: flex-start;
}

.comment-author {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.comment-text {
  margin: 0;
  color: #444;
}

.comment-time {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.no-comments {
  font-style: italic;
  color: #888;
  margin-bottom: 12px;
  text-align: center;
}

.new-comment-section {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

textarea {
  font-family: inherit;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px;
  font-size: 16px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s;
  color : black;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
  background-color: #fefefe;
}

.submit-button {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

/* Scrollbar styles */
.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: transparent;
}

.comments-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>