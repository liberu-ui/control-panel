const ApplicationIndex = () => import('../../../pages/applications/Index.vue');

export default {
    name: 'administration.applications.index',
    path: '',
    component: ApplicationIndex,
    meta: {
        breadcrumb: 'index',
        title: 'Applications',
    },
};
