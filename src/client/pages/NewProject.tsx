import { useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { get, post } from '../lib/api';
import JurisdictionSearch from '../components/JurisdictionSearch';
import AddressAutocomplete from '../components/AddressAutocomplete';

const PROJECT_TYPES = [
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
  { value: 'demolition', label: 'Demolition' },
  { value: 'commercial_remodel', label: 'Commercial remodel' },
];

export default function NewProject() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'natural' | 'structured'>('natural');
  const [naturalInput, setNaturalInput] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);

  const [address, setAddress] = useState(searchParams.get('address') || '');
  const [jurisdictionId, setJurisdictionId] = useState('');
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
  const [geocodeResult, setGeocodedResult] = useState<any>(null);
  const [jurisdictionAutoDetected, setJurisdictionAutoDetected] = useState(false);

  const handleJurisdictionSelect = (jur: any) => {
    setJurisdictionId(jur.id);
    setJurisdictionName(jur.name);
  };

  const handleGeocode = (result: any) => {
    setGeocodedResult(result);
    if (result?.found && result?.jurisdiction) {
      setJurisdictionId(result.jurisdiction.id);
      setJurisdictionName(result.jurisdiction.name);
      setJurisdictionAutoDetected(true);
    }
    if (result?.inFloodZone) setInFloodZone(true);
  };

  const handleParseNL = async () => {
    if (!naturalInput.trim()) return setError('Please describe your project');
    setParsing(true);
    setError(null);
    try {
      const parsed = await post<any>('/api/projects/parse', { input: naturalInput, jurisdictionId });
      setParsedData(parsed);
      setProjectName(parsed.projectName || '');
      setDescription(parsed.description || naturalInput);
      setProjectType(parsed.projectType || '');
      setSquareFootage(parsed.squareFootage || undefined);
      setEstimatedValue(parsed.estimatedValue || undefined);
      setIsCommercial(parsed.isCommercial || false);
      setInvolvesExisting(parsed.existingStructure !== false);
      setInHistoric(parsed.inHistoric || false);
      setInFloodZone(parsed.inFloodZone || false);
      if (parsed.address && !address) setAddress(parsed.address);
      setStep(2);
    } catch (e: any) {
      setError('Failed to parse description. Please try structured input.');
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!jurisdictionId) return setError('Please select a jurisdiction');
    if (!description.trim()) return setError('Please describe your project');
    if (!projectName.trim()) return setError('Please enter a project name');
    setLoading(true);
    try {
      const result = await post<any>('/api/projects', {
        name: projectName, description, projectType, jurisdictionId,
        squareFootage, estimatedValue, address, isCommercial,
        existingStructure: involvesExisting, inHistoric, inFloodZone,
        naturalLanguageInput: inputMode === 'natural' ? naturalInput : null,
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
      if (!jurisdictionId) return setError('Please select a jurisdiction');
      if (inputMode === 'structured' && !projectType) return setError('Please select a project type');
    }
    if (step === 2) {
      if (!projectName.trim()) return setError('Project name is required');
      if (!description.trim()) return setError('Project description is required');
    }
    setError(null);
    setStep(step + 1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">New Project</h1>

      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ' + (step >= s ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-400')}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={'w-12 h-1 ' + (step > s ? 'bg-cyan-500' : 'bg-slate-700')} />}
          </div>
        ))}
        <div className="ml-4 text-sm text-slate-400 self-center">
          {step === 1 ? 'Location & Project Type' : step === 2 ? 'Project Details' : 'Review & Submit'}
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-4 text-rose-100">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Step 1 */}
        {step === 1 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Jurisdiction <span className="text-rose-400">*</span></label>
              <JurisdictionSearch onSelect={handleJurisdictionSelect} selectedId={jurisdictionId} />
              {jurisdictionName && (
                <p className="text-sm text-cyan-300 mt-1">
                  ✓ {jurisdictionName}
                  {jurisdictionAutoDetected && <span className="ml-2 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Auto-detected</span>}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Project Address</label>
              <AddressAutocomplete
                value={address}
                onChange={setAddress}
                onGeocode={handleGeocode}
                placeholder="Start typing an address..."
              />
              {geocodeResult?.found && geocodeResult?.jurisdictionName && (
                <p className="text-xs text-emerald-400 mt-1">✓ {geocodeResult.jurisdictionName} detected</p>
              )}
              {geocodeResult?.found && !geocodeResult?.jurisdictionName && (
                <p className="text-xs text-amber-400 mt-1">⚠ Address outside covered DFW jurisdictions — please select manually</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-3">How would you like to describe your project?</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button type="button" onClick={() => setInputMode('natural')}
                  className={'rounded-xl border p-4 text-left transition ' + (inputMode === 'natural' ? 'border-cyan-400/60 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20')}>
                  <p className="font-medium mb-1">✨ Natural Language</p>
                  <p className="text-xs opacity-70">Just describe it in plain English — AI will extract the details</p>
                </button>
                <button type="button" onClick={() => setInputMode('structured')}
                  className={'rounded-xl border p-4 text-left transition ' + (inputMode === 'structured' ? 'border-cyan-400/60 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20')}>
                  <p className="font-medium mb-1">📋 Structured Form</p>
                  <p className="text-xs opacity-70">Fill out fields manually for precise control</p>
                </button>
              </div>

              {inputMode === 'natural' ? (
                <div className="space-y-3">
                  <textarea value={naturalInput} onChange={e => setNaturalInput(e.target.value)} rows={5}
                    placeholder={'Example: "Adding a 400 sqft master bedroom and full bath to an existing 1980s ranch home in McKinney. Will extend the roofline and add new HVAC zone. Budget around $120k."'}
                    className="w-full px-3 py-2 border border-white/20 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-500 text-sm" />
                  <button type="button" onClick={handleParseNL} disabled={parsing || !naturalInput.trim()}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                    {parsing ? (
                      <><span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/40 border-t-slate-950" /> Analyzing...</>
                    ) : '✨ Parse with AI →'}
                  </button>
                  {parsedData?.clarifyingQuestions?.length > 0 && (
                    <div className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-4">
                      <p className="text-sm font-medium text-amber-200 mb-2">AI has some questions:</p>
                      <ul className="space-y-1">
                        {parsedData.clarifyingQuestions.map((q: string, i: number) => (
                          <li key={i} className="text-sm text-amber-100">• {q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PROJECT_TYPES.map(opt => (
                      <label key={opt.value} className={'flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition ' + (projectType === opt.value ? 'border-cyan-400/60 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20')}>
                        <input type="radio" name="projectType" value={opt.value} checked={projectType === opt.value} onChange={() => setProjectType(opt.value)} className="sr-only" />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-1">Square Footage</label>
                      <input type="number" value={squareFootage || ''} onChange={e => setSquareFootage(parseFloat(e.target.value) || undefined)}
                        className="w-full px-3 py-2 border border-white/20 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-1">Estimated Value ($)</label>
                      <input type="number" value={estimatedValue || ''} onChange={e => setEstimatedValue(parseFloat(e.target.value) || undefined)}
                        className="w-full px-3 py-2 border border-white/20 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isCommercial} onChange={e => setIsCommercial(e.target.checked)} className="rounded" />
                    <span className="text-sm text-slate-200">This is a commercial project</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Project Details</h2>

            {parsedData && (
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm">
                <p className="text-cyan-200 font-medium mb-1">✨ AI parsed your description</p>
                <p className="text-slate-300">Confidence: {Math.round((parsedData.confidence || 0) * 100)}% — review and edit below</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Project Name <span className="text-rose-400">*</span></label>
              <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. Master Bedroom Addition — 123 Oak St"
                className="w-full px-3 py-2 border border-white/20 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>

            {inputMode === 'natural' && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Project Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROJECT_TYPES.map(opt => (
                    <label key={opt.value} className={'flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition text-sm ' + (projectType === opt.value ? 'border-cyan-400/60 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20')}>
                      <input type="radio" name="projectType2" value={opt.value} checked={projectType === opt.value} onChange={() => setProjectType(opt.value)} className="sr-only" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Description <span className="text-rose-400">*</span></label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
                placeholder="Detailed project description..."
                className="w-full px-3 py-2 border border-white/20 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm" />
            </div>

            {inputMode === 'natural' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Square Footage</label>
                  <input type="number" value={squareFootage || ''} onChange={e => setSquareFootage(parseFloat(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-white/20 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Estimated Value ($)</label>
                  <input type="number" value={estimatedValue || ''} onChange={e => setEstimatedValue(parseFloat(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-white/20 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Involves existing structure', state: involvesExisting, set: setInvolvesExisting },
                { label: 'Commercial project', state: isCommercial, set: setIsCommercial },
                { label: 'In historic district', state: inHistoric, set: setInHistoric },
                { label: 'In flood zone', state: inFloodZone, set: setInFloodZone },
              ].map(({ label, state, set }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className="rounded" />
                  <span className="text-sm text-slate-200">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Review & Submit</h2>
            <div className="grid gap-2 text-sm">
              {[
                ['Project Name', projectName],
                ['Address', address || 'Not specified'],
                ['Jurisdiction', jurisdictionName],
                ['Project Type', PROJECT_TYPES.find(t => t.value === projectType)?.label || projectType || 'Not specified'],
                ['Square Footage', squareFootage ? squareFootage + ' sqft' : 'Not specified'],
                ['Estimated Value', estimatedValue ? '$' + estimatedValue.toLocaleString() : 'Not specified'],
                ['Commercial', isCommercial ? 'Yes' : 'No'],
                ['Historic District', inHistoric ? 'Yes' : 'No'],
                ['Flood Zone', inFloodZone ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-sm font-medium text-slate-200 mb-1">Description</p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{description}</p>
            </div>
            <div className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              Clicking Submit will run AI analysis to identify all required permits. This takes 10-30 seconds. You'll be notified by email when complete.
            </div>
          </div>
        )}

        <div className="flex justify-between">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 border border-white/20 bg-slate-800 text-white rounded-lg hover:bg-slate-700">Back</button>
          ) : <div />}
          {step < 3 ? (
            <button type="button" onClick={nextStep}
              className="px-5 py-2 bg-cyan-500 text-slate-950 rounded-lg font-medium hover:bg-cyan-400">
              Continue →
            </button>
          ) : (
            <button type="submit" disabled={loading} className="px-5 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-400 disabled:opacity-50 flex items-center gap-2">
              {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Analyzing...</> : 'Submit & Analyze'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
