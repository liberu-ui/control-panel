const DashboardIndex = () => import('../pages/controlPanel/Index.vue');

export default {
    name: 'dashboard.index',
    path: '/dashboard',
    component: DashboardIndex,
    meta: {
        breadcrumb: 'dashboard',
        title: 'Dashboard',
    },
};
