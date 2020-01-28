import Vue from "vue";
import Call from './mixins/CallApi'
import App from "./App.vue";
import router from "./router";
import Axios from "axios";
import Vant from "vant";
import 'vant/lib/index.css';
import vuetify from './plugins/vuetify';


Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
Vue.mixin(Call)
Vue.use(Vant)

new Vue({
	router,
	vuetify,
	render: h => h(App)
}).$mount("#app");
