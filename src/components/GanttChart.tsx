import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { TimelineEvent } from '../types/AnalysisResult';

interface GanttChartProps {
	timeline: TimelineEvent[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ timeline }) => {
	const [filteredData, setFilteredData] = useState(timeline);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [filterCriteria, setFilterCriteria] = useState('all');

	useEffect(() => {
		let newData = [...timeline];

		if (filterCriteria !== 'all') {
			newData = newData.filter((item) =>
				item.event.toLowerCase().includes(filterCriteria.toLowerCase())
			);
		}

		newData.sort((a, b) => {
			const dateA = new Date(a.date).getTime();
			const dateB = new Date(b.date).getTime();
			return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
		});

		setFilteredData(newData);
	}, [timeline, sortOrder, filterCriteria]);

	const chartData = [
		[
			{ type: 'string', label: 'Task ID' },
			{ type: 'string', label: 'Task Name' },
			{ type: 'date', label: 'Start Date' },
			{ type: 'date', label: 'End Date' },
			{ type: 'number', label: 'Duration' },
			{ type: 'number', label: 'Percent Complete' },
			{ type: 'string', label: 'Dependencies' },
		],
		...filteredData.map((item, index) => [
			index.toString(),
			item.event,
			new Date(item.date),
			new Date(item.date),
			null,
			100,
			null,
		]),
	];

	const options = {
		height: 400,
		gantt: {
			trackHeight: 30,
		},
	};

	return (
		<div>
			<div className="flex justify-between mb-4">
				<Select onValueChange={setFilterCriteria} defaultValue="all">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter events" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Events</SelectItem>
						<SelectItem value="filed">Filed</SelectItem>
						<SelectItem value="response">Response</SelectItem>
						<SelectItem value="hearing">Hearing</SelectItem>
					</SelectContent>
				</Select>
				<Button
					onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
				>
					Sort {sortOrder === 'asc' ? '▲' : '▼'}
				</Button>
			</div>
			<Chart
				chartType="Gantt"
				width="100%"
				height="400px"
				data={chartData}
				options={options}
			/>
		</div>
	);
};
