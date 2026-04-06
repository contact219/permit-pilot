import PDFKit from 'pdfkit';
import { PDFDocument } from 'pdf-lib';

// ── Color palette ─────────────────────────────────────────────────────────────
const C = {
  navy:    '#0f172a',
  cyan:    '#06b6d4',
  indigo:  '#6366f1',
  white:   '#ffffff',
  light:   '#f8fafc',
  mid:     '#94a3b8',
  dark:    '#1e293b',
  green:   '#10b981',
  amber:   '#f59e0b',
  text:    '#1e293b',
  muted:   '#64748b',
  border:  '#e2e8f0',
};

function drawHeader(doc: any, title: string, subtitle: string) {
  // Navy header bar
  doc.rect(0, 0, 612, 80).fill(C.navy);

  // Cyan accent strip
  doc.rect(0, 80, 612, 4).fill(C.cyan);

  // Logo text
  doc.fillColor(C.white).fontSize(22).font('Helvetica-Bold').text('PP', 40, 22);
  doc.rect(40, 22, 28, 28).stroke(C.cyan);

  // Title
  doc.fillColor(C.white).fontSize(16).font('Helvetica-Bold').text(title, 80, 24);
  doc.fillColor(C.cyan).fontSize(9).font('Helvetica').text(subtitle, 80, 46);

  // Right side
  doc.fillColor(C.mid).fontSize(8).text('permitpilot.online', 430, 30, { width: 140, align: 'right' });
  doc.fillColor(C.mid).fontSize(8).text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 430, 44, { width: 140, align: 'right' });
}

function drawSectionHeader(doc: any, title: string, y: number): number {
  doc.rect(40, y, 532, 24).fill(C.dark);
  doc.fillColor(C.cyan).fontSize(9).font('Helvetica-Bold').text(title.toUpperCase(), 50, y + 7);
  return y + 32;
}

function drawField(doc: any, label: string, value: string, x: number, y: number, w: number): number {
  // Label
  doc.fillColor(C.muted).fontSize(7).font('Helvetica').text(label.toUpperCase(), x, y);
  // Field box
  doc.rect(x, y + 10, w, 18).stroke(C.border);
  // Value
  if (value) {
    doc.fillColor(C.text).fontSize(9).font('Helvetica').text(value, x + 4, y + 14, { width: w - 8, ellipsis: true });
  }
  return y + 32;
}

function drawCheckbox(doc: any, label: string, x: number, y: number, checked = false): number {
  doc.rect(x, y, 10, 10).stroke(C.border);
  if (checked) {
    doc.fillColor(C.green).fontSize(8).font('Helvetica-Bold').text('✓', x + 1, y + 1);
  }
  doc.fillColor(C.text).fontSize(9).font('Helvetica').text(label, x + 16, y + 1);
  return y + 18;
}

function drawDivider(doc: any, y: number): number {
  doc.moveTo(40, y).lineTo(572, y).stroke(C.border);
  return y + 12;
}

// ── Permit type field maps ─────────────────────────────────────────────────────
// Maps permit code → the fields that city form would ask for
const PERMIT_FIELD_MAPS: Record<string, string[][]> = {
  BLDG: [
    ['Project Type', 'Building/Residential Addition'],
    ['Occupancy Classification', 'R-3 Residential'],
    ['Construction Type', 'Type V-B (Wood Frame)'],
    ['Sprinklered', 'No'],
    ['Stories', '1'],
    ['Existing Use', 'Single Family Residential'],
    ['Proposed Use', 'Single Family Residential'],
  ],
  ELEC: [
    ['Service Voltage', '120/240V Single Phase'],
    ['Service Amperage', '200A'],
    ['Number of Circuits', ''],
    ['Panel Upgrade', 'No'],
    ['Underground/Overhead', 'Overhead'],
  ],
  PLMB: [
    ['Fixture Count', ''],
    ['Water Heater', 'Yes'],
    ['Water Heater Type', 'Tank/Tankless'],
    ['Gas/Electric', 'Gas'],
    ['Irrigation System', 'No'],
  ],
  MECH: [
    ['System Type', 'Split System HVAC'],
    ['Heating Type', 'Gas Forced Air'],
    ['Cooling Tons', ''],
    ['Ductwork', 'New/Existing'],
    ['Equipment Location', 'Attic/Closet'],
  ],
  POOL: [
    ['Pool Type', 'In-Ground'],
    ['Pool Dimensions', ''],
    ['Pool Volume (gallons)', ''],
    ['Spa Included', 'No'],
    ['Pool Barrier', 'Yes - Required'],
    ['Electrical Bonding', 'Yes - Required'],
  ],
  DEMO: [
    ['Structure Type', 'Residential'],
    ['Demolition Method', 'Mechanical'],
    ['Asbestos Survey', 'Required if pre-1980'],
    ['Debris Disposal', ''],
  ],
};

