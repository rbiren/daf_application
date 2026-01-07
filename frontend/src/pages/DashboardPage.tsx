import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { unitsApi } from '../services/api'
import { Truck, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

export default function DashboardPage() {
  const { data: pendingUnits, isLoading: loadingPending } = useQuery({
    queryKey: ['units', 'pending'],
    queryFn: () => unitsApi.getPending().then((res) => res.data),
  })

  const { data: inProgressUnits, isLoading: loadingInProgress } = useQuery({
    queryKey: ['units', 'in-progress'],
    queryFn: () => unitsApi.getInProgress().then((res) => res.data),
  })

  const stats = [
    {
      label: 'Pending Acceptance',
      value: pendingUnits?.length || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'In Progress',
      value: inProgressUnits?.length || 0,
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Pending Units */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Units Pending Acceptance
          </h2>
          <Link to="/units" className="text-sm text-primary-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="divide-y">
          {loadingPending ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : pendingUnits?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No units pending acceptance
            </div>
          ) : (
            pendingUnits?.slice(0, 5).map((unit: any) => (
              <div key={unit.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {unit.model?.name || 'Unknown Model'} ({unit.modelYear})
                  </p>
                  <p className="text-sm text-gray-500">
                    VIN: ...{unit.vin.slice(-8)}
                  </p>
                  {unit.pdiRecords?.[0] && (
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      {unit.pdiRecords[0].failedItems > 0 ? (
                        <>
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          <span className="text-yellow-600">
                            {unit.pdiRecords[0].failedItems} PDI issues
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-green-600">PDI Complete</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Link
                  to={`/units/${unit.vin}`}
                  className="btn-primary btn-sm"
                >
                  Start
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* In Progress */}
      {inProgressUnits?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              In Progress Acceptances
            </h2>
          </div>
          <div className="divide-y">
            {inProgressUnits.map((unit: any) => (
              <div key={unit.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {unit.model?.name || 'Unknown Model'} ({unit.modelYear})
                  </p>
                  <p className="text-sm text-gray-500">
                    VIN: ...{unit.vin.slice(-8)}
                  </p>
                  {unit.acceptanceRecords?.[0] && (
                    <p className="text-xs text-gray-400">
                      By: {unit.acceptanceRecords[0].user?.name}
                    </p>
                  )}
                </div>
                <Link
                  to={`/acceptance/${unit.acceptanceRecords?.[0]?.id}`}
                  className="btn-secondary btn-sm"
                >
                  Resume
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
