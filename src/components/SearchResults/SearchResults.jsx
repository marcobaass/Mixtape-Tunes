import styles from './SearchResults.module.scss'
import PropTypes from 'prop-types';

export default function SearchResults({query}) {
  return(
    <div className={styles.resultBox}>
      <h2>Search results for: </h2>
      {query}
    </div>
  )
}

SearchResults.propTypes = {
  query: PropTypes.string.isRequired
};
