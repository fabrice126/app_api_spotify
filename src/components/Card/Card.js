import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import config from "../../config";
import "./Card.css";

class Card extends React.PureComponent {
  handleClick = e => {
    if (!this.props.linkTo) return;
    this.props.history.push(this.props.linkTo);
  };
  render() {
    const { name, image, children, externalLink, externalLinkText } = this.props;
    let heightTotal = "350px";
    if (externalLink) heightTotal = "400px";
    return (
      <article id="Card" className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
        <div className="card card-info d-flex flex-column cursor-pointer" style={{ height: heightTotal }} onClick={this.handleClick}>
          <img className="card-img-top img-height" src={image || config.default_image} alt={`${name}`} />
          {children}
          {externalLink && (
            <div className="urlSpotify">
              <a href={externalLink} rel="noopener noreferrer" target="_blank">
                {externalLinkText}
              </a>
            </div>
          )}
        </div>
      </article>
    );
  }
}
Card.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  linkTo: PropTypes.string,
  externalLink: PropTypes.string,
  externalLinkText: PropTypes.string
};

Card.defaultProps = {
  name: "",
  image: "",
  linkTo: "",
  externalLink: "",
  externalLinkText: ""
};

export default withRouter(Card);
