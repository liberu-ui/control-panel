<template>
    <div class="stats-wrapper pt-2 mt-3">
        <divider class="is-bold"
            :title="i18n(group.label)"
            placement="left"/>
        <div class="columns is-multiline has-margin-top-medium pl-3">
            <stat class="column is-4 p-2 has-text-centered"
                v-for="stat in orderedSensors"
                :key="stat.id"
                :stat="stat"/>
        </div>
    </div>
</template>

<script>
import Divider from '@enso-ui/divider';
import Stat from './Stat.vue';

export default {
    name: 'Stats',

    inject: ['i18n'],

    components: { Stat, Divider },

    props: {
        group: {
            type: Object,
            required: true,
        },
    },

    computed: {
        orderedSensors() {
            return [...this.group.sensors]
                .sort((first, second) => first.order - second.order);
        },
    },
};
</script>

<style lang="scss">
    .stats-wrapper {
        .is-divider[data-title]::after {
            background: white;
            font-family: Arial, Helvetica, sans-serif;
        }
    }
</style>
