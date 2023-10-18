"use client";
import React, { useEffect, useState } from "react";

/**
 * MangaDisplay Function Component:
 * The main component that handles the display of top manga.
 *
 * State Variables:
 * - topManga: An array to store the list of top manga.
 * - loading: A boolean to indicate if the component is currently loading data.
 * - error: To store any error messages during data fetching.
 * - retryCount: A counter to keep track of the number of times the fetch operation is retried.
 */
export default function MangaDisplay() {
  // State variables defined using React's useState hook
  const [topManga, setTopManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * fetchMangaStats Function:
   *
   * Objective:
   * Fetches additional statistical data for a list of manga from an API.
   *
   * Working:
   * - Takes an array of manga objects as input.
   * - Makes asynchronous API calls to fetch additional statistics for each manga.
   * - If the API call is successful, it updates the 'readingCount' property of the manga.
   * - If the API call fails, it logs the error and sets 'readingCount' to 0.
   * - Finally, it sorts the manga list based on the 'readingCount' in descending order and returns it.
   */
  const fetchMangaStats = async (mangaList) => {
    // Code for fetching manga statistics and sorting them
    const updatedMangaList = await Promise.all(
      mangaList.map(async (manga) => {
        try {
          const response = await fetch(
            `https://api.jikan.moe/v4/manga/${manga.mal_id}/statistics`
          );
          const stats = await response.json();
          return {
            ...manga,
            readingCount: stats.data.reading || 0,
          };
        } catch (err) {
          console.error(
            `Failed to fetch stats for manga ID ${manga.mal_id}:`,
            err
          );
          return {
            ...manga,
            readingCount: 0,
          };
        }
      })
    );
    return updatedMangaList.sort((a, b) => b.readingCount - a.readingCount);
  };

  /**
   * fetchManga Function:
   *
   * Objective:
   * Fetches a list of top manga from an API and updates the component state.
   *
   * Working:
   * - Sets the 'loading' state to true, indicating data is being fetched.
   * - Makes an asynchronous API call to fetch the list of top manga.
   * - If the API call is successful, it further fetches additional statistics by calling 'fetchMangaStats'.
   * - Then, updates the 'topManga' state and caches it in local storage.
   * - Sets 'loading' to false and clears any errors in 'error' state.
   *
   * Error Handling:
   * - If the API call fails, it sets an error message and retries the fetch operation.
   * - The retry uses exponential backoff, capped at 30 seconds, to avoid overloading the server.
   */
  const fetchManga = async () => {
    // Code for fetching and updating the list of top manga
    setLoading(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/top/manga`);
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        const mangaList = data.data.slice(0, 24);
        const updatedMangaList = await fetchMangaStats(mangaList);
        setTopManga(updatedMangaList);
        localStorage.setItem(
          "updatedMangaList",
          JSON.stringify(updatedMangaList)
        );
        setLoading(false);
        setError(null);
      } else {
        throw new Error("Unexpected data format from API");
      }
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      if (topManga.length === 0) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchManga();
        }, Math.min(1000 * 2 ** retryCount, 30000));
      }
    }
  };

  /**
   * useEffect Hook:
   *
   * Objective:
   * Automatically fetch the list of top manga when the component mounts.
   *
   * Working:
   * - Runs the 'fetchManga' function as soon as the component is added to the DOM.
   */
  useEffect(() => {
    fetchManga();
  }, []);

  return (
    <div className="w-full mt-3 mb-20 p-4 rounded-lg relative">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: Api Limit, Reloading</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {topManga.map((manga) => (
            <div
              key={manga.mal_id}
              className="bg-white p-2 rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  className="w-full h-48 object-cover"
                  src={manga.images.jpg.image_url}
                  alt={manga.title_english || manga.title}
                />
              </div>
              <h2 className="text-lg font-medium text-[#4b7174] mt-1 text-center truncate">
                {manga.title_english || manga.title}
              </h2>
              <div className="mt-2 text-center">
                <span className="flex items-center justify-center space-x-2 text-base font-medium text-[#7F8C8D]">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18 2H6a2 2 0 00-2 2v16c0 1.1.9 2 2 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z"></path>
                  </svg>
                  <span>
                    {parseInt(manga.readingCount).toLocaleString()} reading
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
