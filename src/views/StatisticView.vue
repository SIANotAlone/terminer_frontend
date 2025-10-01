<template>
  <Menu></Menu>
  <h1 style="display: flex; justify-content: center; color: #fff;">Статистика</h1>

  <label for="availableYears" class="metainfo centered-label">Оберіть рік:</label>
  <select name="availableYears" id="availableYears" v-model="selected_year" @change="update_all"
    class="metainfo centered-input">
    <option v-for="year in availableYears" :value="year" :key="year">
      {{ year }}
    </option>
  </select>

  <div class="main-statistics-container">
    <h2 class="section-title">Основні показники</h2>
    <div class="main-statistics-grid">
      <div v-for="(stat, index) in formattedStatistics" :key="index" class="stat-card">
        <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
  <div class="charts-section-wrapper">
    <h2 class="section-title">Графіки по послугам за {{ selected_year }}</h2>

    <div class="chart-row">
      <div class="chart-container-wrapper chart-item">
        <h3 class="chart-subtitle">Надані послуги та записи по місяцям</h3>
        <div id="provided-records-column-chart" class="chart-card"></div>
      </div>

      <div class="chart-container-wrapper chart-item">
        <h3 class="chart-subtitle">Отримані послуги та записи по місяцям</h3>
        <div id="recieved-records-column-chart" class="chart-card"></div>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-container-wrapper chart-item">
        <h3 class="chart-subtitle">Надано послуг по типах (Усього)</h3>
        <div id="provided-service-types-pie-chart" class="chart-card"></div>
      </div>

      <div class="chart-container-wrapper chart-item">
        <h3 class="chart-subtitle">Отримано послуг по типах (Усього)</h3>
        <div id="recieved-service-types-pie-chart" class="chart-card"></div>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-container-wrapper chart-item">
        <h3 class="chart-subtitle">Масажі по типах (Надано)</h3>
        <div id="massage-type-provided-pie-chart" class="chart-card"></div>
      </div>

      <div class="chart-container-wrapper chart-item">
        <h3 class="chart-subtitle">Масажі по типах (Отримано)</h3>
        <div id="massage-type-recieved-pie-chart" class="chart-card"></div>
      </div>
    </div>

    <div class="chart-row single-chart-row">
      <div class="chart-container-wrapper chart-item full-width-chart">
        <h3 class="chart-subtitle">
          Загальне співвідношення Надано/Отримано
          <span v-if="providedDoneRecords.user_name" class="user-info">({{ providedDoneRecords.user_name }})</span>
        </h3>
        <div id="provided-done-pie-chart" class="chart-card"></div>
      </div>
    </div>

  </div>

</template>

<script>
import axios from 'axios';
import ipconfig from "@/server_configs/config.js"
import Menu from '@/components/Menu.vue'
import ApexCharts from 'apexcharts'


