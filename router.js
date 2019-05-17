import HomeComponent from './home.js';
import SeedComponent from './seed.js';
import AdminComponent from './admin.js';
import TypeTagComponent from './typetag.js';


const routes = [
	{ path: '/home', name: 'home', component: HomeComponent },
	{ path: '/seed', name: 'seed', component: SeedComponent },
	{ path: '/admin', name: 'admin', component: AdminComponent },
	{ path: '/typetag', name: 'typetag', component: TypeTagComponent }	
];

const router = new VueRouter({
	routes
});

export { routes, router };
