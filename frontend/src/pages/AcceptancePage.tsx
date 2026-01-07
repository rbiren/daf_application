import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { acceptanceApi } from '../services/api'
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

const decisionIcons = {
  FULL_ACCEPT: CheckCircle,
  CONDITIONAL: AlertTriangle,
  REJECT: XCircle,
}

const decisionColors = {
  FULL_ACCEPT: 'text-green-600',
  CONDITIONAL: 'text-amber-600',
  REJECT: 'text-red-600',
}

const statusColors = {
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

export default function AcceptancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['acceptances'],
    queryFn: () => acceptanceApi.list({ limit: 50 }).then((res) => res.data),
  })

  const records = data?.data || []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Acceptance Records</h1>

      <div className="card">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No acceptance records found
          </div>
        ) : (
          <div className="divide-y">
            {records.map((record: any) => {
              const DecisionIcon = record.decision
                ? decisionIcons[record.decision as keyof typeof decisionIcons]
                : Clock

              return (
                <Link
                  key={record.id}
                  to={`/acceptance/${record.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={clsx(
                        'rounded-full p-2',
                        record.decision
                          ? decisionColors[record.decision as keyof typeof decisionColors]
                          : 'text-blue-600'
                      )}
                    >
                      <DecisionIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {record.unit?.model?.name || 'Unknown Model'} ({record.unit?.modelYear})
                      </p>
                      <p className="text-sm text-gray-500">
                        VIN: ...{record.unit?.vin.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(record.startedAt).toLocaleDateString()} by {record.user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={clsx(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        statusColors[record.status as keyof typeof statusColors]
                      )}
                    >
                      {record.status.replace(/_/g, ' ')}
                    </span>
                    {record.decision && (
                      <p className="mt-1 text-sm text-gray-500">
                        {record.decision.replace(/_/g, ' ')}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
