import HomeComponent from './home.js';
import SeedComponent from './seed.js';
import AdminComponent from './admin.js';
import TypeTagComponent from './typetag.js';
import {routes, router} from './router.js';
import store from './store.js';
import TypeTagFilter from './TypeTagFilter.js';

new Vue({
    router,
    store,
    el: '#root',

    created: function(){




        /*


        this.allTypeTableData = {
            tableHeaders: [],
            tableRows: []
        };
        */

    },

    components: {
        //local components
        //home	
        HomeComponent: HomeComponent
        ,
        SeedComponent: SeedComponent
        ,
        AdminComponent: AdminComponent
        ,
        TypeTagComponent: TypeTagComponent
    }
});
