import styles from './SearchBar.module.scss'
import PropTypes from 'prop-types';

export default function SearchBar({text, setText, onSubmit}) {

  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full shadow-md max-w-md grow">
      <input
        type="text"
        id="text"
        name="text"
        value={text}
        placeholder="Search for Song or Artist ..."
        onChange={(e) => setText(e.target.value)}
        aria-label='Search for Song or Artist'
        className="flex-1 p-2 border border-gray-300 rounded-tr-lg rounded-br-lg rounded-tl-[50px] rounded-bl-[50px] focus:outline-none focus:border-blue-500"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-tl-lg rounded-bl-lg rounded-tr-[50px] rounded-br-[50px] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Click</button>
    </form>
  )
}


SearchBar.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
