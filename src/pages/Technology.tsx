import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Cloud, BarChart3, Network } from "lucide-react";
import { Link } from "react-router-dom";
import engineersImage from "@/assets/engineers-collaboration.jpg";
import sensorsImage from "@/assets/sensors-tech.jpg";

const Technology = () => {
  const technologies = [
    {
      icon: Network,
      title: "Multi-Sensor Integration",
      description: "Comprehensive data collection across all operational parameters",
      details: [
        "Vibration sensors for mechanical health monitoring",
        "Thermal cameras for temperature profiling",
        "Ultrasonic sensors for precision measurements",
        "Gas detectors for environmental safety",
        "Current transformers for energy monitoring"
      ]
    },
    {
      icon: Cpu,
      title: "Edge Computing",
      description: "Real-time analysis and decision-making at the source",
      details: [
        "Sub-millisecond response times for critical alerts",
        "Local processing reduces bandwidth requirements",
        "Autonomous operation during network outages",
        "Machine learning models running on edge devices",
        "Secure data processing at the equipment level"
      ]
    },
    {
      icon: Cloud,
      title: "Cloud Analytics Platform",
      description: "Scalable data processing and advanced analytics",
      details: [
        "Centralized data warehouse for historical analysis",
        "Advanced machine learning and AI algorithms",
        "Predictive modeling and trend analysis",
        "Cross-facility benchmarking and optimization",
        "RESTful APIs for third-party integrations"
      ]
    },
    {
      icon: BarChart3,
      title: "Intelligent Dashboard",
      description: "Actionable insights through intuitive visualization",
      details: [
        "Real-time operational KPI monitoring",
        "Customizable alerts and notifications",
        "Mobile-responsive design for anywhere access",
        "Role-based access control and permissions",
        "Interactive data exploration and drilling"
      ]
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(var(--primary),0.1)_25%,rgba(var(--primary),0.1)_50%,transparent_50%,transparent_75%,rgba(var(--primary),0.1)_75%)] bg-[length:20px_20px]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Advanced IIoT Platform Architecture
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Our integrated ecosystem combines cutting-edge hardware, intelligent edge processing, 
              and cloud-scale analytics to deliver unprecedented operational visibility and control.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">End-to-End IIoT Integration</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our platform seamlessly integrates sensor networks, edge computing, and cloud analytics 
                to provide real-time operational intelligence. From the factory floor to the boardroom, 
                everyone gets the insights they need to make informed decisions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Real-time data processing and analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Scalable architecture supporting thousands of sensors</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Enterprise-grade security and compliance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Open API architecture for seamless integration</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={engineersImage}
                alt="Engineers collaborating with technology"
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent rounded-xl" />
            </div>
          </div>

          {/* Technology Components */}
          <div className="grid md:grid-cols-2 gap-8">
            {technologies.map((tech) => (
              <Card key={tech.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-tech transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                      <tech.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{tech.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {tech.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tech.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Intelligent Data Pipeline</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our sophisticated data pipeline ensures that information flows seamlessly from sensors 
              to actionable insights, with processing optimized at every stage for maximum efficiency and accuracy.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={sensorsImage}
                alt="Advanced sensors and circuit boards"
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Collection</h3>
                  <p className="text-sm text-muted-foreground">Multi-sensor arrays capture comprehensive operational data with microsecond precision</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Edge Processing</h3>
                  <p className="text-sm text-muted-foreground">Real-time analysis and filtering at the edge reduces latency and bandwidth requirements</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cloud Analytics</h3>
                  <p className="text-sm text-muted-foreground">Advanced machine learning models identify patterns and predict future states</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Actionable Insights</h3>
                  <p className="text-sm text-muted-foreground">Intuitive dashboards and automated alerts enable immediate response to critical conditions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Our Technology in Action</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            See how our integrated IIoT platform can transform your operations with a personalized demonstration.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Request a Live Demo</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Technology;