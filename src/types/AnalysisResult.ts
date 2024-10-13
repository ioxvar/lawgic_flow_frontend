/* eslint-disable @typescript-eslint/no-explicit-any */
// AnalysisResult.ts
export interface Entity {
	name: string;
	relationship: string;
}

export interface Outcome {
	outcome: string;
	probability: number;
}

export interface TimelineEvent {
	date: string;
	event: string;
	applicable_laws: string[];
	relevant_case_citations: string[];
}

export interface AnalysisResult {
	case_description: {
		law_area: string;
		entities_involved: Entity[];
		case_timeline: TimelineEvent[];
	};
	preliminary_judgment: {
		summary: string;
		based_on_information: string;
		confidence_level: number;
		potential_outcomes: Outcome[];
	};
	similar_historical_cases: any[]; // You can define a more specific type if needed
	estimated_duration: {
		range: string;
		basis: string;
		based_on_similar_historical_cases: string;
	};
	jurisdiction_analysis: {
		jurisdiction: string;
		impact: string;
		potential_impact: string;
	};
	potential_challenges_counterarguments: Array<{
		challenge: string;
		counterargument: string;
	}>;
	additional_information_needed: string[];
	potential_future_outcomes: Array<{
		outcome: string;
		confidence_level: number;
		additional_information_needed: string;
	}>;
}
