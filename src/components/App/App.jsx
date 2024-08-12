import styles from './App.module.scss';
import SearchBar from '../SearchBar/SearchBar';

function App() {

  return (
    <>
      <h1 className={`${styles.heading} flex items-center justify-center`}>WALKIFY</h1>
      <div className="flex items-center justify-center">
        <SearchBar  />
      </div>
    </>
  );
}

export default App;
