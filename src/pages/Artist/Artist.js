import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import getLocalStorageToken from "../../lib/getLocalStorageToken";
import getTotalPage from "../../lib/getTotalPage";
import SearchBar from "../../components/SearchBar/SearchBar";
import Card from "../../components/Card/Card";
import CardArtistData from "../../components/CardArtistData/CardArtistData";

import "./Artist.css";

class Artist extends React.Component {
  constructor(props) {
    super(props);
    this.searchBarRef = React.createRef();
    this.state = {
      artists: [],
      search: "",
      offset: 0,
      limit: 12,
      totalPage: 0,
      currentPage: 0
    };
    this.lastRequest = null;
    this.timeoutId = null;
    this.unlistenHistory = null;
  }
  getUrlSearchParams(location, param) {
    const urlParams = new URLSearchParams(this.props.location.search);
    const qsArtist = urlParams.get("artist");
    if (!qsArtist) return "";
    return qsArtist;
  }
  async componentDidMount() {
    try {
      const { limit } = this.state;
      const { history, location } = this.props;
      this.unlistenHistory = history.listen(this.listenHistory);
      const qsArtist = this.getUrlSearchParams(location, "artist");
      // No need to send request to Spotify
      if (!qsArtist) return;
      const resultArtist = await this.getQueryArtist(qsArtist);
      const { artists, totalPage } = this.getDataFromRequestArtist(resultArtist, limit);
      this.setState({ artists, totalPage, search: qsArtist }, () => this.toggleSearchBarAnimation());
    } catch (error) {
      console.error(error);
    }
  }
  componentWillUnmount() {
    if (this.unlistenHistory) {
      this.unlistenHistory();
    }
  }
  listenHistory = (location, action) => {
    const qsArtist = this.getUrlSearchParams(this.props.location, "artist");
    if (this.state.search === qsArtist) return;
    const e = { target: { value: qsArtist, historyAction: action } };
    if (action === "POP") {
      this.handleSearchChange(e);
    } else if (action === "PUSH") {
      this.handleSearchChange(e);
    }
  };
  /**
   * Retrieves the identification token to connect to the spotify API and retrieve the artists' data.
   * @param {String} artistSearch
   * @param {Number} offset
   * @param {Number} limit
   */
  getQueryArtist = async (artistSearch = "", offset = 0, limit = 12) => {
    if (!artistSearch) return null;
    const config = {
      headers: { Authorization: getLocalStorageToken("spotify") }
    };
    return axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistSearch)}&type=artist&limit=${limit}&offset=${offset}`, config);
  };
  /**
   * Get artists objects and totalPage
   * @param {Object} resultReqArtist 
   * @param {Number} limit 
   */
  getDataFromRequestArtist(resultReqArtist, limit) {
    let totalPage = 0;
    let artists = [];
    if (resultReqArtist && resultReqArtist.data && resultReqArtist.data.artists && resultReqArtist.data.artists.total) {
      totalPage = getTotalPage(resultReqArtist.data.artists.total, limit);
      artists = resultReqArtist.data.artists.items;
    }
    return { artists, totalPage };
  }
  /**
   * Search as you type
   * @param {Event} e
   */
  handleSearchChange = e => {
    if (!this.state.search) this.toggleSearchBarAnimation();
    if (this.timeoutId) clearTimeout(this.timeoutId);
    const { historyAction, value } = e.target;
    this.lastRequest = Date.now();
    const timestamp = this.lastRequest;
    this.setState({ search: value }, async () => {
      try {
        const { limit, search } = this.state;
        const resultArtist = await this.getQueryArtist(search);
        if (!search) {
          this.toggleSearchBarAnimation();
          if (!historyAction) {
            this.props.history.push(`/artist`);
          }
          return this.setState({ artists: [], totalPage: 0 });
        }
        // If old requests arrive after new requests, we should avoid to change the state with old data
        if (this.lastRequest > timestamp) return;
        const { artists, totalPage } = this.getDataFromRequestArtist(resultArtist, limit);
        // We write a new url when user stop typing during x ms;
        this.timeoutId = window.setTimeout(() => {
          const qsArtist = this.getUrlSearchParams(this.props.location, "artist");
          if (qsArtist === search) return;
          this.props.history.push(`/artist?artist=${search}`);
        }, 700);
        this.setState({ artists, totalPage });
      } catch (error) {
        console.error("error:", error);
      }
    });
  };

  /**
   * Allows you to change pages
   * @param {Object} paginate
   */
  handlePageChange = async paginate => {
    const { search, limit } = this.state;
    const resultArtist = await this.getQueryArtist(search, paginate.selected * limit);
    this.setState({
      artists: resultArtist ? resultArtist.data.artists.items : [],
      currentPage: paginate.selected
    });
  };
  /**
   * Search bar animation when typing for the first time
   */
  toggleSearchBarAnimation = () => {
    if (this.searchBarRef.current.classList.contains("center-searchbar")) {
      //We put the searchbar to the top
      this.searchBarRef.current.classList.replace("center-searchbar", "top-searchbar");
    } else {
      //We put the searchbar to the center
      this.searchBarRef.current.classList.replace("top-searchbar", "center-searchbar");
    }
  };

  render() {
    const { artists, search, totalPage } = this.state;
    return (
      <div id="Artist" className="container">
        <SearchBar ref={this.searchBarRef} search={search} handleSearchChange={this.handleSearchChange} />
        <div className="row padding-top-200px">
          {artists.map(artist => {
            const { id, name, followers, popularity, images } = artist;
            let image = "";
            // Popularity is between 0 and 100
            const stars = popularity > 0 ? popularity / 20 : 0;
            const lengthImg = images.length;
            if (lengthImg) {
              const img = artist.images[lengthImg - 1];
              if (img.url) image = img.url;
            }
            return (
              <Card key={id} linkTo={`/artist/${id}`} name={name} image={image}>
                <CardArtistData name={name} followers={followers.total} stars={stars} />
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

export default Artist;
