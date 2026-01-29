import { FaUserGraduate, FaBookOpen, FaUniversity, FaGraduationCap, FaChalkboardTeacher, FaAward } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const qualificationLevels = [
  {
    title: 'CERTIFICATEs',
    slug: 'pre-university',
    icon: <FaBookOpen size={40} />,
    description: 'A certificate course is the shortest course of study. It is designed to give candidate’s proficiency over a single subject area or topic.',
  },
  {
    title: 'PRE UNIVERSITY',
    slug: 'pre-university',
    icon: <FaUserGraduate size={40} />,
    description: 'A candidate who has passed SPM or O-Level exams and is looking for further studies can enroll into a Pre-University preparatory course programme.',
  },
  {
    title: 'DIPLOMA',
    slug: 'diploma',
    icon: <FaGraduationCap size={40} />,
    description: 'It can be considered the equivalent of a first year degree & qualification is considered to be higher than Pre-University. It is offered in specific function areas.',
  },
  {
    title: 'UNDER GRADUATE',
    slug: 'under-graduate',
    icon: <FaUniversity size={40} />,
    description: 'A degree which is the first level of post secondary education a student wishes to pursue.',
  },
  {
    title: 'POST GRADUATE',
    slug: 'post-graduate',
    icon: <FaChalkboardTeacher size={40} />,
    description: 'Post Graduate Diploma is a version of shorter qualification than a masters degree although at the same scholastic level.',
  },
  {
    title: 'PhD DOCTORATE',
    slug: 'phd',
    icon: <FaAward size={40} />,
    description: 'Doctor of Philosophy is also called a PhD in short. Once a candidate completes this degree, they are qualified to teach at the university level.',
  },
];

export default function QualifiedLevels() {
  const navigate = useNavigate();

  const handleSelect = (slug) => {
    navigate(`/courses/${slug}`);
  };

  return (
<>

    <div className="py-10 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Select Your <span className="text-blue-600">Qualified Level</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {qualificationLevels.map((item, index) => (
          <div
            key={index}
            className="bg-blue-50 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300"
          >
            <div className="text-blue-600 mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-5">{item.description}</p>
            <button
              onClick={() => handleSelect(item.slug)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              SELECT
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
