interface Props {
  projectId: string;
}

export default function FormZipExport({ projectId }: Props) {
  const downloadForms = async () => {
    const response = await fetch(`/api/export/${projectId}/forms`, { credentials: 'include' });
    if (!response.ok) {
      alert('No permit forms are currently available for this project.');
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permit-forms-${projectId}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadForms}
      className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 text-sm font-medium"
      title="Download pre-filled permit forms as ZIP"
    >
      🗂️ Forms ZIP
    </button>
  );
}
