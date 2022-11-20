<script setup lang="ts">
import { ref, toRaw } from "vue";
const separator = ref("❤");
const files = ref<string[]>([]);
const onDrop = (e: DragEvent) => {
    const dropFiles = Array.from((e.dataTransfer as DataTransfer).files).map(
        (item) => item.path
    );
    files.value = dropFiles;
};

const rename = () => {
    window.electronAPI.rename(toRaw(files.value), separator.value);
};

const restore = () => {
    window.electronAPI.restore(toRaw(files.value), separator.value);
};

window.electronAPI.onRename();
window.electronAPI.onRestore();
</script>

<template>
    <div class="container">
        <div class="menu">
            <div class="menu-separator">
                <label class="separator-label" for="separator">separator</label>
                <input
                    class="separator-input"
                    type="text"
                    v-model="separator"
                />
            </div>
            <div class="menu-operator">
                <button class="btn-restore" @click="restore">Restore</button>
                <button class="btn-rename" @click="rename">Rename</button>
            </div>
        </div>
        <div class="drop" @drop.prevent="onDrop" @dragover.prevent>
            <div v-if="files.length > 0">
                <p v-for="item in files" :key="item">{{ item }}</p>
            </div>
            <p v-else>Drop Here.</p>
        </div>
    </div>
</template>

<style scoped>
.container {
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.menu {
    display: flex;
    justify-content: space-between;
}

.menu-separator {
    display: flex;
}

.separator-input {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 10px;
}

.menu-operator {
    display: flex;
}

.menu-operator button {
    cursor: pointer;
    padding: 0 5px;
}

.btn-rename {
    margin-left: 10px;
}

.drop {
    flex-grow: 1;
    border: 1px dashed #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ccc;
    font-style: italic;
    margin-top: 15px;
}
</style>
