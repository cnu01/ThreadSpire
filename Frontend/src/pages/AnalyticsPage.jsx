import { useEffect } from 'react';
import { 
  BarChart2, 
  BookOpen, 
  BookmarkIcon, 
  GitFork, 
  MessageSquare, 
  TrendingUp,
  FileText,
  Trophy,
  Calendar,
  Target,
  Zap,
  Eye
} from 'lucide-react';
import { useAnalyticsStore } from '../stores/analyticsStore';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import AnalyticsChart from '../components/analytics/AnalyticsChart';

function AnalyticsPage() {
  const { analytics, fetchAnalytics, isLoading } = useAnalyticsStore();
  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);
  const reactionChartData = analytics?.reactionsByType ? 
    Object.entries(analytics.reactionsByType).map(([type, count]) => ({ name: type, value: count })) : [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white mb-8">
        Your Analytics
      </h1>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading analytics...</p>
        </div>
      ) : analytics ? (
        <div>
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnalyticsCard
              title="Total Threads"
              value={analytics.threadCount}
              trend={analytics.threadGrowth}
              icon={<BookOpen className="h-6 w-6" />}
              description={`${analytics.publishedThreadCount} published, ${analytics.draftThreadCount} drafts`}
              color="primary"
            />
            <AnalyticsCard
              title="Bookmarks Received"
              value={analytics.bookmarksReceived}
              trend={analytics.bookmarkGrowth}
              icon={<BookmarkIcon className="h-6 w-6" />}
              description={`Avg: ${analytics.averageBookmarksPerThread} per thread`}
              color="accent"
            />
            <AnalyticsCard
              title="Total Reactions"
              value={analytics.reactionCount}
              trend={analytics.reactionGrowth}
              icon={<MessageSquare className="h-6 w-6" />}
              description={`Avg: ${analytics.averageReactionsPerThread} per thread`}
              color="secondary"
            />
            <AnalyticsCard
              title="Times Forked"
              value={analytics.forkCount}
              trend={analytics.forkGrowth}
              icon={<GitFork className="h-6 w-6" />}
              description={`Avg: ${analytics.averageForksPerThread} per thread`}
              color="primary"
            />
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Reaction Types Distribution */}
            {reactionChartData.length > 0 && (
              <AnalyticsChart
                type="pie"
                data={reactionChartData}
                title="Reaction Distribution"
                icon={<MessageSquare className="h-5 w-5" />}
                height={300}
              />
            )}

            {/* Activity Timeline */}
            {analytics.activityTimeline && analytics.activityTimeline.length > 0 && (
              <AnalyticsChart
                type="line"
                data={analytics.activityTimeline.map(item => ({ ...item, date: item.month }))}
                title="30-Day Activity"
                icon={<Calendar className="h-5 w-5" />}
                height={300}
              />
            )}
          </div>
          
          {/* Thread performance */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              Top Performing Threads
            </h2>
            
            {analytics.topThreads && analytics.topThreads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Thread</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Segments</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Bookmarks</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Reactions</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Forks</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topThreads.map((thread) => {
                      const totalScore = thread.bookmarks + thread.reactions + thread.forks;
                      return (
                        <tr key={thread._id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                          <td className="px-4 py-3">
                            <a 
                              href={`/thread/${thread._id}`}
                              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                            >
                              {thread.title}
                            </a>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              {new Date(thread.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                              {thread.segments}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                            <span className="inline-flex items-center">
                              <BookmarkIcon className="h-4 w-4 mr-1 text-accent-600" />
                              {thread.bookmarks}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                            <span className="inline-flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1 text-secondary-600" />
                              {thread.reactions}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                            <span className="inline-flex items-center">
                              <GitFork className="h-4 w-4 mr-1 text-primary-600" />
                              {thread.forks}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                              {totalScore}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400">
                No published threads yet. Create and publish your first thread to see performance data!
              </p>
            )}
          </div>
          
          {/* Top Reacted Segments */}
          {analytics.topReactedSegments && analytics.topReactedSegments.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
                <Zap className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                Most Engaging Segments
              </h2>
              <div className="space-y-4">
                {analytics.topReactedSegments.map((segment, index) => (
                  <div 
                    key={`${segment.threadId}-${segment.segmentIndex}`}
                    className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-bold">
                          #{index + 1}
                        </div>
                        <a 
                          href={`/thread/${segment.threadId}`}
                          className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                          {segment.threadTitle}
                        </a>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          Segment {segment.segmentIndex}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-secondary-600" />
                        <span className="font-bold text-secondary-600 dark:text-secondary-400">
                          {segment.reactionCount}
                        </span>
                      </div>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm line-clamp-2">
                      {segment.content}
                    </p>
                    <div className="flex items-center space-x-1 mt-2">
                      {Object.entries(
                        segment.reactions.reduce((acc, reaction) => {
                          acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([type, count]) => (
                        <span 
                          key={type}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                        >
                          {type} {count}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Most Forked Thread Highlight */}
          {analytics.mostForkedThread && (
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg p-6 mb-8 border border-primary-200 dark:border-primary-700">
              <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
                <Trophy className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                Most Forked Thread
              </h2>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <a 
                    href={`/thread/${analytics.mostForkedThread._id}`}
                    className="text-xl font-bold text-primary-700 dark:text-primary-300 hover:underline"
                  >
                    {analytics.mostForkedThread.title}
                  </a>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1" />
                      {analytics.mostForkedThread.forkCount} forks
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(analytics.mostForkedThread.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    #{analytics.mostForkedThread.forkCount}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    times forked
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Summary Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Publishing Stats */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                Publishing Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Published Threads</span>
                  <span className="font-bold text-success-600 dark:text-success-400">
                    {analytics.publishedThreadCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Draft Threads</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {analytics.draftThreadCount}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-400">Publish Rate</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {analytics.threadCount > 0 ? 
                        Math.round((analytics.publishedThreadCount / analytics.threadCount) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Summary */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
                <Target className="h-5 w-5 text-secondary-600 dark:text-secondary-400 mr-2" />
                Engagement Rate
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Avg Bookmarks</span>
                  <span className="font-bold text-accent-600 dark:text-accent-400">
                    {analytics.averageBookmarksPerThread}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Avg Reactions</span>
                  <span className="font-bold text-secondary-600 dark:text-secondary-400">
                    {analytics.averageReactionsPerThread}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Avg Forks</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {analytics.averageForksPerThread}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
                <Zap className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {/* <a 
                  href="/create"
                  className="block w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-center transition-colors"
                >
                  Create New Thread
                </a>
                <a 
                  href="/collections"
                  className="block w-full px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium text-center transition-colors"
                >
                  Manage Collections
                </a> */}
                <button 
                  onClick={() => fetchAnalytics()}
                  className="block w-full px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg font-medium text-center transition-colors"
                >
                  Refresh Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <BarChart2 className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
            No analytics available
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Start creating and sharing threads to see your analytics
          </p>
          <a 
            href="/create-thread"
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Create Your First Thread
          </a>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;