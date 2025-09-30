import { CheckIcon } from "lucide-react";

export const pricingData = [
    {
        title: "Gói Cơ bản",
        price: 29,
        features: [
            {
                name: "5 hồ sơ ứng tuyển",
                icon: CheckIcon,
            },
            {
                name: "10 GB lưu trữ",
                icon: CheckIcon,
            },
            {
                name: "Hỗ trợ cơ bản",
                icon: CheckIcon,
            },
            {
                name: "Truy cập cộng đồng",
                icon: CheckIcon,
            },
            {
                name: "Đánh giá CV cơ bản",
                icon: CheckIcon,
            },
        ],
        buttonText: "Bắt đầu",
    },
    {
        title: "Gói Chuyên nghiệp",
        price: 79,
        mostPopular: true,
        features: [
            {
                name: "50 hồ sơ ứng tuyển",
                icon: CheckIcon,
            },
            {
                name: "100 GB lưu trữ",
                icon: CheckIcon,
            },
            {
                name: "Hỗ trợ ưu tiên",
                icon: CheckIcon,
            },
            {
                name: "Cộng tác nhóm",
                icon: CheckIcon,
            },
            {
                name: "Phân tích nâng cao",
                icon: CheckIcon,
            },
            {
                name: "Đánh giá CV chuyên nghiệp",
                icon: CheckIcon,
            }
        ],
        buttonText: "Nâng cấp ngay",
    },
    {
        title: "Gói Doanh nghiệp",
        price: 149,
        features: [
            {
                name: "Không giới hạn hồ sơ",
                icon: CheckIcon,
            },
            {
                name: "1 TB lưu trữ",
                icon: CheckIcon,
            },
            {
                name: "Hỗ trợ 24/7 chuyên dụng",
                icon: CheckIcon,
            },
            {
                name: "Tích hợp tùy chỉnh",
                icon: CheckIcon,
            },
            {
                name: "Cam kết SLA",
                icon: CheckIcon,
            }
        ],
        buttonText: "Liên hệ bán hàng",
    }
];