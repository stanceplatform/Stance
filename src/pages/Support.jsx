// pages/PrivacyPolicy.jsx
import React from "react";
import HeaderSecondary from "../components/ui/HeaderSecondary";
import { Link } from "react-router-dom";

const policySections = [
    {
        title: "1. Information We Collect",
        items: [
            {
                subtitle: "A. Account Information",
                content: "When you create an account using Google Sign-In or email authentication, we collect:\n• Email address\n• Username or display name\n• Profile photo (if provided)"
            },
            {
                subtitle: "B. User-Generated Content",
                content: "We collect and store:\n• Posts\n• Questions\n• Arguments\n• Comments\n• Any other content you publish on Stance\n\nThis content may be publicly visible within the app."
            },
            {
                subtitle: "C. Location Information",
                content: "We collect:\n• Precise GPS location\n• Approximate location (based on IP address)\n\nLocation data is collected **only while you are actively using the app** to support personalization, analytics, safety, and platform functionality.\nWe do not collect background location data.\nYou may disable location permissions at any time through your device settings."
            },
            {
                subtitle: "D. Device & Technical Information",
                content: "We collect:\n• Device identifiers\n• IP address\n• Operating system and device type\n• Push notification tokens\n• Log files\n• Crash reports"
            },
            {
                subtitle: "E. Analytics & Usage Data",
                content: "We collect data about how you interact with the app, including:\n• Pages viewed\n• Features used\n• Time spent\n• Engagement activity"
            },
            {
                subtitle: "F. Cookies & Tracking Technologies",
                content: "If you access Stance through our website, we may use cookies.\nWithin the mobile app, we use SDK-based identifiers and analytics tools such as Firebase, Google Analytics, and Mixpanel for tracking and analytics purposes."
            }
        ]
    },
    {
        title: "2. How We Use Your Information",
        content: "We use collected data to:\n• Create and manage accounts\n• Provide and maintain platform functionality\n• Personalize content and recommendations\n• Send notifications\n• Prevent spam and abuse\n• Improve performance and user experience\n• Conduct analytics and product development\n• Comply with legal obligations"
    },
    {
        title: "3. Third-Party Services",
        content: "We use the following third-party service providers:\n• Firebase (Authentication, Analytics, Crashlytics)\n• Google Analytics\n• Mixpanel\n• Amazon Web Services (AWS) for cloud hosting\n• SendGrid for email communication\n\nThese providers may process data on our behalf in accordance with their privacy policies."
    },
    {
        title: "4. Data Sharing",
        content: "We may share data with:\n• Analytics providers\n• Cloud infrastructure providers\n• Email communication providers\n• Law enforcement or regulatory authorities when legally required\n\nWe do not sell personal data."
    },
    {
        title: "5. Data Retention",
        content: "We retain user data for as long as necessary to provide services and comply with legal obligations.\nIf you request account deletion, your data may be retained for up to 365 days for legal, security, and fraud prevention purposes before permanent deletion."
    },
    {
        title: "6. Account Deletion & User Rights",
        content: "Users may request account deletion by contacting:\nhello@mystance.space\n\nUpon verification, we will process deletion requests in accordance with this Privacy Policy.\nYou may also:\n• Update profile information within the app\n• Disable location permissions from device settings"
    },
    {
        title: "7. Data Security",
        content: "We implement reasonable technical and organizational measures to protect user data from unauthorized access, misuse, or disclosure. However, no system can guarantee absolute security."
    },
    {
        title: "8. Children’s Privacy",
        content: "Stance is not intended for individuals under 13 years of age. We do not knowingly collect personal data from children."
    },
    {
        title: "9. International Data Transfers",
        content: "Data may be processed and stored on servers located outside India, including through AWS infrastructure."
    },
    {
        title: "10. Changes to This Privacy Policy",
        content: "We may update this Privacy Policy periodically. Continued use of the service after changes are published constitutes acceptance of the updated policy."
    },
    {
        title: "11. Contact Information",
        content: "For privacy-related questions or data requests:\nEmail: hello@mystance.space\nSupport: helloe@mystance.space"
    }
];

const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    const elements = [];
    let currentList = [];

    const pushList = () => {
        if (currentList.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc pl-5 my-1 space-y-1">
                    {currentList.map((li, i) => <li key={i}>{li}</li>)}
                </ul>
            );
            currentList = [];
        }
    };

    lines.forEach((line, idx) => {
        if (line.startsWith('• ')) {
            currentList.push(line.substring(2));
        } else {
            pushList();
            if (line === '') {
                elements.push(<div key={`empty-${idx}`} className="h-4" />);
            } else {
                elements.push(<div key={`text-${idx}`}>{line}</div>);
            }
        }
    });
    pushList();

    return <div className="text-[15px] leading-[22px] text-[#212121]">{elements}</div>;
};

export default function Support() {
    return (
        <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen">
            <div className="relative w-full">
                <HeaderSecondary />
                <div className="overflow-y-auto px-4 pt-24 pb-10">
                    {/* Page Title */}
                    <h1 className="text-left font-intro font-[600] text-[36px] leading-[48px] text-[#707070] mb-2">
                        Stance App Support
                    </h1>

                    {/* Subtitle */}
                    {/* <p className="text-left font-bold text-[15px] leading-[22px] text-[#212121] mb-6">
                Effective Date: 1/03/2026
          </p> */}

                    <p className="text-left text-[15px] leading-[22px] text-[#212121] mb-4">
                        If you have questions, issues, or feedback regarding the Stance app, please contact us.
                    </p>

                    <p className="text-left text-[15px] leading-[22px] text-[#212121] mb-8">
                        Email:
                        <a
                            href="mailto:hello@mystance.space"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            hello@mystance.space
                        </a>
                    </p>
                    <p className="text-left text-[15px] leading-[22px] text-[#212121] mb-8">
                        We typically respond within 24–48 hours.
                    </p>
                    <p className="text-left text-[15px] leading-[22px] text-[#212121] mb-8">
                        Please include your registered email and a brief
                        description of the issue.
                    </p>

                  <p className="fixed bottom-5 left-0 w-full text-center font-inter text-[13px] font-normal leading-[16px] text-[#212121]">
  <Link to="/terms-conditions" className="underline">
    Terms & Conditions
  </Link>
  {' '}|{' '}
  <Link to="/privacy-policy" className="underline">
    Privacy Policy
  </Link>
</p>


                    {/* Policy Sections */}
                    {/* <div className="space-y-6 text-start">
            {policySections.map((section, idx) => (
              <div key={idx}>
                <h2 className="font-bold text-[18px] leading-[26px] text-[#212121] mb-2">
                  {section.title}
                </h2>
                {section.content && renderContent(section.content)}
                {section.items && (
                  <div className="space-y-4 mt-3 pl-4">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx}>
                        <h3 className="font-semibold text-[16px] leading-[24px] text-[#212121] mb-1">
                          {item.subtitle}
                        </h3>
                        {renderContent(item.content)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div> */}

                </div>
            </div>
        </div>
    );
}
