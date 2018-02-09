<template>
    <div
        :class="classes"
        v-clickoutside="handleClose"
        @keydown.esc="onEscape"
        @keydown.down="onDown"
        @keydown.up="onUp"
        @keydown.enter="onEnter"
    >
        <div
            :class="selectionCls"
            :tabindex="filterable ? -1 : 0"
            ref="reference"
            @click="toggleMenu"
            @keydown.up="keydownUpDown"
            @keydown.down="keydownUpDown"
            @keydown.tab="keydownTab"
            @blur="setFocused(false)"
            @focus="setFocused(true)"
        >
            <slot name="input">
                <input
                    type="hidden"
                    :name="name"
                    :value="model"
                >
                <div
                    class="ivu-tag ivu-tag-checked"
                    v-for="(item, index) in selectedMultiple"
                    :key="JSON.stringify(item)"
                >
                    <span class="ivu-tag-text">{{ item.label }}</span>
                    <Icon
                        type="ios-close-empty"
                        @click.native.stop="removeTag(index)"
                    />
                </div>
                <span
                    v-show="showPlaceholder && !filterable"
                    :class="[prefixCls + '-placeholder']"
                >
                    {{ localePlaceholder }}
                </span>
                <span
                    v-show="!showPlaceholder && !multiple && !filterable"
                    :class="[prefixCls + '-selected-value']"
                >
                    {{ selectedSingle }}
                </span>
                <input
                    v-if="filterable"
                    ref="input"
                    type="text"
                    v-model="query"
                    autocomplete="off"
                    spellcheck="false"
                    :id="elementId"
                    :disabled="disabled"
                    :class="[prefixCls + '-input']"
                    :placeholder="showPlaceholder ? localePlaceholder : ''"
                    :style="inputStyle"
                    @blur="handleBlur"
                    @focus="onFocus"
                    @keydown="resetInputState"
                    @keydown.delete="handleInputDelete"
                >
                <Icon
                    v-show="showCloseIcon"
                    type="ios-close"
                    :class="[prefixCls + '-arrow']"
                    @click.native.stop="clearSingleSelect"
                />
                <Icon
                    v-if="!remote"
                    type="arrow-down-b"
                    :class="[prefixCls + '-arrow']"
                />
            </slot>
        </div>
        <transition :name="transitionName">
            <Drop
                v-show="dropVisible"
                ref="dropdown"
                :class="dropdownCls"
                :placement="placement"
                :data-transfer="transfer"
                v-transfer-dom
            >
                <ul
                    v-show="notFoundShow"
                    :class="[prefixCls + '-not-found']"
                >
                    <li>{{ localeNotFoundText }}</li>
                </ul>
                <ul
                    v-show="(!notFound && !remote) || (remote && !loading && !notFound)"
                    :class="[prefixCls + '-dropdown-list']"
                >
                    <slot/>
                </ul>
                <ul
                    v-show="loading"
                    :class="[prefixCls + '-loading']"
                >
                    {{ localeLoadingText }}
                </ul>
            </Drop>
        </transition>
    </div>
</template>

<script>
import Icon from '../icon';
import Drop from './dropdown.vue';
import clickoutside from '../../directives/clickoutside';
import TransferDom from '../../directives/transfer-dom';
import {oneOf, findComponentDownward} from '../../utils/assist';
import Emitter from '../../mixins/emitter';
import Locale from '../../mixins/locale';
import {debounce} from './utils';

const prefixCls = 'ivu-select';
const noop = () => {};

