<template>
    <div class="box indicator raises-on-hover">
        <div class="level">
            <div class="level-item">
                <label class="label">
                    {{ label }}: {{ formattedValue }}
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import { numberFormat } from '@enso-ui/mixins';

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

    computed: {
        formattedValue() {
            return numberFormat(this.value, 0);
        },
    },
};
</script>

<style lang="scss">
    .box.indicator {
        padding: 0.62em;
    }
</style>
