<template>
    <div>
        <div class="columns">
            <div class="column is-offset-one-third is-one-third">
                <date-filter class="box raises-on-hover"
                    compact
                    @update="dates = $event"/>
            </div>
        </div>
        <div class="columns is-multiline is-mobile">
            <div v-for="(application, index) in applications"
                :key="index"
                class="
                    column is-one-third-fullhd is-one-quarter-widescreen
                    is-one-third-tablet is-half-mobile
                ">
                <application ref="apps"
                    class="raises-on-hover"
                    :application="application"
                    :dates="dates"
                    @loaded="updateStats"/>
            </div>
        </div>
    </div>
</template>

<script>

import { DateFilter } from '@enso-ui/filters/bulma';
import Application from './components/Application.vue';

export default {
    components: { Application, DateFilter },

    inject: ['route', 'i18n'],

    data() {
        return {
            applications: [],
            dates: {
                min: new Date(),
                max: null,
            },
            general: {
                logins: 0,
                actions: 0,
                users: 0,
                sessions: 0,
            },
        };
    },

    created() {
        this.dates.max = new Date(this.dates.min.getTime() + (24 * 60 * 60 * 1000));

        this.fetch();
    },

    methods: {
        fetch() {
            axios.get(this.route('administration.applications.index'))
                .then(({ data }) => (this.applications = data))
                .catch(error => this.handleError(error));
        },
        refresh() {
            this.$refs.apps.forEach(app => app.fetch());
        },
        updateStats() {
            Object.keys(this.general)
                .forEach((key) => {
                    this.general[key] = this.sum(key);
                });
        },

        sum(attr) {
            return this.$refs.apps
                .reduce((sum, app) => (sum + parseInt(`0${app.$data.statistics[attr]}`, 10)), 0);
        },

        format(value) {
            value = value.toString();
            const rgx = /(\d+)(\d{3})/;

            while (rgx.test(value)) {
                value = value.replace(rgx, '$1,$2');
            }

            return value;
        },
    },
};

</script>
