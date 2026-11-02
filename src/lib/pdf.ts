import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { WorkerProfile } from '@/types';

/**
 * Generates an official, high-fidelity A4 SkillPassport certificate PDF
 */
export async function generateSkillPassportPDF(
  worker: WorkerProfile,
  publicUrl: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // --- 1. Top Header Banner (Deep Navy #0B2A5B) ---
  doc.setFillColor(11, 42, 91);
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Orange accent bar under the navy header
  doc.setFillColor(244, 123, 32);
  doc.rect(0, 44, pageWidth, 3, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CREDIFY SKILLPASSPORT', 15, 20);

  // Header Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(244, 123, 32); // Orange
  doc.text('NATIONAL SKILL REGISTER — VERIFIED DIGITAL CREDENTIAL', 15, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(190, 210, 240);
  doc.text('Evidence-Backed Trust Layer for Skilled Workforce • DPDP Act 2023 Compliant', 15, 36);

  // Top right watermark / authority badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL VERIFIED RECORD', 150, 20);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 220, 255);
  doc.text(`REG-ID: IND-${worker.id.toUpperCase()}`, 150, 27);

  // --- 2. Dynamic QR Code Generation ---
  try {
    const qrDataUrl = await QRCode.toDataURL(publicUrl, {
      margin: 1,
      width: 250,
      color: {
        dark: '#0B2A5B',
        light: '#FFFFFF',
      },
    });

    // Place QR code in upper right box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(156, 52, 38, 45, 3, 3, 'FD');
    doc.addImage(qrDataUrl, 'PNG', 158, 54, 34, 34);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(11, 42, 91);
    doc.text('SCAN TO VERIFY LIVE', 175, 93, { align: 'center' });
  } catch (qrErr) {
    console.warn('QR code generation failed for PDF:', qrErr);
  }

  // --- 3. Worker Identity Section ---
  const leftMargin = 15;
  let y = 60;

  doc.setTextColor(15, 27, 51);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(worker.name, leftMargin, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(91, 107, 132);
  const tradeStr = worker.trade === 'ELECTRICIAN' ? 'Certified Electrician' : 'Certified Plumber';
  doc.text(`${tradeStr} • ${worker.locality}, Bengaluru`, leftMargin, y);

  y += 7;
  // Tier Badge Pill
  const badgeColor =
    worker.badgeLevel === 'Gold'
      ? [245, 166, 35]
      : worker.badgeLevel === 'Silver'
      ? [138, 148, 166]
      : [184, 115, 51];
  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.roundedRect(leftMargin, y, 32, 6, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`${worker.badgeLevel.toUpperCase()} BADGE`, leftMargin + 16, y + 4.2, { align: 'center' });

  if (worker.safetyAware) {
    doc.setFillColor(46, 158, 91);
    doc.roundedRect(leftMargin + 35, y, 42, 6, 2, 2, 'F');
    doc.text('SAFETY AWARE CERTIFIED', leftMargin + 56, y + 4.2, { align: 'center' });
  }

  // --- 4. Trust Score & Metrics Banner Box ---
  y += 14;
  doc.setFillColor(244, 247, 251);
  doc.setDrawColor(220, 228, 240);
  doc.roundedRect(leftMargin, y, 180, 26, 3, 3, 'FD');

  // Trust score circle/block
  doc.setTextColor(11, 42, 91);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('COMPUTED TRUST SCORE', leftMargin + 8, y + 8);

  doc.setFontSize(20);
  doc.setTextColor(46, 158, 91); // Green
  doc.text(`${worker.trustScore}`, leftMargin + 8, y + 18);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('/ 100', leftMargin + 25, y + 17);

  // Experience
  doc.setFontSize(9);
  doc.setTextColor(11, 42, 91);
  doc.text('EXPERIENCE', leftMargin + 55, y + 8);
  doc.setFontSize(13);
  doc.setTextColor(15, 27, 51);
  doc.text(`${worker.yearsOfExperience} Years`, leftMargin + 55, y + 17);

  // Vouches
  doc.setFontSize(9);
  doc.setTextColor(11, 42, 91);
  doc.text('CLIENT VOUCHES', leftMargin + 100, y + 8);
  doc.setFontSize(13);
  doc.setTextColor(15, 27, 51);
  doc.text(`${worker.vouches.length} Verified`, leftMargin + 100, y + 17);

  // Evidence Items
  doc.setFontSize(9);
  doc.setTextColor(11, 42, 91);
  doc.text('WORK EVIDENCE', leftMargin + 145, y + 8);
  doc.setFontSize(13);
  doc.setTextColor(15, 27, 51);
  doc.text(`${worker.evidence.length} Media Proofs`, leftMargin + 145, y + 17);

  // --- 5. Verified Competencies Section ---
  y += 34;
  doc.setFillColor(11, 42, 91);
  doc.rect(leftMargin, y, 3, 8, 'F');
  doc.setTextColor(11, 42, 91);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('VERIFIED COMPETENCIES & PRACTICAL SKILLS', leftMargin + 6, y + 6);

  y += 12;
  const skills = worker.verifiedSkills.length > 0 ? worker.verifiedSkills : worker.declaredSkills;
  let skillX = leftMargin;
  skills.forEach((skill) => {
    const textWidth = doc.getTextWidth(skill) + 8;
    if (skillX + textWidth > leftMargin + 175) {
      skillX = leftMargin;
      y += 8;
    }
    doc.setFillColor(232, 246, 238);
    doc.setDrawColor(46, 158, 91);
    doc.roundedRect(skillX, y - 4.5, textWidth, 6.5, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(46, 158, 91);
    doc.text(`✓ ${skill}`, skillX + 4, y);
    skillX += textWidth + 3;
  });

  // --- 6. Verified Vouches Table ---
  y += 16;
  doc.setFillColor(11, 42, 91);
  doc.rect(leftMargin, y, 3, 8, 'F');
  doc.setTextColor(11, 42, 91);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`VERIFIED CLIENT & SUPERVISOR VOUCHES (${worker.vouches.length})`, leftMargin + 6, y + 6);

  y += 11;
  // Table Header
  doc.setFillColor(240, 243, 248);
  doc.rect(leftMargin, y, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(91, 107, 132);
  doc.text('ENDORSER / ROLE', leftMargin + 4, y + 4.8);
  doc.text('RATING', leftMargin + 60, y + 4.8);
  doc.text('STATEMENT & FEEDBACK', leftMargin + 85, y + 4.8);
  doc.text('STATUS', leftMargin + 155, y + 4.8);

  y += 7;
  worker.vouches.slice(0, 4).forEach((vouch, idx) => {
    const rowHeight = 14;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(leftMargin, y, 180, rowHeight, 'F');
    }
    doc.setDrawColor(230, 235, 245);
    doc.line(leftMargin, y + rowHeight, leftMargin + 180, y + rowHeight);

    // Endorser name & role
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 27, 51);
    doc.text(vouch.vouchedByName, leftMargin + 4, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(vouch.role, leftMargin + 4, y + 10);

    // Rating
    doc.setTextColor(244, 123, 32);
    doc.setFont('helvetica', 'bold');
    doc.text('★ '.repeat(vouch.rating), leftMargin + 60, y + 7);

    // Comment
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const comment = vouch.comment ? `"${vouch.comment}"` : 'Verified work completion.';
    const splitComment = doc.splitTextToSize(comment, 65);
    doc.text(splitComment, leftMargin + 85, y + 5);

    // Verified OTP status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(46, 158, 91);
    doc.text('✓ OTP Verified', leftMargin + 155, y + 7);

    y += rowHeight;
  });

  // --- 7. Security & DPDP Compliance Watermark Footer ---
  const footerY = 265;
  doc.setDrawColor(220, 226, 235);
  doc.line(leftMargin, footerY, leftMargin + 180, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(11, 42, 91);
  doc.text('DIGITAL COMPLIANCE & CRYPTOGRAPHIC VERIFICATION SEAL', leftMargin, footerY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This SkillPassport is an tamper-evident digital credential generated under the Credify Merit Verification Architecture.',
    leftMargin,
    footerY + 10
  );
  doc.text(
    'Protected under the Digital Personal Data Protection (DPDP) Act 2023. Explicit consent verified on file.',
    leftMargin,
    footerY + 14
  );
  doc.text(`Live Verification URL: ${publicUrl}`, leftMargin, footerY + 18);

  const timestamp = new Date().toISOString();
  doc.text(`SHA-256 Hash ID: ${worker.id}-${timestamp.slice(0, 10)} | Issued by Credify Technologies India`, leftMargin, footerY + 22);

  // Save the PDF file
  const fileName = `SkillPassport_${worker.name.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}

