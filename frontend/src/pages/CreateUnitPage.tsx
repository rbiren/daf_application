import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { manufacturerUnitsApi } from '../services/api'
import api from '../services/api'
import { ArrowLeft, Save } from 'lucide-react'

export default function CreateUnitPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    vin: '',
    modelYear: new Date().getFullYear(),
    dealerId: '',
    modelId: '',
    stockNumber: '',
    exteriorColor: '',
    interiorColor: '',
    chassisType: '',
    engineType: '',
    gvwr: '',
    msrp: '',
    productionDate: '',
    plantLocation: '',
    specialInstructions: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch dealers and models for dropdowns
  const { data: dealers } = useQuery({
    queryKey: ['dealers'],
    queryFn: () => api.get('/dealers').then((res) => res.data),
  })

  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: () => api.get('/models').then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => manufacturerUnitsApi.create(data),
    onSuccess: (response) => {
      navigate(`/manufacturer/inspection/start/${response.data.id}`)
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message })
      }
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.vin || formData.vin.length !== 17) {
      newErrors.vin = 'VIN must be exactly 17 characters'
    }

    if (!formData.modelYear || formData.modelYear < 2000 || formData.modelYear > 2100) {
      newErrors.modelYear = 'Model year must be between 2000 and 2100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const data: any = {
      vin: formData.vin.toUpperCase(),
      modelYear: parseInt(String(formData.modelYear)),
    }

    // Add optional fields
    if (formData.dealerId) data.dealerId = formData.dealerId
    if (formData.modelId) data.modelId = formData.modelId
    if (formData.stockNumber) data.stockNumber = formData.stockNumber
    if (formData.exteriorColor) data.exteriorColor = formData.exteriorColor
    if (formData.interiorColor) data.interiorColor = formData.interiorColor
    if (formData.chassisType) data.chassisType = formData.chassisType
    if (formData.engineType) data.engineType = formData.engineType
    if (formData.gvwr) data.gvwr = parseInt(formData.gvwr)
    if (formData.msrp) data.msrp = parseFloat(formData.msrp)
    if (formData.productionDate) data.productionDate = formData.productionDate
    if (formData.plantLocation) data.plantLocation = formData.plantLocation
    if (formData.specialInstructions) data.specialInstructions = formData.specialInstructions

    createMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-secondary btn-sm">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Unit</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>
          <div className="card-body grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">VIN *</label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                maxLength={17}
                className={`input w-full uppercase ${errors.vin ? 'border-red-500' : ''}`}
                placeholder="17-character VIN"
              />
              {errors.vin && <p className="text-sm text-red-500 mt-1">{errors.vin}</p>}
              <p className="text-xs text-gray-500 mt-1">{formData.vin.length}/17 characters</p>
            </div>

            <div>
              <label className="label">Model Year *</label>
              <input
                type="number"
                name="modelYear"
                value={formData.modelYear}
                onChange={handleChange}
                min={2000}
                max={2100}
                className={`input w-full ${errors.modelYear ? 'border-red-500' : ''}`}
              />
              {errors.modelYear && <p className="text-sm text-red-500 mt-1">{errors.modelYear}</p>}
            </div>

            <div>
              <label className="label">Model</label>
              <select
                name="modelId"
                value={formData.modelId}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="">Select Model</option>
                {models?.data?.map((model: any) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Dealer</label>
              <select
                name="dealerId"
                value={formData.dealerId}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="">Select Dealer</option>
                {dealers?.data?.map((dealer: any) => (
                  <option key={dealer.id} value={dealer.id}>
                    {dealer.name} ({dealer.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Stock Number</label>
              <input
                type="text"
                name="stockNumber"
                value={formData.stockNumber}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., STK-2024-001"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Specifications</h2>
          </div>
          <div className="card-body grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Exterior Color</label>
              <input
                type="text"
                name="exteriorColor"
                value={formData.exteriorColor}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Champagne Metallic"
              />
            </div>

            <div>
              <label className="label">Interior Color</label>
              <input
                type="text"
                name="interiorColor"
                value={formData.interiorColor}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Saddle Leather"
              />
            </div>

            <div>
              <label className="label">Chassis Type</label>
              <input
                type="text"
                name="chassisType"
                value={formData.chassisType}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Ford F-53"
              />
            </div>

            <div>
              <label className="label">Engine Type</label>
              <input
                type="text"
                name="engineType"
                value={formData.engineType}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., 7.3L V8"
              />
            </div>

            <div>
              <label className="label">GVWR (lbs)</label>
              <input
                type="number"
                name="gvwr"
                value={formData.gvwr}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., 22000"
              />
            </div>

            <div>
              <label className="label">MSRP ($)</label>
              <input
                type="number"
                name="msrp"
                value={formData.msrp}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., 250000"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Production Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Production Information</h2>
          </div>
          <div className="card-body grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Production Date</label>
              <input
                type="date"
                name="productionDate"
                value={formData.productionDate}
                onChange={handleChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="label">Plant Location</label>
              <input
                type="text"
                name="plantLocation"
                value={formData.plantLocation}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Elkhart, IN"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Special Instructions</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                className="input w-full h-24"
                placeholder="Any special notes or instructions for this unit..."
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {createMutation.isPending ? 'Creating...' : 'Create & Start Inspection'}
          </button>
        </div>
      </form>
    </div>
  )
}
