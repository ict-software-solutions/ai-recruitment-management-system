import { Injectable } from '@angular/core';
import { FuseNavigation } from '@fuse/types';

import { FuseSidebarComponent } from './sidebar.component';

@Injectable({
    providedIn: 'root'
})
    
export class FuseSidebarService
{

    navigation: FuseNavigation[] = [
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
                    id: 'products',
                    title: 'User Management',
                    icon: 'people',
                    type: 'item',
                    url: '/apps/e-commerce/products',
                    exactMatch: true
                }, {
                    id: 'product',
                    title: 'Role Management',
                    icon: 'account_circle',
                    type: 'item',
                    url: '/apps/contacts',
                    exactMatch: true
                },
                {
                    id: 'chat',
                    title: 'System Activities',
                    // translate: 'NAV.CHAT',
                    type: 'item',
                    icon: 'desktop_mac',
                    url: '/apps/chat',

                },
            ]
        }

    ]

    
    // Private
    private _registry: { [key: string]: FuseSidebarComponent } = {};

    /**
     * Constructor
     */
    constructor()
    {

    }

    /**
     * Add the sidebar to the registry
     *
     * @param key
     * @param sidebar
     */
    register(key, sidebar): void
    {
        // Check if the key already being used
        if ( this._registry[key] )
        {
            console.error(`The sidebar with the key '${key}' already exists. Either unregister it first or use a unique key.`);

            return;
        }

        // Add to the registry
        this._registry[key] = sidebar;
    }

    /**
     * Remove the sidebar from the registry
     *
     * @param key
     */
    unregister(key): void
    {
        // Check if the sidebar exists
        if ( !this._registry[key] )
        {
            console.warn(`The sidebar with the key '${key}' doesn't exist in the registry.`);
        }

        // Unregister the sidebar
        delete this._registry[key];
    }

    /**
     * Return the sidebar with the given key
     *
     * @param key
     * @returns {FuseSidebarComponent}
     */
    getSidebar(key): FuseSidebarComponent
    {
        // Check if the sidebar exists
        if ( !this._registry[key] )
        {
            console.warn(`The sidebar with the key '${key}' doesn't exist in the registry.`);

            return;
        }

        // Return the sidebar
        return this._registry[key];
    }
}