function getPermitFields(code: string): string[][] {
  return PERMIT_FIELD_MAPS[code] || [];
}

// ── Main generators ────────────────────────────────────────────────────────────

export async function generateDataSheet(
  permit: any,
  fieldData: Record<string, string>,
  project: any
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFKit({ size: 'LETTER', margin: 0, bufferPages: true });
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const jurisdiction = project.jurisdictionName || project.jurisdiction?.name || 'DFW, TX';

    drawHeader(doc, `${permit.name} — Application Data Sheet`, jurisdiction);

    let y = 100;

    // Project info section
    y = drawSectionHeader(doc, 'Project Information', y);

    const leftX = 40, rightX = 316, halfW = 256;

    drawField(doc, 'Project Name / Description', project.name || '', leftX, y, halfW);
    drawField(doc, 'Permit Type', permit.name || '', rightX, y, halfW);
    y += 32;

    drawField(doc, 'Site Address', fieldData.project_address || project.address || '', leftX, y, halfW);
    drawField(doc, 'City / Jurisdiction', jurisdiction, rightX, y, halfW);
    y += 32;

    drawField(doc, 'Owner Name / Company', fieldData.owner_name || '', leftX, y, halfW);
    drawField(doc, 'Project Type', fieldData.project_type || project.projectType || '', rightX, y, halfW);
    y += 32;

    drawField(doc, 'Square Footage', fieldData.sq_ft || '', leftX, y, 120);
    drawField(doc, 'Estimated Project Value', fieldData.valuation ? '$' + fieldData.valuation : '', leftX + 128, y, 120);
    drawField(doc, 'Permit Code', permit.code || '', rightX, y, 120);
    y += 40;

    // Permit-specific fields
    const specificFields = getPermitFields(permit.code);
    if (specificFields.length > 0) {
      y = drawSectionHeader(doc, `${permit.name} — Specific Requirements`, y);
      let col = 0;
      for (const [label, defaultVal] of specificFields) {
        const x = col === 0 ? leftX : rightX;
        drawField(doc, label, defaultVal, x, y, halfW);
        col++;
        if (col === 2) { col = 0; y += 32; }
      }
      if (col === 1) y += 32;
      y += 8;
    }

    // Required documents
    y = drawSectionHeader(doc, 'Required Documents', y);
    const docs = permit.requiredDocs || [];
    const defaultDocs = [
      'Completed permit application form',
      'Site plan / plot plan showing project location',
      'Construction drawings (floor plan, elevations)',
      'Proof of contractor license bond ($25,000)',
      'Contractor registration with city',
    ];
    const docList = docs.length > 0 ? docs.map((d: any) => d.name || d) : defaultDocs;
    for (const d of docList) {
      y = drawCheckbox(doc, typeof d === 'string' ? d : d.name || String(d), 50, y);
    }
    y += 12;

    // Fee estimate
    y = drawSectionHeader(doc, 'Fee Estimate', y);
    const feeBase = parseFloat(permit.feeBase || '0');
    const feeSqft = parseFloat(permit.feePerSqft || '0');
    const sqft = parseInt(fieldData.sq_ft || '0', 10);
    const totalFee = feeBase + (feeSqft * sqft);

    drawField(doc, 'Base Fee', feeBase ? `$${feeBase.toFixed(2)}` : 'See city fee schedule', leftX, y, halfW);
    drawField(doc, 'Per Sq Ft Rate', feeSqft ? `$${feeSqft.toFixed(2)}/sqft` : 'N/A', rightX, y, halfW);
    y += 32;
    drawField(doc, 'Estimated Total', totalFee > 0 ? `$${totalFee.toFixed(2)}` : 'Contact city for exact amount', leftX, y, halfW);
    drawField(doc, 'Payment Method', 'Online / In Person', rightX, y, halfW);
    y += 40;

    // Submission instructions
    y = drawSectionHeader(doc, 'Submission Instructions', y);
    doc.fillColor(C.text).fontSize(9).font('Helvetica');
    const portalUrl = project.jurisdiction?.portalUrl || '';
    const instructions = [
      `1. Complete the official ${permit.name} application from the ${jurisdiction} building department.`,
      `2. Attach all required documents listed above.`,
      `3. Submit online${portalUrl ? ' at ' + portalUrl : ' via the city permit portal'} or in person.`,
      `4. Pay permit fees at time of application.`,
      `5. Allow ${permit.reviewDays || '7-10'} business days for plan review.`,
      `6. Schedule inspections online once permit is issued.`,
    ];
    for (const line of instructions) {
      doc.text(line, 50, y, { width: 512 });
      y += 16;
    }
    y += 8;

    // Bond reminder
    doc.rect(40, y, 532, 44).fill('#fef3c7');
    doc.rect(40, y, 4, 44).fill(C.amber);
    doc.fillColor('#92400e').fontSize(8).font('Helvetica-Bold').text('CONTRACTOR BOND REQUIRED', 52, y + 6);
    doc.fillColor('#78350f').fontSize(8).font('Helvetica').text(
      `Most ${jurisdiction} permit applications require proof of a $25,000 Contractor License Bond. Get an instant quote at quantumsurety.bond`,
      52, y + 18, { width: 512 }
    );
    y += 56;

    // Footer
    doc.rect(0, 730, 612, 62).fill(C.navy);
    doc.fillColor(C.mid).fontSize(7).font('Helvetica').text(
      'DISCLAIMER: This data sheet is generated by Permit Pilot for informational purposes only. Always verify requirements directly with your local building department. Permit Pilot is not responsible for errors or omissions.',
      40, 736, { width: 532 }
    );
    doc.fillColor(C.cyan).fontSize(8).text('permitpilot.online', 40, 758);
    doc.fillColor(C.mid).fontSize(8).text(`Generated ${new Date().toLocaleDateString()}`, 430, 758, { width: 140, align: 'right' });

    doc.end();
  });
}

