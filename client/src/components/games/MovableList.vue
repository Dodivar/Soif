<template>
  <v-card>
    <h1>Movable List</h1>
    <draggable :v-bind="dragOptions" group="items" @start="drag = true" @end="drag = false">
      <transition-group type="transition" name="flip-list">
        <li v-for="item in items" :key="item.id">
          {{ item.text }}
        </li>
      </transition-group>
    </draggable>
    <div class="add-item">
      <input v-model="newItem" @keyup.enter="addItem" placeholder="Add new item" />
      <button @click="addItem">Add</button>
    </div>
  </v-card>
</template>

<script>
// import { state, socket } from '@/socket'
import draggable from 'vuedraggable'
// import GiveSoif from '@/components/GiveSoif.vue'

export default {
  components: {
    // GiveSoif,
    draggable
  },
  data() {
    return {
      items: [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
        { id: 4, text: 'Item 4' },
        { id: 5, text: 'Item 5' }
      ],
      newItem: '',
      drag: false,
      nextId: 6,
      dragOptions: {
        animation: 150,
        ghostClass: 'ghost',
        dragClass: 'sortable-drag',
        forceFallback: true
      }
    }
  },
  methods: {
    addItem() {
      if (this.newItem.trim() !== '') {
        this.items.push({
          id: this.nextId++,
          text: this.newItem.trim()
        })
        this.newItem = ''
      }
    }
  }
}
</script>
