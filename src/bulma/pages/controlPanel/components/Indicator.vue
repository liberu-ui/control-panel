<template>
    <div class="box indicator raises-on-hover">
        <div class="level">
            <div class="level-item">
                <label class="label">
                    {{ label }}: {{ value | numberFormat(0) }}
                </label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Indicator',

    props: {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: [String, Number],
            required: true,
        },
    },
};
</script>

<style lang="scss">
    .box.indicator {
        padding: 0.62em;
    }
</style>
