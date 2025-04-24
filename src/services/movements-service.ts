import {
  STATUS_AGUARDANDO_VEZ,
  STATUS_EM_PATIO,
  TIPO_CAMINHAO,
  TIPO_CARRO,
} from '@/data/constants'
import {
  fakeMovementsRepository,
  possibleStatus,
} from '@/data/fake-movements-repository'

export function contarCarrosConsecutivos(posicaoCaminhao: number) {
  const movimentos = fakeMovementsRepository.getAll()

  let contador = 0

  // Verifica se estamos no último elemento da lista
  if (posicaoCaminhao >= movimentos.length - 1) {
    return 0 // Não há elementos após o último
  }

  // Começamos após o caminhão e vamos para frente
  for (let i = posicaoCaminhao + 1; i < movimentos.length; i++) {
    if (movimentos[i].tipo === TIPO_CARRO) {
      contador++
    } else {
      // Paramos de contar quando encontramos outro caminhão
      break
    }
  }

  return contador
}

export function getCaminhoesECarrosConsecutivos() {
  const movimentos = fakeMovementsRepository.getAll()

  // Buscar todos os caminhões ativos
  const caminhoes = movimentos.filter((movimento) => {
    return (
      movimento.tipo === TIPO_CAMINHAO &&
      movimento.status !== STATUS_EM_PATIO &&
      !!movimento.fila
    )
  })

  const resultado = []

  // Para cada caminhão, buscar os carros consecutivos após ele
  for (const caminhao of caminhoes) {
    // Encontrar o próximo caminhão (se existir)
    const proximoCaminhao = caminhoes.find(
      (c) => Number(c.fila) > Number(caminhao.fila)
    )

    // Buscar os carros entre o caminhão atual e o próximo (ou até o final se não houver próximo)
    const carrosApos = movimentos.filter((movimento) => {
      return (
        movimento.tipo === TIPO_CARRO &&
        movimento.status !== STATUS_EM_PATIO &&
        !!movimento.fila &&
        Number(movimento.fila) > Number(caminhao.fila) &&
        Number(movimento.fila) < Number(proximoCaminhao?.fila)
      )
    })

    resultado.push({ caminhao, carrosApos })
  }

  console.log({ resultado })

  return resultado
}

export function encontrarPosicaoParaCarro() {
  // Busca os caminhões e os carros consecutivos após cada um
  const caminhoesComCarros = getCaminhoesECarrosConsecutivos()

  // Percorre a lista para encontrar um caminhão com menos de 3 carros após ele
  for (const { caminhao, carrosApos } of caminhoesComCarros) {
    if (carrosApos.length < 3) {
      // Calcula a posição sugerida baseada na presença ou não de carros após o caminhão
      const posicaoSugerida =
        carrosApos.length === 0
          ? Number(caminhao.fila) + 1
          : Number(carrosApos[carrosApos.length - 1].fila) + 1

      // Verifica se há um movimento nessa posição e se ele está AGUARDANDO_VEZ
      const movimentoDaPosicaoSugerida =
        fakeMovementsRepository.findByFila(posicaoSugerida)

      // Se a posição estiver vazia OU o movimento estiver AGUARDANDO_VEZ, podemos usar essa posição
      if (
        !movimentoDaPosicaoSugerida ||
        movimentoDaPosicaoSugerida.status === STATUS_AGUARDANDO_VEZ
      ) {
        return posicaoSugerida
      }

      // Se o movimento não está AGUARDANDO_VEZ, continua para o próximo caminhão
    }
  }

  return null // Não encontrou posição adequada (vai para o final da fila)
}

export function reorganizarFila(movimentoId: number) {
  const movimentoAtual = fakeMovementsRepository.findById(movimentoId)

  if (!movimentoAtual) return

  const tipo = movimentoAtual.tipo

  // Busca apenas os movimentos que estão AGUARDANDO VEZ (que podem ser reordenados)
  const movimentosAguardandoVez = fakeMovementsRepository.getByStatus(
    STATUS_AGUARDANDO_VEZ
  )

  // Não existe movimentos aguardando vez, não faz nada
  if (!movimentosAguardandoVez.length) {
    return
  }

  // Para carros, verificamos se podemos inseri-lo antes de algum caminhão
  if (tipo === TIPO_CARRO) {
    // Encontra a posição ideal para inserir o novo carro
    const numeroFilaAlvo = encontrarPosicaoParaCarro()

    if (numeroFilaAlvo !== null) {
      // Encontramos uma posição ideal para inserir o carro

      // Busca o movimentoAlvo que irá trocar o número de fila
      const movimentoAlvo = fakeMovementsRepository.findByFila(numeroFilaAlvo)

      // Caso o movimento não esteja AGUARDANDO VEZ retornamos
      if (movimentoAlvo?.status !== STATUS_AGUARDANDO_VEZ) {
        return
      }

      // Verificamos se existem movimentos AGUARDANDO VEZ que precisam ser atualizados
      const movimentosParaAtualizar = movimentosAguardandoVez.filter(
        (m) => Number(m.fila) >= numeroFilaAlvo
      )

      // Atualizamos os números de fila dos movimentos AGUARDANDO VEZ
      for (const mov of movimentosParaAtualizar) {
        atualizarNumeroFila(mov.id, Number(mov.fila) + 1)
      }

      // Atualizamos o novo movimento com o número de fila alvo
      atualizarNumeroFila(movimentoId, numeroFilaAlvo)
    }
  }
}

export function atualizarNumeroFila(movimentoId: number, numeroFila: number) {
  const movimento = fakeMovementsRepository.findById(movimentoId)

  if (!movimento) return

  fakeMovementsRepository.update(movimentoId, {
    ...movimento,
    fila: numeroFila,
  })
}

export function addMovementToTheQueue(movementId: number) {
  const currentMovement = fakeMovementsRepository.findById(movementId)

  if (!currentMovement) return

  const updates: Movement = {
    ...currentMovement,
    fila: fakeMovementsRepository.getNextFilaNumber(),
  }

  fakeMovementsRepository.update(movementId, updates)

  reorganizarFila(movementId)
}

export function advanceMovementStatus(movementId: number): void {
  const currentMovement = fakeMovementsRepository.findById(movementId)

  if (!currentMovement) return

  const currentMovementStatusIndex = possibleStatus.indexOf(
    currentMovement.status
  )

  const isFinalStatus = currentMovement.status === possibleStatus.at(-1)

  if (!isFinalStatus) {
    const nextStatus = possibleStatus[currentMovementStatusIndex + 1]

    const updates: Movement = {
      ...currentMovement,
      status: nextStatus,
    }

    fakeMovementsRepository.update(movementId, updates)

    const shouldAddToTheQueue = nextStatus === STATUS_AGUARDANDO_VEZ

    if (shouldAddToTheQueue) {
      addMovementToTheQueue(movementId)
    }
  }
}
