import React from "react";
import PropTypes from "prop-types";
import "./CardAlbumData.css";
import textAbstract from "../../lib/textAbstract"

function CardAlbumData(props) {
  const { name, totalTracks, artistName, releaseDate } = props;
  return (
    <div id="CardAlbumData" className="card-body position-relative">
      <div title={name}>{textAbstract(name, 50)}</div>
      <div className="card-album-artist-name">
        <span>{artistName}</span>
      </div>
      <div className="card-album-infos position-absolute">
        <div>{releaseDate}</div>
        <div>{totalTracks} tracks</div>
      </div>
    </div>
  );
}

CardAlbumData.propTypes = {
  totalTracks: PropTypes.number,
  name: PropTypes.string,
  artistName: PropTypes.string,
  releaseDate: PropTypes.string
};

CardAlbumData.defaultProps = {
  totalTracks: 0,
  name: "",
  artistName: "",
  releaseDate: ""
};

export default CardAlbumData;
