import { For } from 'solid-js';

function CategoryFilter(props) {
    // props:
    // - categories: an array of strings (e.g., ['Work', 'Personal', 'Daily'])
    // - selectedCategory: a string indicating the currently selected category, or ''
    // - onSelect: a callback function to inform the parent about category selection

    const handleCategoryClick = (category) => {
        props.onSelect(category); // Inform the parent which category was clicked
    };

    const handleClearFilter = () => {
        props.onSelect(''); // Clear the filter by sending an empty string
    };

    return (
        <div class="category-filter-bar"> {/* Added a wrapper div for styling flexibility */}
            <For each={props.categories}>
                {(category) => (
                    <button
                        classList={{
                            'category-filter': true, // Base class for all buttons
                            selected: props.selectedCategory === category // Add 'selected' class if it's the active filter
                        }}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                )}
            </For>

            {/* Show Clear filter button only if a category is selected */}
            <Show when={props.selectedCategory}>
                <button class="category-filter" onClick={handleClearFilter}>
                    Clear filter
                </button>
            </Show>
        </div>
    );
}

export default CategoryFilter;