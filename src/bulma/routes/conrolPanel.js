const Index = () => import('../pages/controlPanel/Index.vue');

export default {
    name: 'administration.applications.index',
    path: '/applications',
    component: Index,
    meta: {
        breadcrumb: 'Applications',
        title: 'Applications',
    },
};
