<template>
    <div class="columns is-multiline line">
        <div v-if="label"
            class="line-label">
            {{ i18n(label) }}
        </div>
        <slot/>
    </div>
</template>

<script>
export default {
    name: 'Stats',

    inject: ['i18n'],

    props: {
        label: {
            type: String,
            default: null,
        },
    },
};

</script>
<style scoped>
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

    .line-label {
        position: absolute;
        top: -11px;
        left: 5px;
        background: white;
        padding-left:5px;
        padding-right:5px;
    }
</style>
