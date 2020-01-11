const ApplicationCreate = () => import('../../../pages/applications/Create.vue');

export default {
    name: 'administration.applications.create',
    path: 'create',
    component: ApplicationCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create Application',
    },
};
