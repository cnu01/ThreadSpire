import express from 'express';
import Thread from '../models/Thread.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// import express from 'express';
// import Thread from '../models/Thread.js';
// import { auth } from '../middleware/auth.js';

// const router = express.Router();

// Comprehensive user analytics
router.get('/', auth, async (req, res) => {
  try {
    // Get all user's threads with detailed data
    const userThreads = await Thread.find({ author: req.userId })
      .populate('author', 'username')
      .lean();

    // Basic counts
    const threadCount = userThreads.length;
    const publishedThreadCount = userThreads.filter(t => !t.isDraft).length;
    const draftThreadCount = userThreads.filter(t => t.isDraft).length;

    // Calculate bookmarks received across all threads
    const bookmarksReceived = userThreads.reduce((total, thread) => {
      return total + (thread.bookmarks?.length || 0);
    }, 0);

    // Calculate total reactions received across all threads and segments
    const reactionData = userThreads.reduce((acc, thread) => {
      thread.segments?.forEach(segment => {
        segment.reactions?.forEach(reaction => {
          acc.total++;
          acc.byType[reaction.type] = (acc.byType[reaction.type] || 0) + 1;
        });
      });
      return acc;
    }, { total: 0, byType: {} });

    // Calculate total forks
    const totalForks = userThreads.reduce((total, thread) => {
      return total + (thread.forkCount || 0);
    }, 0);

    // Find most forked thread
    const mostForkedThread = userThreads
      .filter(t => !t.isDraft && (t.forkCount || 0) > 0)
      .sort((a, b) => (b.forkCount || 0) - (a.forkCount || 0))[0];

    // Detailed thread performance
    const topThreads = userThreads
      .filter(t => !t.isDraft)
      .map(thread => {
        const reactions = thread.segments?.reduce((total, segment) => {
          return total + (segment.reactions?.length || 0);
        }, 0) || 0;

        return {
          _id: thread._id,
          title: thread.title,
          bookmarks: thread.bookmarks?.length || 0,
          reactions: reactions,
          forks: thread.forkCount || 0,
          createdAt: thread.createdAt,
          segments: thread.segments?.length || 0
        };
      })
      .sort((a, b) => (b.bookmarks + b.reactions + b.forks) - (a.bookmarks + a.reactions + a.forks))
      .slice(0, 10);

    // Thread activity timeline (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activityTimeline = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const threadsCreated = userThreads.filter(thread => {
        const threadDate = new Date(thread.createdAt).toISOString().split('T')[0];
        return threadDate === dateStr;
      }).length;

      activityTimeline.push({
        date: dateStr,
        count: threadsCreated,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }

    // Most reacted segments across all threads
    const segmentAnalytics = [];
    userThreads.forEach(thread => {
      thread.segments?.forEach((segment, index) => {
        const reactionCount = segment.reactions?.length || 0;
        if (reactionCount > 0) {
          segmentAnalytics.push({
            threadId: thread._id,
            threadTitle: thread.title,
            segmentIndex: index + 1,
            content: segment.content.replace(/<[^>]*>/g, '').substring(0, 100) + (segment.content.length > 100 ? '...' : ''),
            reactionCount,
            reactions: segment.reactions || []
          });
        }
      });
    });

    // Sort by reaction count and get top 5
    const topReactedSegments = segmentAnalytics
      .sort((a, b) => b.reactionCount - a.reactionCount)
      .slice(0, 5);

    // Calculate growth trends (mock data for now, could be enhanced with historical tracking)
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    const thisMonthThreads = userThreads.filter(t => new Date(t.createdAt).getMonth() === currentMonth).length;
    const lastMonthThreads = userThreads.filter(t => new Date(t.createdAt).getMonth() === lastMonth).length;
    const threadGrowth = lastMonthThreads === 0 ? 0 : ((thisMonthThreads - lastMonthThreads) / lastMonthThreads) * 100;

    const analytics = {
      // Basic metrics
      threadCount,
      publishedThreadCount,
      draftThreadCount,
      bookmarksReceived,
      reactionCount: reactionData.total,
      forkCount: totalForks,
      
      // Growth trends
      threadGrowth: Math.round(threadGrowth),
      bookmarkGrowth: 0, // Could be calculated with historical data
      reactionGrowth: 0, // Could be calculated with historical data
      forkGrowth: 0, // Could be calculated with historical data
      
      // Detailed analytics
      reactionsByType: reactionData.byType,
      topThreads,
      mostForkedThread,
      topReactedSegments,
      activityTimeline,
      
      // Summary stats
      averageReactionsPerThread: threadCount > 0 ? Math.round(reactionData.total / threadCount * 10) / 10 : 0,
      averageBookmarksPerThread: threadCount > 0 ? Math.round(bookmarksReceived / threadCount * 10) / 10 : 0,
      averageForksPerThread: threadCount > 0 ? Math.round(totalForks / threadCount * 10) / 10 : 0
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Thread-specific analytics (example: count of reactions, bookmarks, etc.)
router.get('/threads/:threadId', auth, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    const reactionCount = thread.segments.reduce((acc, seg) => acc + (seg.reactions ? seg.reactions.length : 0), 0);
    const bookmarkCount = thread.bookmarks ? thread.bookmarks.length : 0;
    res.json({ reactionCount, bookmarkCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch thread analytics' });
  }
});

export default router;
