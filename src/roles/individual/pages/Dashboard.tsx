import { useState, useEffect } from "react";
import { Search, MapPin, Pizza, Store, TrendingUp, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { BusinessService, type Business } from "@/services/businessService";
import { EventService } from "@/services/eventService";
import { FavoriteService } from "@/services/favoriteService";
import { ReviewService } from "@/services/reviewService";
import { usePersonalizedRecommendations, useTrendingPlaces, useCurrentContext, useLocationForRecommendations } from "@/hooks/useRecommendations";
import RecommendationsCard from "@/components/recommendations/RecommendationsCard";
import PlaceDetails from "@/components/places/PlaceDetails";
import type { RecommendationScore } from "@/services/recommendationsService";
import ResponsiveContainer, { ResponsiveGrid, TouchOptimizedButton } from "@/components/layout/ResponsiveContainer";
import { useBreakpoints } from "@/lib/responsive";


const categories = [
  {
    id: 1,
    name: "All",
    active: true,
    color: "bg-bg-primary-dark2",
  },
  { id: 2, name: "Dining", active: false, color: "bg-bg-primary-dark2" },
  { id: 3, name: "Services", active: false, color: "bg-bg-primary-dark2" },
  { id: 4, name: "Events", active: false, color: "bg-bg-primary-dark2" },
  { id: 5, name: "Shopping", active: false, color: "bg-bg-primary-dark2" },
  { id: 6, name: "Auto", active: false, color: "bg-bg-primary-dark2" },
];

// const bottomCategories = [
//   {
//     id: 1,
//     icon: <Wrench className="w-6 h-6" />,
//     name: "Auto repairs",
//     color: "bg-purple-500",
//   },
//   {
//     id: 2,
//     icon: <Pizza className="w-6 h-6" />,
//     name: "Takeout",
//     color: "bg-orange-500",
//   },
//   {
//     id: 3,
//     icon: <Coffee className="w-6 h-6" />,
//     name: "Smoothies",
//     color: "bg-teal-400",
//   },
//   {
//     id: 4,
//     icon: <ShoppingCart className="w-6 h-6" />,
//     name: "Shopping",
//     color: "bg-purple-400",
//   },
// ];

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    favoriteCount: 0,
    reviewCount: 0,
    eventCount: 0,
  });
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationScore | null>(null);
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);

  const { profile } = useAuth();
  const navigate = useNavigate();
  const currentContext = useCurrentContext();
  const { location } = useLocationForRecommendations();
  const { isMobile } = useBreakpoints();

  // AI Recommendations hooks
  const {
    recommendations: personalizedRecs,
    loading: personalizedLoading,
    error: personalizedError,
    refresh: refreshPersonalized
  } = usePersonalizedRecommendations({ limit: 6 });

  const {
    recommendations: trendingRecs,
    loading: trendingLoading,
    error: trendingError,
    refresh: refreshTrending
  } = useTrendingPlaces(location || undefined, 6);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load businesses
      const businessData = await BusinessService.getBusinesses({
        limit: 6,
        verified: true
      });
      setBusinesses(businessData || []);

      // Load user stats if authenticated
      if (profile) {
        const [favoriteCount, userReviews, userEvents] = await Promise.all([
          FavoriteService.getUserFavoritesCount(),
          ReviewService.getReviewsByUser(profile.id),
          EventService.getEvents({ limit: 100 }) // Get events to count attended ones
        ]);

        setStats({
          favoriteCount,
          reviewCount: userReviews?.length || 0,
          eventCount: userEvents?.length || 0,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    if (activeCategory === "All") return true;
    return business.category === activeCategory;
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const searchResults = await BusinessService.searchBusinesses(searchQuery, {
        category: activeCategory === "All" ? undefined : activeCategory,
        limit: 10
      });
      setBusinesses(searchResults || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleRecommendationSelect = (recommendation: RecommendationScore) => {
    setSelectedRecommendation(recommendation);
    setShowPlaceDetails(true);
  };

  const handleCloseDetails = () => {
    setShowPlaceDetails(false);
    setSelectedRecommendation(null);
  };

  const dashboardStats = [
    {
      title: "Saved Places",
      value: stats.favoriteCount.toString(),
      icon: Star,
      change: "+3",
      changeType: "positive" as const,
    },
    {
      title: "Reviews Written",
      value: stats.reviewCount.toString(),
      icon: Users,
      change: `+${stats.reviewCount}`,
      changeType: "positive" as const,
    },
    {
      title: "Events Discovered",
      value: stats.eventCount.toString(),
      icon: Calendar,
      change: "+5",
      changeType: "positive" as const,
    },
    {
      title: "Cities Explored",
      value: "3",
      icon: TrendingUp,
      change: "+1",
      changeType: "positive" as const,
    },
  ];

  return (
    <ResponsiveContainer size="full" padding="md">
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Good {currentContext === 'morning' ? 'morning' : currentContext === 'afternoon' ? 'afternoon' : 'evening'}, {profile?.full_name || 'Explorer'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back! Here's what's happening in your city today.
          </p>
        </div>

        {/* Stats Cards */}
        <ResponsiveGrid
          cols={{ mobile: 2, tablet: 2, desktop: 4 }}
          gap="sm"
        >
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-3 sm:p-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                  <CardTitle className="text-xs sm:text-sm font-medium truncate">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="p-0 pt-2">
                  <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-600">{stat.change}</span> this month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </ResponsiveGrid>

        {/* Hero Search Section */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 sm:p-6 text-primary-foreground">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold leading-tight">
                    Discover amazing places and events in your city
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={isMobile ? "Search places..." : "Search for restaurants, events, services..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 bg-background text-foreground text-base" // 16px to prevent zoom on iOS
                      />
                    </div>
                    <TouchOptimizedButton
                      onClick={handleSearch}
                      className="bg-white text-primary hover:bg-gray-50"
                      fullWidth={isMobile}
                    >
                      Search
                    </TouchOptimizedButton>
                  </div>
                </div>

                {!isMobile && (
                  <div className="hidden lg:block ml-8">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 relative">
                      <div className="w-full h-full bg-background/10 rounded-full flex items-center justify-center">
                        <Pizza className="w-12 h-12 lg:w-16 lg:h-16" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* AI Recommendations Section */}
      <div className="space-y-6">
        <RecommendationsCard
          title="Just for You"
          subtitle={`AI-powered recommendations based on your preferences`}
          recommendations={personalizedRecs}
          loading={personalizedLoading}
          error={personalizedError}
          onPlaceSelect={handleRecommendationSelect}
          onRefresh={refreshPersonalized}
          type="personalized"
          maxItems={6}
        />

        <RecommendationsCard
          title="Trending Now"
          subtitle={`What's popular in your area right now`}
          recommendations={trendingRecs}
          loading={trendingLoading}
          error={trendingError}
          onPlaceSelect={handleRecommendationSelect}
          onRefresh={refreshTrending}
          type="trending"
          maxItems={6}
        />
      </div>

        {/* Category Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Explore Categories</CardTitle>
            <CardDescription className="text-sm">Find what you're looking for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <TouchOptimizedButton
                  key={category.name}
                  variant={activeCategory === category.name ? "primary" : "ghost"}
                  onClick={() => setActiveCategory(category.name)}
                  className="whitespace-nowrap flex-shrink-0 text-sm"
                  size="sm"
                >
                  {category.name}
                </TouchOptimizedButton>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Businesses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Featured Businesses</CardTitle>
            <CardDescription className="text-sm">Popular places in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2 text-sm">Loading businesses...</p>
              </div>
            ) : (
              <ResponsiveGrid
                cols={{ mobile: 1, tablet: 1, desktop: 2 }}
                gap="sm"
              >
                {filteredBusinesses.map((business) => (
                  <Card
                    key={business.id}
                    className="cursor-pointer hover:shadow-md transition-shadow active:scale-95 transform transition-transform"
                    onClick={() => navigate(`/business/${business.id}`)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Store className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{business.name}</h4>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Badge variant="secondary" className="text-xs">{business.category}</Badge>
                              {business.verified && (
                                <Badge variant="default" className="text-xs">
                                  ✓
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {business.description || "Discover what this business has to offer"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{business.city}</span>
                            </div>
                            {business.rating > 0 && (
                              <div className="flex items-center text-xs sm:text-sm flex-shrink-0">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                <span>{business.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground ml-1">
                                  ({business.total_reviews})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ResponsiveGrid>
            )}
          </CardContent>
        </Card>

        {/* Place Details Modal */}
        <PlaceDetails
          place={selectedRecommendation?.place || null}
          isOpen={showPlaceDetails}
          onClose={handleCloseDetails}
        />
      </div>
    </ResponsiveContainer>
  );
};

export default Dashboard;
