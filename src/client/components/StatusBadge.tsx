type Status = 'draft' | 'submitted' | 'in_review' | 'approved' | 'active' | 'not_started' | 'in_progress';

interface Props {
  status: Status | string;
}

const statusStyles: Record<Status, string> = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  active: 'bg-green-200 text-green-900',
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<Status, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  in_review: 'In Review',
  approved: 'Approved',
  active: 'Active',
  not_started: 'Not Started',
  in_progress: 'In Progress',
};

export default function StatusBadge({ status }: Props) {
  const normalized = status as Status;
  const style = statusStyles[normalized] || 'bg-gray-100 text-gray-800';
  const label = statusLabels[normalized] || status;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
