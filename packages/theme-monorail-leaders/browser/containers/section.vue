<template>
  <div :class="classes" :data-section-id="sectionId">
    <button class="leaders-section__toggle-button" @click="toggleExpanded">
      <chevron-plus-icon
        v-if="iconSet === 'chevron'"
        v-show="!isExpanded"
        :modifiers="iconModifiers"
      />
      <plus-icon v-else v-show="!isExpanded" :modifiers="iconModifiers" />
      <chevron-minus-icon
        v-if="iconSet === 'chevron'"
        v-show="isExpanded"
        :modifiers="iconModifiers"
      />
      <minus-icon v-else v-show="isExpanded" :modifiers="iconModifiers" />
      <span class="leaders-section__toggle-button-title">{{ title }}</span>
    </button>
    <div v-if="isExpanded" class="leaders-section__list">
      <loading
        v-if="!hasLoaded"
        :is-loading="isLoading"
        :error="error"
        :has-no-results="!items.length"
        loading-message="Loading content..."
        no-results-message="No content was found."
      />
      <list
        v-else
        :items="items"
        :identifier="sectionId"
        :open="open"
        :offset-top="offsetTop"
        :offset-bottom="offsetBottom"
        nav-direction="vertical"
        @link-action="emitAction"
        @mounted="emitCategoryItems"
      >
        <template #nav-link="{ item, isActive }">
          <link-contents
            :title="item.name"
            :is-active="isActive"
            :has-videos="item.videos.edges.length > 0"
          />
        </template>
        <template #dropdown="{ item, isActive }">
          <card
            :company="item"
            :is-active="isActive"
            :featured-product-label="featuredProductLabel"
            @action="emitAction"
          />
        </template>
      </list>
    </div>
  </div>
</template>

<script>
import PlusIcon from '../icons/add-circle-outline.vue';
import MinusIcon from '../icons/remove-circle-outline.vue';
import ChevronPlusIcon from '../icons/chevron-right.vue';
import ChevronMinusIcon from '../icons/chevron-down.vue';
import Loading from '../common/loading.vue';

import List from '../list/index.vue';
import Card from '../card/index.vue';
import LinkContents from '../list/nav/contents.vue';

import getEdgeNodes from '../utils/get-edge-nodes';

export default {
  components: {
    PlusIcon,
    MinusIcon,
    ChevronPlusIcon,
    ChevronMinusIcon,
    Loading,
    List,
    Card,
    LinkContents,
  },

  props: {
    sectionId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    open: {
      type: String,
      default: 'left',
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    contextual: {
      type: Boolean,
      default: false,
    },
    offsetTop: {
      type: Number,
      default: 0,
    },
    offsetBottom: {
      type: Number,
      default: 0,
    },
    promotionLimit: {
      type: Number,
      default: 4,
    },
    videoLimit: {
      type: Number,
      default: 3,
    },
    featuredProductLabel: {
      type: String,
      default: 'Featured Products',
    },
    iconSet: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    blockName: 'leaders-section',
    items: [],
    isLoading: false,
    hasLoaded: false,
    isExpanded: false,
    error: null,
  }),

  computed: {
    classes() {
      const { blockName } = this;
      const classes = [blockName];
      if (this.contextual) classes.push(`${blockName}--contextual`);
      return classes;
    },
    iconModifiers() {
      const mods = [];
      if (!this.contextual) mods.push('primary-color-light');
      return mods;
    },
    canLoad() {
      return this.isExpanded && (!this.isLoading || !this.hasLoaded);
    },
    hasChildren() {
      return Boolean(this.children.length);
    },
  },

  watch: {
    isExpanded() {
      this.loadContent();
    },
  },

  created() {
    this.isExpanded = this.expanded;
  },

  methods: {
    elementClass(name) {
      return `${this.blockName}__${name}`;
    },

    emitAction(event, payload = {}) {
      this.$emit('action', event, {
        ...payload,
        sectionId: this.sectionId,
        sectionName: this.title,
      });
    },

    emitCategoryItems(items) {
      if (!items || !items.length) return;
      this.emitAction({
        type: 'viewed',
        label: 'Section Company Items',
        category: 'Leaders Sections Nav',
      }, {
        sectionId: this.sectionId,
        sectionName: this.title,
        items: items.map(item => ({ id: item.id, name: item.name })),
      });
    },

    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
      this.emitAction({
        type: this.isExpanded ? 'expand' : 'collapse',
        label: 'Section Item',
        category: 'Leaders Sections Nav',
      }, {
        sectionId: this.sectionId,
        sectionName: this.title,
      });
    },

    async loadContent() {
      if (this.canLoad) {
        this.isLoading = true;
        this.error = null;
        try {
          const url = `/__content-for-section?sectionId=${this.sectionId}`;
          const res = await fetch(url);
          const json = await res.json();
          if (!res.ok) throw new Error(json.message || res.statusText);
          this.items = getEdgeNodes(json, 'websiteScheduledContent');
          this.hasLoaded = true;
        } catch (error) {
          this.error = error.message;
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
};
</script>
