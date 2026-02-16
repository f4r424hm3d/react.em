import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Layers } from "lucide-react";
import SeoHead from "../../components/SeoHead";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";
import useStaticPageSeo from "../../hooks/useStaticPageSeo";

const PrivacyPolicy = () => {
  const { seo: apiSeo } = useStaticPageSeo("privacy-policy");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="service-detail"
        data={{
          name: apiSeo?.meta_title,
          description: apiSeo?.meta_description,
          keywords: apiSeo?.meta_keyword,
          image: apiSeo?.og_image_path,
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="service-detail"
        data={{
          title: "Privacy Policy",
          slug: "privacy-policy",
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-700 text-white text-center py-6 px-4 sticky top-0 z-10 shadow-md">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8 text-gray-700 space-y-6 text-[15px] leading-relaxed">
            <p>
              The User of the web-site <strong>www.educationmalaysia.in</strong>{" "}
              must carefully read and agree to the following terms and
              conditions before using the website. By using the site, you agree
              to be bound by these terms and our Privacy Policy.
            </p>

            <p>
              <strong>1.4 :</strong> Your use of the Website is subject to these
              terms and conditions (“the Terms”).
            </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                2. Changes to the Terms
              </h2>
              <p>
                <strong>2.1 :</strong> We reserve the right to update or modify
                these Terms at any time. Please review them regularly.
              </p>
              <p>
                <strong>2.2 :</strong> The current draft was published on 21
                February 2020.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                3. Information about you and visits to the Website
              </h2>
              <p>
                <strong>3.1 :</strong> We process your information in accordance
                with our{" "}
                <a href="/privacy-policy" className="text-blue-600 underline">
                  Privacy Policy
                </a>
                . You confirm that all data provided is accurate.
              </p>
              <p>
                <strong>3.2 :</strong> You may be required to register using
                personal details for full access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                4. Access to and use of our Website
              </h2>
              <p>
                <strong>4.1 :</strong> You agree to use the Website only for
                lawful purposes. You must not:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the Website in a fraudulent or illegal manner.</li>
                <li>
                  Copy or re-use any portion of the Website code or content.
                </li>
                <li>Enable unauthorized access to the Website or its data.</li>
              </ul>
              <p>
                <strong>4.2 - 4.6 :</strong> Additional terms regarding access,
                user conduct, and security are included.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                5. Intellectual Property Rights
              </h2>
              <p>
                <strong>5.1 - 5.8 :</strong> All content, designs, trademarks,
                and copyrights belong to us or licensors. You agree not to
                misuse or replicate them without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                6. Uploading Content to the Website
              </h2>
              <p>
                <strong>6.3 - 6.7 :</strong> Any content you upload grants us
                the right to use and display it. You must not upload harmful or
                unlawful content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                7. Links to Other Websites
              </h2>
              <p>
                <strong>7.1 - 7.4 :</strong> We are not responsible for
                third-party links or their content. Use them at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                8. Disclaimer and Limitation of Liability
              </h2>
              <p>
                <strong>8.1 - 8.6 :</strong> We disclaim warranties and limit
                our liability for damages arising from use of the Website. Force
                majeure clauses apply.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                9. General
              </h2>
              <p>
                <strong>9.2 - 9.4 :</strong> These Terms are governed by
                Malaysian law. If any part is unenforceable, the rest remains
                valid.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
