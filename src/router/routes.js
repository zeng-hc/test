export const routes = [
    {
        path:'index',
        name:'index',
        redirect: '/Myhome',
        component: () => import('../views/index.vue'),
        children:[
            {
                path: '/Myhome',
                name: 'Myhome',
                component: () => import('../views/Myhome.vue')
            },
            {
                path: '/Menu',
                name: 'Menu',
                component: () => import('../views/Menu.vue'),
            },
            {
                path: '/Myshop',
                name: 'Myshop',
                component: () => import('../views/Myshop.vue')
            },
            {
                path: '/My',
                name: 'My',
                component: () => import('../views/My.vue')
            }
        ]
    },
    {
        path: '/Detail/:name',
        name: 'Detail',
        component: () => import('../views/Detail.vue')
    },
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/Settlement',
        name: 'Settlement',
        component: () => import('../views/Settlement.vue')
    },
    {
        path: '/Address',
        name: 'Address',
        component: () => import('../views/Address.vue')
    },
    {
        path: '/addAddress',
        name: 'addAddress',
        component: () => import('../views/addAddress.vue')
    },
    {
        path: '/MyCollection',
        name: 'MyCollection',
        component: () => import('../views/My_collection.vue')
    },
    {
        path: '/PersonalData',
        name: 'PersonalData',
        component: () => import('../views/Personal_data.vue')
    },
    {
        path: '/MyOrder',
        name: 'MyOrder',
        component: () => import('../views/My_order.vue')
    },
    {
        path: '/AccountSet',
        name: 'AccountSet',
        component: () => import('../views/AccountSet.vue')
    },
    {
        path: '/Search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    }
]