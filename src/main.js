import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Axios from "axios";
import vuetify from './plugins/vuetify';
import VueRouter from "vue-router";

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
Vue.use(VueRouter)

new Vue({
	router,
	vuetify,
	render: h => h(App)
}).$mount("#app");
