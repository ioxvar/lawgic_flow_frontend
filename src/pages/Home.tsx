import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { GanttChart } from '@/components/GanttChart';
import { CaseDetails } from '@/components/CaseDetails';
import { ExportToPDF } from '@/components/ExportToPDF';
import { RiskAssessment } from '@/components/RiskAssessment';

import { AnalysisResult } from '@/types/AnalysisResult';

const FormSchema = z.object({
	law_area: z.string({
		required_error: 'Please select the area of law',
	}),
	description: z.string({
		required_error: 'Please enter the description',
	}),
	additional_details: z.string(),
});

export default function Home() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
		null
	);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			description: '',
			law_area: '',
			additional_details: '',
		},
	});

	const onSubmit = async () => {
		const reqData = form.getValues();
		if (!reqData.description || !reqData.law_area) {
			toast({
				variant: 'destructive',
				title: 'Please fill in all required fields',
				description: 'Both the area of law and case description are mandatory.',
			});
			return;
		}

		setIsLoading(true);
		setAnalysisResult(null);

		try {
			const response = await axios.post<AnalysisResult>(
				'http://127.0.0.1:5000/analyze',
				reqData
			);
			if ('error' in response.data) {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: 'Failed to get the data! Please try again',
				});
				return;
			} else {
				setAnalysisResult(response.data);
			}
			console.log(response);
			toast({
				title: 'Analysis Complete',
				description: 'The case analysis has been successfully generated.',
			});
		} catch (error) {
			console.error(error);
			const axiosError = error as AxiosError<{ error: string }>;
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					axiosError.response?.data?.error ||
					'Failed to get the data! Please try again',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<Form {...form}>
				<Toaster />
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="law_area"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Area of Law</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select an area of law" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="intellectual-property">
												Intellectual Property
											</SelectItem>
											<SelectItem value="environmental">
												Environmental
											</SelectItem>
											<SelectItem value="contract">Contract</SelectItem>
											<SelectItem value="employment">Employment</SelectItem>
											<SelectItem value="financial-regulation">
												Financial Regulation
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>
									Select the Area of law applicable for the case
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Case Description</FormLabel>
								<FormControl>
									<Textarea rows={10} placeholder="description" {...field} />
								</FormControl>
								<FormDescription>
									Type in the description about the case
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="additional_details"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Additional Details</FormLabel>
								<FormControl>
									<Textarea placeholder="Additional details" {...field} />
								</FormControl>
								<FormDescription>
									Type in any additional details about the case
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Analyzing...' : 'Submit'}
					</Button>
				</form>
			</Form>
			{analysisResult && (
				<div className="mt-8 space-y-8">
					<GanttChart
						timeline={analysisResult.case_description.case_timeline}
					/>
					<CaseDetails analysisResult={analysisResult} />
					<RiskAssessment analysisResult={analysisResult} />
					<ExportToPDF analysis={analysisResult} />
				</div>
			)}
		</div>
	);
}
