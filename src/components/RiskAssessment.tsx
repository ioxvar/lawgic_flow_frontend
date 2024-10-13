// RiskAssessment.tsx
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from 'chart.js';
import { AnalysisResult } from '../types/AnalysisResult';

ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend
);

interface RiskAssessmentProps {
	analysisResult: AnalysisResult;
}

export function RiskAssessment({ analysisResult }: RiskAssessmentProps) {
	const potentialOutcomes =
		analysisResult.preliminary_judgment.potential_outcomes;

	const data = {
		labels: potentialOutcomes.map((outcome) => outcome.outcome),
		datasets: [
			{
				label: 'Risk Assessment',
				data: potentialOutcomes.map((outcome) => outcome.probability * 100),
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
			},
		],
	};

	const options = {
		scales: {
			r: {
				angleLines: {
					display: false,
				},
				suggestedMin: 0,
				suggestedMax: 100,
			},
		},
	};

	return (
		<div>
			<h3 className="text-xl font-bold mb-4">Risk Assessment</h3>
			<Radar data={data} options={options} />
		</div>
	);
}
