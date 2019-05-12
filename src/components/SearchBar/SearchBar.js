import React from "react";
import PropTypes from "prop-types";
import "./SearchBar.css";

const SearchBar = React.forwardRef((props, ref) => {
  const { search, handleSearchChange, placeholder } = props;
  return (
    <div id="SearchBar" ref={ref} className="d-flex justify-content-center center-searchbar">
      <div className="input-group col-sm-6 col-10">
        <input type="text" className="form-control" name="search" autoComplete="off" placeholder={placeholder} value={search} onChange={handleSearchChange} />
        <i className="fas fa-search" />
      </div>
    </div>
  );
});
SearchBar.propTypes = {
  search: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

SearchBar.defaultProps = {
  search: "",
  placeholder: "Search for an artist..."
};
export default SearchBar;
