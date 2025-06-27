import AnimatedSection from "@/components/AnimatedSection";
import Contact from "@/components/sections/contact/Contact";

export default function Home() {
  return (
    <>
      <AnimatedSection animation="fade-in-up" duration="duration-700">
        <Contact />
      </AnimatedSection>
    </>
  );
}
