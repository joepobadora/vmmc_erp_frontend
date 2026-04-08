import { writable } from 'svelte/store';

const modulesTemplate = {
    ADMIN0: false, // admin
    ADMIN1: false, // accounts
    ADMIN2: false, // roles
    ADMIN3: false, // offices
    ADMIN4: false, // doc types
    ADMIN5: false, // doc tags
    ADMIN6: false, // audit trail
    DEX0: false, // dex
    DEX1: false, // dms documents
    DEX2: false, // dms ref copies
    DEX3: false, // dms drafts
    DEX4: false, // dms archive
    DEX5: false, // dms trash
    DEX6: false, // dts incoming
    DEX7: false, // dts inbox
    DEX8: false, // dts outgoing
    DEX9: false, // dts drafts
    DEX10: false, // dts broadcast
    DEX11: false, // dts archive
    DEX12: false, // dts trash
    SEND0: false, // send
    FORMS0: false, // forms
};

const permissionsTemplate = {
    'ADMIN.ACC_VIEW': false,
    'ADMIN.ACC_CREATE': false,
    'ADMIN.ACC_EDIT': false,
    'ADMIN.ACC_DELETE': false,
    'ADMIN.ROLES_VIEW': false,
    'ADMIN.ROLES_CREATE': false,
    'ADMIN.ROLES_EDIT': false,
    'ADMIN.ROLES_DELETE': false,
    'ADMIN.OFFICES_VIEW': false,
    'ADMIN.OFFICES_CREATE': false,
    'ADMIN.OFFICES_EDIT': false,
    'ADMIN.OFFICES_DELETE': false,
    'ADMIN.DOCTYPES_VIEW': false,
    'ADMIN.DOCTYPES_CREATE': false,
    'ADMIN.DOCTYPES_EDIT': false,
    'ADMIN.DOCTYPES_DELETE': false,
    'ADMIN.DOCTAGS_VIEW': false,
    'ADMIN.DOCTAGS_CREATE': false,
    'ADMIN.DOCTAGS_EDIT': false,
    'ADMIN.DOCTAGS_DELETE': false,
    'ADMIN.AUDIT_VIEW': false,

    'DMS.DOCS_VIEW': false,
    'DMS.DOCS_DELETE': false,
    'DMS.DOCS_DOWNLOAD': false,
    'DMS.DOCS_ARCHIVE': false,
    'DMS.DOCS_SIGN': false,
    'DMS.DOCS_ROUTE': false,
    'DMS.REFCOPIES_VIEW': false,
    'DMS.REFCOPIES_DELETE': false,
    'DMS.REFCOPIES_DOWNLOAD': false,
    'DMS.REFCOPIES_ARCHIVE': false,
    'DMS.DRAFTS_VIEW': false,
    'DMS.DRAFTS_CREATE': false,
    'DMS.DRAFTS_EDIT': false,
    'DMS.DRAFTS_DELETE': false,
    'DMS.DRAFTS_POST': false,
    'DMS.DRAFTS_REVIEW': false,
    'DMS.DRAFTS_APPROVE': false,
    'DMS.ARCHIVE_VIEW': false,
    'DMS.ARCHIVE_DELETE': false,
    'DMS.TRASH_VIEW': false,
    'DMS.TRASH_RESTORE': false,
    'DMS.TRASH_PERMADELETE': false,

    'DTS.INCOMING_VIEW': false,
    'DTS.INCOMING_REJECT': false,
    'DTS.INCOMING_ACKNOWLEDGE': false,
    'DTS.INBOX_VIEW': false,
    'DTS.INBOX_RETRIEVE': false,
    'DTS.INBOX_FORWARD': false,
    'DTS.INBOX_TERMINATE': false,
    'DTS.OUTGOING_VIEW': false,
    'DTS.OUTGOING_RECALL': false,
    'DTS.DRAFTS_VIEW': false,
    'DTS.DRAFTS_CREATE': false,
    'DTS.DRAFTS_EDIT': false,
    'DTS.DRAFTS_DELETE': false,
    'DTS.DRAFTS_POST': false,
    'DTS.BROADCAST_VIEW': false,
    'DTS.BROADCAST_RETRIEVE': false,
    'DTS.ARCHIVE_VIEW': false,
    'DTS.ARCHIVE_DELETE': false,
    'DTS.TRASH_VIEW': false,
    'DTS.TRASH_RESTORE': false,
    'DTS.TRASH_PERMADELETE': false,
    'DTS.ARCHIVE_RETRIEVE': false,
};

const modules = writable([]);

const permissions = writable([]);

export { modules, permissions };
