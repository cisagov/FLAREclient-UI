/* eslint-disable react/no-array-index-key */
import React, {
    lazy,
    Suspense,
    Fragment
} from 'react';
import {
    Switch,
    Redirect,
    Route
} from 'react-router-dom';
import AppLayout from '../layouts/App';
import LoadingScreen from '../components/LoadingScreen';
import AuthRedirect from "./AuthRedirect";
import GuestRedirect from "./GuestRedirect";


const _app_management_routes = [
    {
        exact: true,
        path: '/app/management/servers',
        component: lazy(() => import('../pages/ServerManagement'))
    },
    {
        exact: true,
        path: '/app/management/servers/add',
        component: lazy(() => import('../pages/ServerManagement/EditServer'))
    },
    {
        exact: true,
        path: '/app/management/servers/:serverLabel',
        component: lazy(() => import('../pages/ServerManagement/ServerDetails'))
    },
    {
        exact: true,
        path: '/app/management/servers/:serverLabel/edit',
        component: lazy(() => import('../pages/ServerManagement/EditServer'))
    },
    {
        exact: true,
        path: '/app/servers/:serverLabel/collections/:collectionId/:tabName',
        component: lazy(() => import('../pages/CollectionManagement'))
    },
    {
        exact: true,
        path: '/app/servers/:serverLabel/collections/:collectionId/content/:contentId',
        component: lazy(() => import('../pages/CollectionManagement/Detail'))
    },
    {
        exact: true,
        path: '/app/management/users',
        component: lazy(() => import('../pages/UserManagement'))
    },
    {
        exact: true,
        path: '/app/management/users/add',
        component: lazy(() => import('../pages/UserManagement/EditUser'))
    },
    {
        exact: true,
        path: '/app/management/users/edit',
        component: lazy(() => import('../pages/UserManagement/EditUser'))
    },
    {
        exact: true,
        path: '/app/management/logs',
        component: lazy(() => import('../pages/Logs'))
    },
    {
        exact: true,
        path: '/app/management/audits',
        component: lazy(() => import('../pages/Audit'))
    },
]

const _app_report_routes = [
    {
        exact: true,
        path: '/app/reports/dashboard',
        component: lazy(() => import('../pages/Dashboard'))
    },
    {
        exact: true,
        path: '/app/reports/events',
        component: lazy(() => import('../pages/Events'))
    },
    {
        exact: true,
        path: '/app/reports/status',
        component: lazy(() => import('../pages/Status'))
    },
    {
        exact: true,
        path: '/app/reports/status/:statusId',
        component: lazy(() => import('../pages/Status/Status'))
    },
]

const _application_routes = {
    path: '/app',
    redirect_element: AuthRedirect,
    layout: AppLayout,
    routes: [
        {
            exact: true,
            path: '/app',
            component: () => <Redirect to="/app/reports/dashboard" />
        },
        ..._app_report_routes,
        ..._app_management_routes,
        {
            component: () => <Redirect to="/404" />
        }
    ]
}


/***
 * Just like firewalls, this should ALWAYS be at the end of the list, redirect to a 404 if no matches can be made
 * @type {{path: string, routes: [{component: function(): *}]}}
 */
const catch_all =   {
    path: '*',
    routes: [
        {
            component: () => <Redirect to="/404" />
        }
    ]
}


const routesConfig = [
    {
        exact: true,
        path: '/',
        component: () => <Redirect to="/app" />
    },
    {
        exact: true,
        path: '/404',
        component: lazy(() => import('../pages/404.js'))
    },
    {
        exact: true,
        path: '/login',
        redirect_element: GuestRedirect,
        component: lazy(() => import('../pages/Login'))
    },
    {
        exact: true,
        path: '/login-unprotected',
        component: lazy(() => import('../pages/Login'))
    },
    {..._application_routes},
    {...catch_all}

];

const renderRoutes = (routes) => (routes ? (
    <Suspense fallback={<LoadingScreen />}>
        <Switch>
            {routes.map((route, i) => {
                const Layout = route.layout || Fragment;
                const Component = route.component;
                const Redirect = route.redirect_element || Fragment;

                return (
                    <Route
                        key={i}
                        path={route.path}
                        exact={route.exact}
                        render={(props) => (
                            <Redirect>
                                <Layout>
                                    {route.routes
                                        ? renderRoutes(route.routes)
                                        : <Component {...props} />}
                                </Layout>
                            </Redirect>
                        )}
                    />
                );
            })}
        </Switch>
    </Suspense>
) : null);

function Routes() {
    return renderRoutes(routesConfig);
}

export default Routes;
