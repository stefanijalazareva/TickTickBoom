import { createSignal, createEffect } from 'solid-js';

function SearchBar(props) {
    // We'll manage a local signal for the input value
    // and update the parent's search query on input.
    // Using props.searchQuery for the value makes it a "controlled component".
    const [inputValue, setInputValue] = createSignal(props.searchQuery || '');

    // This effect ensures the inputValue stays in sync with the parent's searchQuery
    // in case the parent changes it (e.g., clearing the filter).
    createEffect(() => {
        setInputValue(props.searchQuery || '');
    });

    const handleInputChange = (e) => {
        const query = e.target.value;
        setInputValue(query); // Update local signal
        props.onSearch(query); // Inform parent about the new query
    };

    return (
        <input
            type="text"
            placeholder="Search tasks..."
            class="search-bar"
            value={inputValue()} // Controlled by local signal, synced with prop
            onInput={handleInputChange}
        />
    );
}

export default SearchBar;