<template>
    <div class="columns is-multiline line">
        <div class="line-group">
            {{ i18n(group.label) }}
        </div>
        <stat v-for="stat in order(group.statistics)"
            :stat="stat"
            :key="stat.id"/>
    </div>
</template>

<script>
import Stat from './Stat.vue';

export default {
    name: 'Stats',

    inject: ['i18n'],

    components: { Stat },

    props: {
        group: {
            type: Object,
            required: true,
        },
    },
    methods: {
        order(items) {
            return [...items].sort((i1, i2) => i1.order - i2.order);
        },
    },
};
</script>

<style lang="scss">
    .line {
        position: relative;
        font-weight: bold;
        text-align: left;
        margin-left: 0;
        margin-right: 0;
        padding-left: 15px;
    }

    .line {
        border-top: 1px solid #dbdbdb;
    }

    .line-group {
        position: absolute;
        top: -11px;
        left: 5px;
        background: white;
        padding-left:5px;
        padding-right:5px;
    }
</style>
