// src/App.jsx
import { createSignal, createEffect, For, Show } from 'solid-js';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import List from './components/List.jsx';
import AddCategoryModal from './components/AddCategoryModal.jsx';
import CardModal from './components/CardModal.jsx';
import Notification from './components/Notification.jsx';
import { initialLists } from './data/initialData.js';
import { setupReminders } from './utils/utils.js';

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

function App() {
  const [lists, setLists] = createSignal(deepClone(initialLists));
  const [nextCardId, setNextCardId] = createSignal(5);
  const [nextListId, setNextListId] = createSignal(4); // Not actively used but kept for consistency

  // Modal and UI state
  const [addingCardToListId, setAddingCardToListId] = createSignal(null);
  const [editingCard, setEditingCard] = createSignal(null);
  const [currentModalListId, setCurrentModalListId] = createSignal(null); // Tracks the listId for the modal's context
  const [showAddCategoryModal, setShowAddCategoryModal] = createSignal(false);
  const [notifications, setNotifications] = createSignal([]);

  // Search and Category Filter state
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal('');
  const [categories, setCategories] = createSignal([]);

  // Effects
  createEffect(() => {
    const allCategories = new Set(lists().flatMap(list => list.cards.map(card => card.category).filter(Boolean)));
    setCategories(Array.from(allCategories));
  });

  createEffect(() => {
    setupReminders(lists(), (card) => {
      setNotifications(prev => [...prev, { id: Date.now(), title: 'Task Reminder', content: card.content }]);
    });
  });

  createEffect(() => {
    if (notifications().length > 0) {
      const latestNotification = notifications()[notifications().length - 1];
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== latestNotification.id));
      }, 5000);
    }
  });

  // Event Handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(prev => prev === category ? '' : category);
  };

  const handleAddCategory = (newCategory) => {
    if (newCategory && !categories().includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
    }
    setShowAddCategoryModal(false);
  };

  const handleSaveCard = (cardData, listId, isNew) => {
    setLists(prevLists => {
      const updatedLists = prevLists.map(list => {
        if (list.id === listId) {
          if (isNew) {
            return {
              ...list,
              cards: [...list.cards, { ...cardData, id: nextCardId() }]
            };
          } else {
            return {
              ...list,
              cards: list.cards.map(card =>
                  card.id === cardData.id ? { ...cardData } : card
              )
            };
          }
        }
        return list;
      });
      if (isNew) {
        setNextCardId(prev => prev + 1);
      }
      return updatedLists;
    });
    // Reset modal state after saving
    setEditingCard(null);
    setAddingCardToListId(null);
    setCurrentModalListId(null);
  };

  const handleDeleteCard = (cardId, listId) => {
    console.log(`App.jsx: Deleting card ${cardId} from list ${listId}`);
    setLists(prevLists => {
      const updatedLists = prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.filter(card => card.id !== cardId)
          };
        }
        return list;
      });
      console.log('Lists after deletion:', updatedLists);
      return updatedLists;
    });
    // Reset modal state after deleting
    setEditingCard(null);
    setAddingCardToListId(null);
    setCurrentModalListId(null);
  };

  const handleMoveCard = (cardId, sourceListId, targetListId) => {
    if (sourceListId === targetListId) {
      return;
    }

    setLists(prevLists => {
      let draggedCard = null;
      let updatedLists = prevLists.map(list => {
        if (list.id === sourceListId) {
          const cardsAfterRemoval = list.cards.filter(card => {
            if (card.id === cardId) {
              draggedCard = card;
              return false;
            }
            return true;
          });
          return { ...list, cards: cardsAfterRemoval };
        }
        return list;
      });

      if (draggedCard) {
        updatedLists = updatedLists.map(list => {
          if (list.id === targetListId) {
            return { ...list, cards: [...list.cards, draggedCard] };
          }
          return list;
        });
      }
      return updatedLists;
    });
  };

  // HANDLER FOR OPENING NEW CARD MODAL (from List component)
  const openNewCardModal = (listId) => {
    setAddingCardToListId(listId);
    setCurrentModalListId(listId);
    setEditingCard(null);
  };

  // HANDLER FOR OPENING EDIT CARD MODAL (from Card component)
  // This handler now ensures both the card object AND its listId are set in state
  const openEditCardModal = (card, listId) => {
    setEditingCard(card);
    setCurrentModalListId(listId);
    setAddingCardToListId(null);
  };

  // Derived State / Filtering Logic
  const filteredLists = () => {
    const currentSearchQuery = searchQuery().toLowerCase();
    const currentSelectedCategory = selectedCategory();

    return lists().map(list => ({
      ...list,
      cards: list.cards.filter(card => {
        let matchesSearch = true;
        let matchesCategory = true;

        if (currentSearchQuery) {
          matchesSearch = (
              card.content.toLowerCase().includes(currentSearchQuery) ||
              (card.description && card.description.toLowerCase().includes(currentSearchQuery)) ||
              (card.labels && card.labels.some(l => l.toLowerCase().includes(currentSearchQuery))) ||
              (card.category && card.category.toLowerCase().includes(currentSearchQuery))
          );
        }

        if (currentSelectedCategory) {
          matchesCategory = card.category === currentSelectedCategory;
        }

        return matchesSearch && matchesCategory;
      })
    }));
  };

  return (
      <>
        <Header />

        <div class="add-category-bar">
          <button class="add-category-btn" onClick={() => setShowAddCategoryModal(true)}>Add Category</button>
        </div>

        <SearchBar searchQuery={searchQuery()} onSearch={handleSearch} />

        <Show when={categories().length > 0 || selectedCategory()}>
          <CategoryFilter
              categories={categories()}
              selectedCategory={selectedCategory()}
              onSelect={handleCategorySelect}
          />
        </Show>

        <div class="board-container">
          <For each={filteredLists()}>
            {(list) => (
                <List
                    list={list}
                    onAddCard={openNewCardModal}
                    onEditCard={openEditCardModal} // Pass the handler that now correctly receives listId
                    onDeleteCard={handleDeleteCard}
                    onMoveCard={handleMoveCard}
                />
            )}
          </For>
        </div>

        <Show when={showAddCategoryModal()}>
          <AddCategoryModal
              onAdd={handleAddCategory}
              onClose={() => setShowAddCategoryModal(false)}
          />
        </Show>

        {/* CardModal visibility: show if editingCard OR addingCardToListId is truthy */}
        <Show when={editingCard() || addingCardToListId()}>
          <CardModal
              card={editingCard()} // Pass the card object for editing (will be null for new)
              listId={currentModalListId()} // This consistently passes the correct listId
              isNew={!!addingCardToListId()} // True if adding new, false if editing
              categories={categories()}
              onSave={handleSaveCard}
              onDelete={handleDeleteCard} // Pass delete handler to CardModal
              onClose={() => { setEditingCard(null); setAddingCardToListId(null); setCurrentModalListId(null); }}
          />
        </Show>

        <For each={notifications()}>
          {(notification, i) => <Notification notification={notification} index={i()} />}
        </For>
      </>
  );
}

export default App;