export default {
  setup() {
    // ...
  },
  mounted() {
    document.body.style.backgroundColor = '#1e1e1e';
    document.body.style.color = '#ffffff';

    axios.get(ipconfig['backend_ip'] + '/api/statistic/getavailableyears', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt_token')
      }
    }).then(response => {
      this.availableYears = response.data;
      this.selected_year = this.availableYears[response.data.length - 1]
      this.update_all()
    })
  },
  beforeUnmount() {
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
    // Уничтожаем все экземпляры графиков
    if (this.providedDonePieChart) this.providedDonePieChart.destroy();
    if (this.providedColumnChart) this.providedColumnChart.destroy();
    if (this.recievedColumnChart) this.recievedColumnChart.destroy();
    if (this.providedMassageTypePieChart) this.providedMassageTypePieChart.destroy();
    if (this.recievedMassageTypePieChart) this.recievedMassageTypePieChart.destroy();
    if (this.providedServiceTypePieChart) this.providedServiceTypePieChart.destroy();
    if (this.recievedServiceTypePieChart) this.recievedServiceTypePieChart.destroy();
  },
  data() {
    return {
      mainstatistic: {},
      providedDoneRecords: {},
      providedRecordsProMonth: {},
      recievedRecordsProMonth: {},
      massageProType: {}, // Надано (Масажі)
      recievedMassageProType: {}, // Отримано (Масажі)
      providedServiceByTypes: {}, // Надано (всі послуги)
      recievedServiceByTypes: {}, // Отримано (всі послуги)

      availableYears: [],
      selected_year: null,

      // Екземпляри графіків
      providedDonePieChart: null,
      providedColumnChart: null,
      recievedColumnChart: null,
      providedMassageTypePieChart: null,
      recievedMassageTypePieChart: null,
      providedServiceTypePieChart: null,
      recievedServiceTypePieChart: null,
    };
  },
  components: { Menu },
  computed: {
    formattedStatistics() {
      const accentColor = '#ff9aff';
      const defaultColor = '#ff9aff';
      const stats = this.mainstatistic;

      return [
        { label: 'Усього надано термінів', value: stats.services || 0, color: defaultColor, key: 'services' },
        { label: 'Створено промо послуг', value: stats.promoservices || 0, color: defaultColor, key: 'promoservices' },
        { label: 'Коментарів до послуг', value: stats.comments || 0, color: defaultColor, key: 'comments' },
        { label: 'Створено послуг', value: stats.provided || 0, color: accentColor, key: 'provided' },
        { label: 'Отримано послуг', value: stats.recieved || 0, color: accentColor, key: 'recieved' },
        { label: 'Виконано послуг', value: stats.done || 0, color: accentColor, key: 'done' },
        { label: 'Підтверджено користувачем', value: stats.confirm || 0, color: accentColor, key: 'confirm' },
      ].filter(s => s.value !== undefined);
    }
  },
  methods: {
    update_all() {
      // Обнуление данных перед новым запросом
      this.mainstatistic = {}
      this.providedDoneRecords = {}
      this.providedRecordsProMonth = {}
      this.recievedRecordsProMonth = {}
      this.massageProType = {}
      this.recievedMassageProType = {}
      this.providedServiceByTypes = {}
      this.recievedServiceByTypes = {}

      if (!this.selected_year) return;

      // 1. mainstatistic
      axios.get(ipconfig['backend_ip'] + '/api/statistic/mainstatistic?year=' + this.selected_year, {
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt_token') }
      }).then(response => { this.mainstatistic = response.data }).catch(error => { console.error("Ошибка mainstatistic:", error); })

      // 2. provideddonerecords
      axios.get(ipconfig['backend_ip'] + '/api/statistic/provideddonerecords?year=' + this.selected_year, {
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt_token') }
      }).then(response => {
        this.providedDoneRecords = response.data
        this.renderProvidedDonePieChart();
      }).catch(error => {
        console.error("Ошибка provideddonerecords:", error);
        this.providedDoneRecords = { "gave": 0, "got": 0, "user_name": "Дані недоступні" };
        this.renderProvidedDonePieChart();
      })

      // 3. providedrecordspromonth
      axios.get(ipconfig['backend_ip'] + '/api/statistic/providedrecordspromonth?year=' + this.selected_year, {
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt_token') }
      }).then(response => {
        this.providedRecordsProMonth = response.data
        this.renderProvidedColumnChart();
      }).catch(error => {
        console.error("Ошибка providedrecordspromonth:", error);
        this.providedRecordsProMonth = {};
        this.renderProvidedColumnChart();
      })

      // 4. recievedrecordspromonth
      axios.get(ipconfig['backend_ip'] + '/api/statistic/recievedrecordspromonth?year=' + this.selected_year, {
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt_token') }
      }).then(response => {
        this.recievedRecordsProMonth = response.data
        this.renderRecievedColumnChart();
      }).catch(error => {
        console.error("Ошибка recievedrecordspromonth:", error);
        this.recievedRecordsProMonth = {};
        this.renderRecievedColumnChart();
      })

      // 5. massagetype
      axios.get(ipconfig['backend_ip'] + '/api/statistic/massagetype?year=' + this.selected_year, {
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt_token') }
      }).then(response => {
        this.massageProType = response.data
        this.renderProvidedMassageTypePieChart();
      }).catch(error => {
        console.error("Ошибка massagetype:", error);
        this.massageProType = {};
        this.renderProvidedMassageTypePieChart();
      })

      // 6. resievedmassagetype
      axios.get(ipconfig['backend_ip'] + '/api/statistic/resievedmassagetype?year=' + this.selected_year, {
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt_token') }
      }).then(response => {
        this.recievedMassageProType = response.data
        this.renderRecievedMassageTypePieChart();
      }).catch(error => {
        console.error("Ошибка resievedmassagetype:", error);
        this.recievedMassageProType = {};
        this.renderRecievedMassageTypePieChart();
      })

      // 7. providetservicebytypes
      axios.get(ipconfig['backend_ip'] + '/api/statistic/providetservicebytypes?year=' + this.selected_year, {
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt_token') }
      }).then(response => {
        this.providedServiceByTypes = response.data
        this.renderProvidedServiceTypePieChart();
      }).catch(error => {
        console.error("Ошибка providetservicebytypes:", error);
        this.providedServiceByTypes = {};
        this.renderProvidedServiceTypePieChart();
      })

      // 8. resievedservicebytypes
      axios.get(ipconfig['backend_ip'] + '/api/statistic/resievedservicebytypes?year=' + this.selected_year, {
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt_token') }
      }).then(response => {
        this.recievedServiceByTypes = response.data
        this.renderRecievedServiceTypePieChart();
      }).catch(error => {
        console.error("Ошибка resievedservicebytypes:", error);
        this.recievedServiceByTypes = {};
        this.renderRecievedServiceTypePieChart();
      })
    },

    // --- ОНОВЛЕНІ ФУНКЦІЇ РЕНДЕРИНГУ КРУГОВИХ ДІАГРАМ ---

    renderProvidedDonePieChart() {
      const chartElement = document.getElementById('provided-done-pie-chart');
      if (!chartElement) return;

      const chartData = this.providedDoneRecords;
      const series = [chartData.gave || 0, chartData.got || 0];

      const options = {
        chart: { type: 'pie', height: 350, toolbar: { show: false }, fontFamily: 'sans-serif' },
        colors: ['#ff9aff', '#48d1cc'],
        series: series,
        labels: ['Надано послуг', 'Отримано послуг'],
        theme: { mode: 'dark' },
        legend: { position: 'bottom', fontSize: '14px', labels: { colors: '#ffffff' } },
        dataLabels: { 
          enabled: true, 
          // Форматтер для виведення: Значення (Відсоток)
          formatter: (val, opts) => {
            const value = opts.w.config.series[opts.seriesIndex];
            const percentage = val.toFixed(1) + '%';
            return `${value} (${percentage})`;
          }, 
          style: { fontSize: '14px', colors: ['#ffffff'] } // Змінено на білий
        },
        tooltip: { theme: 'dark' }
      };

      if (this.providedDonePieChart) {
        this.providedDonePieChart.updateOptions(options);
      } else {
        this.providedDonePieChart = new ApexCharts(chartElement, options);
        this.providedDonePieChart.render();
      }
    },

    renderProvidedColumnChart() {
      const chartElement = document.getElementById('provided-records-column-chart');
      if (!chartElement) return;

      const chartData = this.providedRecordsProMonth;
      const monthNames = ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"];
      const monthKeys = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

      const recordsData = monthKeys.map(key => chartData.records?.[key] || 0);
      const servicesData = monthKeys.map(key => chartData.services?.[key] || 0);

      const options = {
        chart: { type: 'bar', height: 350, toolbar: { show: false }, fontFamily: 'sans-serif', stacked: false, background: 'transparent' },
        colors: ['#ff9aff', '#48d1cc'],
        series: [
          { name: 'Кількість термінів (Надано)', data: recordsData },
          { name: 'Кількість послуг (Надано)', data: servicesData }
        ],
        xaxis: { categories: monthNames, labels: { style: { colors: '#ffffff' } } },
        yaxis: { title: { text: 'Кількість', style: { color: '#ccc' } }, labels: { style: { colors: '#ffffff' } } },
        grid: { borderColor: '#444' },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
        legend: { position: 'top', labels: { colors: '#ffffff' } },
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark' }
      };

      if (this.providedColumnChart) {
        this.providedColumnChart.updateOptions(options);
      } else {
        this.providedColumnChart = new ApexCharts(chartElement, options);
        this.providedColumnChart.render();
      }
    },

    renderRecievedColumnChart() {
      const chartElement = document.getElementById('recieved-records-column-chart');
      if (!chartElement) return;

      const chartData = this.recievedRecordsProMonth;
      const monthNames = ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"];
      const monthKeys = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

      const recordsData = monthKeys.map(key => chartData.records?.[key] || 0);
      const servicesData = monthKeys.map(key => chartData.services?.[key] || 0);

      const accentColor = '#ff9aff';
      const defaultColor = '#48d1cc';

      const options = {
        chart: { type: 'bar', height: 350, toolbar: { show: false }, fontFamily: 'sans-serif', stacked: false, background: 'transparent' },
        colors: [accentColor, defaultColor],
        series: [
          { name: 'Кількість термінів (Отримано)', data: recordsData },
          { name: 'Кількість послуг (Отримано)', data: servicesData }
        ],
        xaxis: { categories: monthNames, labels: { style: { colors: '#ffffff' } } },
        yaxis: { title: { text: 'Кількість', style: { color: '#ccc' } }, labels: { style: { colors: '#ffffff' } } },
        grid: { borderColor: '#444' },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
        legend: { position: 'top', labels: { colors: '#ffffff' } },
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark' }
      };

      if (this.recievedColumnChart) {
        this.recievedColumnChart.updateOptions(options);
      } else {
        this.recievedColumnChart = new ApexCharts(chartElement, options);
        this.recievedColumnChart.render();
      }
    },

    renderProvidedMassageTypePieChart() {
      const chartElement = document.getElementById('massage-type-provided-pie-chart');
      if (!chartElement) return;

      const chartData = this.massageProType;
      const series = chartData.amount || [];
      const labels = chartData.types || [];

      const chartColors = ['#ff9aff', '#48d1cc', '#ffd700', '#546E7A', '#E91E63', '#9C27B0', '#00BCD4', '#FF9800', '#795548'];

      const options = {
        chart: { type: 'pie', height: 350, toolbar: { show: false }, fontFamily: 'sans-serif', background: 'transparent' },
        colors: chartColors,
        series: series,
        labels: labels,
        theme: { mode: 'dark' },
        legend: { position: 'bottom', fontSize: '14px', labels: { colors: '#ffffff' } },
        dataLabels: { 
          enabled: true, 
          // Форматтер для виведення: Значення (Відсоток)
          formatter: (val, opts) => {
            const value = opts.w.config.series[opts.seriesIndex];
            const percentage = val.toFixed(1) + '%';
            return `${value} (${percentage})`;
          },
          style: { fontSize: '14px', colors: ['#ffffff'] } // Змінено на білий
        },
        tooltip: { theme: 'dark' }
      };

      if (this.providedMassageTypePieChart) {
        this.providedMassageTypePieChart.updateOptions(options);
      } else {
        this.providedMassageTypePieChart = new ApexCharts(chartElement, options);
        this.providedMassageTypePieChart.render();
      }
    },

    renderRecievedMassageTypePieChart() {
      const chartElement = document.getElementById('massage-type-recieved-pie-chart');
      if (!chartElement) return;

      const chartData = this.recievedMassageProType;
      const series = chartData.amount || [];
      const labels = chartData.types || [];

      const chartColors = ['#48d1cc', '#ff9aff', '#546E7A', '#ffd700', '#9C27B0', '#E91E63', '#FF9800', '#00BCD4', '#795548'];

      const options = {
        chart: { type: 'pie', height: 350, toolbar: { show: false }, fontFamily: 'sans-serif', background: 'transparent' },
        colors: chartColors,
        series: series,
        labels: labels,
        theme: { mode: 'dark' },
        legend: { position: 'bottom', fontSize: '14px', labels: { colors: '#ffffff' } },
        dataLabels: { 
          enabled: true, 
          // Форматтер для виведення: Значення (Відсоток)
          formatter: (val, opts) => {
            const value = opts.w.config.series[opts.seriesIndex];
            const percentage = val.toFixed(1) + '%';
            return `${value} (${percentage})`;
          },
          style: { fontSize: '14px', colors: ['#ffffff'] } // Змінено на білий
        },
        tooltip: { theme: 'dark' }
      };

      if (this.recievedMassageTypePieChart) {
        this.recievedMassageTypePieChart.updateOptions(options);
      } else {
        this.recievedMassageTypePieChart = new ApexCharts(chartElement, options);
        this.recievedMassageTypePieChart.render();
      }
    },

    renderProvidedServiceTypePieChart() {
      const chartElement = document.getElementById('provided-service-types-pie-chart');
      if (!chartElement) return;

      const chartData = this.providedServiceByTypes;
      const series = chartData.amount || [];
      const labels = chartData.types || [];

      const chartColors = ['#ff9aff', '#48d1cc', '#ffd700', '#546E7A', '#E91E63', '#9C27B0', '#00BCD4', '#FF9800', '#795548', '#8BC34A', '#FF5722'];

      const options = {
        chart: { type: 'pie', height: 350, toolbar: { show: false }, fontFamily: 'sans-serif', background: 'transparent' },
        colors: chartColors,
        series: series,
        labels: labels,
        theme: { mode: 'dark' },
        legend: { position: 'bottom', fontSize: '14px', labels: { colors: '#ffffff' } },
        dataLabels: { 
          enabled: true, 
          // Форматтер для виведення: Значення (Відсоток)
          formatter: (val, opts) => {
            const value = opts.w.config.series[opts.seriesIndex];
            const percentage = val.toFixed(1) + '%';
            return `${value} (${percentage})`;
          },
          style: { fontSize: '14px', colors: ['#ffffff'] } // Змінено на білий
        },
        tooltip: { theme: 'dark' }
      };

      if (this.providedServiceTypePieChart) {
        this.providedServiceTypePieChart.updateOptions(options);
      } else {
        this.providedServiceTypePieChart = new ApexCharts(chartElement, options);
        this.providedServiceTypePieChart.render();
      }
    },

    renderRecievedServiceTypePieChart() {
      const chartElement = document.getElementById('recieved-service-types-pie-chart');
      if (!chartElement) return;

      const chartData = this.recievedServiceByTypes;
      const series = chartData.amount || [];
      const labels = chartData.types || [];

      const chartColors = ['#48d1cc', '#ff9aff', '#546E7A', '#ffd700', '#9C27B0', '#E91E63', '#FF9800', '#00BCD4', '#795548', '#FF5722', '#8BC34A'];

      const options = {
        chart: { type: 'pie', height: 350, toolbar: { show: false }, fontFamily: 'sans-serif', background: 'transparent' },
        colors: chartColors,
        series: series,
        labels: labels,
        theme: { mode: 'dark' },
        legend: { position: 'bottom', fontSize: '14px', labels: { colors: '#ffffff' } },
        dataLabels: { 
          enabled: true, 
          // Форматтер для виведення: Значення (Відсоток)
          formatter: (val, opts) => {
            const value = opts.w.config.series[opts.seriesIndex];
            const percentage = val.toFixed(1) + '%';
            return `${value} (${percentage})`;
          },
          style: { fontSize: '14px', colors: ['#ffffff'] } // Змінено на білий
        },
        tooltip: { theme: 'dark' }
      };

      if (this.recievedServiceTypePieChart) {
        this.recievedServiceTypePieChart.updateOptions(options);
      } else {
        this.recievedServiceTypePieChart = new ApexCharts(chartElement, options);
        this.recievedServiceTypePieChart.render();
      }
    }
  }
}
</script>

