import { useState } from 'react'
import styles from './SearchBar.module.scss'

export default function SearchBar() {
  const [text, setText] = useState("");


  return (
    <form className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full shadow-md max-w-md grow">
      <input
        type="text"
        id="text"
        name="text"
        value={text}
        placeholder="Search for Song or Artist ..."
        onChange={(e) => setText(e.target.value)}
        aria-label='Search for Song or Artist'
        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Click</button>
    </form>
  )
}
