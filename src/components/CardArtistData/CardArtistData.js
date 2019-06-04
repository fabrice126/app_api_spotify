import React from "react";
import PropTypes from "prop-types";
import StarRatings from "react-star-ratings";
import formatNumber from "../../lib/formatNumber";
import "./CardArtistData.css";

function CardArtistData(props) {
  const { name, followers, stars } = props;
  return (
    <div className="CardArtistData card-body position-relative">
      <div>{name}</div>
      <div className="card-artist-followers">
        <span>{formatNumber(followers)} followers</span>
      </div>
      <div className="card-artist-stars position-absolute">
        <StarRatings rating={stars} starRatedColor="#ED8A1A" numberOfStars={5} starDimension="20px" starSpacing="2px" />
      </div>
    </div>
  );
}

CardArtistData.propTypes = {
  name: PropTypes.string.isRequired,
  followers: PropTypes.number,
  stars: PropTypes.number
};

CardArtistData.defaultProps = {
  name: "",
  followers: 0,
  stars: 0
};

export default CardArtistData;