<style>
/* ... СТИЛІ БЕЗ ЗМІН ... */
/* Общие стили для тёмной темы */
body {
  background-color: #1e1e1e;
  /* Темный фон для всей страницы */
  color: #ffffff;
  /* Светлый текст */
  font-family: sans-serif;
}

h1,
h2,
h3 {
  color: #ffffff;
}

/* Стили для формы выбора года */
.centered-label {
  margin: 20px 0 10px 0;
  display: flex;
  justify-content: center;
  color: #ffffff;
}

.centered-input {
  display: block;
  margin: 0 auto 20px auto;
  width: 40%;
  min-width: 200px;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #2c2c2c;
  color: #ffffff;
  border: 1px solid #444;
  transition: border-color 0.3s;
}

.centered-input:focus {
  border-color: #ff9aff;
  outline: none;
}

@media (max-width: 600px) {
  .centered-input {
    display: block;
    margin: 0 auto 20px auto !important;
    width: 80% !important;
    text-align: center;
    float: none;
  }
}

/* ------------------- */
/* Стили для Основной статистики */
/* ------------------- */

.main-statistics-container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 15px;
}

.section-title {
  text-align: center;
  color: #ff9aff;
  /* Акцентный цвет для заголовка секции */
  margin-bottom: 25px;
  font-size: 1.8em;
  border-bottom: 2px solid rgba(255, 154, 255, 0.3);
  padding-bottom: 10px;
}

