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

