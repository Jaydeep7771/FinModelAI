import jsPDF from 'jspdf';

export function exportCSV(fileName, rows) {
  const csv = rows.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}

export function exportPDF(title, content) {
  const pdf = new jsPDF();
  pdf.setFontSize(16);
  pdf.text(title, 10, 20);
  pdf.setFontSize(11);
  pdf.text(content, 10, 35, { maxWidth: 180 });
  pdf.save(`${title}.pdf`);
}