.main-statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.stat-card {
  background-color: #2c2c2c;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  border: 1px solid #444;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(255, 154, 255, 0.2);
}

.stat-value {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  color: #ccc;
}


/* ------------------- */
/* Стили для Блока Графиков */
/* ------------------- */
.charts-section-wrapper {
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 15px;
}

.chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
  /* Отступ между рядами графиков */
}

.chart-item {
  flex: 1 1 48%;
  /* Позволяет элементам занимать половину ширины */
  min-width: 300px;
}

.chart-container-wrapper {
  display: flex;
  flex-direction: column;
}

.chart-subtitle {
  font-size: 1.3em;
  margin: 10px 0;
  color: #ffffff;
  text-align: center;
}

.user-info {
  font-size: 0.8em;
  font-weight: normal;
  color: #ccc;
  display: block;
}

.chart-card {
  background-color: #2c2c2c;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  border: 1px solid #444;
  flex-grow: 1;
  min-height: 370px;
}

@media (max-width: 900px) {
  .chart-item {
    flex: 1 1 100%;
    /* На маленьких экранах графики занимают всю ширину */
  }
}

/* Стиль для опций в select, чтобы они были читаемыми в тёмной теме */
select option {
  background: #2c2c2c;
  color: #ffffff;
}
</style>