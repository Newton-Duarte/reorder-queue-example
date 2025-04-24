import { fakeMovementsRepository } from '@/data/fake-movements-repository'
import { sleep } from '@/utils/sleep'

export async function createMovement(tipo: MovementType) {
  await sleep()

  const movement = fakeMovementsRepository.create(tipo)

  return {
    success: true,
    movement,
  }
}
