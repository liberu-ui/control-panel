<template>
    <div class="wrapper">
        <top :summary="summary"
            @update="dateInterval = $event"
            @refresh="refresh"/>
        <div class="columns is-multiline">
            <div class="column is-one-third is-half-tablet"
                v-for="app in apps"
                :key="app.id">
                <application class="raises-on-hover"
                    :app="app"
                    :date-interval="dateInterval"
                    @loaded="updateStats"
                    ref="apps"/>
            </div>
        </div>
    </div>
</template>

<script>
import Top from './components/Top.vue';
import Application from './components/Application.vue';

export default {
    name: 'Index',

    components: { Top, Application },

    inject: ['http', 'route'],

    data: () => ({
        apps: [],
        dateInterval: {
            min: null,
            max: null,
        },
        summary: {
            logins: 0,
            requests: 0,
            newUsers: 0,
            sessions: 0,
        },
    }),

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            this.http.get(this.route('administration.applications.index'))
                .then(({ data }) => (this.apps = data))
                .catch(error => this.handleError(error));
        },
        refresh() {
            this.$refs.apps.forEach(app => app.refresh());
        },
        updateStats() {
            Object.keys(this.summary)
                .forEach(key => (this.summary[key] = this.sum(key)));
        },
        sum(key) {
            return this.$refs.apps
                .reduce((sum, app) => (sum + app.$data.summary[key]), 0);
        },
    },
};
</script>
