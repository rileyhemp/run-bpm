import Vue from "vue";
import VueRouter from "vue-router";
import Connect from "../views/Connect.vue";
import Dashboard from "../views/Dashboard.vue";
import Import from "../views/Import.vue";
import Create from "../views/Create.vue";
import Save from "../views/Save.vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		component: Dashboard,
		children: [
			{
				path: "",
				name: "Dashboard",
				component: Home,
				meta: { requiresAuth: true }
			},
			{
				path: "/import",
				name: "Import",
				component: Import,
				meta: { requiresAuth: true }
			},
			{
				path: "/create",
				name: "Create",
				component: Create,
				meta: { requiresAuth: true }
			},
			{
				path: "/save",
				name: "Save",
				component: Save,
				meta: { requiresAuth: true }
			}
		]
	},
	{
		path: "/connect",
		name: "connect",
		component: Connect
	}
];

const router = new VueRouter({
	mode: "history",
	routes
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (localStorage.RunBPM) {
			if (to.name === "Create" && from.name !== "Import") {
				next({
					name: "Dashboard"
				});
			} else if (to.name === "Save" && from.name !== "Create") {
				next({
					name: "Dashboard"
				});
			} else next();
		} else {
			next({
				path: "/connect"
			});
		}
	} else if (to.name === "connect" && localStorage.RunBPM) {
		next({
			name: "Dashboard"
		});
	} else {
		next();
	}
});

export default router;
