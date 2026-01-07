import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { unitsApi, pdiApi, acceptanceApi } from '../services/api'
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Camera,
  FileText,
} from 'lucide-react'
import clsx from 'clsx'
import type { Unit, PdiRecord } from '../types'

export default function UnitDetailPage() {
  const { vin } = useParams<{ vin: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: unit, isLoading } = useQuery({
    queryKey: ['unit', vin],
    queryFn: () => unitsApi.getByVin(vin!).then((res) => res.data as Unit),
    enabled: !!vin,
  })

  const startAcceptanceMutation = useMutation({
    mutationFn: () => acceptanceApi.start(vin!),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['unit', vin] })
      navigate(`/acceptance/${response.data.id}`)
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Unit not found</p>
      </div>
    )
  }

  const latestPdi = unit.pdiRecords?.[0]
  const canStartAcceptance = ['PDI_COMPLETE', 'PDI_ISSUES', 'RECEIVED'].includes(unit.status)
  const hasInProgressAcceptance = unit.status === 'IN_ACCEPTANCE'
  const inProgressAcceptance = unit.acceptanceRecords?.find((a) => a.status === 'IN_PROGRESS')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-outline btn-sm">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {unit.model?.name || 'Unknown Model'} ({unit.modelYear})
          </h1>
          <p className="text-gray-500">VIN: {unit.vin}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Unit Details */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Unit Details</h2>
          </div>
          <div className="card-body">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">VIN</dt>
                <dd className="font-mono text-sm">{unit.vin}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Stock Number</dt>
                <dd>{unit.stockNumber || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Model Year</dt>
                <dd>{unit.modelYear}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Model</dt>
                <dd>{unit.model?.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Exterior Color</dt>
                <dd>{unit.exteriorColor || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Interior Color</dt>
                <dd>{unit.interiorColor || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Chassis</dt>
                <dd>{unit.chassisType || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Engine</dt>
                <dd>{unit.engineType || '-'}</dd>
              </div>
              {unit.gvwr && (
                <div>
                  <dt className="text-sm text-gray-500">GVWR</dt>
                  <dd>{unit.gvwr.toLocaleString()} lbs</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="card">
            <div className="card-body">
              <h3 className="mb-3 font-semibold">Status</h3>
              <div
                className={clsx(
                  'rounded-lg p-3 text-center font-medium',
                  unit.status === 'ACCEPTED' && 'bg-green-100 text-green-800',
                  unit.status === 'CONDITIONALLY_ACCEPTED' && 'bg-amber-100 text-amber-800',
                  unit.status === 'REJECTED' && 'bg-red-100 text-red-800',
                  unit.status === 'IN_ACCEPTANCE' && 'bg-orange-100 text-orange-800',
                  !['ACCEPTED', 'CONDITIONALLY_ACCEPTED', 'REJECTED', 'IN_ACCEPTANCE'].includes(unit.status) &&
                    'bg-gray-100 text-gray-800'
                )}
              >
                {unit.status.replace(/_/g, ' ')}
              </div>

              <div className="mt-4">
                {hasInProgressAcceptance ? (
                  <button
                    onClick={() => navigate(`/acceptance/${inProgressAcceptance?.id}`)}
                    className="btn-primary w-full"
                  >
                    Resume Acceptance
                  </button>
                ) : canStartAcceptance ? (
                  <button
                    onClick={() => startAcceptanceMutation.mutate()}
                    disabled={startAcceptanceMutation.isPending}
                    className="btn-primary w-full"
                  >
                    {startAcceptanceMutation.isPending ? 'Starting...' : 'Start Acceptance'}
                  </button>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    Unit cannot be accepted in current status
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDI Results */}
      {latestPdi && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold">PDI Results</h2>
            <span className="text-sm text-gray-500">
              {new Date(latestPdi.completedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="card-body">
            <div className="mb-4 grid gap-4 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{latestPdi.totalItems}</p>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{latestPdi.passedItems}</p>
                <p className="text-sm text-gray-500">Passed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{latestPdi.failedItems}</p>
                <p className="text-sm text-gray-500">Issues</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {latestPdi.status === 'COMPLETE' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {latestPdi.status === 'COMPLETE' ? 'All Clear' : 'Issues Pending'}
                </p>
              </div>
            </div>

            {latestPdi.notes && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">{latestPdi.notes}</p>
              </div>
            )}

            {/* PDI Issues */}
            {latestPdi.pdiItems?.filter((i) => i.status !== 'PASS').length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 font-medium">Issues Found</h3>
                <div className="space-y-2">
                  {latestPdi.pdiItems
                    .filter((i) => i.status !== 'PASS')
                    .map((item) => (
                      <div
                        key={item.id}
                        className={clsx(
                          'rounded-lg border p-3',
                          item.resolved ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {item.itemCode}: {item.itemDescription}
                            </p>
                            {item.notes && (
                              <p className="mt-1 text-sm text-gray-600">{item.notes}</p>
                            )}
                          </div>
                          {item.resolved ? (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                              Resolved
                            </span>
                          ) : (
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                              Open
                            </span>
                          )}
                        </div>
                        {item.resolved && item.resolutionNotes && (
                          <p className="mt-2 text-sm text-green-700">
                            Resolution: {item.resolutionNotes}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Acceptance History */}
      {unit.acceptanceRecords && unit.acceptanceRecords.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Acceptance History</h2>
          </div>
          <div className="divide-y">
            {unit.acceptanceRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">
                    {record.decision ? record.decision.replace(/_/g, ' ') : 'In Progress'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(record.startedAt).toLocaleDateString()} by {record.user?.name}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/acceptance/${record.id}`)}
                  className="btn-outline btn-sm"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
