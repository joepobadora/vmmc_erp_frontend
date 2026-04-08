<script>
    import j from '$lib/components/helper';
    import { goto } from '$app/navigation';
</script>

<j.Row mb="0">
    <j.Col span="2"></j.Col>
    <j.Col>
        <div class="vh-100">
            <div class="h-75 d-flex align-items-center">
                <j.RowCol>
                    <h1 class="display-2 text-danger">403</h1>
                    <h2>Access Denied</h2>
                    <p class="text-muted small">Sorry, you don’t have permission to view this page.</p>
                    <div>
                        <button
                            class="btn btn-primary btn-sm px-3"
                            onclick={() => {
                                goto('/');
                            }}><i class="bi bi-chevron-left me-2"></i>Go to Home</button
                        >
                    </div>
                </j.RowCol>
            </div>
        </div>
    </j.Col>
    <j.Col></j.Col>
</j.Row>
