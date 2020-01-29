import Vue from "vue";
import VueRouter from "vue-router";
import Authentication from "../views/Authentication.vue";
import Redirect from "../views/Redirect.vue";
import Connect from "../views/Connect.vue";
import Dashboard from "../views/Dashboard.vue";
import ImportVue from "../components/Import.vue";
import GeneratedPlaylistsVue from '../components/GeneratedPlaylists'

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "authentication",
		component: Authentication
	},
	{
		path: "/connect",
		name: "connect",
		component: Connect
	},
	{
		path: "/redirect",
		name: "redirect",
		component: Redirect
	},
	{
		path: "/dashboard",
		component: Dashboard,
		children: [
			{
				path: '',
				name: 'Dashboard',
				component: GeneratedPlaylistsVue
			},
			{
				path: '/import',
				name: 'Import',
				component: ImportVue
			}
		]
	},
];

const router = new VueRouter({
	mode: "history",
	routes
});

export default router;


