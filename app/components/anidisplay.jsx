"use client";
// Importing React hooks and components needed for this file
import React, { useEffect, useState, useRef, useCallback } from "react";
// Importing ReactDOM to render elements not managed by React (like tooltips)
import ReactDOM from "react-dom";

/**
 * Anidisplay Function Component:
 *
 * Purpose:
 * The main component that handles the display of anime. It provides features like
 * showing tooltips on click, fetching anime data from an API, and error handling.
 *
 * State Variables:
 * - topAnime: An array to store the list of top anime.
 * - loading: A boolean to indicate if the component is currently loading data.
 * - error: To store any error messages during data fetching.
 * - hideTooltip, activeTooltip, tooltipPosition: Variables for managing tooltips.
 */
export default function Anidisplay() {
  // useState hook for storing a list of top anime
  const [topAnime, setTopAnime] = useState([]);
  // useState hook for showing/hiding loading spinner
  const [loading, setLoading] = useState(true);
  // useState hook for error handling during data fetch
  const [error, setError] = useState(null);

  // useState hooks for tooltip visibility and related information
  const [hideTooltip, setHideTooltip] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  // useRef hook to get a reference to the main component
  const aniDisplayRef = useRef(null);

  // useRef hook for storing tooltip timeout ID
  const tooltipTimeout = useRef(null);

  /**
   * useEffect for Data Fetching:
   * This function runs when the component is first mounted.
   * It checks if the data is already cached in the local storage. If yes, it uses that data.
   * Otherwise, it fetches new data from the API and stores it in the local storage for future use.
   */
  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentSeason = ["winter", "spring", "summer", "fall"][
      Math.floor(currentDate.getMonth() / 3)
    ];

    const cacheKey = `animeData-${currentYear}-${currentSeason}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      setTopAnime(JSON.parse(cachedData));
      setLoading(false);
    } else {
      fetch(`https://api.jikan.moe/v4/seasons/${currentYear}/${currentSeason}`)
        .then((response) => response.json())
        .then((data) => {
          setTopAnime(data.data.slice(0, 24));
          localStorage.setItem(
            cacheKey,
            JSON.stringify(data.data.slice(0, 24))
          );
          setLoading(false);
        })
        .catch((error) => {
          setError(error.toString());
          setLoading(false);
        });
    }
  }, []);

  /**
   * handleMouseLeave Function:
   * This function triggers when the mouse leaves an anime thumbnail.
   * It sets a timeout to hide the tooltip after 300 milliseconds.
   * This provides a delay before hiding the tooltip, enhancing user experience.
   */
  const handleMouseLeave = useCallback(() => {
    // Code here sets a timeout to hide the tooltip
    tooltipTimeout.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 300);
  }, []);

  /**
   * cancelTooltipHide Function:
   * This function cancels the tooltip hiding timeout when called.
   * It's useful for when the user moves the mouse back over the tooltip before it hides.
   */
  const cancelTooltipHide = useCallback(() => {
    // Code here cancels the tooltip hiding timeout
    clearTimeout(tooltipTimeout.current);
  }, []);

  /**
   * handleClick Function:
   * This function is called when a user clicks on an anime thumbnail.
   * It calculates the exact position where the tooltip should appear based on the position of the clicked thumbnail.
   * Different conditions are checked to ensure the tooltip appears in a viewable area.
   */
  const handleClick = (event, anime) => {
    // Code here displays the tooltip and calculates its position
    clearTimeout(tooltipTimeout.current); // Cancel any existing tooltip timeout
    const rect = event.currentTarget.getBoundingClientRect();
    const isLastColumn = rect.left + rect.width > window.innerWidth - 350;
    setActiveTooltip(anime);

    if (window.innerWidth <= 768) {
      setTooltipPosition({
        top: rect.top,
        left: window.innerWidth / 2 - 100,
      });
    } else if (isLastColumn) {
      setTooltipPosition({
        top: rect.top,
        left: rect.left - 320,
      });
    } else {
      setTooltipPosition({
        top: rect.top,
        left: rect.left + rect.width + 10,
      });
    }
  };

  /**
   * renderTooltip Function:
   * This function conditionally renders the tooltip on the screen.
   * It uses ReactDOM.createPortal to insert the tooltip into a specific place in the DOM,
   * allowing the tooltip to break out of its container for positioning.
   */
  const renderTooltip = () => {
    // Code here returns JSX for the tooltip based on active state and position
    if (!activeTooltip || !tooltipPosition) return null;
    const style = {
      top: tooltipPosition.top,
      left: tooltipPosition.left,
      position: "fixed",
      zIndex: 1000,
      width: "300px",
      backgroundColor: "#1A202C",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
      padding: "12px",
      borderRadius: "5px",
      border: "1px solid #2D3748",
      color: "#E2E8F0",
      fontSize: "0.8rem",
      cursor: "pointer",
    };
    return ReactDOM.createPortal(
      <div
        style={style}
        className="bg-gray-900 text-white rounded-lg p-4 shadow-md w-72"
      >
        <h3 className="font-medium text-lg mb-2 text-purple-400">
          {activeTooltip.title_english || activeTooltip.title}
        </h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-3">
          {activeTooltip.synopsis}
        </p>
        <div className="text-sm text-gray-400 space-y-1">
          <p>
            <strong className="text-gray-200">Other names:</strong>{" "}
            {activeTooltip.title_synonyms.join(", ")}
          </p>
          <p>
            <strong className="text-gray-200">Scores:</strong>{" "}
            {activeTooltip.score} / {activeTooltip.scored_by} reviews
          </p>
          <p>
            <strong className="text-gray-200">Studio:</strong>{" "}
            {activeTooltip.studios.map((studio) => studio.name).join(", ")}
          </p>
          <p>
            <strong className="text-gray-200">Type:</strong>{" "}
            {activeTooltip.type}
          </p>
          <p>
            <strong className="text-gray-200">Duration:</strong>{" "}
            {activeTooltip.duration}
          </p>
          <p>
            <strong className="text-gray-200">Status:</strong>{" "}
            {activeTooltip.status}
          </p>
          <p>
            <strong className="text-gray-200">Genre:</strong>{" "}
            {activeTooltip.genres.map((genre) => genre.name).join(", ")}
          </p>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div
      ref={aniDisplayRef}
      className="  flex flex-col lg:flex-row gap-x-2 w-full mt-3 mb-20"
    >
      {/* Left Column */}
      <div className="w-full lg:w-2/12 p-1 flex flex-col">
        <nav className="flex justify-between items-center mb-2 p-3 bg-blue-500 text-white rounded-md shadow-md">
          <span className="font-extrabold">Top Anime</span>
        </nav>
        <div className="overflow-hidden flex-grow grid grid-rows-8 gap-2 bg-white rounded-md p-2 shadow-md">
          {(() => {
            const elements = [];
            for (let index = 0; index < Math.min(8, topAnime.length); index++) {
              const anime = topAnime[index];
              elements.push(
                <div
                  key={anime.mal_id}
                  onClick={(e) => handleClick(e, anime)}
                  onMouseEnter={cancelTooltipHide}
                  onMouseLeave={handleMouseLeave}
                  className="row-span-1 p-3 border-0 rounded-lg shadow-lg bg-white flex items-center hover:shadow-xl cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out"
                >
                  <span className="font-bold text-[#7F8C8D] mr-2">
                    {index + 1}.
                  </span>
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      className="object-cover w-full h-full"
                      src={anime.images.jpg.image_url}
                      alt={anime.title_english || anime.title}
                    />
                  </div>
                  <h2 className="text-sm font-semibold text-[#7F8C8D] ml-2 truncate w-32 wrap-text">
                    {anime.title_english || anime.title}
                  </h2>
                </div>
              );
            }
            return elements;
          })()}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-10/12 p-1 flex flex-col">
        <nav className="flex justify-between items-center mb-2 p-3 bg-opacity-30 rounded-md bg-white shadow-md">
          <span className="text-xl font-extrabold text-black">
            Top Fall Anime
          </span>
        </nav>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2 flex-grow overflow-y-auto bg-opacity-30 rounded-md bg-white shadow-md">
          {topAnime.map((anime, index) => (
            <div
              key={anime.mal_id}
              onClick={(e) => handleClick(e, anime)}
              onMouseEnter={cancelTooltipHide}
              onMouseLeave={handleMouseLeave}
              className="bg-white p-2 rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-t-lg group">
                <img
                  className="w-full h-48 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105"
                  src={anime.images.jpg.image_url}
                  alt={anime.title_english || anime.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 group-hover:opacity-60 transition-opacity duration-500 ease-in-out"></div>
              </div>
              <h2 className="text-lg font-medium text-[#7F8C8D] mt-1 text-center truncate">
                {anime.title_english || anime.title}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {renderTooltip()}
    </div>
  );
}