export async function prefillPermitForm(
  formPdfUrl: string,
  fieldData: Record<string, string>
): Promise<Uint8Array> {
  const formBytes = await fetch(formPdfUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formBytes);
  const form = pdfDoc.getForm();

  // Try common field name variations
  const fieldAliases: Record<string, string[]> = {
    owner_name:          ['owner_name', 'OwnerName', 'owner', 'Owner', 'applicant_name', 'ApplicantName'],
    project_address:     ['project_address', 'ProjectAddress', 'address', 'Address', 'site_address', 'SiteAddress', 'location'],
    project_description: ['project_description', 'description', 'Description', 'work_description', 'WorkDescription', 'scope'],
    sq_ft:               ['sq_ft', 'square_footage', 'SquareFootage', 'sqft', 'area', 'Area'],
    valuation:           ['valuation', 'Valuation', 'project_value', 'ProjectValue', 'value', 'Value', 'cost'],
    project_type:        ['project_type', 'ProjectType', 'permit_type', 'PermitType', 'type', 'Type'],
  };

  for (const [dataKey, value] of Object.entries(fieldData)) {
    const aliases = fieldAliases[dataKey] || [dataKey];
    for (const alias of aliases) {
      try {
        const field = form.getTextField(alias);
        field.setText(value);
        break;
      } catch { /* try next alias */ }
    }
  }

  try { form.flatten(); } catch { /* some forms resist flattening */ }
  return pdfDoc.save();
}

