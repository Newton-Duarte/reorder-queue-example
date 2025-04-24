import { advanceMovementStatus } from '@/services/movements-service'
import { sleep } from '@/utils/sleep'

export async function advanceStatus(movementId: number) {
  await sleep()

  const movement = advanceMovementStatus(movementId)

  return {
    success: true,
    movement,
  }
}
