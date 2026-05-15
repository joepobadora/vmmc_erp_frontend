<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import { draft } from '$lib/stores/dms';
    import j from '$lib/components/helper';
    import z from 'zod';
    import { page } from '$app/state';
    import Auth from '$lib/components/Auth.svelte';

    let auth = $state();

    let { data } = $props();

    console.log(data);

    let type = $state($draft.documentType ?? '');
    let name = $state($draft.name ?? '');
    let details = $state($draft.details ?? '');
    let tag = $state(null);
    let tags = $state($draft.tags ?? []);
    let reviewer = $state(null);
    let reviewers = $state($draft.reviewers ?? []);
    let approver = $state(null);
    let approvers = $state($draft.approvers ?? []);

    let typeList = $state(data.typeList ?? []);
    let tagList = $state(data.tagList ?? []);
    let accountList = $state(data.accountList ?? []);

    let saving = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    const schema = z.object({
        type: z
            .string()
            .nonempty('Required.')
            .refine((val) => typeList.map((t) => t.name).includes(val), {
                message: 'Invalid document type selected.',
            }),
        name: z.string().nonempty('Required.'),
        reviewers: z.array(z.any()).nonempty('At lease one reviewer is required.'),
        approvers: z.array(z.any()).nonempty('At lease one approver is required.'),
    });

    const reviewerSchema = z.object({
        reviewer: z.refine((val) => accountList.map((a) => a.id).includes(val), {
            message: 'Invalid reviewer selected.',
        }),
    });

    const approverSchema = z.object({
        approver: z.refine((val) => accountList.map((a) => a.id).includes(val), {
            message: 'Invalid approver selected.',
        }),
    });

    onMount(() => {
        if (!$draft.source) {
            goto('/dex/dms/drafts/create/source');
        }
    });

    async function save() {
        const validate = schema.safeParse({
            type,
            name,
            reviewers,
            approvers,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        const formData = new FormData();
        formData.append('file', $draft.file);
        formData.append('source', $draft.source);
        formData.append('type', type);
        formData.append('name', name);
        formData.append('details', details);
        formData.append('tags', JSON.stringify(tags));
        formData.append('reviewers', JSON.stringify(reviewers));
        formData.append('approvers', JSON.stringify(approvers));

        // saving account
        try {
            // password auth
            if (!(await auth.confirm())) return;

            // udpate button state
            saving = true;

            const result = await App.API.post('/dex/dms/drafts/store', formData, {
                headers: {
                    // Let Axios set the boundary automatically
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
                    Alert.show('success', 'Saving success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Saving failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            saving = false;
        }
    }

    function changeAttachment() {
        $draft.documentType = type;
        $draft.name = name;
        $draft.details = details;
        $draft.tags = tags;
        $draft.reviewers = reviewers;
        $draft.approvers = approvers;

        goto('/dex/dms/drafts/create/file-upload');
    }

    function handleTagSelect() {
        if (!tags.includes(tag)) {
            tags = [...tags, tag];
        }
        tag = null;
    }

    function handleTagRemove(tag) {
        tags = tags.filter((t) => t !== tag);
    }

    function handleReviewerSelect() {
        const opt = [...document.querySelectorAll('#accountList option')].find((o) => o.value === reviewer);

        if (opt) {
            reviewer = Number(opt.dataset.id);
        }

        const obj = accountList.find((a) => a.id === reviewer);

        const validate = reviewerSchema.safeParse({
            reviewer,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        if (!reviewers.includes(obj)) {
            reviewers = [...reviewers, obj];
        }

        reviewer = null;
    }

    function handleReviewerRemove(reviewer) {
        reviewers = reviewers.filter((r) => r !== reviewer);
    }

    function handleApproverSelect() {
        const opt = [...document.querySelectorAll('#accountList option')].find((o) => o.value === approver);

        if (opt) {
            approver = Number(opt.dataset.id);
        }

        const obj = accountList.find((a) => a.id === approver);

        const validate = approverSchema.safeParse({
            approver,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        if (!approvers.includes(obj)) {
            approvers = [...approvers, obj];
        }

        approver = null;
    }

    function handleApproverRemove(approver) {
        approvers = approvers.filter((a) => a !== approver);
    }
</script>

<Auth bind:me={auth} warning="You are about to create a draft document." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
            <li class="breadcrumb-item small active">Create</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>Create a draft document</h5>
        <p class="small text-muted">
            Create a new draft to capture and organize information before finalizing the document. Drafts can be saved, edited, and updated as needed prior to review or approval.
        </p>
    </j.RowCol>
    {#if $draft.source == 'DOCSRC1'}
        <hr class="text-muted" />
        <h5>File</h5>
        <j.Row>
            <j.Col>
                <label for="name" class="form-label small">Name</label>
                <input value={$draft.file.name} type="text" class="form-control form-control-sm" id="name" disabled />
            </j.Col>
        </j.Row>
        <j.Row>
            <j.Col span="6">
                <label for="name" class="form-label small">Size</label>
                <input value={App.Format.number($draft.file.size).toFileSize()} type="text" class="form-control form-control-sm" id="name" disabled />
            </j.Col>
            <j.Col span="6">
                <label for="name" class="form-label small">Type</label>
                <input value={$draft.file.ext} type="text" class="form-control form-control-sm" id="name" disabled />
            </j.Col>
        </j.Row>
        <j.RowCol>
            <label for="password" class="form-label small">Attachment</label>
            <div>
                <j.Button label="Change File" loadinglabel="Resetting" icon="bi-arrow-repeat" onClick={changeAttachment} />
            </div>
        </j.RowCol>
    {/if}
    <hr class="text-muted" />
    <h5>Details</h5>
    <j.Row>
        <j.Col span="6">
            <label for="office" class="form-label small">Document Type<span class="ms-1 text-danger">*</span></label>
            <input bind:value={type} list="typeList" type="text" class="form-control form-control-sm {errors.type ? 'is-invalid' : ''}" id="office" placeholder="Type and choose..." />
            <p class="text-danger small mb-auto {errors.type ? '' : 'd-none'}">{errors.type?.[0]}</p>
            <datalist id="typeList">
                {#each typeList as type}
                    <option value={type.name}></option>
                {/each}
            </datalist>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col>
            <label for="password" class="form-label small">Name<span class="ms-1 text-danger">*</span></label>
            <input bind:value={name} type="text" class="form-control form-control-sm {errors.name ? 'is-invalid' : ''}" id="password" placeholder="Name" />
            <p class="text-danger small mb-auto {errors.name ? '' : 'd-none'}">{errors.name?.[0]}</p>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col>
            <label for="exampleFormControlTextarea1" class="form-label small">Details</label>
            <textarea bind:value={details} class="form-control form-control-sm" id="exampleFormControlTextarea1" rows="5" placeholder="Details"></textarea>
        </j.Col>
    </j.Row>
    <j.RowCol span="6">
        <label for="docmngtMyDocumentsStatusDropdown" class="form-label small">Tag</label>
        <select onchange={handleTagSelect} bind:value={tag} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
            {#each tagList as tag}
                <option value={tag}>{tag.name}</option>
            {/each}
        </select>
        <div class="d-flex flex-row flex-wrap gap-2 my-3">
            {#each tags as tag}
                <j.Tag name={tag.name} color={tag.color} onRemove={() => handleTagRemove(tag)} />
            {/each}
        </div>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Participants</h5>
    <j.Row>
        <j.Col span="4">
            <label for="office" class="form-label small">Reviewers<span class="ms-1 text-danger">*</span></label>
            <div class="input-group input-group-sm">
                <input
                    bind:value={reviewer}
                    list="accountList"
                    type="text"
                    class="form-control form-control-sm {errors.reviewer || errors.reviewers ? 'is-invalid' : ''}"
                    id="office"
                    placeholder="Type and choose..."
                />
                <button onclick={handleReviewerSelect} class="btn btn-light border" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
            </div>
            <p class="text-danger small mb-auto {errors.reviewer ? '' : 'd-none'}">{errors.reviewer?.[0]}</p>
            <p class="text-danger small mb-auto {errors.reviewers ? '' : 'd-none'}">{errors.reviewers?.[0]}</p>
            <div class="d-flex flex-row flex-wrap gap-2 my-3">
                {#each reviewers as reviewer}
                    <j.Tag name={reviewer.user.full_name_2} onRemove={() => handleReviewerRemove(reviewer)} border />
                {/each}
            </div>
        </j.Col>
        <j.Col span="4">
            <label for="office" class="form-label small">Approvers<span class="ms-1 text-danger">*</span></label>
            <div class="input-group input-group-sm">
                <input
                    bind:value={approver}
                    list="accountList"
                    type="text"
                    class="form-control form-control-sm {errors.approver || errors.approvers ? 'is-invalid' : ''}"
                    id="office"
                    placeholder="Type and choose..."
                />
                <button onclick={handleApproverSelect} class="btn btn-light border" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
            </div>
            <p class="text-danger small mb-auto {errors.approver ? '' : 'd-none'}">{errors.approver?.[0]}</p>
            <p class="text-danger small mb-auto {errors.approvers ? '' : 'd-none'}">{errors.approvers?.[0]}</p>
            <div class="d-flex flex-row flex-wrap gap-2 my-3">
                {#each approvers as approver}
                    <j.Tag name={approver.user.full_name_2} onRemove={() => handleApproverRemove(approver)} border />
                {/each}
            </div>
        </j.Col>
        <datalist id="accountList">
            {#each accountList as account}
                <option data-id={account.id} value={account.user.full_name_2}></option>
            {/each}
        </datalist>
    </j.Row>

    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn btn-light border btn-sm px-3 {saving == true ? 'd-none' : ''}"
                onclick={() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
                }}>Cancel</button
            >
            <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
        </div>
    </j.RowCol>
</j.Card>