export async function generateChecklist(project: any, permits: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFKit({ size: 'LETTER', margin: 0, bufferPages: true });
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const jurisdiction = project.jurisdictionName || project.jurisdiction?.name || 'DFW, TX';
    const portalUrl = project.jurisdiction?.portalUrl || '';

    drawHeader(doc, 'Permit Compliance Checklist', `${jurisdiction} — ${project.address || ''}`);

    let y = 100;

    // Project summary
    y = drawSectionHeader(doc, 'Project Overview', y);
    const leftX = 40, rightX = 316, halfW = 256;
    drawField(doc, 'Project Name', project.name || '', leftX, y, halfW);
    drawField(doc, 'Jurisdiction', jurisdiction, rightX, y, halfW);
    y += 32;
    drawField(doc, 'Project Address', project.address || '', leftX, y, halfW);
    drawField(doc, 'Generated Date', new Date().toLocaleDateString(), rightX, y, halfW);
    y += 32;

    if (portalUrl) {
      doc.fillColor(C.muted).fontSize(7).text('PERMIT PORTAL', leftX, y);
      doc.fillColor('#0066cc').fontSize(9).font('Helvetica').text(portalUrl, leftX, y + 10, { link: portalUrl, underline: true });
      y += 28;
    }

    if (project.aiSummary) {
      doc.fillColor(C.muted).fontSize(7).font('Helvetica').text('AI ANALYSIS SUMMARY', leftX, y);
      doc.fillColor(C.text).fontSize(9).text(project.aiSummary, leftX, y + 10, { width: 532 });
      y += Math.ceil(project.aiSummary.length / 90) * 14 + 20;
    }

    // Permits list
    y = drawSectionHeader(doc, `Required Permits (${permits.length})`, y);

    const statusColors: Record<string, string> = {
      not_started: C.muted,
      applied:     C.amber,
      in_review:   '#3b82f6',
      approved:    C.green,
    };
    const statusLabels: Record<string, string> = {
      not_started: 'Not Started',
      applied:     'Applied',
      in_review:   'In Review',
      approved:    'Approved',
    };

    for (const item of permits) {
      const permit = item.pt || item.permitType;
      if (!permit) continue;

      const status = item.pp?.status || 'not_started';
      const statusColor = statusColors[status] || C.muted;
      const statusLabel = statusLabels[status] || status;

      // Permit row background
      doc.rect(40, y, 532, 22).fill(C.light);
      doc.rect(40, y, 4, 22).fill(statusColor);

      // Checkbox
      doc.rect(50, y + 6, 10, 10).stroke(C.border);
      if (status === 'approved') {
        doc.fillColor(C.green).fontSize(8).font('Helvetica-Bold').text('✓', 51, y + 7);
      }

      // Permit name
      doc.fillColor(C.text).fontSize(10).font('Helvetica-Bold').text(permit.name || '', 68, y + 5, { width: 340 });

      // Status badge
      doc.fillColor(statusColor).fontSize(7).font('Helvetica-Bold').text(statusLabel.toUpperCase(), 450, y + 8, { width: 100, align: 'right' });

      y += 26;

      // Details row
      const details = [];
      if (permit.feeBase) details.push(`Fee: $${permit.feeBase}${permit.feePerSqft ? ' + $' + permit.feePerSqft + '/sqft' : ''}`);
      if (permit.code) details.push(`Code: ${permit.code}`);
      if (item.pp?.notes) details.push(`Notes: ${item.pp.notes}`);

      if (details.length > 0) {
        doc.fillColor(C.muted).fontSize(8).font('Helvetica').text(details.join('   ·   '), 68, y, { width: 490 });
        y += 14;
      }

      // Required docs
      const docs = permit.requiredDocs || [];
      if (docs.length > 0) {
        for (const d of docs.slice(0, 4)) {
          const name = typeof d === 'string' ? d : d.name || '';
          doc.fillColor(C.muted).fontSize(7).text(`  ○  ${name}`, 68, y, { width: 490 });
          y += 11;
        }
      }

      y += 6;
      doc.moveTo(40, y).lineTo(572, y).stroke(C.border);
      y += 8;

      // Page break if needed
      if (y > 680) {
        doc.addPage();
        y = 40;
      }
    }

    // Summary totals
    y += 8;
    y = drawSectionHeader(doc, 'Fee Summary', y);

    let totalFees = 0;
    for (const item of permits) {
      const permit = item.pt || item.permitType;
      if (!permit) continue;
      const fee = parseFloat(permit.feeBase || '0');
      totalFees += fee;
      drawField(doc, permit.name, fee > 0 ? `$${fee.toFixed(2)} base` : 'See city fee schedule', leftX, y, halfW * 1.5);
      y += 32;
    }

    if (totalFees > 0) {
      doc.rect(40, y, 532, 28).fill(C.dark);
      doc.fillColor(C.white).fontSize(10).font('Helvetica-Bold').text('ESTIMATED TOTAL FEES', 50, y + 8);
      doc.fillColor(C.cyan).fontSize(12).font('Helvetica-Bold').text(`$${totalFees.toFixed(2)}`, 430, y + 6, { width: 140, align: 'right' });
      y += 36;
    }

    // Bond reminder
    y += 8;
    doc.rect(40, y, 532, 44).fill('#fef3c7');
    doc.rect(40, y, 4, 44).fill(C.amber);
    doc.fillColor('#92400e').fontSize(8).font('Helvetica-Bold').text('CONTRACTOR BOND REQUIRED', 52, y + 6);
    doc.fillColor('#78350f').fontSize(8).font('Helvetica').text(
      'Most DFW permit applications require a $25,000 Contractor License Bond. Get an instant same-day quote at quantumsurety.bond — approx. $175/year.',
      52, y + 18, { width: 512 }
    );
    y += 56;

    // Footer
    doc.rect(0, 730, 612, 62).fill(C.navy);
    doc.fillColor(C.mid).fontSize(7).font('Helvetica').text(
      'DISCLAIMER: This checklist is generated by Permit Pilot for informational purposes only. Always verify requirements directly with your local building department before submitting applications.',
      40, 736, { width: 532 }
    );
    doc.fillColor(C.cyan).fontSize(8).text('permitpilot.online', 40, 758);
    doc.fillColor(C.mid).fontSize(8).text(`Generated ${new Date().toLocaleDateString()}`, 430, 758, { width: 140, align: 'right' });

    doc.end();
  });
}
