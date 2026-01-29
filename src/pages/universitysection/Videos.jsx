import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from '../../api';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchVideosData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/university-videos/${slug}`);
        console.log('Videos API Response:', response.data);
        
        // Handle the specific API response structure
        let videosData = [];
        const videosArray = response?.data?.data?.universityVideos ?? response?.data?.universityVideos ?? [];
        
        if (Array.isArray(videosArray)) {
          videosData = videosArray
            .filter(video => video.video_link || video.video_url || video.video_path)
            .map(video => video.video_link || video.video_url || video.video_path);
        }
        
        console.log('Processed videos data:', videosData);
        setVideos(videosData);
        
      } catch (error) {
        console.error('Error fetching videos data:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchVideosData();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <h2 className="text-xl font-semibold mb-2">Videos</h2>
        <div className="animate-pulse">
          <div className="w-full h-64 bg-gray-200 rounded-lg shadow"></div>
        </div>
      </>
    );
  }

  if (videos.length === 0) {
    return (
      <>
        <h2 className="text-xl font-semibold mb-2">Videos</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No videos available</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Videos</h2>
      {videos.map((videoUrl, index) => (
        <iframe
          key={index}
          src={videoUrl}
          title={`Campus Video ${index + 1}`}
          className="w-full h-64 rounded-lg shadow mb-4"
          allowFullScreen
        ></iframe>
      ))}
    </>
  );
};

export default Videos;
