interface Props {
  permit: any;
  onUpdateStatus?: (status: string) => void;
}

export default function PermitCard({ permit, onUpdateStatus }: Props) {
  const { name, code, description, requiredDocs, feeBase, feePerSqft, status, notes } = permit;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">Code: {code}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          status === 'approved' ? 'bg-green-100 text-green-800' :
          status === 'submitted' ? 'bg-blue-100 text-blue-800' :
          status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-600'
        }`}>
          {status?.replace('_', ' ') || 'Unknown'}
        </span>
      </div>
      
      {notes && (
        <p className="text-gray-700 mb-4 text-sm">{notes}</p>
      )}

      {requiredDocs && requiredDocs.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Required Documents:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {requiredDocs.map((doc: any, idx: number) => (
              <li key={idx} className="text-sm text-gray-600">
                <strong>{doc.name}:</strong> {doc.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feeBase && (
        <p className="text-sm text-gray-600 mb-4">
          <strong>Fee:</strong> ${feeBase} base{feePerSqft ? ` + $${feePerSqft}/sqft` : ''}
        </p>
      )}

      {onUpdateStatus && (
        <div className="flex gap-2 mt-4">
          <select
            onChange={(e) => onUpdateStatus(e.target.value)}
            defaultValue={status}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      )}
    </div>
  );
}
