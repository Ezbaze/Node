<template>
    <div class="field-option">
        <div :class="['dark-select', { '--open': open }]" @click="open = !open">
            <div class="__selected field-type">
                <div class="__text">{{ selectedText }}</div>
                <div class="__icon">
                    <i-arrow></i-arrow>
                </div>
            </div>
            <transition name="slide-fade">
                <div class="__dropdown" v-show="open">
                    <div class="item --header">{{ name }}</div>
                    <div
                        v-for="(item, i) in items"
                        :key="i"
                        :class="['item', { '--active': isSelected(item) }]"
                        @click="setSelected(item)"
                    >
                        {{ isAdvancedMode ? item.text : item }}
                    </div>
                </div>
            </transition>
        </div>
        <input type="text" class="dark-input field-input" placeholder="Name..." />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { NodeOption, NodeInterface } from "@baklavajs/core";
// @ts-ignore

import vClickOutside from "v-click-outside";

interface IAdvancedItem {
    text: string;
    value: any;
}
type ItemType = string | IAdvancedItem;

@Component({
    components: {
        "i-arrow": Arrow
    },
    directives: {
        // TODO: Fix clickoutside issue
        //ClickOutside: vClickOutside.directive
    }
})
export default class FieldOption extends Vue {
    open = false;
    items = [];
    @Prop({ type: String })
    name!: string;
    @Prop()
    value!: any;
    @Prop({ type: Object })
    option!: NodeOption | NodeInterface;
    get isAdvancedMode() {
        return !this.items.every(i => typeof i === "string");
    }
    get selectedText() {
        if (this.value) {
            return this.isAdvancedMode ? this.getItemByValue(this.value)?.text ?? "" : this.value;
        } else {
            return "";
        }
    }
    mounted() {
        // computed property won't work here due to missing reactivity
        this.items = this.option.items || [];
        this.option.events.updated.addListener(this, () => {
            this.items = this.option.items || [];
        });
    }
    beforeDestroy() {
        this.option.events.updated.removeListener(this);
    }
    isSelected(item: ItemType) {
        if (this.isAdvancedMode) {
            return (item as IAdvancedItem).value === this.value;
        } else {
            return item === this.value;
        }
    }
    setSelected(item: ItemType) {
        this.$emit("input", this.isAdvancedMode ? (item as IAdvancedItem).value : (item as string));
    }
    getItemByValue(value: any) {
        return (this.items as IAdvancedItem[]).find(i => i.value === value);
    }
}
</script>

<style scoped>
.field-option {
    border: 1px solid #666;
    border-radius: 4px;
    font-family: "Courier New", Courier, monospace;
    font-size: 12px;
}
.field-type {
    color: rgb(203, 178, 2);
}
.field-input {
    background-color: #1c1e24;
}
</style>