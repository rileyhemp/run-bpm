import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		dark: true,
		themes: {
			dark: {
				primary: "#1DB954",
				secondary: "#03DAC6",
				accent: "#3700B3",
				error: "#CF6679"
			}
		}
	}
});
