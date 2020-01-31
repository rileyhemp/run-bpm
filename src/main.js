import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Axios from "axios";
import 'vant/lib/index.css';
import vuetify from './plugins/vuetify';


Vue.config.productionTip = false;
Vue.prototype.$http = Axios;

new Vue({
	router,
	vuetify,
	render: h => h(App)
}).$mount("#app");
