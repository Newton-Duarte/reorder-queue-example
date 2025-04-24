import {
  STATUS_AGUARDANDO_VEZ,
  STATUS_EM_CARREGAMENTO,
  STATUS_EM_PATIO,
  STATUS_SAIDA_LIBERADA,
} from './constants'

export const possibleStatus: MovementStatus[] = [
  STATUS_EM_PATIO,
  STATUS_AGUARDANDO_VEZ,
  STATUS_EM_CARREGAMENTO,
  STATUS_SAIDA_LIBERADA,
] as const

let fakeMovements: Movement[] = []

let lastId = 0
let filaAtual = 0

export const fakeMovementsRepository = {
  getAll: () =>
    fakeMovements.sort((a, b) => {
      if (a.fila === null && b.fila === null) {
        return 0
      } else if (a.fila === null) {
        return 1
      } else if (b.fila === null) {
        return -1
      } else {
        return a.fila - b.fila
      }
    }),

  getByStatus: (status: MovementStatus) =>
    fakeMovements.filter((movement) => movement.status === status),

  getNextFilaNumber: () => {
    return ++filaAtual
  },

  findById: (id: number) =>
    fakeMovements.find((movement) => movement.id === id),

  findByFila: (fila: number) =>
    fakeMovements.find((movement) => movement.fila === fila),

  create: (tipo: MovementType): Movement => {
    const newMovement: Movement = {
      id: ++lastId,
      fila: null,
      tipo,
      status: STATUS_EM_PATIO,
      createdAt: new Date().toISOString(),
    }

    fakeMovements = [...fakeMovements, { ...newMovement }]

    return newMovement
  },

  update: (id: number, updates: Movement): void => {
    fakeMovements = fakeMovements.map((movement) => {
      if (movement.id === id) {
        return {
          ...updates,
        }
      }

      return movement
    })
  },

  delete: (id: number): void => {
    fakeMovements = fakeMovements.filter((movement) => movement.id !== id)
  },
}
