import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { manufacturerInspectionApi } from '../services/api'
import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  Truck,
  Package,
  ArrowRight
} from 'lucide-react'
import clsx from 'clsx'

export default function ManufacturerDashboardPage() {
  const queryClient = useQueryClient()

  const { data: pendingInspection, isLoading: loadingPending } = useQuery({
    queryKey: ['manufacturer', 'pending-inspection'],
    queryFn: () => manufacturerInspectionApi.getPendingInspection().then((res) => res.data),
  })

  const { data: pendingApproval } = useQuery({
    queryKey: ['manufacturer', 'pending-approval'],
    queryFn: () => manufacturerInspectionApi.getPendingApproval().then((res) => res.data),
  })

  const { data: readyToShip } = useQuery({
    queryKey: ['manufacturer', 'ready-to-ship'],
    queryFn: () => manufacturerInspectionApi.getReadyToShip().then((res) => res.data),
  })

  const shipMutation = useMutation({
    mutationFn: (unitId: string) => manufacturerInspectionApi.ship(unitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturer'] })
    },
  })

  const stats = [
    {
      label: 'Pending Inspection',
      value: pendingInspection?.length || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Pending Approval',
      value: pendingApproval?.length || 0,
      icon: ClipboardCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Ready to Ship',
      value: readyToShip?.length || 0,
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manufacturer Dashboard</h1>
        <Link to="/manufacturer/units/new" className="btn-primary">
          + Create Unit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className={clsx('rounded-lg p-2', stat.bg)}>
                  <stat.icon className={clsx('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Units Pending Inspection */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Units Pending Inspection
          </h2>
          <Link to="/manufacturer/units" className="text-sm text-primary-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="divide-y">
          {loadingPending ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : pendingInspection?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No units pending inspection
            </div>
          ) : (
            pendingInspection?.slice(0, 5).map((unit: any) => (
              <div key={unit.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {unit.model?.name || 'Unknown Model'} ({unit.modelYear})
                  </p>
                  <p className="text-sm text-gray-500">VIN: {unit.vin}</p>
                  <p className="text-xs text-gray-400">
                    Dealer: {unit.dealer?.name || 'Unassigned'}
                  </p>
                </div>
                <Link
                  to={`/manufacturer/inspection/start/${unit.id}`}
                  className="btn-primary btn-sm"
                >
                  Start Inspection
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Units Pending Approval */}
      {pendingApproval?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Approval
            </h2>
          </div>
          <div className="divide-y">
            {pendingApproval.map((unit: any) => (
              <div key={unit.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {unit.model?.name || 'Unknown Model'} ({unit.modelYear})
                  </p>
                  <p className="text-sm text-gray-500">VIN: {unit.vin}</p>
                  {unit.manufacturerInspectionRecords?.[0] && (
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="text-gray-500">
                        Inspector: {unit.manufacturerInspectionRecords[0].inspector?.name}
                      </span>
                      <span className="text-green-600">
                        {unit.manufacturerInspectionRecords[0].passedItems}/{unit.manufacturerInspectionRecords[0].totalItems} passed
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  to={`/manufacturer/inspection/${unit.manufacturerInspectionRecords?.[0]?.id || unit.id}`}
                  className="btn-secondary btn-sm"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready to Ship */}
      {readyToShip?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Ready to Ship
            </h2>
          </div>
          <div className="divide-y">
            {readyToShip.map((unit: any) => (
              <div key={unit.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {unit.model?.name || 'Unknown Model'} ({unit.modelYear})
                  </p>
                  <p className="text-sm text-gray-500">VIN: {unit.vin}</p>
                  <p className="text-xs text-gray-400">
                    Dealer: {unit.dealer?.name || 'Unassigned'}
                  </p>
                </div>
                <button
                  onClick={() => shipMutation.mutate(unit.id)}
                  disabled={shipMutation.isPending}
                  className="btn-primary btn-sm flex items-center gap-1"
                >
                  <Truck className="h-4 w-4" />
                  {shipMutation.isPending ? 'Shipping...' : 'Ship Unit'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Workflow</h2>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3">
                <Package className="h-5 w-5 text-gray-600" />
              </div>
              <span className="mt-1">Create Unit</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-yellow-100 p-3">
                <ClipboardCheck className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="mt-1">Inspection</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <span className="mt-1">Approve</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <span className="mt-1">Ship</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
