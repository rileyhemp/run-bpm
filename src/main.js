import Vue from "vue";
import Call from './mixins/CallApi'
import App from "./App.vue";
import router from "./router";
import Axios from "axios";

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
Vue.mixin(Call)

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
