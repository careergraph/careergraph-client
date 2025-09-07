import Marquee from "react-fast-marquee";
import TestimonialCard from "../components/Cards/TestimonialCard";
import { testimonialsData } from "../data/testimonialsData";
import SectionTitle from "../components/Sections/SectionTitle";

export default function TestimonialsSection() {
    return (
        <>
            <SectionTitle text1="Testimonials" text2="Our Social Proof" text3="A visual collection of our most recent works - each piece crafted with intention, emotion and style." />

            <Marquee className="max-w-5xl mx-auto mt-11" gradient={true} speed={25}>
                <div className="flex items-center justify-center py-5">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>
            <Marquee className="max-w-5xl mx-auto" gradient={true} speed={25} direction="right">
                <div className="flex items-center justify-center py-5">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>
        </>
    );
}