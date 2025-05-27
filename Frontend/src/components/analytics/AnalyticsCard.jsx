import { Link as Line } from 'lucide-react';
import { motion } from 'framer-motion';

function AnalyticsCard({ title, value, icon, trend, description, color = 'primary' }) {
	const isTrendPositive = trend > 0;
	const isTrendNeutral = trend === 0;
	const trendColorClass = isTrendPositive
		? 'text-success-600 dark:text-success-500'
		: isTrendNeutral
			? 'text-neutral-500 dark:text-neutral-400'
			: 'text-error-600 dark:text-error-500';
	const iconColorClass = {
		primary: 'text-primary-600 dark:text-primary-400',
		secondary: 'text-secondary-600 dark:text-secondary-400',
		accent: 'text-accent-600 dark:text-accent-400',
	}[color];
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6"
		>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-medium text-neutral-900 dark:text-white">
					{title}
				</h3>
				<div className={`rounded-full p-2 ${iconColorClass} bg-opacity-10`}>
					{icon}
				</div>
			</div>
			<div className="flex items-baseline">
				<div className="text-3xl font-bold text-neutral-900 dark:text-white">
					{value}
				</div>
				{trend !== undefined && (
					<div className={`ml-2 flex items-center ${trendColorClass}`}>
						{!isTrendNeutral && (
							<span className="text-sm">
								{isTrendPositive ? '+' : ''}{trend}%
							</span>
						)}
						{isTrendNeutral && (
							<Line className="h-3 w-3 ml-1" />
						)}
					</div>
				)}
			</div>
			{description && (
				<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
					{description}
				</p>
			)}
		</motion.div>
	);
}

export default AnalyticsCard;