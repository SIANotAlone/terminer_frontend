<template>
  <div class="category-page-layout">
    <Sidebar />

    <main class="main-content">
      <header>
        <h1>Управление категориями</h1>
      </header>

      <div class="toolbar">
        <div class="toolbar-actions">
          <button class="btn btn-primary create-btn" @click="openCreateModal">
            <i class="fas fa-plus"></i> <span>Создать</span>
          </button>
          
          <div class="management-group">
            <button 
              class="btn btn-outline" 
              :disabled="!selectedCategory || selectedCategory.is_based" 
              @click="openEditModal"
            >
              <i class="fas fa-edit"></i> <span>Изменить</span>
            </button>
            <button 
              class="btn btn-danger" 
              :disabled="!selectedCategory || selectedCategory.is_based" 
              @click="confirmDelete"
            >
              <i class="fas fa-trash-alt"></i> <span>Удалить</span>
            </button>
          </div>
        </div>

        <div class="toolbar-filters">
          <div class="search-container">
            <i class="fas fa-search search-icon"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Поиск по названию..." 
              class="search-input"
            />
          </div>

          <select v-model="selectedOwnership" class="filter-select">
            <option value="ALL">Все источники</option>
            <option value="MINE">Только мои</option>
            <option value="SYSTEM">Только системные</option>
          </select>

          <select v-model="selectedType" class="filter-select">
            <option value="ALL">Все типы</option>
            <option value="EXPENSE">Расход</option>
            <option value="INCOME">Доход</option>
          </select>
        </div>
      </div>

      <section class="content-section">
        <div class="table-responsive">
          <table v-if="!loading">
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Владелец</th>
                <th class="hide-mobile">Описание</th>
                <th class="hide-mobile">Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="cat in filteredCategories" 
                :key="cat.id" 
                @click="selectCategory(cat)"
                :class="{ 'selected': selectedCategory?.id === cat.id }"
              >
                <td class="name-cell">
                  <i v-if="cat.is_based" class="fas fa-lock lock-icon" title="Системная категория"></i>
                  <span class="category-name">{{ cat.name }}</span>
                </td>
                <td>
                  <span :class="cat.type === 'INCOME' ? 'type-inc' : 'type-exp'">
                    {{ cat.type === 'INCOME' ? 'Доход' : 'Расход' }}
                  </span>
                </td>
                <td>
                  <span :class="['badge', cat.is_based ? 'badge-base' : 'badge-user']">
                    {{ cat.is_based ? 'Система' : 'Вы' }}
                  </span>
                </td>
                <td class="description-cell hide-mobile">{{ cat.description }}</td>
                <td class="date-cell hide-mobile">{{ cat.is_based ? '—' : formatDate(cat.created_at) }}</td>
              </tr>
              <tr v-if="filteredCategories.length === 0">
                <td colspan="5" class="empty-state">Категории не найдены</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i> Загрузка...
          </div>
        </div>
      </section>
    </main>

    <BaseModal v-if="showFormModal" :title="isEditMode ? 'Изменить категорию' : 'Создать категорию'" @close="closeModals">
       <div class="modal-form">
        <div class="form-group">
          <label>Название</label>
          <input v-model="form.name" type="text" class="form-input" placeholder="Напр. Продукты" />
        </div>
        <br>
        <div class="form-group">
          <label>Тип</label>
          <select v-model="form.type" class="form-input">
            <option value="EXPENSE">Расход</option>
            <option value="INCOME">Доход</option>
          </select>
        </div>
        <br>
        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="form.description" class="form-input" rows="3"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="closeModals">Отмена</button>
        <button class="btn btn-primary" @click="confirmAction">Сохранить</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showConfirmModal" :title="isDeleteAction ? 'Опасное действие!' : 'Подтверждение'" @close="showConfirmModal = false">
      <div class="confirm-content" :class="{ 'danger-mode': isDeleteAction }">
        <div v-if="isDeleteAction" class="warning-sign">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="confirm-text">
          <p>{{ confirmMessage }}</p>
          <p v-if="isDeleteAction" class="danger-warning">
            <strong>Внимание!</strong> При удалении категории будут безвозвратно удалены все связанные с ней транзакции.
          </p>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="showConfirmModal = false">Отмена</button>
        <button 
          :class="['btn', isDeleteAction ? 'btn-danger-filled' : 'btn-primary']" 
          @click="executeConfirmedAction"
        >
          {{ isDeleteAction ? 'Удалить всё' : 'Подтвердить' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import axios from 'axios';
import ipconfig from '@/server_configs/config.js';
import Sidebar from '@/components/budget/SideMenu.vue';
import BaseModal from '@/components/budget/BaseModal.vue';
import { toast } from 'vue3-toastify';

export default {
  name: 'CategoryPage',
  components: { Sidebar, BaseModal },
  data() {
    return {
      categories: [],
      searchQuery: '',
      selectedType: 'ALL',
      selectedOwnership: 'ALL', // Новое состояние для фильтра
      loading: true,
      selectedCategory: null,
      showFormModal: false,
      showConfirmModal: false,
      isEditMode: false,
      isDeleteAction: false,
      confirmMessage: '',
      pendingAction: null,
      form: { id: null, name: '', description: '', type: 'EXPENSE' }
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(cat => {
        // Поиск по названию
        const matchesSearch = cat.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        // Фильтр по типу (Расход/Доход)
        const matchesType = this.selectedType === 'ALL' || cat.type === this.selectedType;
        
        // Фильтр по источнику (Мои/Системные)
        let matchesOwnership = true;
        if (this.selectedOwnership === 'MINE') matchesOwnership = !cat.is_based;
        if (this.selectedOwnership === 'SYSTEM') matchesOwnership = cat.is_based;

        return matchesSearch && matchesType && matchesOwnership;
      });
    }
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async apiRequest(method, url, data = {}) {
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await axios({
          method,
          url: `${ipconfig.backend_ip}${url}`,
          data,
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.message === "invalid token") {
          this.$router.push('/sign-in');
          return null;
        }
        return response.data;
      } catch (error) {
        if (error.response?.data?.message === "invalid token") this.$router.push('/sign-in');
        throw error;
      }
    },
    async fetchCategories() {
      this.loading = true;
      try {
        const data = await this.apiRequest('get', '/api/category/getavailablecategories');
        if (data) this.categories = data.categories;
      } finally {
        this.loading = false;
      }
    },
    selectCategory(cat) {
      this.selectedCategory = (this.selectedCategory?.id === cat.id) ? null : cat;
    },
    openCreateModal() {
      this.isEditMode = false;
      this.isDeleteAction = false;
      this.form = { name: '', description: '', type: 'EXPENSE' };
      this.showFormModal = true;
    },
    openEditModal() {
      if (!this.selectedCategory) return;
      this.isEditMode = true;
      this.isDeleteAction = false;
      this.form = { ...this.selectedCategory };
      this.showFormModal = true;
    },
    confirmAction() {
      this.isDeleteAction = false;
      this.confirmMessage = this.isEditMode ? "Сохранить изменения в категории?" : "Создать новую категорию?";
      this.pendingAction = this.isEditMode ? this.updateCategory : this.createCategory;
      this.showConfirmModal = true;
    },
    confirmDelete() {
      if (!this.selectedCategory) return;
      this.isDeleteAction = true;
      this.confirmMessage = `Вы уверены, что хотите удалить категорию "${this.selectedCategory.name}"?`;
      this.pendingAction = this.deleteCategory;
      this.showConfirmModal = true;
    },
    async executeConfirmedAction() {
      if (this.pendingAction) {
        await this.pendingAction();
        this.showConfirmModal = false;
        this.pendingAction = null;
      }
    },
    async createCategory() {
      const res = await this.apiRequest('post', '/api/category/create', this.form);
      if (res) { toast.success("Категория добавлена"); this.showFormModal = false; this.fetchCategories(); }
    },
    async updateCategory() {
      const res = await this.apiRequest('put', '/api/category/update', this.form);
      if (res) { toast.success("Данные обновлены"); this.showFormModal = false; this.fetchCategories(); }
    },
    async deleteCategory() {
      const res = await this.apiRequest('delete', '/api/category/delete', { id: this.selectedCategory.id });
      if (res) { toast.success("Удалено вместе с транзакциями"); this.selectedCategory = null; this.fetchCategories(); }
    },
    closeModals() { this.showFormModal = false; this.showConfirmModal = false; },
    formatDate(dateStr) { return new Date(dateStr).toLocaleDateString('ru-RU'); }
  }
};
</script>

<style scoped>
/* ПЕРЕМЕННЫЕ */
.category-page-layout {
  --text-main: #2b3674;
  --text-secondary: #a3aed0;
  --primary: #4318ff;
  --bg-color: #f4f7fe;
  --border: #e0e5f2;
  --danger: #ee5d50;
  --radius: 20px;
  display: flex; 
  min-height: 100vh; 
  background-color: var(--bg-color);
  color: var(--text-main) !important;
}

.category-page-layout :deep(*) { color: inherit; }

.main-content { 
  flex: 1; 
  padding: 30px; 
  width: 100%; 
  max-width: 1400px; 
  margin: 0 auto; 
}

/* ТУЛБАР */
.toolbar {
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
  background: white; 
  padding: 20px;
  border-radius: var(--radius); 
  margin-bottom: 25px; 
  box-shadow: 0px 10px 30px rgba(0,0,0,0.05);
}

.toolbar-actions { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: wrap; 
  gap: 15px; 
}

.management-group { 
  display: flex; 
  gap: 10px; 
}

.toolbar-filters { 
  display: flex; 
  gap: 15px; 
  padding-top: 15px; 
  border-top: 1px solid var(--border); 
}

/* ЭЛЕМЕНТЫ ФИЛЬТРАЦИИ */
.search-container { 
  position: relative; 
  flex: 2; 
  min-width: 200px; 
}

.search-icon { 
  position: absolute; 
  left: 15px; 
  top: 50%; 
  transform: translateY(-50%); 
  color: var(--text-secondary); 
}

.search-input {
  width: 100%; 
  padding: 12px 15px 12px 45px; 
  border: 1px solid var(--border); 
  border-radius: 12px;
  background: #f8faff; 
  font-size: 14px; 
  outline: none;
}

.filter-select {
  flex: 1; 
  padding: 12px 15px; 
  border: 1px solid var(--border); 
  border-radius: 12px;
  background: #f8faff; 
  font-size: 14px; 
  cursor: pointer; 
  outline: none; 
  min-width: 160px;
}

/* КНОПКИ */
.btn {
  padding: 10px 20px; 
  border-radius: 12px; 
  font-weight: 600; 
  cursor: pointer;
  display: flex; 
  align-items: center; 
  justify-content: center;
  gap: 8px; 
  border: none; 
  transition: 0.2s; 
  font-size: 14px;
  white-space: nowrap;
}

.btn-primary { background: var(--primary); color: white !important; }
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-main) !important; }
.btn-danger { background: #fff0f0; color: var(--danger) !important; }
.btn-danger-filled { background: var(--danger); color: white !important; }
.btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ТАБЛИЦА */
.content-section { 
  background: white; 
  border-radius: var(--radius); 
  padding: 20px; 
  box-shadow: 0px 10px 30px rgba(0,0,0,0.05); 
}

.table-responsive { overflow-x: auto; }

table { 
  width: 100%; 
  border-collapse: collapse; 
  min-width: 750px; 
}

th { 
  text-align: left; 
  padding: 15px; 
  color: var(--text-secondary) !important; 
  font-size: 12px; 
  text-transform: uppercase; 
  border-bottom: 1px solid var(--border); 
}

td { 
  padding: 15px; 
  border-bottom: 1px solid var(--border); 
  font-size: 14px; 
}

tr:hover { background: #fcfdff; }
tr.selected { background: #f4f7fe; }

.lock-icon { margin-right: 15px; color: var(--text-secondary); font-size: 14px; }
.type-inc { color: #05cd99 !important; font-weight: 700; }
.type-exp { color: var(--danger) !important; font-weight: 700; }
.badge { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; }
.badge-base { background: #eef2f7; color: #718096 !important; }
.badge-user { background: #e0e7ff; color: var(--primary) !important; }

/* МОДАЛКА ОПАСНОСТИ */
.confirm-content { display: flex; gap: 20px; padding: 10px 0; align-items: flex-start; }
.warning-sign { font-size: 40px; color: #ffb547; }
.danger-mode .warning-sign { color: var(--danger); }
.danger-warning { 
  color: var(--danger) !important; 
  font-size: 13px; 
  background: #fff5f5; 
  padding: 10px; 
  border-radius: 8px; 
  border-left: 4px solid var(--danger); 
  margin-top: 10px; 
}

/* --- АДАПТИВНОСТЬ (ГЛАВНОЕ) --- */
@media (max-width: 768px) {
  .main-content { 
    padding: 15px; 
    padding-bottom: 100px; /* Чтобы контент не перекрывался нижним меню */
  }

  .toolbar { 
    padding: 15px; 
    gap: 15px;
  }

  .toolbar-actions { 
    flex-direction: column; 
    align-items: stretch; 
  }

  .create-btn {
    width: 100%;
    order: 1; /* Кнопка Создать всегда первая */
  }

  .management-group { 
    display: grid; 
    grid-template-columns: 1fr 1fr; /* Изменить и Удалить в один ряд */
    width: 100%;
    order: 2;
  }

  .toolbar-filters { 
    flex-direction: column; 
    gap: 10px;
    padding-top: 15px;
  }

  .search-container, 
  .filter-select { 
    width: 100%; 
    min-width: unset;
  }

  /* Скрываем второстепенные колонки, чтобы таблица не разъезжалась */
  .hide-mobile { display: none; }
  
  table {
    min-width: unset; /* Позволяем таблице сжиматься */
  }

  th, td {
    padding: 10px 8px;
    font-size: 13px;
  }
}

.empty-state { text-align: center; padding: 30px; color: var(--text-secondary) !important; }
.form-input { 
  width: 100%; 
  padding: 12px; 
  border: 1px solid var(--border); 
  border-radius: 12px; 
  margin-top: 5px; 
  color: var(--text-main) !important; 
}
</style>