export default {
    name: 'iSelect',

    mixins: [Emitter, Locale],

    components: {Icon, Drop},

    directives: {clickoutside, TransferDom},

    props: {
        value: {
            default: '',
            type: [String, Number, Array],
        },
        // 使用时，也得设置 value 才行
        label: {
            default: '',
            type: [String, Number, Array],
        },
        multiple: {
            default: false,
            type: Boolean,
        },
        disabled: {
            default: false,
            type: Boolean,

        },
        clearable: {
            default: false,
            type: Boolean,
        },
        placeholder: {
            default: '',
            type: String,
        },
        filterable: {
            default: false,
            type: Boolean,
        },
        filterMethod: {
            default: noop,
            type: Function,
        },
        remote: {
            default: false,
            type: Boolean,
        },
        remoteMethod: {
            default: noop,
            type: Function,
        },
        loading: {
            default: false,
            type: Boolean,
        },
        loadingText: {
            default: '',
            type: String,
        },
        size: {
            default: 'default',
            type: String,
            validator(value){
                return oneOf(value, ['small', 'large', 'default']);
            },
        },
        labelInValue: {
            default: false,
            type: Boolean,
        },
        notFoundText: {
            defalt: '',
            type: String,
        },
        placement: {
            default: 'bottom',
            type: String,
            validator(value){
                return oneOf(value, ['top', 'bottom']);
            },
        },
        transfer: {
            default: false,
            type: Boolean,
        },
        // Use for AutoComplete
        autoComplete: {
            default: false,
            type: Boolean,
        },
        name: {
            default: '',
            type: String,
        },
        elementId: {
            default: '',
            type: String,
        },
    },

    data(){
        return {
            prefixCls,
            visible: false,
            focused: false,
            options: [],
            optionInstances: [],
            selectedSingle: '', // label
            selectedMultiple: [],
            focusIndex: 0,
            query: '',
            lastQuery: '',
            selectToChangeQuery: false, // when select an option, set this first and set query, because query is watching, it will emit event
            inputLength: 20,
            notFound: false,
            slotChangeDuration: false, // if slot change duration and in multiple, set true and after slot change, set false
            model: this.value,
            currentLabel: this.label,
        };
    },

    computed: {
        classes(){
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-visible`]: this.visible,
                    [`${prefixCls}-focused`]: !this.visible && this.focused,
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-multiple`]: this.multiple,
                    [`${prefixCls}-single`]: !this.multiple,
                    [`${prefixCls}-show-clear`]: this.showCloseIcon,
                    [`${prefixCls}-${this.size}`]: !!this.size,
                },
            ];
        },

        dropdownCls(){
            return {
                [`${prefixCls}-dropdown-transfer`]: this.transfer,
                [`${prefixCls}-multiple`]: this.multiple && this.transfer,
                'ivu-auto-complete': this.autoComplete,
            };
        },

        selectionCls(){
            return {
                [`${prefixCls}-selection`]: !this.autoComplete,
            };
        },

        showPlaceholder(){
            if (typeof this.model === 'string') {
                return this.model === '';
            }

            if (Array.isArray(this.model)) {
                return !this.model.length;
            }

            return this.model === null;
        },

        showCloseIcon(){
            return !this.multiple && this.clearable && !this.showPlaceholder;
        },

        inputStyle(){
            const style = {};

            if (this.multiple) {
                style.width = this.showPlaceholder ? '100%' : `${this.inputLength}px`;
            }

            return style;
        },

        localePlaceholder(){
            return this.placeholder === undefined ? this.t('i.select.placeholder') : this.placeholder;
        },

        localeNotFoundText(){
            return this.notFoundText === undefined ? this.t('i.select.noMatch') : this.notFoundText;
        },

        localeLoadingText(){
            return this.loadingText === undefined ? this.t('i.select.loading') : this.loadingText;
        },

        transitionName(){
            return this.placement === 'bottom' ? 'slide-up' : 'slide-down';
        },

        getOptions(){
            return this.$slots.default || [];
        },

        dropVisible(){
            if (!this.visible) {
                return false;
            }

            if (this.getOptions.length || !this.autoComplete) {
                return true;
            }

            return this.loading && !this.remote && this.query !== '';
        },

        notFoundShow(){
            return this.remote ? !this.loading && !this.getOptions.length : this.notFound;
        },
    },

    methods: {
        setFocused(value) {
            if (!this.filterable) {
                this.focused = !!value;
            }
        },

        onFocus(){
            this.visible = true;
        },

        keydownUpDown(){
            return this.visible ? false : this.toggleMenu();
        },

        keydownTab(event){
            if (this.visible) {
                event.preventDefault();
            }
        },

        toggleMenu(){
            if (this.disabled || this.autoComplete) {
                return false;
            }

            this.visible = !this.visible;
        },

        hideMenu(){
            this.visible = false;
            this.focusIndex = 0;
            this.broadcast('iOption', 'on-select-close');
        },

        // find option component
        findChild(cb){
            const find = (child) => {
                if (child.$options.componentName) {
                    cb(child);
                } else if (child.$children.length) {
                    child.$children.forEach(find);
                }
            };

            const instances = this.optionInstances.length ? this.optionInstances : this.$children;
            instances.forEach(find);
        },

        updateOptions(slot = false){
            console.log('updateOptions');
            const options = [];
            let index = 1;

            this.findChild((child) => {
                options.push({
                    value: child.value,
                    label: child.label === undefined ? child.$el.textContent : child.label,
                });

                child.index = index;
                index += 1;

                this.optionInstances.push(child);
            });

            this.options = options;

            if (!this.remote) {
                this.updateSingleSelected(true, slot);
                this.updateMultipleSelected(true, slot);
            }
        },

        updateSingleSelected(init = false, slot = false){
            console.log('updateSingleSelected');
            const {
                model,
            } = this;

            if (typeof model === 'string' || typeof model === 'number') {
                const findModel = this.options.find(option => (option.value === model));
                if (findModel) {
                    this.selectedSingle = findModel.label;
                } else if (slot) {
                    this.model = '';
                    this.query = '';
                }
            }

            this.toggleSingleSelected(this.model, init);
        },

        clearSingleSelect(){
            if (this.showCloseIcon) {
                this.findChild((child) => {
                    child.selected = false;
                });

                this.model = '';

                if (this.filterable) {
                    this.query = '';
                }
            }
        },

        updateMultipleSelected(init = false, slot = false){
            if (this.multiple && Array.isArray(this.model)) {
                const selected = this.remote ? this.selectedMultiple : [];

                this.model.forEach((model) => {
                    this.options.forEach((option) => {
                        if (model === option.value) {
                            selected.push({
                                value: option.value,
                                label: option.label,
                            });
                        }
                    });
                });

                const selectedArray = [];
                const selectedObject = {};

                selected.forEach((item) => {
                    if (!selectedObject[item.value]) {
                        selectedArray.push(item);
                        selectedObject[item.value] = 1;
                    }
                });

                // #2066
                if (this.remote) {
                    this.selectedMultiple = this.model.length ? selectedArray : [];
                } else {
                    this.selectedMultiple = selected;
                }

                if (slot) {
                    const selectedModel = selected.map(select => select.value);

                    // if slot change and remove a selected option, emit user
                    if (this.model.length === selectedModel.length) {
                        this.slotChangeDuration = true;
                    }

                    this.model = selectedModel;
                }
            }
            this.toggleMultipleSelected(this.model, init);
        },

        removeTag(index){
            if (this.disabled) {
                return false;
            }

            if (this.remote) {
                const tag = this.model[index];

                this.selectedMultiple = this.selectedMultiple.filter(item => item.value !== tag);
            }

            this.model.splice(index, 1);

            if (this.filterable && this.visible) {
                this.$refs.input.focus();
            }

            this.broadcast('Drop', 'on-update-popper');
        },

        // to select option for single
        toggleSingleSelected(value, init = false){
            console.log('toggleSingleSelected');
            if (!this.multiple) {
                let label = '';

                this.findChild((child) => {
                    child.selected = child.value === value;
                    if (child.selected) {
                        label = child.label === undefined ? child.$el.innerHTML : child.label;
                    }
                });

                this.hideMenu();

                if (!init) {
                    const val = this.labelInValue ? {value, label} : value;

                    this.$emit('on-change', val);
                    this.dispatch('FormItem', 'on-form-change', val);
                }
            }
        },

        // to select option for multiple
        toggleMultipleSelected(value, init = false){
            if (this.multiple) {
                const hybridValue = value.map(val => ({
                    value: val,
                }));

                this.findChild((child) => {
                    const index = value.indexOf(child.value);

                    child.selected = index >= 0;
                    if (child.selected) {
                        hybridValue[index].label = child.label === undefined ? child.$el.innerHTML : child.label;
                    }
                });

                if (!init) {
                    const val = this.labelInValue ? hybridValue : value;

                    this.$emit('on-change', val);
                    this.dispatch('FormItem', 'on-form-change', val);
                }
            }
        },

        handleClose(){
            this.hideMenu();
        },

        onEscape(event){
            if (this.visible) {
                event.preventDefault();
                this.hideMenu();
            }
        },

        onDown(event){
            if (this.visible) {
                event.preventDefault();
                this.navigateOptions('next');
            }
        },

        onUp(event){
            if (this.visible) {
                event.preventDefault();
                this.navigateOptions('prev');
            }
        },

        onEnter(event){
            if (this.visible) {
                event.preventDefault();

                this.findChild((child) => {
                    if (child.isFocus) {
                        console.log('Select', child);
                        child.select();
                    }
                });
            }
        },

        navigateOptions(direction){
            if (direction === 'next') {
                this.focusIndex = this.focusIndex === this.options.length ? 1 : this.focusIndex + 1;
            } else if (direction === 'prev') {
                this.focusIndex = this.focusIndex <= 1 ? this.options.length : this.focusIndex - 1;
            }

            const childStatus = {
                disabled: false,
                hidden: false,
            };

            let findDeep = false; // can next find allowed

            this.findChild((child) => {
                if (child.index === this.focusIndex) {
                    childStatus.disabled = child.disabled;
                    childStatus.hidden = child.hidden;

                    if (!child.disabled && !child.hidden) {
                        child.isFocus = true;
                    }
                } else {
                    child.isFocus = false;
                }

                if (!child.hidden && !child.disabled) {
                    findDeep = true;
                }
            });

            this.resetScrollTop();

            if ((childStatus.disabled || childStatus.hidden) && findDeep) {
                this.navigateOptions(direction);
            }
        },

        resetScrollTop(){
            if (!this.optionInstances.length) {
                return;
            }

            const index = this.focusIndex - 1;
            const {
                bottom,
                top,
            } = this.optionInstances[index].$el.getBoundingClientRect();

            const {
                bottom: bottomEl,
                top: topEl,
            } = this.$refs.dropdown.$el.getBoundingClientRect();

            const bottomOverflowDistance = bottom - bottomEl;
            const topOverflowDistance = top - topEl;

            if (bottomOverflowDistance > 0) {
                this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance;
            }

            if (topOverflowDistance < 0) {
                this.$refs.dropdown.$el.scrollTop += topOverflowDistance;
            }
        },

        handleBlur(){
            this.visible = false;

            setTimeout(() => {
                if (this.autoComplete) {
                    return;
                }

                const {
                    model,
                } = this;

                if (this.multiple) {
                    this.query = '';
                } else if (model !== '') {
                    this.findChild((child) => {
                        if (child.value === model) {
                            this.query = child.label === undefined ? child.searchLabel : child.label;
                        }
                    });

                    // 如果删除了搜索词，下拉列表也清空了，所以强制调用一次remoteMethod
                    if (this.remote && this.query !== this.lastQuery) {
                        this.$nextTick(() => {
                            this.query = this.lastQuery;
                        });
                    }
                } else {
                    this.query = '';
                }
            }, 300);
        },

        resetInputState(){
            this.inputLength = this.$refs.input.value.length * 12 + 20;
        },

        handleInputDelete(){
            if (this.multiple && this.model.length && this.query === '') {
                this.removeTag(this.model.length - 1);
            }
        },

        // use when slot changed
        slotChange(){
            this.options = [];
            this.optionInstances = [];
        },

        setQuery(query){
            if (!this.filterable) {
                return;
            }

            this.query = query;
        },

        modelToQuery(){
            if (!this.multiple && this.filterable && this.model !== undefined) {
                this.findChild((child) => {
                    if (this.model === child.value) {
                        if (child.label) {
                            this.query = child.label;
                        } else if (child.searchLabel) {
                            this.query = child.searchLabel;
                        } else {
                            this.query = child.value;
                        }
                    }
                });
            }
        },

        broadcastQuery(val){
            if (findComponentDownward(this, 'OptionGroup')) {
                this.broadcast('OptionGroup', 'on-query-change', val);
            }

            this.broadcast('iOption', 'on-query-change', val);
        },

        debouncedAppendRemove(){
            return debounce(function(){
                if (!this.remote) {
                    this.modelToQuery();
                    this.$nextTick(() => this.broadcastQuery(''));
                } else {
                    this.findChild((child) => {
                        child.updateSearchLabel(); // #1865
                        child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
                    });
                }

                this.slotChange();
                this.updateOptions(true);
            });
        },

        // 处理 remote 初始值
        updateLabel(){
            if (this.remote) {
                if (!this.multiple && this.model !== '') {
                    this.selectToChangeQuery = true;
                    if (this.currentLabel === '') {
                        this.currentLabel = this.model;
                    }

                    this.lastQuery = this.currentLabel;
                    this.query = this.currentLabel;
                } else if (this.multiple && this.model.length) {
                    if (this.currentLabel.length !== this.model.length) {
                        this.currentLabel = this.model;
                    }

                    this.selectedMultiple = this.model.map((item, index) => ({
                        value: item,
                        label: this.currentLabel[index],
                    }));
                } else if (this.multiple && !this.model.length) {
                    this.selectedMultiple = [];
                }
            }
        },
    },

    mounted(){
        this.modelToQuery();
        // 处理 remote 初始值
        this.updateLabel();
        this.$nextTick(() => {
            this.broadcastQuery('');
        });

        this.updateOptions();

        this.$on('append', this.debouncedAppendRemove());
        this.$on('remove', this.debouncedAppendRemove());

        this.$on('on-select-selected', (value) => {
            console.log('on-select-selected');
            if (this.model === value) {
                if (this.autoComplete) {
                    this.$emit('on-change', value);
                }

                this.hideMenu();
            } else if (this.multiple) {
                const index = this.model.indexOf(value);
                if (index >= 0) {
                    this.removeTag(index);
                } else {
                    this.model.push(value);
                    this.broadcast('Drop', 'on-update-popper');
                }

                if (this.filterable) {
                    // remote&filterable&multiple时，一次点多项，不应该设置true，因为无法置为false，下次的搜索会失效
                    if (this.query !== '') {
                        this.selectToChangeQuery = true;
                    }

                    this.query = '';
                    this.$refs.input.focus();
                }
            } else {
                this.model = value;

                if (this.filterable) {
                    this.findChild((child) => {
                        if (child.value === value) {
                            if (this.query !== '') {
                                this.selectToChangeQuery = true;
                            }

                            this.query = child.label === undefined ? child.searchLabel : child.label;
                            this.lastQuery = this.query;
                        }
                    });
                }
            }
        });
    },

    watch: {
        value(val){
            this.model = val;
            // #982
            if (val === '' || val === null) {
                this.query = '';
            }
        },

        label(val){
            this.currentLabel = val;
            this.updateLabel();
        },

        model(){
            console.log('model');
            this.$emit('input', this.model);
            this.modelToQuery();
            if (this.multiple) {
                if (this.slotChangeDuration) {
                    this.slotChangeDuration = false;
                } else {
                    this.updateMultipleSelected();
                }
            } else {
                this.updateSingleSelected();
            }

            // #957
            if (!this.visible && this.filterable) {
                this.$nextTick(() => {
                    this.broadcastQuery('');
                });
            }
        },

        visible(val){
            console.log('visible');
            if (val) {
                if (this.filterable) {
                    if (this.multiple) {
                        this.$refs.input.focus();
                    } else if (!this.autoComplete) {
                        this.$refs.input.select();
                    }

                    if (this.remote) {
                        this.findChild((child) => {
                            child.selected = this.multiple ? this.model.includes(child.value) : this.model === child.value;
                        });

                        // remote下，设置了默认值，第一次打开时，搜索一次
                        if (this.query !== '') {
                            const options = this.$slots.default || [];
                            if (!options.length) {
                                this.remoteMethod(this.query);
                            }
                        }
                    }
                }

                this.broadcast('Drop', 'on-update-popper');
            } else {
                if (this.filterable) {
                    if (!this.autoComplete) {
                        this.$refs.input.blur();
                    }

                    // #566 reset options visible
                    setTimeout(() => {
                        this.broadcastQuery('');
                    }, 300);
                }

                this.broadcast('Drop', 'on-destroy-popper');
            }
        },

        query(val){
            console.log('query');
            if (this.remote && this.remoteMethod) {
                if (!this.selectToChangeQuery) {
                    this.$emit('on-query-change', val);
                    this.remoteMethod(val);
                }

                this.focusIndex = 0;
                console.log('Reset child.isFocus');
                this.findChild((child) => {
                    child.isFocus = false;
                });
            } else {
                if (!this.selectToChangeQuery) {
                    this.$emit('on-query-change', val);
                }

                this.broadcastQuery(val);

                let isHidden = true;

                this.$nextTick(() => {
                    this.findChild((child) => {
                        if (!child.hidden) {
                            isHidden = false;
                        }
                    });

                    this.notFound = isHidden;
                });
            }

            this.selectToChangeQuery = false;
            this.broadcast('Drop', 'on-update-popper');
        },
    },
};
</script>
