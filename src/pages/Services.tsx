import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import sensorsImage from "@/assets/sensors-tech.jpg";
import dashboardImage from "@/assets/dashboard-analytics.jpg";

const Services = () => {
  const services = [
    {
      icon: Activity,
      title: "Predictive Maintenance",
      description: "Transform your maintenance strategy with AI-powered predictions",
      details: "Our advanced vibration and thermal sensors continuously monitor your equipment's health, using machine learning algorithms to predict failures weeks before they occur. Reduce unplanned downtime by up to 75% and extend equipment life by optimizing maintenance schedules based on actual condition data.",
      features: [
        "Real-time vibration analysis",
        "Thermal imaging integration", 
        "Machine learning failure prediction",
        "Automated alert systems",
        "Maintenance scheduling optimization"
      ]
    },
    {
      icon: Zap,
      title: "Energy Optimization",
      description: "Eliminate energy waste and reduce operational costs",
      details: "Our current transformers and smart meters provide granular visibility into your energy consumption patterns. Identify inefficiencies, optimize equipment operation schedules, and reduce energy costs by up to 30% through data-driven insights and automated control systems.",
      features: [
        "Real-time energy monitoring",
        "Load balancing optimization",
        "Peak demand management",
        "Equipment efficiency tracking",
        "Carbon footprint reduction"
      ]
    },
    {
      icon: Shield,
      title: "Automated Safety Monitoring",
      description: "Ensure workplace safety with continuous environmental monitoring",
      details: "Deploy our comprehensive sensor network to monitor air quality, gas levels, temperature, and environmental conditions. Automated safety systems provide instant alerts and can trigger emergency protocols, ensuring compliance with safety regulations and protecting your workforce.",
      features: [
        "Multi-gas detection systems",
        "Air quality monitoring",
        "Emergency alert protocols",
        "Regulatory compliance tracking",
        "Environmental data logging"
      ]
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Comprehensive IIoT Solutions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your manufacturing operations with our integrated Industrial IoT ecosystem. 
              From predictive maintenance to energy optimization, we deliver measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:gap-20">
            {services.map((service, index) => (
              <div key={service.title} className={`grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                          <service.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{service.title}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {service.details}
                      </p>
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-foreground">Key Features:</h4>
                        <ul className="grid grid-cols-1 gap-2">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={index === 0 ? sensorsImage : dashboardImage}
                      alt={service.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let our experts assess your facility and design a custom IIoT solution that delivers immediate ROI.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Schedule Your Assessment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Services;