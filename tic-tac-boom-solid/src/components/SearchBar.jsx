import { createSignal, createEffect } from 'solid-js';

function SearchBar(props) {
    const [inputValue, setInputValue] = createSignal(props.searchQuery || '');

    createEffect(() => {
        setInputValue(props.searchQuery || '');
    });

    const handleInputChange = (e) => {
        const query = e.target.value;
        setInputValue(query);
        props.onSearch(query);
    };

    return (
        <input
            type="text"
            placeholder="Search tasks..."
            class="search-bar"
            value={inputValue()}
            onInput={handleInputChange}
        />
    );
}

export default SearchBar;