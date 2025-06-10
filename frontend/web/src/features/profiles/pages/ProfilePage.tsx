import { useParams } from "react-router-dom";
import { useUser } from "@/common/contexts";
import {
  Card,
  CardImage,
  EmptyState,
  ErrorDisplay,
  Layout,
  PageLayout,
  Spinner,
  Tabs,
} from "@/common/components";
import { useProfileById } from "../hooks/useProfile";
import EducatorOffersTab from "../components/EducatorOffersTab";
import MyPurchasesTab from "../components/MyPurchasesTab";
import ProfileHeader from "../components/ProfileHeader";

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useUser();

  const isOwnProfile =
    (currentUser && (!userId || userId === currentUser.id)) ?? false;
  const profileUserId = userId || currentUser?.id;

  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
  } = useProfileById(profileUserId!, { enabled: !!profileUserId });

  const handleMessage = () => {
    console.log("Message user:", user?.id);
  };

  const handleFollow = () => {
    console.log("Follow user:", user?.id);
  };

  const handleUserBookmark = () => {
    console.log("Bookmark user:", user?.id);
  };

  if (profileLoading) {
    return (
      <Layout>
        <PageLayout>
          <Spinner message="Loading profile..." size="lg" />
        </PageLayout>
      </Layout>
    );
  }

  if (!user || profileError) {
    return (
      <Layout>
        <PageLayout>
          <ErrorDisplay error={profileError} title="Failed to load profile" />
        </PageLayout>
      </Layout>
    );
  }

  const isEducator = !!user.educator;

  const NewsUpdatesTab = () => (
    <EmptyState
      title="Coming Soon"
      message="News & Updates will be available soon."
      size="md"
    />
  );

  const PortfolioTab = () => {
    if (!user.educator) return null;

    return (
      <div className="space-y-6">
        <h2 className="ora-heading text-2xl mb-2">Educator Bio</h2>
        <div className="flex gap-4">
          <div className="w-96">
            <Card className="overflow-hidden flex-1 flex flex-col">
              <CardImage
                src={user.educator.videoUrl}
                alt={user.firstName}
                aspectRatio="video"
                className="h-full flex-1"
              />
            </Card>
          </div>
          <div className="flex-1 sm:flex-1">
            <p className="ora-body text-sm leading-relaxed">
              {user.educator.bio || "No bio available."}
            </p>
          </div>
        </div>
        <div>
          <h3 className="ora-heading text-2xl mb-2">Experience</h3>
          <p className="ora-body text-sm leading-relaxed">
            {user.educator.experience || "No experience information available."}
          </p>
        </div>
      </div>
    );
  };

  const ReviewsTab = () => (
    <EmptyState
      title="Coming Soon"
      message="Reviews will be available soon."
      size="md"
    />
  );

  const tabs = [
    {
      id: "news",
      label: "News & Updates",
      content: <NewsUpdatesTab />,
    },
    ...(isEducator
      ? [
          {
            id: "description",
            label: "Portfolio",
            content: <PortfolioTab />,
          },
        ]
      : []),
    ...(isEducator
      ? [
          {
            id: "offers",
            label: "Offers",
            content: (
              <EducatorOffersTab
                educatorId={user.id}
                allowCreate={isOwnProfile}
              />
            ),
          },
        ]
      : []),
    ...(isOwnProfile && currentUser
      ? [
          {
            id: "purchases",
            label: "Purchases",
            content: <MyPurchasesTab userId={user.id} />,
          },
        ]
      : []),
    {
      id: "reviews",
      label: "Reviews",
      content: <ReviewsTab />,
    },
  ];

  return (
    <Layout>
      <PageLayout>
        <div className="space-y-8 mt-15">
          <ProfileHeader
            user={user}
            isOwnProfile={!!isOwnProfile}
            onMessage={handleMessage}
            onFollow={handleFollow}
            onBookmark={handleUserBookmark}
          />

          <div className="mt-12">
            <Tabs items={tabs} defaultTabId={tabs[0]?.id} className="w-full" />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};

export default ProfilePage;
