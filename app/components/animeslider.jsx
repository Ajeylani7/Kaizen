"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Link from "next/link";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * AnimeSlider Component:
 *
 * Purpose:
 * This is the main functional component for displaying a slider of top anime.
 * It uses various state variables to manage the UI and data.
 */

export default function AnimeSlider() {
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * fetchAnimeWithStats Function:
   *
   * Purpose:
   * An asynchronous function that fetches the top anime list for the current season.
   *
   * Working:
   * - Sets the 'loading' state to true at the start.
   * - Makes an API call to fetch anime data for the current season.
   * - On successful fetch, stores the data in the 'topAnime' state variable.
   * - If an error occurs, it retries the fetch operation every 1 second.
   */

  const fetchAnimeWithStats = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentSeason = ["winter", "spring", "summer", "fall"][
        Math.floor(currentDate.getMonth() / 3)
      ];

      const response = await fetch(
        `https://api.jikan.moe/v4/seasons/${currentYear}/${currentSeason}`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setTopAnime(data.data);
        setLoading(false);
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      setError(error.toString());
      setTimeout(fetchAnimeWithStats, 1000); // Retry every 1 second
    }
  };

  useEffect(() => {
    fetchAnimeWithStats();
  }, []);

  const settings = {
    dots: true, // Default to true
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false, // Explicitly set to true
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false, // Set to false
        },
      },
    ],
  };

  return (
    <div className="w-full mt-10 mb-12 relative">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Slider {...settings}>
          {topAnime.map((anime) => (
            <div key={anime.mal_id} className="relative">
              <div
                className="flex w-full h-[250px] bg-[#f8f4ea] rounded-md overflow-hidden"
                style={{
                  backgroundImage: `url(${anime.images.jpg.image_url})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-1/2 p-4 flex flex-col justify-between bg-white bg-opacity-90 backdrop-blur-md">
                  <div>
                    <span className="bg-[#FF6B6B] text-white font-bold text-xs p-1 rounded-md absolute top-2 left-2">
                      🔥 Trending
                    </span>
                    <h1 className="text-[#0D0C22] text-2xl font-bold mt-6">
                      {anime.title_english || anime.title}
                    </h1>
                    <div className="text-[#7F8C8D] mt-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {anime.synopsis}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
