import React from 'react';
import { AnalysisResult } from '../types/AnalysisResult';

interface CaseDetailsProps {
	analysisResult: AnalysisResult;
}

export function CaseDetails({ analysisResult }: CaseDetailsProps) {
	return (
		<div className="mt-8 space-y-6">
			<section>
				<h3 className="text-xl font-semibold mb-2">Case Summary</h3>
				<p>{analysisResult.case_description.law_area}</p>
			</section>
			<section>
				<h3 className="text-xl font-semibold mb-2">Key Entities Involved</h3>
				<ul className="list-disc pl-5">
					{analysisResult.case_description.entities_involved.map(
						(entity, index) => (
							<li key={index}>
								{entity.name} - {entity.relationship}
							</li>
						)
					)}
				</ul>
			</section>
			<section>
				<h3 className="text-xl font-semibold mb-2">Preliminary Judgment</h3>
				<p>{analysisResult.preliminary_judgment.summary}</p>
				<p className="mt-2">
					<strong>Confidence Level:</strong>{' '}
					{analysisResult.preliminary_judgment.confidence_level * 100}%
				</p>
				<h4 className="text-lg font-semibold mt-4 mb-2">Potential Outcomes</h4>
				<ul className="list-disc pl-5">
					{analysisResult.preliminary_judgment.potential_outcomes.map(
						(outcome, index) => (
							<li key={index}>
								{outcome.outcome} (Probability: {outcome.probability * 100}%)
							</li>
						)
					)}
				</ul>
			</section>
			<section>
				<h3 className="text-xl font-semibold mb-2">Estimated Duration</h3>
				<p>{analysisResult.estimated_duration.range}</p>
				<p>{analysisResult.estimated_duration.basis}</p>
			</section>
			<section>
				<h3 className="text-xl font-semibold mb-2">Jurisdiction Analysis</h3>
				<p>{analysisResult.jurisdiction_analysis.jurisdiction}</p>
				<p>{analysisResult.jurisdiction_analysis.impact}</p>
			</section>
		</div>
	);
}
