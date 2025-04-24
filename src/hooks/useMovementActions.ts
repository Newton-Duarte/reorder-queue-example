import { advanceStatus } from '@/http/advance-status'
import { createMovement } from '@/http/create-movement'
import { deleteMovement } from '@/http/delete-movement'
import { queryClient } from '@/lib/react-query'
import { useMutation } from '@tanstack/react-query'

export const useMovementActions = () => {
  const createMovementMutation = useMutation({
    mutationFn: (tipo: MovementType) => {
      return createMovement(tipo)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] })
    },
  })

  const advanceMovementStatusMutation = useMutation({
    mutationFn: (movementId: number) => {
      return advanceStatus(movementId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] })
    },
  })

  const deleteMovementStatusMutation = useMutation({
    mutationFn: (movementId: number) => {
      return deleteMovement(movementId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] })
    },
  })

  return {
    createMovementMutation,
    advanceMovementStatusMutation,
    deleteMovementStatusMutation,
  }
}
