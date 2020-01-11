const ApplicationEdit = () => import('../../../pages/applications/Edit.vue');

export default {
    name: 'administration.applications.edit',
    path: ':application/edit',
    component: ApplicationEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Application',
    },
};
