import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptanceApi } from '../services/api'
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Circle,
  Camera,
  MessageSquare,
} from 'lucide-react'
import clsx from 'clsx'
import type { AcceptanceItem, ItemStatus } from '../types'

const statusConfig = {
  PENDING: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100' },
  PASS: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ISSUE: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  FAIL: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  NA: { icon: Circle, color: 'text-gray-500', bg: 'bg-gray-200' },
}

export default function AcceptanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { data: acceptance, isLoading } = useQuery({
    queryKey: ['acceptance', id],
    queryFn: () => acceptanceApi.getById(id!).then((res) => res.data),
    enabled: !!id,
  })

  const { data: progress } = useQuery({
    queryKey: ['acceptance', id, 'progress'],
    queryFn: () => acceptanceApi.getProgress(id!).then((res) => res.data),
    enabled: !!id,
  })

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, status, notes }: { itemId: string; status: ItemStatus; notes?: string }) =>
      acceptanceApi.updateItem(id!, itemId, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acceptance', id] })
      queryClient.invalidateQueries({ queryKey: ['acceptance', id, 'progress'] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!acceptance) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Acceptance not found</p>
      </div>
    )
  }

  // Group items by category
  const itemsByCategory = acceptance.acceptanceItems?.reduce((acc: any, item: AcceptanceItem) => {
    const catName = item.checklistItem?.category?.name || 'Uncategorized'
    if (!acc[catName]) acc[catName] = []
    acc[catName].push(item)
    return acc
  }, {})

  const categories = Object.keys(itemsByCategory || {})
  const currentCategory = selectedCategory || categories[0]
  const currentItems = itemsByCategory?.[currentCategory] || []

  const isCompleted = acceptance.status === 'COMPLETED'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="btn-outline btn-sm">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Acceptance: {acceptance.unit?.model?.name || 'Unknown'}
            </h1>
            <p className="text-sm text-gray-500">VIN: {acceptance.unit?.vin}</p>
          </div>
        </div>
        {!isCompleted && (
          <button
            onClick={() => navigate(`/acceptance/${id}/submit`)}
            className="btn-primary"
            disabled={progress?.percentComplete !== 100}
          >
            Review & Submit
          </button>
        )}
      </div>

      {/* Progress */}
      {progress && (
        <div className="card">
          <div className="card-body">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">
                {progress.completed}/{progress.total} items ({progress.percentComplete}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary-600 transition-all"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>
            <div className="mt-2 flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {progress.passed} passed
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                {progress.issues} issues
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                {progress.failed} failed
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Categories */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h2 className="font-semibold">Categories</h2>
          </div>
          <div className="p-2">
            {categories.map((cat) => {
              const catProgress = progress?.byCategory?.[cat]
              const isComplete = catProgress?.completed === catProgress?.total

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={clsx(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm',
                    currentCategory === cat
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <span className="truncate">{cat}</span>
                  {isComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="text-xs text-gray-400">
                      {catProgress?.completed}/{catProgress?.total}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Items */}
        <div className="card lg:col-span-3">
          <div className="card-header">
            <h2 className="font-semibold">{currentCategory}</h2>
          </div>
          <div className="divide-y">
            {currentItems.map((item: AcceptanceItem) => {
              const config = statusConfig[item.status]
              const StatusIcon = config.icon

              return (
                <div key={item.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={clsx('rounded-full p-2', config.bg)}>
                      <StatusIcon className={clsx('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.checklistItem?.description}</p>
                      {item.checklistItem?.instructions && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.checklistItem.instructions}
                        </p>
                      )}
                      {item.notes && (
                        <p className="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-600">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isCompleted && (
                    <div className="mt-3 flex flex-wrap gap-2 pl-12">
                      {(['PASS', 'ISSUE', 'FAIL', 'NA'] as ItemStatus[]).map((status) => {
                        const btnConfig = statusConfig[status]
                        const BtnIcon = btnConfig.icon
                        const isActive = item.status === status

                        return (
                          <button
                            key={status}
                            onClick={() =>
                              updateItemMutation.mutate({ itemId: item.id, status })
                            }
                            className={clsx(
                              'flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                              isActive
                                ? clsx(btnConfig.bg, btnConfig.color)
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                          >
                            <BtnIcon className="h-4 w-4" />
                            {status}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
