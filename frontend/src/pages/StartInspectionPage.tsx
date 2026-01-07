import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { manufacturerInspectionApi, unitsApi } from '../services/api'
import { ArrowLeft, Play, AlertTriangle } from 'lucide-react'

export default function StartInspectionPage() {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()

  // Try to get unit by ID first (it might be a UUID)
  const { data: unit, isLoading } = useQuery({
    queryKey: ['unit', unitId],
    queryFn: async () => {
      try {
        // First try to get by VIN
        const res = await unitsApi.getByVin(unitId!)
        return res.data
      } catch {
        // If that fails, the unitId might be a UUID, try listing with filter
        return null
      }
    },
    enabled: !!unitId,
  })

  const startMutation = useMutation({
    mutationFn: () => manufacturerInspectionApi.start(unit?.id || unitId!),
    onSuccess: (response) => {
      navigate(`/manufacturer/inspection/${response.data.id}`)
    },
    onError: (error: any) => {
      console.error('Failed to start inspection:', error)
    },
  })

  if (isLoading) {
    return <div className="p-8 text-center">Loading unit...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/manufacturer')} className="btn-secondary btn-sm">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Start Inspection</h1>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Unit Details</h2>
        </div>
        <div className="card-body">
          {unit ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-gray-500">VIN</label>
                <p className="font-mono font-medium">{unit.vin}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Model</label>
                <p className="font-medium">{unit.model?.name || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Model Year</label>
                <p className="font-medium">{unit.modelYear}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Dealer</label>
                <p className="font-medium">{unit.dealer?.name || 'Unassigned'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <p className="font-medium">{unit.status}</p>
              </div>
              {unit.exteriorColor && (
                <div>
                  <label className="text-sm text-gray-500">Exterior Color</label>
                  <p className="font-medium">{unit.exteriorColor}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-500">Unit not found or unable to load details.</p>
              <p className="text-sm text-gray-400">Unit ID: {unitId}</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Inspection Checklist</h2>
        </div>
        <div className="card-body">
          <p className="text-gray-600 mb-4">
            Starting an inspection will create a new inspection record and load the appropriate
            checklist for this unit's model. All checklist items will be set to "Pending" status.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Before you begin</h4>
                <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                  <li>Ensure you have physical access to the unit</li>
                  <li>Have your documentation and camera ready</li>
                  <li>The inspection must be completed before the unit can be approved</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer flex justify-end">
          <button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending || !unit}
            className="btn-primary flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {startMutation.isPending ? 'Starting...' : 'Start Inspection'}
          </button>
        </div>
      </div>
    </div>
  )
}
