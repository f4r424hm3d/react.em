import React, { useState, useEffect } from "react";
import SeoHead from "../components/SeoHead";
import api from "../api";
import Hero from "../components/home section/Hero";
import StudyJurney from "../components/home section/studyjurney";
import UniversitySlider from "../components/home section/UniversitySlider";
import Malaysia from "../components/home section/malyisia";
import Culture from "../components/home section/Culture";
import MalaysiaStudyInfo from "../components/home section/MalaysiaStudyInfo";
import ProgrammeSelector from "../components/home section/ProgrammeSelector";
import FieldStudy from "../components/home section/FieldStudy";
import CountryDashboard from "../components/home section/CountryDashboard ";
import UniversityRankingTable from "../components/home section/UniversityRankingTable";
import TestimonialSlider from "../components/home section/TestimonialSlider";

const Home = () => {
  const [seo, setSeo] = useState({});

  useEffect(() => {
    const fetchHomeSeo = async () => {
      try {
        const response = await api.get("/home");
        console.log("Home SEO Response:", response.data);

        // Handle various possible response structures
        // 1. { seo: { ... } }
        // 2. { data: { seo: { ... } } }
        // 3. { meta_title: "..." } (direct object)
        const seoData =
          response.data.seo || response.data.data?.seo || response.data;

        console.log("Processed SEO Data:", seoData);
        setSeo(seoData || {});
      } catch (error) {
        console.error("Error fetching home SEO:", error);
        // Fallback to default SEO if API fails
        setSeo({
          meta_title:
            "Education Malaysia - Study in Top Malaysian Universities",
          meta_description:
            "Discover top universities in Malaysia. Find courses, scholarships, exams, and expert guidance for studying in Malaysia. Your gateway to quality education in Malaysia.",
          meta_keyword:
            "study in Malaysia, Malaysian universities, courses in Malaysia, scholarships Malaysia, education Malaysia, study abroad Malaysia",
        });
      }
    };
    fetchHomeSeo();
  }, []);

  return (
    <>
      <SeoHead
        pageType="home"
        data={{
          ...seo, // Pass all backend fields (meta_title, etc.)
          name: seo.meta_title || "Education Malaysia",
          description:
            seo.meta_description ||
            "Discover top universities in Malaysia. Find courses, scholarships, exams, and expert guidance for studying in Malaysia. Your gateway to quality education in Malaysia.",
          keywords:
            seo.meta_keyword ||
            "study in Malaysia, Malaysian universities, courses in Malaysia, scholarships Malaysia, education Malaysia, study abroad Malaysia",
        }}
      />

      <Hero />
      <StudyJurney />
      <UniversitySlider />
      <Malaysia />
      <Culture />
      <MalaysiaStudyInfo />
      <ProgrammeSelector />
      <FieldStudy />
      <CountryDashboard />
      <UniversityRankingTable />
      <TestimonialSlider />
    </>
  );
};

export default Home;
