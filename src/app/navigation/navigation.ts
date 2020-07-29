import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: '',
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
            }, {
                id        : 'products',
                title     : 'User Management',
                icon      : 'people',
                type      : 'item',
                url       : '/apps/e-commerce/products',
                exactMatch: true
            }, {
                id        : 'product',
                title     : 'Role Management',
                icon      : 'account_circle',
                type      : 'item',
                url       : '/apps/contacts',
                exactMatch: true
            },
                    // {
                    //     id        : 'products',
                    //     title     : 'User Management',
                    //     icon      : 'people',
                    //     type      : 'item',
                    //     url       : '/apps/e-commerce/products',
                    //     exactMatch: true
                    // },
                    // {
                    //     id        : 'product',
                    //     title     : 'Role Management',
                    //     icon      : 'account_circle',
                    //     type      : 'item',
                    //     url       : '/apps/contacts',
                    //     exactMatch: true
                    // },
                    // {
                    //     id        : 'configuration',
                    //     title     : 'System Activties',
                    //     icon      : 'account_circle',
                    //     type      : 'item',
                    //     url       : '/apps/configuration',
                    //     exactMatch: true
                    // },
                     {
                id       : 'chat',
                title    : 'System Activities',
                // translate: 'NAV.CHAT',
                type     : 'item',
                icon     : 'desktop_mac',
                url      : '/apps/chat',
              
            },
        ]
    }
   
]

