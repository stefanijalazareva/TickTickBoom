export const initialLists = [
    {
        id: 1,
        title: 'Today\'s Focus',
        cards: [
            {
                id: 1,
                content: 'Review morning goals & set focus for the day',
                reminder: null,
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                labels: ['Urgent'],
                category: 'Daily',
                description: 'Start your day by reviewing goals and priorities.',
                image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                profileIcon: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            {
                id: 2,
                content: 'Refactor task component logic for elegance',
                reminder: new Date(Date.now() + 60000).toISOString(),
                dueDate: new Date().toISOString(),
                labels: ['Code', 'Refactor'],
                category: 'Work',
                description: 'Improve the code structure for maintainability.',
                image: '',
                profileIcon: 'https://randomuser.me/api/portraits/women/44.jpg'
            }
        ]
    },
    {
        id: 2,
        title: 'Active Ops',
        cards: [
            {
                id: 3,
                content: 'Fixing delay in task removal animation',
                reminder: null,
                dueDate: new Date(Date.now() - 86400000).toISOString(),
                labels: ['Bug'],
                category: 'Work',
                description: 'Investigate and fix the animation delay.',
                image: '',
                profileIcon: 'https://randomuser.me/api/portraits/men/45.jpg'
            }
        ]
    },
    {
        id: 3,
        title: 'Marked as Magic',
        cards: [
            {
                id: 4,
                content: 'Celebrated with coffee',
                reminder: null,
                dueDate: null,
                labels: ['Fun'],
                category: 'Personal',
                description: 'Rewarded myself for a productive week.',
                image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
                profileIcon: 'https://randomuser.me/api/portraits/women/46.jpg'
            }
        ]
    }
];