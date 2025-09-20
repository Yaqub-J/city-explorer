import { useState, useEffect } from "react";
import { Search, MapPin, Pizza, Store, TrendingUp, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { BusinessService, type Business } from "@/services/businessService";
import { EventService } from "@/services/eventService";
import { FavoriteService } from "@/services/favoriteService";
import { ReviewService } from "@/services/reviewService";


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

  const { profile } = useAuth();
  const navigate = useNavigate();

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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Good morning, {profile?.full_name || 'Explorer'}
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your city today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600">{stat.change}</span> this month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hero Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  Discover amazing places and events in your city
                </h2>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for restaurants, events, services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 bg-background text-foreground"
                    />
                  </div>
                  <Button onClick={handleSearch} size="default">
                    Search
                  </Button>
                </div>
              </div>

              <div className="hidden md:block ml-8">
                <div className="w-32 h-32 relative">
                  <div className="w-full h-full bg-background/10 rounded-full flex items-center justify-center">
                    <Pizza className="w-16 h-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Explore Categories</CardTitle>
          <CardDescription>Find what you're looking for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? "default" : "outline"}
                onClick={() => setActiveCategory(category.name)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Businesses */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Businesses</CardTitle>
          <CardDescription>Popular places in your area</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading businesses...</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredBusinesses.map((business) => (
                <Card
                  key={business.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Store className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{business.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{business.category}</Badge>
                            {business.verified && (
                              <Badge variant="default" className="text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {business.description || "Discover what this business has to offer"}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            {business.city}
                          </div>
                          {business.rating > 0 && (
                            <div className="flex items-center text-sm">
                              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
