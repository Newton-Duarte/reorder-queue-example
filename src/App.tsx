import { Car, ChevronsRight, Loader2, Trash2, Truck } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'
import { useMovements } from './hooks/useMovements'
import { Skeleton } from './components/ui/skeleton'
import { useMovementActions } from './hooks/useMovementActions'
import {
  STATUS_AGUARDANDO_VEZ,
  STATUS_EM_CARREGAMENTO,
  STATUS_EM_PATIO,
  STATUS_SAIDA_LIBERADA,
  TIPO_CAMINHAO,
  TIPO_CARRO,
} from './data/constants'
import { cn } from './lib/utils'

export function App() {
  const { isLoading, data } = useMovements()

  const computedMovements = data?.content

  const {
    createMovementMutation,
    advanceMovementStatusMutation,
    deleteMovementStatusMutation,
  } = useMovementActions()

  const handleCreateMovement = async (tipo: MovementType) => {
    await createMovementMutation.mutateAsync(tipo)
  }

  const handleAdvanceMovementStatus = async (movementId: number) => {
    await advanceMovementStatusMutation.mutateAsync(movementId)
  }

  const handleDeleteMovement = async (movementId: number) => {
    await deleteMovementStatusMutation.mutateAsync(movementId)
  }

  return (
    <div className="container space-y-4">
      <h1 className="text-center font-bold uppercase">
        Refresq - Reorganiza Fila
      </h1>
      <Card className="mx-auto max-h-[855px] max-w-[560px] overflow-y-auto p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-row items-center justify-center gap-2">
            <h2 className="font-medium uppercase">Movimentos</h2>
            {isLoading && <Loader2 className="size-4 animate-spin" />}
          </div>
          <div className="space-x-2">
            <Button
              className="relative"
              disabled={isLoading || createMovementMutation.isPending}
              onClick={() => handleCreateMovement(TIPO_CARRO)}
            >
              {createMovementMutation.isPending && (
                <Loader2 className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transform animate-spin" />
              )}
              Adicionar Carro
            </Button>
            <Button
              className="relative"
              disabled={isLoading || createMovementMutation.isPending}
              onClick={() => handleCreateMovement(TIPO_CAMINHAO)}
            >
              {createMovementMutation.isPending && (
                <Loader2 className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transform animate-spin" />
              )}
              Adicionar Caminhão
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="w-full space-y-4">
            {Array.from(Array(10).keys()).map((n) => (
              <Skeleton key={n} className="w-ful h-10" />
            ))}
          </div>
        ) : computedMovements?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {computedMovements?.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">{movement.id}</TableCell>
                  <TableCell className="font-medium">{movement.fila}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {movement.tipo === TIPO_CARRO ? (
                        <Car className="size-4" />
                      ) : (
                        <Truck className="size-4" />
                      )}
                      {movement.tipo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn('size-2 rounded-full', {
                          'bg-purple-400': movement.status === STATUS_EM_PATIO,
                          'bg-yellow-400':
                            movement.status === STATUS_AGUARDANDO_VEZ,
                          'bg-blue-400':
                            movement.status === STATUS_EM_CARREGAMENTO,
                          'bg-emerald-400':
                            movement.status === STATUS_SAIDA_LIBERADA,
                        })}
                      />
                      {movement.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={
                          movement.status === STATUS_SAIDA_LIBERADA ||
                          advanceMovementStatusMutation.isPending
                        }
                        onClick={() => handleAdvanceMovementStatus(movement.id)}
                      >
                        {advanceMovementStatusMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <ChevronsRight className="size-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={deleteMovementStatusMutation.isPending}
                        onClick={() => handleDeleteMovement(movement.id)}
                      >
                        {deleteMovementStatusMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center">
            Nenhum registro encontrado...
          </p>
        )}
      </Card>
    </div>
  )
}
