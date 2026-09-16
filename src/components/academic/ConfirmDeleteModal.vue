<script setup>
const emit = defineEmits(['confirmar', 'cancelar'])
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-card">
            <p class="modal-text">Deseja excluir registro Formação Acadêmica?</p>
            <div class="modal-actions">
                <button @click="emit('confirmar')" class="btn btn-delete">excluir</button>
                <button @click="emit('cancelar')" class="btn btn-cancel">cancelar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-card {
    background: #f2ebd9;
    padding: 40px 50px;
    border-radius: 20px;
    border: 1px solid #c4b59f;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.modal-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: #3a2b1f;
    margin-bottom: 30px;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.btn {
    border: none;
    padding: 10px 40px;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
}

.btn-delete {
    background: #8c9c6d;
    color: #3a2b1f;
}

.btn-cancel {
    background: #8c9c6d;
    color: #3a2b1f;
}
</style>