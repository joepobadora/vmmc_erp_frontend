<script>
    // Example data (replace with API later)

    let stats = {
        total_accounts: 54,
        active_accounts: 47,
        roles: 6,
        offices: 12,
        document_types: 9,
        document_tags: 23,
    };

    let auditLogs = [
        { time: '10:32', action: 'Admin created account: joan' },
        { time: '10:20', action: 'Admin updated role: Manager' },
        { time: '09:55', action: 'Admin deleted tag: obsolete' },
        { time: '09:12', action: 'Admin added office: Procurement' },
    ];

    let logins = [
        { time: '10:41', user: 'joan' },
        { time: '10:30', user: 'mark' },
        { time: '10:10', user: 'admin' },
    ];

    let newAccounts = [
        { name: 'Joan', role: 'Clerk' },
        { name: 'Mark', role: 'Supervisor' },
    ];
</script>

<div class="dashboard">
    <!-- HEADER -->
    <div class="header">
        <h2>Admin Dashboard</h2>

        <div class="quick-actions">
            <button>Create Account</button>
            <button>Create Role</button>
            <button>Add Office</button>
            <button>Add Document Type</button>
        </div>
    </div>

    <!-- SYSTEM OVERVIEW -->
    <section class="overview">
        <div class="card">
            <span class="value">{stats.total_accounts}</span>
            <span class="label">Total Accounts</span>
        </div>

        <div class="card">
            <span class="value">{stats.active_accounts}</span>
            <span class="label">Active Accounts</span>
        </div>

        <div class="card">
            <span class="value">{stats.roles}</span>
            <span class="label">Roles</span>
        </div>

        <div class="card">
            <span class="value">{stats.offices}</span>
            <span class="label">Offices</span>
        </div>

        <div class="card">
            <span class="value">{stats.document_types}</span>
            <span class="label">Document Types</span>
        </div>

        <div class="card">
            <span class="value">{stats.document_tags}</span>
            <span class="label">Document Tags</span>
        </div>
    </section>

    <!-- MAIN GRID -->
    <section class="main-grid">
        <!-- SYSTEM ACTIVITY -->
        <div class="panel">
            <div class="panel-header">
                <h3>System Activity</h3>
                <a href="/admin/audit-trail">View all</a>
            </div>

            <div class="activity-list">
                {#each auditLogs as log}
                    <div class="activity-item">
                        <span class="time">{log.time}</span>
                        <span>{log.action}</span>
                    </div>
                {/each}
            </div>
        </div>

        <!-- USER ACTIVITY -->
        <div class="panel">
            <h3>User Activity</h3>

            <div class="sub-panel">
                <h4>Recent Logins</h4>

                {#each logins as login}
                    <div class="activity-item">
                        <span class="time">{login.time}</span>
                        <span>{login.user}</span>
                    </div>
                {/each}
            </div>

            <div class="sub-panel">
                <h4>Recently Created Accounts</h4>

                {#each newAccounts as acc}
                    <div class="activity-item">
                        <span>{acc.name}</span>
                        <span class="badge">{acc.role}</span>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- SYSTEM INSIGHTS -->
    <section class="insights">
        <div class="panel">
            <div class="panel-header">
                <h3>Most Active Offices</h3>
            </div>

            <div class="chart-placeholder">Chart Placeholder</div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <h3>Most Used Document Types</h3>
            </div>

            <div class="chart-placeholder">Chart Placeholder</div>
        </div>
    </section>
</div>

<style>
    .dashboard {
        padding: 24px;
        background: #f5f7fb;
        min-height: 100vh;
        font-family: Roboto, Arial, sans-serif;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .quick-actions button {
        margin-left: 10px;
        padding: 8px 14px;
        border: none;
        background: #1976d2;
        color: white;
        border-radius: 6px;
        cursor: pointer;
    }

    .quick-actions button:hover {
        background: #1565c0;
    }

    .overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
    }

    .card {
        background: white;
        border-radius: 10px;
        padding: 18px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
    }

    .value {
        font-size: 26px;
        font-weight: 600;
    }

    .label {
        font-size: 13px;
        color: #6b7280;
    }

    .main-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        margin-bottom: 24px;
    }

    .panel {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
    }

    .activity-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
        font-size: 14px;
    }

    .activity-item:last-child {
        border-bottom: none;
    }

    .time {
        color: #9ca3af;
        margin-right: 10px;
    }

    .sub-panel {
        margin-bottom: 16px;
    }

    .badge {
        background: #e3f2fd;
        padding: 2px 8px;
        border-radius: 5px;
        font-size: 12px;
    }

    .insights {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .chart-placeholder {
        height: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f3f8;
        border-radius: 8px;
        color: #777;
        font-size: 14px;
    }
</style>
