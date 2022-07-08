import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext} from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import {auth} from '../main';


const guard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
        if (auth.currentUser) {
            next()
        } else {
            next("/")
        }
    } catch (e) {
        next("/")
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/views/AuthPage.vue'),
    },
    {
        path: '/tabs/',
        component: TabsPage,
        children: [
            {
                path: '',
                redirect: '/tabs/tab1'
            },
            {
                path: 'tab1',
                component: () => import('@/views/Tab1Page.vue'),
                beforeEnter: guard
            },
            {
                path: 'tab2',
                component: () => import('@/views/Tab2Page.vue'),
                beforeEnter: guard
            },
            {
                path: 'tab3',
                component: () => import('@/views/Tab3Page.vue'),
                beforeEnter: guard
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
