import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { get, post } from '../lib/api';
import JurisdictionSearch from '../components/JurisdictionSearch';

export default function NewProject() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [address, setAddress] = useState(searchParams.get('address') || '');
  const [jurisdictionId, setJurisdictionId] = useState<string>('');
  const [jurisdictionName, setJurisdictionName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [squareFootage, setSquareFootage] = useState<number>();
  const [estimatedValue, setEstimatedValue] = useState<number>();
  const [description, setDescription] = useState('');
  const [isCommercial, setIsCommercial] = useState(false);
  const [involvesExisting, setInvolvesExisting] = useState(true);
  const [inHistoric, setInHistoric] = useState(false);
  const [inFloodZone, setInFloodZone] = useState(false);
  const [projectName, setProjectName] = useState('');

  const { data: jurisdictionData } = useQuery({
    queryKey: ['jurisdiction', jurisdictionId],
    queryFn: () => get<any>(`/api/jurisdictions/${jurisdictionId}`),
    enabled: !!jurisdictionId,
  });

  const handleJurisdictionSelect = (jur: any) => {
    setJurisdictionId(jur.id);
    setJurisdictionName(jur.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jurisdictionId) {
      setError('Please select a jurisdiction');
      return;
    }

    if (!description.trim()) {
      setError('Please describe your project');
      return;
    }

    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    setLoading(true);
    try {
      const result = await post<any>('/api/projects', {
        name: projectName,
        description,
        projectType,
        jurisdictionId,
        squareFootage,
        estimatedValue,
        address,
        isCommercial,
        existingStructure: involvesExisting,
        inHistoric,
        inFloodZone,
      });
      navigate(`/projects/${result.project.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!address.trim()) return setError('Address is required');
      if (!jurisdictionId) return setError('Please select a jurisdiction');
    }
    if (step === 2) {
      if (!projectName.trim()) return setError('Project name is required');
      if (!description.trim()) return setError('Project description is required');
      if (!projectType) return setError('Project type is required');
    }
    setError(null);
    setStep(step + 1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">New Project</h1>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Location */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold">Location</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, TX"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
              <JurisdictionSearch onSelect={handleJurisdictionSelect} selectedId={jurisdictionId} />
              {jurisdictionName && (
                <p className="text-sm text-gray-600 mt-1">Selected: {jurisdictionName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <div className="space-y-2">
                {[
                  { value: 'room_addition', label: 'Room addition' },
                  { value: 'new_construction', label: 'New construction' },
                  { value: 'garage', label: 'Garage/Carport' },
                  { value: 'adu', label: 'ADU/Guest house' },
                  { value: 'deck_patio', label: 'Deck/Patio' },
                  { value: 'roof_replacement', label: 'Roof replacement' },
                  { value: 'electrical_upgrade', label: 'Electrical upgrade' },
                  { value: 'plumbing_modification', label: 'Plumbing modification' },
                  { value: 'hvac_replacement', label: 'HVAC replacement' },
                  { value: 'fence', label: 'Fence' },
                  { value: 'pool', label: 'Pool' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center">
                    <input
                      type="radio"
                      name="projectType"
                      value={opt.value}
                      checked={projectType === opt.value}
                      onChange={() => setProjectType(opt.value)}
                      className="mr-2"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage (optional)</label>
                <input
                  type="number"
                  value={squareFootage || ''}
                  onChange={(e) => setSquareFootage(parseFloat(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value (optional)</label>
                <input
                  type="number"
                  value={estimatedValue || ''}
                  onChange={(e) => setEstimatedValue(parseFloat(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isCommercial}
                onChange={(e) => setIsCommercial(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">This is a commercial project</label>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold">Project Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Add a name for this project"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe your project in detail (e.g., 'Adding a 20x20 bedroom addition with bathroom, extending existing roofline, new electrical and plumbing') "
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={involvesExisting}
                  onChange={(e) => setInvolvesExisting(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Involves existing structure</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={inHistoric}
                  onChange={(e) => setInHistoric(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">In historic district</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={inFloodZone}
                  onChange={(e) => setInFloodZone(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">In flood zone</label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold">Review & Submit</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Project Name:</strong> {projectName}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Jurisdiction:</strong> {jurisdictionName}</p>
              <p><strong>Project Type:</strong> {projectType}</p>
              {squareFootage && <p><strong>Square Footage:</strong> {squareFootage}</p>}
              {estimatedValue && <p><strong>Estimated Value:</strong> ${estimatedValue.toLocaleString()}</p>}
              <p><strong>Commercial:</strong> {isCommercial ? 'Yes' : 'No'}</p>
              <p><strong>Involves Existing Structure:</strong> {involvesExisting ? 'Yes' : 'No'}</p>
              <p><strong>In Historic District:</strong> {inHistoric ? 'Yes' : 'No'}</p>
              <p><strong>In Flood Zone:</strong> {inFloodZone ? 'Yes' : 'No'}</p>
              <div className="mt-4">
                <strong>Project Description:</strong>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">{description}</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-sm text-yellow-800">
                By clicking Submit, our AI will analyze your project and identify all required permits based on local jurisdiction requirements. This may take 10-30 seconds.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Continue
            </button>
          ) : (
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Submit & Analyze'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
