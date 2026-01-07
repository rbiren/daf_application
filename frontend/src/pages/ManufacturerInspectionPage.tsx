import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { manufacturerInspectionApi, itemNotesApi } from '../services/api'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MinusCircle,
  Send,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Eye,
  EyeOff
} from 'lucide-react'
import clsx from 'clsx'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', icon: MinusCircle, color: 'text-gray-400' },
  { value: 'PASS', label: 'Pass', icon: CheckCircle, color: 'text-green-500' },
  { value: 'ISSUE', label: 'Issue', icon: AlertTriangle, color: 'text-yellow-500' },
  { value: 'FAIL', label: 'Fail', icon: XCircle, color: 'text-red-500' },
  { value: 'NA', label: 'N/A', icon: MinusCircle, color: 'text-gray-400' },
]

const SEVERITY_OPTIONS = [
  { value: 'MINOR', label: 'Minor', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'MODERATE', label: 'Moderate', color: 'bg-orange-100 text-orange-800' },
  { value: 'MAJOR', label: 'Major', color: 'bg-red-100 text-red-800' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-200 text-red-900' },
]

export default function ManufacturerInspectionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [noteContent, setNoteContent] = useState('')
  const [noteVisibleToDealer, setNoteVisibleToDealer] = useState(false)

  const { data: inspection, isLoading } = useQuery({
    queryKey: ['manufacturer-inspection', id],
    queryFn: () => manufacturerInspectionApi.getById(id!).then((res) => res.data),
    enabled: !!id,
  })

  // Group items by category
  const groupedItems = inspection?.manufacturerInspectionItems?.reduce((acc: any, item: any) => {
    const categoryId = item.checklistItem?.category?.id || 'uncategorized'
    const categoryName = item.checklistItem?.category?.name || 'Uncategorized'
    if (!acc[categoryId]) {
      acc[categoryId] = {
        id: categoryId,
        name: categoryName,
        items: [],
      }
    }
    acc[categoryId].items.push(item)
    return acc
  }, {}) || {}

  const categories = Object.values(groupedItems)

  // Expand first category by default
  useEffect(() => {
    if (categories.length > 0 && expandedCategories.size === 0) {
      setExpandedCategories(new Set([(categories[0] as any).id]))
    }
  }, [categories])

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: any }) =>
      manufacturerInspectionApi.updateItem(id!, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturer-inspection', id] })
    },
  })

  const completeMutation = useMutation({
    mutationFn: (data: { generalNotes?: string }) =>
      manufacturerInspectionApi.complete(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturer-inspection', id] })
      navigate('/manufacturer')
    },
  })

  const createNoteMutation = useMutation({
    mutationFn: (data: any) => itemNotesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturer-inspection', id] })
      setNoteContent('')
    },
  })

  const handleStatusChange = (itemId: string, status: string) => {
    updateItemMutation.mutate({
      itemId,
      data: {
        status,
        isIssue: status === 'ISSUE' || status === 'FAIL',
      },
    })
  }

  const handleNotesChange = (itemId: string, notes: string) => {
    updateItemMutation.mutate({ itemId, data: { notes } })
  }

  const handleSeverityChange = (itemId: string, severity: string) => {
    updateItemMutation.mutate({ itemId, data: { issueSeverity: severity } })
  }

  const handleAddNote = (itemId: string) => {
    if (!noteContent.trim()) return
    createNoteMutation.mutate({
      manufacturerItemId: itemId,
      content: noteContent,
      visibleToDealer: noteVisibleToDealer,
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const getStatusIcon = (status: string) => {
    const option = STATUS_OPTIONS.find((o) => o.value === status)
    if (!option) return null
    const Icon = option.icon
    return <Icon className={clsx('h-5 w-5', option.color)} />
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading inspection...</div>
  }

  if (!inspection) {
    return <div className="p-8 text-center">Inspection not found</div>
  }

  const progress = inspection.progress || {
    totalItems: 0,
    completedItems: 0,
    percentComplete: 0,
  }

  const canComplete = progress.percentComplete === 100 && inspection.status === 'IN_PROGRESS'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/manufacturer')} className="btn-secondary btn-sm">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manufacturer Inspection</h1>
            <p className="text-sm text-gray-500">
              {inspection.unit?.model?.name} - VIN: {inspection.unit?.vin}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium',
            inspection.status === 'IN_PROGRESS' && 'bg-yellow-100 text-yellow-800',
            inspection.status === 'COMPLETED' && 'bg-blue-100 text-blue-800',
            inspection.status === 'APPROVED' && 'bg-green-100 text-green-800',
          )}>
            {inspection.status}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {progress.completedItems} / {progress.totalItems} items ({progress.percentComplete}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
          <div className="mt-2 flex gap-4 text-xs">
            <span className="text-green-600">{progress.passedItems} passed</span>
            <span className="text-yellow-600">{progress.issueItems} issues</span>
            <span className="text-red-600">{progress.failedItems} failed</span>
          </div>
        </div>
      </div>

      {/* Inspection Items by Category */}
      <div className="space-y-4">
        {(categories as any[]).map((category) => (
          <div key={category.id} className="card">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full card-header flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <h3 className="font-semibold">{category.name}</h3>
              </div>
              <span className="text-sm text-gray-500">
                {category.items.filter((i: any) => i.status !== 'PENDING').length} / {category.items.length}
              </span>
            </button>

            {expandedCategories.has(category.id) && (
              <div className="divide-y">
                {category.items.map((item: any) => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="font-medium">{item.checklistItem?.description}</span>
                          <span className="text-xs text-gray-400">({item.checklistItem?.code})</span>
                        </div>

                        {/* Requirements */}
                        {item.checklistItem?.requirements && (
                          <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="font-medium">Requirement:</span> {item.checklistItem.requirements}
                          </p>
                        )}

                        {/* Status Buttons */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {STATUS_OPTIONS.filter(o => o.value !== 'PENDING').map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleStatusChange(item.id, option.value)}
                              disabled={inspection.status !== 'IN_PROGRESS'}
                              className={clsx(
                                'px-3 py-1 rounded-md text-sm font-medium border transition-colors',
                                item.status === option.value
                                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                                  : 'border-gray-300 hover:border-gray-400'
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>

                        {/* Severity (for issues/fails) */}
                        {(item.status === 'ISSUE' || item.status === 'FAIL') && (
                          <div className="mt-3">
                            <label className="text-sm text-gray-600">Severity:</label>
                            <div className="flex gap-2 mt-1">
                              {SEVERITY_OPTIONS.map((sev) => (
                                <button
                                  key={sev.value}
                                  onClick={() => handleSeverityChange(item.id, sev.value)}
                                  disabled={inspection.status !== 'IN_PROGRESS'}
                                  className={clsx(
                                    'px-2 py-1 rounded text-xs font-medium',
                                    item.issueSeverity === sev.value ? sev.color : 'bg-gray-100'
                                  )}
                                >
                                  {sev.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        <div className="mt-3">
                          <textarea
                            placeholder="Add notes..."
                            value={item.notes || ''}
                            onChange={(e) => handleNotesChange(item.id, e.target.value)}
                            disabled={inspection.status !== 'IN_PROGRESS'}
                            className="input w-full h-16 text-sm"
                          />
                        </div>

                        {/* Shared Notes */}
                        {item.itemNotes?.length > 0 && (
                          <div className="mt-3 bg-blue-50 p-2 rounded">
                            <div className="text-xs font-medium text-blue-700 mb-1">Shared Notes:</div>
                            {item.itemNotes.map((note: any) => (
                              <div key={note.id} className="text-sm text-blue-900">
                                <span className="font-medium">{note.author?.name}:</span> {note.content}
                                {note.visibleToDealer && (
                                  <Eye className="inline h-3 w-3 ml-1 text-blue-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Note Button */}
                        {inspection.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                            className="mt-2 text-sm text-primary-600 flex items-center gap-1"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Add shared note
                          </button>
                        )}

                        {/* Add Note Form */}
                        {selectedItem?.id === item.id && (
                          <div className="mt-2 p-3 bg-gray-50 rounded">
                            <textarea
                              value={noteContent}
                              onChange={(e) => setNoteContent(e.target.value)}
                              placeholder="Enter note..."
                              className="input w-full h-16 text-sm"
                            />
                            <div className="mt-2 flex items-center justify-between">
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={noteVisibleToDealer}
                                  onChange={(e) => setNoteVisibleToDealer(e.target.checked)}
                                />
                                {noteVisibleToDealer ? (
                                  <><Eye className="h-4 w-4" /> Visible to dealer</>
                                ) : (
                                  <><EyeOff className="h-4 w-4" /> Internal only</>
                                )}
                              </label>
                              <button
                                onClick={() => handleAddNote(item.id)}
                                disabled={!noteContent.trim()}
                                className="btn-primary btn-sm"
                              >
                                Add Note
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      {inspection.status === 'IN_PROGRESS' && (
        <div className="card">
          <div className="card-body flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to submit?</p>
              <p className="text-sm text-gray-500">
                {canComplete
                  ? 'All items have been reviewed. Click Complete to submit for approval.'
                  : `Complete all items before submitting. ${progress.totalItems - progress.completedItems} items remaining.`}
              </p>
            </div>
            <button
              onClick={() => completeMutation.mutate({})}
              disabled={!canComplete || completeMutation.isPending}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {completeMutation.isPending ? 'Submitting...' : 'Complete Inspection'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
