import { CheckIcon } from "lucide-react";

export const pricingData = [
    {
        title: "Basic Plan",
        price: 29,
        features: [
            {
                name: "5 Projects",
                icon: CheckIcon,
            },
            {
                name: "10 GB Storage",
                icon: CheckIcon,
            },
            {
                name: "Basic Support",
                icon: CheckIcon,
            },
            {
                name: "Community Access",
                icon: CheckIcon,
            },
            {
                name: "Basic code review",
                icon: CheckIcon,
            },
        ],
        buttonText: "Get Started",
    },
    {
        title: "Pro Plan",
        price: 79,
        mostPopular: true,
        features: [
            {
                name: "50 Projects",
                icon: CheckIcon,
            },
            {
                name: "100 GB Storage",
                icon: CheckIcon,
            },
            {
                name: "Priority Support",
                icon: CheckIcon,
            },
            {
                name: "Team Collaboration",
                icon: CheckIcon,
            },
            {
                name: "Advanced Analytics",
                icon: CheckIcon,
            },
            {
                name: "Premium Code Review",
                icon: CheckIcon,
            }
        ],
        buttonText: "Upgrade Now",
    },
    {
        title: "Enterprise Plan",
        price: 149,
        features: [
            {
                name: "Unlimited Projects",
                icon: CheckIcon,
            },
            {
                name: "1 TB Storage",
                icon: CheckIcon,
            },
            {
                name: "24/7 Dedicated Support",
                icon: CheckIcon,
            },
            {
                name: "Custom Integrations",
                icon: CheckIcon,
            },
            {
                name: "SLA Guarantee",
                icon: CheckIcon,
            }
        ],
        buttonText: "Contact Sales",
    }
];