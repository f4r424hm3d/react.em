import React from "react";
import SeoHead from "../components/SeoHead";
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
  return (
    <>
      <SeoHead
        pageType="home"
        data={{
          name: "Education Malaysia",
          description:
            "Discover top universities in Malaysia. Find courses, scholarships, exams, and expert guidance for studying in Malaysia. Your gateway to quality education in Malaysia.",
          keywords:
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
