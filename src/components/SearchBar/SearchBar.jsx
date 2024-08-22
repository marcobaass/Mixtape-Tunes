import styles from './SearchBar.module.scss'
import PropTypes from 'prop-types';

export default function SearchBar({text, setText, onSubmit, handleSuggestions, suggestions}) {

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    handleSuggestions(newText);
  };

  const handleSuggestionClick = (suggestion) => {
    setText(suggestion);
    handleSuggestions('');
    onSubmit({ preventDefault: () => {} });
 };

  return (
    <div className="relative">
      <form onSubmit={onSubmit} className={`${styles.gridSearch} flex items-center space-x-2 p-2 ml-3 mr-3 bg-bright-cyan rounded-full shadow-md max-w-md grow`}>
        <input
          type="text"
          id="text"
          name="text"
          value={text}
          placeholder="Search for Song or Artist ..."
          onChange={handleChange}
          aria-label='Search for Song or Artist'
          className="flex-1 p-2 border border-gray-400 rounded-tr-lg rounded-br-lg rounded-tl-[50px] rounded-bl-[50px] focus:outline-none focus:border-blue-500 min-w-72"
          autoComplete='off'
        />
        <button type="submit" className="px-4 py-2 bg-hot-magenta text-white rounded-tl-lg rounded-bl-lg rounded-tr-[50px] rounded-br-[50px] hover:bg-neon-pink focus:outline-none focus:ring-2 focus:ring-blue-500">search</button>
      </form>
      {suggestions.length > 0 && (
        <ul className={`${styles.suggestions} absolute bg-white border border-gray-300 mt-1 w-full rounded-lg shadow-lg`}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


SearchBar.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleSuggestions: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired
};
