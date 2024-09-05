import React from 'react';
import styles from './LoadingSpinner.module.scss'

const LoadingSpinner = () => (
  <div className={styles.loadingSpinner}>
    <div className={styles.loader}></div>
  </div>
);

export default LoadingSpinner;
