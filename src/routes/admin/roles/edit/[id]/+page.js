import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    const permissions = {
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
        'DMS.DOCS_EDIT': false,
        'DMS.DOCS_DELETE': false,
        'DMS.DOCS_DOWNLOAD': false,
        'DMS.DOCS_ARCHIVE': false,
        'DMS.DOCS_SIGN': false,
        'DMS.DOCS_ROUTE': false,
        'DMS.REFCOPIES_VIEW': false,
        'DMS.REFCOPIES_EDIT': false,
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
        'DMS.ARCHIVE_EDIT': false,
        'DMS.ARCHIVE_DELETE': false,
        'DMS.ARCHIVE_DOWNLOAD': false,
        'DMS.ARCHIVE_UNARCHIVE': false,
        'DMS.TRASH_VIEW': false,
        'DMS.TRASH_EDIT': false,
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

    try {
        const result = await App.API.get(`/admin/roles/${params.id}`);

        const data = result.data.data;

        if (result.data.success) {
            data.permissions.forEach((permission) => {
                permissions[permission.code] = true;
            });

            return {
                code: data.code,
                name: data.name,
                description: data.description,
                status: data.is_active == 1,
                permissions,
            };
        } else {
            return {
                error: result.data.error_code,
            };
        }
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
