import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./applications', false, /.*\.js$/));
const Router = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'applications',
    component: Router,
    meta: {
        breadcrumb: 'applications',
        route: 'administration.applications.index',
    },
    children: routes,
};
