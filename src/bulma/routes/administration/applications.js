import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./applications', false, /.*\.js$/));
const RouterView = () => import('@core/bulma/pages/Router.vue');

export default {
    path: 'applications',
    component: RouterView,
    meta: {
        breadcrumb: 'applications',
        route: 'administration.applications.index',
    },
    children: routes,
};
