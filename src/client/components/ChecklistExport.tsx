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
      className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm"
      title="Download compliance checklist"
    >
      📄 Checklist
    </button>
  );
}
