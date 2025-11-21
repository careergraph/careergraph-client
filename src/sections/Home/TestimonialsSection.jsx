import Marquee from "react-fast-marquee";
import TestimonialCard from "../../components/Cards/TestimonialCard";
import { testimonialsData } from "../../data/testimonialsData";
import SectionTitle from "../../components/Sections/SectionTitle";

export default function TestimonialsSection() {
    return (
        <>
            <SectionTitle text1="Đánh giá" text2="Phản hồi từ người dùng" text3="Những chia sẻ chân thực từ người dùng về trải nghiệm tìm việc làm trên Career Graph." />

            <Marquee className="max-w-full mx-auto mt-11" gradient={true} speed={25}>
                <div className="flex items-center justify-center py-5">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>
            <Marquee className="max-w-full mx-auto" gradient={true} speed={25} direction="right">
                <div className="flex items-center justify-center py-5">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>
        </>
    );
}