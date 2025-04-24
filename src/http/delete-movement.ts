import { fakeMovementsRepository } from '@/data/fake-movements-repository'
import { sleep } from '@/utils/sleep'

export async function deleteMovement(movementId: number) {
  await sleep()

  fakeMovementsRepository.delete(movementId)

  return {
    success: true,
  }
}
