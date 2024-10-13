import React from 'react';
import { Button } from './ui/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { AnalysisResult } from '@/types/AnalysisResult';

// Extend the jsPDF type to include the lastAutoTable property
interface jsPDFWithAutoTable extends jsPDF {
	autoTable: (options: UserOptions) => jsPDF;
	lastAutoTable: { finalY: number };
}

interface ExportToPDFProps {
	analysis: AnalysisResult;
}

export const ExportToPDF: React.FC<ExportToPDFProps> = ({ analysis }) => {
	const exportToPDF = () => {
		const doc = new jsPDF() as jsPDFWithAutoTable;

		doc.setFontSize(18);
		doc.text('Case Analysis Report', 14, 22);

		doc.setFontSize(14);
		doc.text('Case Summary', 14, 32);
		doc.setFontSize(12);
		doc.text(`Law Area: ${analysis.case_description.law_area}`, 14, 40);

		doc.setFontSize(14);
		doc.text('Case Timeline', 14, 50);
		const timelineData = analysis.case_description.case_timeline.map(
			(event) => [event.date, event.event, event.applicable_laws.join(', ')]
		);
		doc.autoTable({
			startY: 55,
			head: [['Date', 'Event', 'Applicable Laws']],
			body: timelineData,
		});

		// Access the finalY property from lastAutoTable
		const currentY = doc.lastAutoTable.finalY + 10;

		doc.setFontSize(14);
		doc.text('Preliminary Judgment', 14, currentY);
		doc.setFontSize(12);
		doc.text(analysis.preliminary_judgment.summary, 14, currentY + 8, {
			maxWidth: 180,
		});

		doc.save('case-analysis.pdf');
	};

	return <Button onClick={exportToPDF}>Export to PDF</Button>;
};
