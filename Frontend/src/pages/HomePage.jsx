import { useEffect, useState } from "react";
import { BookOpen, TrendingUp, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useThreadStore } from "../stores/threadStore";
import { useBookmarkStore } from "../stores/bookmarkStore";
import { useAuthStore } from "../stores/authStore";
import { formatThreadStats } from "../utils/helpers";
import ThreadCard from "../components/thread/ThreadCard";
import FilterBar from "../components/ui/FilterBar";

function HomePage() {
  const { featuredThreads, fetchFeaturedThreads, isLoading, filters } =
    useThreadStore();
  const { fetchBookmarks } = useBookmarkStore();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch featured threads on component mount
  useEffect(() => {
    fetchFeaturedThreads(filters);
  }, [fetchFeaturedThreads]);

  // Fetch bookmarks when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated, fetchBookmarks]);

  // Handle filter/sort change
  const handleFilterChange = (newFilters) => {
    fetchFeaturedThreads(newFilters);
  };

  // Calculate thread stats and filter featured threads
  const filteredFeatured = featuredThreads
    .filter(
      (thread) =>
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .map((thread) => ({
      ...thread,
      stats: formatThreadStats(thread),
      previewSegments: thread.segments?.slice(0, 2) || [],
    }));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Hero section */}
        <section className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6"
          >
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 dark:text-white mb-2">
              <span className="text-primary-600 dark:text-primary-400">
                Thread
              </span>
              Spire
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Discover, create, and share wisdom threads—structured, focused,
              and deeply human.
            </p>
            <div className="mt-4 max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search featured threads by title or tag..."
                  className="w-full form-input pl-9 py-1.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Featured threads only */}
        <section>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">
              Featured Threads
            </h2>
          </div>
          <FilterBar
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-neutral-500 dark:text-neutral-400 text-sm">
                Loading featured threads...
              </p>
            </div>
          ) : filteredFeatured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFeatured.map((thread, index) => (
                <ThreadCard
                  key={thread._id}
                  thread={thread}
                  index={index}
                  compact
                  showSnippet
                  showReactions
                  showTags
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-10 w-10 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                No featured threads found
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                {searchQuery
                  ? `No featured threads matching "${searchQuery}"`
                  : "No featured threads available with the selected filters"}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
