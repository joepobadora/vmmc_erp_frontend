// data.js
export const treeData = [
    {
        id: 1,
        name: 'Parent 1',
        children: [
            { id: 2, name: 'Child 1.1' },
            {
                id: 3,
                name: 'Child 1.2',
                children: [
                    { id: 4, name: 'Grandchild 1.2.1' },
                    { id: 5, name: 'Grandchild 1.2.2' },
                ],
            },
        ],
    },
    {
        id: 6,
        name: 'Parent 2',
        children: [{ id: 7, name: 'Child 2.1' }],
    },
];
