
import React from 'react';
import { AdminModuleProps, DashboardProps } from './types';
import { LoginView } from './sections/login-view';
import { DashboardShell } from './sections/dashboard-shell';

export const AdminModule = (props: AdminModuleProps) => {
    // AUTH GUARD: If no session, show Login
    if (!props.session) {
        return <LoginView />;
    }

    // AUTH SUCCESS: Show Dashboard
    return <DashboardShell {...(props as DashboardProps)} />;
};
