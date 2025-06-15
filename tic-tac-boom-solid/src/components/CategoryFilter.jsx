import { For } from 'solid-js';

function CategoryFilter(props) {
    const handleCategoryClick = (category) => {
        props.onSelect(category);
    };

    const handleClearFilter = () => {
        props.onSelect('');
    };

    return (
        <div class="category-filter-bar"> {}
            <For each={props.categories}>
                {(category) => (
                    <button
                        classList={{
                            'category-filter': true,
                            selected: props.selectedCategory === category
                        }}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                )}
            </For>

            {}
            <Show when={props.selectedCategory}>
                <button class="category-filter" onClick={handleClearFilter}>
                    Clear filter
                </button>
            </Show>
        </div>
    );
}

export default CategoryFilter;