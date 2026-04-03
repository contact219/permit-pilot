interface Props {
  projectId: string;
}

export default function ChecklistExport({ projectId }: Props) {
  const downloadChecklist = async () => {
    const response = await fetch(`/api/export/${projectId}/checklist`);
    if (!response.ok) {
      alert('Failed to generate checklist');
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist-${projectId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadChecklist}
      className="px-3 py-2 bg-emerald-400/20 text-emerald-200 rounded-lg hover:bg-emerald-400/30 text-sm font-medium"
      title="Download compliance checklist"
    >
      📄 Checklist
    </button>
  );
}
