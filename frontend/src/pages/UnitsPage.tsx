import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { unitsApi } from '../services/api'
import { Search, Filter, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import type { Unit } from '../types'

const statusColors: Record<string, string> = {
  PENDING_PDI: 'bg-gray-100 text-gray-800',
  PDI_COMPLETE: 'bg-blue-100 text-blue-800',
  PDI_ISSUES: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  RECEIVED: 'bg-cyan-100 text-cyan-800',
  IN_ACCEPTANCE: 'bg-orange-100 text-orange-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  CONDITIONALLY_ACCEPTED: 'bg-amber-100 text-amber-800',
  REJECTED: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  PENDING_PDI: 'Pending PDI',
  PDI_COMPLETE: 'PDI Complete',
  PDI_ISSUES: 'PDI Issues',
  SHIPPED: 'Shipped',
  RECEIVED: 'Received',
  IN_ACCEPTANCE: 'In Acceptance',
  ACCEPTED: 'Accepted',
  CONDITIONALLY_ACCEPTED: 'Conditional',
  REJECTED: 'Rejected',
}

export default function UnitsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['units', { search, status: statusFilter, page }],
    queryFn: () =>
      unitsApi
        .list({ search: search || undefined, status: statusFilter || undefined, page, limit: 20 })
        .then((res) => res.data),
  })

  const units = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Units</h1>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by VIN or stock number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="input pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="input w-40"
              >
                <option value="">All Status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Units List */}
      <div className="card">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : units.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No units found</div>
        ) : (
          <div className="divide-y">
            {units.map((unit: Unit) => (
              <Link
                key={unit.id}
                to={`/units/${unit.vin}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-900">
                      {unit.model?.name || 'Unknown Model'}
                    </p>
                    <span
                      className={clsx(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        statusColors[unit.status]
                      )}
                    >
                      {statusLabels[unit.status]}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <span>VIN: {unit.vin}</span>
                    <span>{unit.modelYear}</span>
                    {unit.stockNumber && <span>Stock: {unit.stockNumber}</span>}
                  </div>
                  {unit.exteriorColor && (
                    <p className="text-xs text-gray-400">
                      {unit.exteriorColor} / {unit.interiorColor}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-gray-500">
              Page {meta.page} of {meta.totalPages} ({meta.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline btn-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
