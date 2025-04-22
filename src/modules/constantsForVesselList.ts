import { ref } from 'vue'

export const constantsForVesselList = () => {
  const input = ref('')
  const idOfMarkerBeingEdited = ref<string | null>(null)
  const isCreating = ref(false)
  const editForm = ref({
    title: '',
    lat: 0,
    lng: 0,
  })
  return {
    input,
    idOfMarkerBeingEdited,
    isCreating,
    editForm,
  }
}
