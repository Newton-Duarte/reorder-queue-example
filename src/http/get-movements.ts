import { fakeMovementsRepository } from '@/data/fake-movements-repository'
import { sleep } from '@/utils/sleep'

export async function getMovements() {
  await sleep()

  const movements = fakeMovementsRepository.getAll()

  return {
    success: true,
    content: movements,
  }
}
