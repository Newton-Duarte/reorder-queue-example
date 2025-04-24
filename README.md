# Reordenação de Fila

Este repositório contém um sistema de gerenciamento de filas que organiza a entrada de veículos (caminhões e carros) de acordo com regras específicas de negócio.

## Visão Geral

O sistema gerencia movimentos de veículos em uma fila, com dois tipos principais:

- **Caminhões**: Veículos de maior prioridade
- **Carros**: Veículos que devem seguir regras específicas de posicionamento

## Funcionalidades Principais

### Reordenação de Fila

A funcionalidade principal deste sistema é a reordenação inteligente da fila de veículos, seguindo regras específicas:

1. Caminhões entram normalmente na fila
2. Carros devem ser posicionados após um caminhão, com no máximo 3 carros consecutivos por caminhão
3. O sistema reorganiza automaticamente a fila quando um novo veículo entra

### Estados dos Movimentos

Os movimentos podem estar em diferentes estados:

- `STATUS_AGUARDANDO_VEZ`: Veículos que podem ser reordenados na fila
- `STATUS_EM_CARREGAMENTO`: Veículos em processo de carregamento (não podem ser reordenados)
- `STATUS_EM_PATIO`: Veículos no pátio (não participam da fila)

## Algoritmo de Reordenação

O algoritmo principal verifica onde um carro deve ser inserido na fila:

1. Busca todos os caminhões ativos na fila
2. Para cada caminhão, verifica quantos carros consecutivos estão após ele
3. Se encontrar um caminhão com menos de 3 carros consecutivos, posiciona o novo carro após o último carro deste grupo ou diretamente após o caminhão
4. Verifica se a posição sugerida está ocupada por um movimento que pode ser reordenado
5. Caso a posição esteja ocupada por um movimento em estado diferente de `AGUARDANDO_VEZ`, o algoritmo continua buscando outra posição válida

## Tecnologias Utilizadas

- Vite
- React
- TypeScript
- TailwindCSS v4
- Shadcn-UI
- React Query

---

Este projeto é um exemplo didático de implementação de regras de negócio complexas para gerenciamento de filas.
