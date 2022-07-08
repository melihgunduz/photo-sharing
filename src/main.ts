import {createApp} from 'vue'
import App from './App.vue'
import router from './router';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


import {IonicVue} from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

const firebaseConfig = {
    apiKey: "AIzaSyA6BY69hCJrSiz_Ubt7ITwobK6SX7teD4A",
    authDomain: "ionic-vue3-49a66.firebaseapp.com",
    projectId: "ionic-vue3-49a66",
    storageBucket: "ionic-vue3-49a66.appspot.com",
    messagingSenderId: "333648828551",
    appId: "1:333648828551:web:27440b75665766d3b10022"
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const st = firebase.storage();

let app: any;

auth.onAuthStateChanged(async kullanici => {
    if (!app) {
        app = createApp(App)
            .use(IonicVue)
            .use(router);

        router.isReady().then(() => {
            app.mount('#app');
        });
    }
})
