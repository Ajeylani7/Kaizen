import ReactDOM from "react-dom";

function Tooltip({ anime, position }) {
  if (!anime || !position) return null;

  const style = {
    top: position.top,
    left: position.left + position.width,
    position: "absolute",
    zIndex: 1000,
  };

  return ReactDOM.createPortal(
    <div
      style={style}
      className="w-80 p-3 bg-white border rounded-md shadow-xl"
    >
      <h3>{anime.title_english || anime.title}</h3>
      <p>Rated: {anime.rating}</p>
      <p>Duration: {anime.duration} min</p>
      <p>Desc: {anime.synopsis}</p>
      <p>Other names: {anime.title}</p>
      <p>
        Scores: {anime.score} / {anime.scored_by} reviews
      </p>
      <p>Date aired: {anime.airing_start}</p>
      <p>Status: {anime.status}</p>
      <p>Genre: {anime.genres.map((genre) => genre.name).join(", ")}</p>
      <button>Explore</button>
    </div>,
    document.body
  );
}

export default Tooltip;
