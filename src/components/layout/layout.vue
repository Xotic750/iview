<template>
    <div :class="wrapClasses"><slot/></div>
</template>
<script>
const prefixCls = 'ivu-layout';

export default {
    name: 'Layout',
    data() {
        return {
            hasSider: false,
        };
    },
    computed: {
        wrapClasses() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-has-sider`]: this.hasSider,
                },
            ];
        },
    },
    methods: {
        findSider() {
            return this.$children.some(child => child.$options.name === 'Sider');
        },
    },
    mounted() {
        this.hasSider = this.findSider();
    },
};
</script>
