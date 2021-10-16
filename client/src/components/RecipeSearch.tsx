import * as React from 'react';
import { useHistory } from 'react-router-dom';
import './styles/recipesearch.css';

const RecipeSearch = () => {
  const [search, setSearch] = React.useState<string>('');
  const history = useHistory();

  return (
    <div className="search">
      <input
        id="search-header"
        name="search-header"
        className="search__input"
        type="text"
        placeholder="Search"
        value={search}
        onChange={(evt) => setSearch(evt.target.value)}
        onKeyDown={(evt) => {
          if (evt.key === 'Enter') {
            history.push(`/search?q=${search}`);
            setSearch('');
          }
        }}
      />
    </div>
  );
};

export default RecipeSearch;
