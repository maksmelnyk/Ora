import { Link } from "react-router-dom";
import { cn } from "@/common/utils";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Globe,
  Users,
  Video,
} from "lucide-react";
import {
  Layout,
  HeroLayout,
  Button,
  Card,
  CardContent,
} from "@/common/components";
import { routes } from "@/common/constants/routes";
import { ProductType } from "../products/types";
import { getProductPath } from "../products/utils";

interface BaseHeroProps {
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export const MinimalHero: React.FC<BaseHeroProps> = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  className,
}) => (
  <section className={cn("bg-ora-bg py-16 lg:py-24", className)}>
    <div className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="ora-heading text-4xl md:text-5xl lg:text-6xl text-ora-navy mb-6">
          {title}
        </h1>
        <p className="ora-body text-xl md:text-2xl text-ora-gray mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && (
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              asChild={!!primaryAction.href}
            >
              {primaryAction.href ? (
                <Link to={primaryAction.href}>{primaryAction.label}</Link>
              ) : (
                <span onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </span>
              )}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size="lg"
              asChild={!!secondaryAction.href}
            >
              {secondaryAction.href ? (
                <Link to={secondaryAction.href}>{secondaryAction.label}</Link>
              ) : (
                <span onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  </section>
);

export const HomeHero = () => (
  <MinimalHero
    title="Education Reimagined"
    subtitle="Experience learning like never before with our innovative platform connecting you to expert instructors worldwide."
    primaryAction={{
      label: "Get Started",
      href: routes.auth.signUp,
    }}
    secondaryAction={{
      label: "Learn More",
      //TODO: replace with the correct path
      href: routes.public.home,
    }}
  />
);

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroLayout hero={<HomeHero />} fullWidthHero>
        <section className="py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="ora-heading text-3xl lg:text-4xl text-ora-navy mb-4">
              How ORA Works
            </h2>
            <p className="ora-body text-xl text-ora-gray max-w-2xl mx-auto">
              Three simple steps to start your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Path",
                description:
                  "Browse our extensive catalog of courses and instructors to find the perfect match for your learning goals.",
                icon: <BookOpen className="w-8 h-8 text-ora-blue" />,
              },
              {
                step: "02",
                title: "Connect & Learn",
                description:
                  "Schedule sessions, join group classes, or take self-paced courses with expert guidance every step of the way.",
                icon: <Users className="w-8 h-8 text-ora-teal" />,
              },
              {
                step: "03",
                title: "Achieve Your Goals",
                description:
                  "Track your progress, earn certifications, and unlock new opportunities with your newfound skills.",
                icon: <Award className="w-8 h-8 text-ora-orange" />,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-ora-lg ora-transition"
              >
                <CardContent className="py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="ora-subheading text-sm text-ora-gray mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="ora-heading text-xl text-ora-navy mb-3">
                    {item.title}
                  </h3>
                  <p className="ora-body text-ora-gray">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="ora-heading text-3xl lg:text-4xl text-ora-navy mb-4">
              Choose Your Learning Style
            </h2>
            <p className="ora-body text-xl text-ora-gray max-w-2xl mx-auto">
              Flexible options designed to fit your schedule and learning
              preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: ProductType.PrivateSession,
                title: "1-on-1 Sessions",
                description:
                  "Personalized instruction tailored to your specific needs and pace.",
                icon: <Users className="w-12 h-12 text-ora-blue" />,
                features: [
                  "Personal attention",
                  "Flexible scheduling",
                  "Custom curriculum",
                ],
              },
              {
                type: ProductType.GroupSession,
                title: "Live Workshops",
                description:
                  "Intensive, hands-on sessions focusing on practical skills.",
                icon: <Calendar className="w-12 h-12 text-ora-purple" />,
                features: [
                  "Intensive format",
                  "Practical focus",
                  "Expert guidance",
                ],
              },
              {
                type: ProductType.PreRecordedCourse,
                title: "Courses",
                description:
                  "Learn alongside peers in collaborative, interactive environments.",
                icon: <Globe className="w-12 h-12 text-ora-teal" />,
                features: [
                  "Peer interaction",
                  "Structured learning",
                  "Affordable pricing",
                ],
              },
              {
                type: ProductType.PrivateSession,
                title: "Online Courses",
                description:
                  "Self-paced learning with comprehensive video content and resources.",
                icon: <Video className="w-12 h-12 text-ora-orange" />,
                features: [
                  "Learn anytime",
                  "Lifetime access",
                  "Progress tracking",
                ],
              },
            ].map((option, index) => (
              <Link to={getProductPath(option.type)} key={index}>
                <Card
                  key={index}
                  className="hover:shadow-ora-lg ora-transition h-full"
                >
                  <CardContent className="py-6 flex flex-col justify-center items-center h-full">
                    <div className="text-center mb-4">{option.icon}</div>
                    <h3 className="ora-heading text-lg text-ora-navy mb-2 text-center">
                      {option.title}
                    </h3>
                    <p className="ora-body text-ora-gray text-center mb-4 flex-grow">
                      {option.description}
                    </p>
                    <ul className="space-y-1 mb-4">
                      {option.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2 ora-body text-sm"
                        >
                          <div className="w-1.5 h-1.5 bg-ora-teal rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </HeroLayout>
    </Layout>
  );
};

export default HomePage;
