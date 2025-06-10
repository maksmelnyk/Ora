import { Button, Card, CardContent } from "@/common/components";
import { GraduationCap, HandCoins, Timer, UserCheck } from "lucide-react";

interface IntroStepProps {
  onGetStarted: () => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({ onGetStarted }) => {
  return (
    <>
      {/* Hero Section */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center gap-8">
            <div>
              <h1 className="ora-heading text-4xl lg:text-5xl text-ora-navy mb-6">
                Become an Educator
              </h1>
              <p className="text-xl font-bold text-ora-teal mb-8 leading-relaxed">
                Share your expertise. Reach learners worldwide. Earn on your own
                terms.
              </p>
            </div>
            <div className="flex justify-items-stretch gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={onGetStarted}
              >
                Join now !
              </Button>
              <Button variant="teal" size="lg" className="flex-1">
                Learn more
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/assets/images/educator.png"
              alt="Become an Educator"
              className="max-w-md h-auto"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="bg-ora-highlight/20 border-l-12 border-ora-highlight rounded-l-none">
            <CardContent className="p-8">
              <h3 className="ora-heading text-xl text-ora-navy mb-6">
                What you'll get:
              </h3>
              <ul className="space-y-1 ora-body text-ora-gray">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-ora-gray rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Create your own courses & lessons
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-ora-gray rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Teach live or on your schedule
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-ora-gray rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Earn money doing what you love
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-ora-orange/20 border-l-12 border-ora-orange rounded-l-none">
            <CardContent className="p-8">
              <h3 className="ora-heading text-xl text-ora-navy mb-6">
                What we'll need from you:
              </h3>
              <ul className="space-y-1 ora-body text-ora-gray">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-ora-gray rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  A quick verification
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-ora-gray rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  A short video intro
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-ora-gray rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  A few words about your experience
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="ora-heading text-3xl text-ora-navy mb-4">
            Got questions? We've got answers.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              title: "Who can become an educator?",
              description:
                "Anyone with valuable knowledge to share. You don't need a degree — just skill and passion.",
              icon: <UserCheck className="w-24 h-24 text-ora-blue" />,
            },
            {
              title: "How long does it take to get approved?",
              description: "Usually within 1-3 business days.",
              icon: <Timer className="w-24 h-24 text-ora-orange" />,
            },
            {
              title: "Do I need to be a professional teacher?",
              description: "Nope. Many of our top educators are self-taught.",
              icon: <GraduationCap className="w-24 h-24 text-ora-teal" />,
            },
            {
              title: "How much can I earn?",
              description:
                "It depends on your offering — many earn 500-2000€/mo part-time.",
              icon: <HandCoins className="w-24 h-24 text-ora-error" />,
            },
          ].map((item, index) => (
            <Card key={index} className="text-center">
              <CardContent className="py-8">
                <div className="mb-6 flex justify-center">{item.icon}</div>
                <h3 className="ora-heading text-xl text-ora-navy mb-3">
                  {item.title}
                </h3>
                <p className="ora-body text-ora-gray">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="flex flex-col justify-center items-center gap-2 py-4 lg:py-8 bg-ora-highlight/20 rounded-xl">
          <h2 className="ora-heading text-3xl text-ora-navy mb-4">
            Ready to teach on your terms?
          </h2>
          <p className="ora-body text-lg text-ora-gray mb-8">
            We'll guide you through each step. You bring the knowledge — we'll
            handle the rest.
          </p>
          <Button
            variant="primary"
            size="md"
            className="min-w-1/3"
            onClick={onGetStarted}
          >
            Let's go!
          </Button>
        </div>
      </section>
    </>
  );
};

export default IntroStep;
