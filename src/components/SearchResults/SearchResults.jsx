import styles from './SearchResults.module.scss'
import PropTypes from 'prop-types';

export default function SearchResults() {
  return(
    <div className={styles.resultBox}>
      <h2></h2>
    </div>
  )
}

SearchResults.propTypes = {
  query: PropTypes.string.isRequired
};
