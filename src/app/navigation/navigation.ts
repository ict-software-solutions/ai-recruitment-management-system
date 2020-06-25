import { FuseNavigation } from '@fuse/types';
export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        icon: 'apps',
        children: [
            {
                id: 'dashboards',
                title: 'Dashboards',
                translate: 'NAV.DASHBOARDS',
                type: 'collapsable',
                icon: 'dashboard',
                url: '/apps/dashboards/analytics'

            },

            {
                id: 'calendar',
                title: 'Calendar',
                translate: 'NAV.CALENDAR',
                type: 'item',
                icon: 'today',
                url: '/apps/calendar'
            },
                //   {
                //         id        : 'orders',
                //         title     : 'User Management',
                //         icon: 'account_circle',
                //         type      : 'item',
                //         url       : '/apps/e-commerce/orders',
                //         exactMatch: true
                //     },
                    {
                        id        : 'products',
                        title     : 'User Management',
                        icon: 'account_circle',
                        type      : 'item',
                        url       : '/apps/e-commerce/products',
                        exactMatch: true
                    },
                    {
                        id        : 'products',
                        title     : 'Role Management',
                        icon: 'account_circle',
                        type      : 'item',
                        url       : '/apps/contacts',
                        exactMatch: true
                    },
                    // {
                    //     id       : 'scrumboard',
                    //     title    : 'Mapping',
                    //     // translate: 'NAV.SCRUMBOARD',
                    //     type     : 'item',
                    //     icon     : 'check_circle_outline',
                    //     url      : '/apps/scrumboard'
                    // }
                    // {
                    //     id        : 'products',
                    //     title     : 'profile',
                    //     icon: 'account_circle',
                    //     type      : 'item',
                    //     url       : '/apps/profile/forms',
                    //     exactMatch: true
                    // },
                    //   {
                    //     id   : 'forms',
                    //     title: 'profile',
                    //     type : 'item',
                    //     icon : 'add',
                    //     url  : '/apps/profile/forms'
                    // },
            //   {
            //             id        : 'orderDetail',
            //             title     : 'Order Detail',
            //             type      : 'item',
            //             url       : '/apps/e-commerce/orders/1',
            //             exactMatch: true
            //         },
                    // {
                    //     id   : 'forms',
                    //     title: 'ui',
                    //     type : 'item',
                    //     icon : 'add',
                    //     url  : '/ui/forms'
                    // },
        ]
    },
    {
        id: 'pages',
        title: '',
        type: 'group',
        icon: 'pages',
        children: [

        ]
    },
   {
        id: 'user-interface',
        title: '',
        type: 'group',
        icon: 'web',
        children: [
        ]
    },
]

