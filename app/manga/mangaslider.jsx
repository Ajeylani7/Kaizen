"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * MangaSlider Component:
 *
 * Purpose:
 * This is the main functional component for displaying a slider of top manga.
 * It uses various state variables to manage the UI and data.
 */

export default function MangaSlider() {
  const [topManga, setTopManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * fetchMangaWithStats Function (inside useEffect):
     *
     * Purpose:
     * An asynchronous function that fetches the top manga list.
     *
     * Working:
     * - Sets the 'loading' state to true at the start.
     * - Makes an API call to fetch the top manga data.
     * - On successful fetch, stores the data in the 'topManga' state variable and also in localStorage.
     * - If an error occurs, sets the 'error' state with the error message.
     */

    const fetchMangaWithStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.jikan.moe/v4/top/manga");
        const data = await response.json();

        if (data.data && data.data.length > 0) {
          setTopManga(data.data);
          localStorage.setItem("topManga", JSON.stringify(data.data));
          setLoading(false);
        } else {
          throw new Error("Data not found");
        }
      } catch (error) {
        setError(error.toString());
        setLoading(false);
      }
    };

    fetchMangaWithStats();
  }, []);

  const settings = {
    dots: true,
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
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="w-full mt-10 mb-14">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Slider {...settings}>
          {topManga.map((manga) => (
            <div
              key={manga.mal_id}
              className="relative p-8 bg-gradient-to-r from-[#f8f4ea] to-[#eae4d3] rounded-lg flex items-center"
            >
              <div className="w-full flex items-center">
                <img
                  src={manga.images.jpg.image_url}
                  alt={manga.title_english || manga.title}
                  className="shadow-lg rounded-lg"
                />{" "}
                <div className="w-full p-4 flex flex-col justify-between ml-6">
                  <h1 className="text-[#0D0C22] text-2xl font-semibold mt-6 tracking-wide">
                    {manga.title_english || manga.title}
                  </h1>
                  <div className="text-[#7F8C8D] mt-4 mb-4 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {manga.synopsis}
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
