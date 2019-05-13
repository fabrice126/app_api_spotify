import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import getLocalStorageToken from "../../lib/getLocalStorageToken";
import getTotalPage from "../../lib/getTotalPage";
import Card from "../../components/Card/Card";
import CardAlbumData from "../../components/CardAlbumData/CardAlbumData";
import "./Album.css";

class Album extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      artist: null,
      offset: 0,
      limit: 12,
      totalPage: 0,
      currentPage: 0
    };
  }
  async componentDidMount() {
    try {
      const { limit } = this.state;
      const { artistId } = this.props.match.params;
      const resultAlbum = await this.getQueryAlbum(artistId);
      const { total, items } = resultAlbum.data;
      let artist = null;
      if (items.length) {
        artist = items[0].artists.find(artist => artist.id === artistId);
      }
      let totalPage = 0;
      totalPage = getTotalPage(total, limit);
      this.setState({ totalPage, albums: items, artist });
    } catch (error) {
      console.error("error componentDidMount :", error);
    }
  }
  /**
   * Retrieves the identification token to connect to the spotify API and retrieve the artists' data.
   * @param {String} artistId
   * @param {Number} offset
   * @param {Number} limit
   */
  getQueryAlbum = async (artistId = "", offset = 0, limit = 12) => {
    const config = {
      headers: { Authorization: getLocalStorageToken("spotify") }
    };
    return axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&offset=${offset}`, config);
  };
  /**
   * Allows you to change pages
   * @param {Object} paginate
   */
  handlePageChange = async paginate => {
    const { artist, limit } = this.state;
    const resultAlbum = await this.getQueryAlbum(artist.id, paginate.selected * limit);
    const { items } = resultAlbum.data;
    this.setState({
      albums: items,
      currentPage: paginate.selected
    });
  };
  render() {
    const { albums, artist, totalPage } = this.state;
    const artistName = artist ? artist.name : "";
    return (
      <div id="Album" className="container">
        <div className="infosLabel">
          <div className="artistLabel">{}</div>
          <div className="albumLabel">Albums</div>
        </div>
        <div className="row padding-top-200px">
          {albums.map(album => {
            const { id, name, images, total_tracks, release_date, external_urls } = album;
            let image = "";
            const lengthImg = images.length;
            if (lengthImg) {
              const img = album.images[lengthImg - 1];
              if (img.url) image = img.url;
            }
            let externalLinkSpotify = "";
            if (external_urls && external_urls.spotify) {
              externalLinkSpotify = external_urls.spotify;
            }
            return (
              <Card key={id} name={name} image={image} externalLink={externalLinkSpotify} externalLinkText={"Preview on Spotify"}>
                <CardAlbumData totalTracks={total_tracks} name={name} artistName={artistName} releaseDate={release_date} />
              </Card>
            );
          })}
        </div>
        {totalPage ? (
          <ReactPaginate
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageChange}
            previousLabel={"<"}
            nextLabel={">"}
            breakClassName={"break-me"}
            breakLabel={"..."}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Album;
