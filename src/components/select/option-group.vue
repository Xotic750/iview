<template>
    <li
        v-show="!hidden"
        :class="[prefixCls + '-wrap']"
    >
        <div :class="[prefixCls + '-title']">{{ label }}</div>
        <ul>
            <li
                :class="[prefixCls]"
                ref="options"
            >
                <slot/>
            </li>
        </ul>
    </li>
</template>

<script>
const prefixCls = 'ivu-select-group';

export default {
    name: 'OptionGroup',

    props: {
        label: {
            default: '',
            type: String,
        },
    },

    data(){
        return {
            prefixCls,
            hidden: false, // for search
        };
    },

    methods: {
        queryChange(){
            this.$nextTick(() => {
                const options = this.$refs.options.querySelectorAll('.ivu-select-item');
                const hasVisibleOption = options.find(option => option.style.display !== 'none');

                this.hidden = !hasVisibleOption;
            });
        },
    },

    mounted(){
        this.$on('on-query-change', () => {
            this.queryChange();

            return true;
        });
    },
};
</script>
