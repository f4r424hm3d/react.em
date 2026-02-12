
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import api from '../../api';

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug} = useParams();

    useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/university-gallery/${slug}`);
        // console.log('API Response:', response.data);
        
        // Handle API response – support both data.universityPhotos and universityPhotos
        let galleryData = [];
        const photos = response?.data?.universityPhotos ?? response?.data?.data?.universityPhotos;
        if (Array.isArray(photos)) {
          const toAbsoluteUrl = (path) => {
            if (!path) return null;
            if (/^https?:\/\//i.test(path)) return path;
            // Ensure we prefix with site root (not the API base)
            const cleaned = String(path).replace(/^\/+/, '');
            return `https://admin.educationmalaysia.in/storage/${cleaned}`;
          };

          galleryData = photos
            .map((photo) => toAbsoluteUrl(photo?.photo_path))
            .filter(Boolean);
        }
        
        // console.log('Processed gallery data:', galleryData);
        setImages(galleryData);
        
      } catch (error) {
        console.error('Error fetching gallery data:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGalleryData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Gallery</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No gallery images available</p>
        </div>
      </div>
    );
  }

  return (
     <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Gallery</h2>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <div key={i} className="relative group cursor-pointer">
            <img
              src={src}
              alt={`Campus ${i + 1}`}
              className="rounded-lg shadow-md object-cover w-full h-48 transition-transform duration-200"
            />
            {/* Zoom Icon on Hover */}
            <div
              onClick={() => setSelectedImg(src)}
              className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
            >
              <FaSearchPlus className="text-white text-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal (Full screen view) */}
      {selectedImg && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* Close Icon */}
          <button
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-red-500 transition-colors"
            aria-label="Close image preview"
          >
            <FaTimes />
          </button>

          <img
            src={selectedImg}
            alt="Zoomed campus"
            className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
