import { PDFDocument, StandardFonts } from 'pdf-lib';
import PDFKit from 'pdfkit';
import { Writable } from 'stream';

export async function prefillPermitForm(
  formPdfUrl: string,
  fieldData: Record<string, string>
): Promise<Uint8Array> {
  const formBytes = await fetch(formPdfUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formBytes);
  const form = pdfDoc.getForm();

  for (const [fieldName, value] of Object.entries(fieldData)) {
    try {
      const field = form.getTextField(fieldName);
      field.setText(value);
    } catch {
      // Field not found — skip
    }
  }

  form.flatten();
  return pdfDoc.save();
}

export async function generateDataSheet(permit: any, fieldData: Record<string, string>, project: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFKit({ size: 'LETTER', margin: 50 });

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Permit Application Data Sheet', 50, 50)
      .moveDown(1);

    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Permit: ${permit.name}`)
      .text(`Project: ${project.name}`)
      .text(`Address: ${project.address}`)
      .text(`Jurisdiction: ${project.jurisdiction?.name || 'Unknown'}`)
      .moveDown(1);

    doc.font('Helvetica-Bold').text('Project Information:', { underline: true });
    doc.font('Helvetica');
    Object.entries(fieldData).forEach(([key, value]) => {
      doc.text(`${key.replace(/_/g, ' ').toUpperCase()}: ${value}`);
    });

    doc.moveDown(1).font('Helvetica-Bold').text('Instructions:', { underline: true });
    doc.font('Helvetica').text(
      'This data sheet contains the information needed to complete the official permit application form. ' +
      "Please transfer the values above to the official PDF form manually. For electronic submission, visit your jurisdiction's portal."
    );

    doc.end();
  });
}

export async function generateChecklist(project: any, permits: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFKit({ size: 'LETTER', margin: 50 });

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('Permit Pilot', 50, 50)
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#666')
      .text('Permit Compliance Checklist', 50, 78)
      .moveDown(2);

    doc
      .fillColor('#000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(project.name)
      .font('Helvetica')
      .fontSize(11)
      .text(project.address)
      .text(`Jurisdiction: ${project.jurisdictionName || project.jurisdiction?.name || 'Unknown'}`)
      .text(`Generated: ${new Date().toLocaleDateString()}`)
      .moveDown(0.5);

    if (project.jurisdiction?.portalUrl) {
      doc.fillColor('#0066cc').text(`Permit Portal: ${project.jurisdiction.portalUrl}`, { link: project.jurisdiction.portalUrl, underline: true }).fillColor('#000');
    }

    doc.moveDown(1.5);

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Project Summary')
      .moveDown(0.3)
      .font('Helvetica')
      .fontSize(11)
      .text(project.aiSummary || 'No summary available')
      .moveDown(1.5);

    for (const item of permits) {
      const permit = item.pt || item.permitType;
      if (!permit) continue;
      
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text(`[ ]  ${permit.name}`)
        .moveDown(0.3);

      const docs = permit.requiredDocs ?? [];
      for (const d of docs) {
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(`      • ${d.name}`, { indent: 20 })
          .fillColor('#555')
          .text(`        ${d.description ?? ''}`, { indent: 20 })
          .fillColor('#000');
      }

      if (permit.feeBase) {
        doc
          .fontSize(10)
          .fillColor('#333')
          .text(`      💰 Fee: $${permit.feeBase} base${permit.feePerSqft ? ` + $${permit.feePerSqft}/sqft` : ''}`, { indent: 20 })
          .fillColor('#000');
      }

      if (item.pp?.notes) {
        doc.fontSize(10).fillColor('#555').text(`      📝 Notes: ${item.pp.notes}`, { indent: 20 }).fillColor('#000');
      }

      if (item.pp?.status && item.pp.status !== 'not_started') {
        const statusLabels: Record<string, string> = { applied: 'Applied', in_review: 'In Review', approved: 'Approved ✓' };
        doc.fontSize(10).fillColor('#005500').text(`      Status: ${statusLabels[item.pp.status] || item.pp.status}`, { indent: 20 }).fillColor('#000');
      }

      doc.moveDown(1);
    }

    doc
      .moveDown(2)
      .fontSize(9)
      .fillColor('#888')
      .text(
        'DISCLAIMER: This checklist is generated for informational purposes only and does not constitute legal or professional permitting advice. Always verify requirements directly with your local permitting authority before submitting applications. Permit Pilot is not responsible for errors or omissions in local requirement data.',
        { align: 'left' }
      );

    doc.end();
  });
}
