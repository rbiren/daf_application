import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptanceApi, manufacturerInspectionApi, itemNotesApi } from '../services/api'
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Circle,
  Eye,
  FileText,
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

  // Fetch manufacturer inspection for side-by-side comparison
  const { data: manufacturerInspection } = useQuery({
    queryKey: ['manufacturer-inspection', 'unit', acceptance?.unit?.id],
    queryFn: () => manufacturerInspectionApi.getByUnitId(acceptance!.unit.id).then((res) => res.data),
    enabled: !!acceptance?.unit?.id,
  })

  // Fetch shared notes for this unit
  const { data: sharedNotes } = useQuery({
    queryKey: ['item-notes', 'unit', acceptance?.unit?.id],
    queryFn: () => itemNotesApi.getForUnit(acceptance!.unit.id).then((res) => res.data),
    enabled: !!acceptance?.unit?.id,
  })

  // Create a map of manufacturer items by checklist item code for matching
  const mfgItemsByCode = manufacturerInspection?.manufacturerInspectionItems?.reduce((acc: any, item: any) => {
    const code = item.checklistItem?.code
    if (code) acc[code] = item
    return acc
  }, {}) || {}

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

        {/* Items - Side by Side */}
        <div className="card lg:col-span-3">
          <div className="card-header flex items-center justify-between">
            <h2 className="font-semibold">{currentCategory}</h2>
            {manufacturerInspection && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                <Eye className="h-3 w-3 inline mr-1" />
                Side-by-side view enabled
              </span>
            )}
          </div>
          <div className="divide-y">
            {currentItems.map((item: AcceptanceItem) => {
              const config = statusConfig[item.status]
              const StatusIcon = config.icon
              const itemCode = item.checklistItem?.code
              const mfgItem = itemCode ? mfgItemsByCode[itemCode] : null
              const mfgConfig = mfgItem ? statusConfig[mfgItem.status as keyof typeof statusConfig] : null
              const MfgStatusIcon = mfgConfig?.icon

              return (
                <div key={item.id} className="p-4">
                  {/* Item Header with Requirements */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className={clsx('rounded-full p-2', config.bg)}>
                      <StatusIcon className={clsx('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.checklistItem?.description}</p>
                        <span className="text-xs text-gray-400">({itemCode})</span>
                      </div>
                      {item.checklistItem?.requirements && (
                        <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-2 text-sm">
                          <span className="font-medium text-gray-700">Standard Requirement:</span>
                          <p className="text-gray-600">{item.checklistItem.requirements}</p>
                          {item.checklistItem?.documentationUrl && (
                            <a href={item.checklistItem.documentationUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-xs flex items-center gap-1 mt-1">
                              <FileText className="h-3 w-3" /> View documentation
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Side by Side Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-12">
                    {/* Dealer Side (Left) */}
                    <div className="border rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Your Inspection
                      </h4>

                      {/* Status Buttons */}
                      {!isCompleted && (
                        <div className="flex flex-wrap gap-2 mb-2">
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
                                  'flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                                  isActive
                                    ? clsx(btnConfig.bg, btnConfig.color)
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                              >
                                <BtnIcon className="h-3 w-3" />
                                {status}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {isCompleted && (
                        <div className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded text-sm', config.bg, config.color)}>
                          <StatusIcon className="h-4 w-4" />
                          {item.status}
                        </div>
                      )}

                      {item.notes && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Manufacturer Side (Right) */}
                    <div className={clsx(
                      'border rounded-lg p-3',
                      mfgItem ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    )}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Manufacturer Result
                      </h4>

                      {mfgItem ? (
                        <>
                          <div className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded text-sm', mfgConfig?.bg, mfgConfig?.color)}>
                            {MfgStatusIcon && <MfgStatusIcon className="h-4 w-4" />}
                            {mfgItem.status}
                          </div>
                          {mfgItem.issueSeverity && (
                            <span className={clsx(
                              'ml-2 text-xs px-1 py-0.5 rounded',
                              mfgItem.issueSeverity === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                              mfgItem.issueSeverity === 'MAJOR' ? 'bg-red-100 text-red-700' :
                              mfgItem.issueSeverity === 'MODERATE' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            )}>
                              {mfgItem.issueSeverity}
                            </span>
                          )}
                          {mfgItem.notes && (
                            <p className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded">
                              {mfgItem.notes}
                            </p>
                          )}

                          {/* Manufacturer shared notes */}
                          {mfgItem.itemNotes?.filter((n: any) => n.visibleToDealer).length > 0 && (
                            <div className="mt-2 border-t pt-2">
                              <div className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Manufacturer Notes:
                              </div>
                              {mfgItem.itemNotes
                                .filter((n: any) => n.visibleToDealer)
                                .map((note: any) => (
                                  <div key={note.id} className="text-xs text-gray-600 bg-white/50 p-1 rounded mt-1">
                                    {note.content}
                                  </div>
                                ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No matching manufacturer data</p>
                      )}
                    </div>
                  </div>

                  {/* Comparison indicator */}
                  {mfgItem && item.status !== 'PENDING' && item.status !== mfgItem.status && (
                    <div className="mt-2 pl-12">
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-700 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Status differs from manufacturer result
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Full Manufacturer Report Link */}
      {manufacturerInspection && (
        <div className="card">
          <div className="card-body flex items-center justify-between">
            <div>
              <h3 className="font-medium">Full Manufacturer Inspection Report</h3>
              <p className="text-sm text-gray-500">
                View complete inspection results: {manufacturerInspection.progress?.passedItems || 0} passed, {manufacturerInspection.progress?.failedItems || 0} failed, {manufacturerInspection.progress?.issueItems || 0} issues
              </p>
            </div>
            <button
              onClick={() => window.open(`/manufacturer/inspection/${manufacturerInspection.id}`, '_blank')}
              className="btn-secondary flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View Full Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
