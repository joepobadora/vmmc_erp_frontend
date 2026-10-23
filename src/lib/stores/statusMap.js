const docVariantMap = {
    true: { label: 'ORIGINAL', color: '#DBEAFE' }, // Soft Primary Blue
    false: { label: 'COPY', color: '#F1F5F9' }, // Soft Neutral Slate Gray
};

const docStatusMap = {
    // Drafting phase
    DOCSTATE1: { label: 'DRAFTED', color: '#E2E8F0' }, // Soft Slate
    DOCSTATE2: { label: 'POSTED', color: '#E0F2FE' }, // Soft Light Blue
    DOCSTATE3: { label: 'UPDATED', color: '#BAE6FD' }, // Soft Sky Blue
    DOCSTATE5: { label: 'REVIEWED', color: '#FEF3C7' }, // Soft Amber
    DOCSTATE7: { label: 'DECLINED', color: '#FFEDD5' }, // Soft Orange

    // Official document phase
    DOCSTATE6: { label: 'APPROVED', color: '#D1FAE5' }, // Soft Emerald Green
    DOCSTATE9: { label: 'SIGNED', color: '#A7F3D0' }, // Soft Mint
    DOCSTATE11: { label: 'RETRIEVED', color: '#E5E7EB' }, // Soft Neutral Gray

    // Reference copies
    DOCSTATE10: { label: 'ROUTED', color: '#E0E7FF' }, // Soft Indigo
    DOCSTATE14: { label: 'COPIED', color: '#F1F5F9' }, // Soft Cool Gray

    // Archiving
    DOCSTATE8: { label: 'ARCHIVED', color: '#E2E8F0' }, // Soft Muted Gray

    // Trash
    DOCSTATE4: { label: 'DELETED', color: '#FEE2E2' }, // Soft Rose/Red
};

const tranStatusMap = {
    // Transactions in the inbox
    ACTION1: { label: 'BROADCASTED', color: '#DDD6FE' }, // Soft Purple
    ACTION4: { label: 'RECEIVED', color: '#D1FAE5' }, // Soft Green
    ACTION5: { label: 'TERMINATED', color: '#E5E7EB' }, // Soft Gray
    ACTION8: { label: 'RECALLED', color: '#FEF3C7' }, // Soft Amber

    // Incoming transactions
    ACTION3: { label: 'FORWARDED', color: '#E0E7FF' }, // Soft Indigo
    ACTION9: { label: 'REJECTED', color: '#FEE2E2' }, // Soft Red

    // Outgoing on pool
    ACTION2: { label: 'RELEASED', color: '#A7F3D0' }, // Soft Mint Green

    // Archiving
    ACTION6: { label: 'ARCHIVED', color: '#E2E8F0' }, // Soft Slate

    // Trash
    ACTION7: { label: 'DELETED', color: '#FECDD3' }, // Soft Rose
};

export { docVariantMap, docStatusMap, tranStatusMap };
