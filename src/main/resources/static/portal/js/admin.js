document.addEventListener('DOMContentLoaded', () => {
    loadSystemReport('#report-area');
    loadAdmins();
    setupCreateForm();
});

async function loadAdmins() {
    const loading = document.getElementById('admins-loading');
    const errorBox = document.getElementById('admins-error');
    const wrap = document.getElementById('admins-table-wrap');
    const tbody = document.querySelector('#admins-table tbody');
    errorBox.classList.add('hidden');
    wrap.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        const admins = await fetchAdmins();
        loading.classList.add('hidden');
        if (!admins.length) {
            errorBox.textContent = 'No admins found.';
            errorBox.classList.remove('hidden');
            return;
        }
        tbody.innerHTML = admins.map(a => renderAdminRow(a)).join('');
        wrap.classList.remove('hidden');
    } catch (e) {
        loading.classList.add('hidden');
        errorBox.textContent = 'Failed: ' + e.message;
        errorBox.classList.remove('hidden');
    }
}

function renderAdminRow(a) {
    return `
    <tr data-id="${a.id}">
      <td>${a.id}</td>
      <td>${a.username}</td>
      <td>${a.email}</td>
      <td>
        <select class="inline-input a-role">
          <option value="SUPER_ADMIN"${a.role==='SUPER_ADMIN'?' selected':''}>SUPER_ADMIN</option>
          <option value="STAFF"${a.role==='STAFF'?' selected':''}>STAFF</option>
        </select>
      </td>
      <td>
        <label style="display:flex;align-items:center;gap:.25rem;font-size:.6rem;">
          <input type="checkbox" class="a-enabled" ${a.enabled?'checked':''}>
          <span>${a.enabled?'Yes':'No'}</span>
        </label>
      </td>
      <td><input class="inline-input a-full" value="${a.fullName??''}" placeholder="Full name"></td>
      <td title="Updated: ${a.updatedAt||''}">${a.createdAt||''}</td>
      <td style="min-width:150px">
        <input class="inline-input a-pass" type="password" placeholder="New Pass">
        <button class="btn primary btn-sm a-save" style="margin-top:.35rem;">Save</button>
      </td>
      <td>
        <button class="btn danger btn-sm a-delete" title="Delete admin">Delete</button>
      </td>
    </tr>
  `;
}

function setupCreateForm() {
    const form = document.getElementById('admin-create-form');
    const msg = document.getElementById('admin-create-msg');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msg.textContent = '';

        const data = Object.fromEntries(new FormData(form).entries());
        if (data.username.length < 3) return showMsg(msg,'Username too short','error');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return showMsg(msg,'Invalid email','error');
        if (data.password.length < 6) return showMsg(msg,'Password too short','error');

        try {
            await createAdmin(data);
            showMsg(msg,'Admin created','success');
            form.reset();
            await loadAdmins();
            await refreshSystemReport('#report-area');
        } catch (e2) {
            showMsg(msg,e2.message,'error');
        }
    });
}

function showMsg(el, text, type) {
    el.textContent = text;
    el.style.color = type === 'error' ? '#ff8b8b' : '#6bdd9b';
    setTimeout(()=> {
        if (el.textContent === text) el.textContent='';
    }, 3000);
}

// Delegated update/delete handler
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('a-save')) {
        const tr = e.target.closest('tr');
        await updateSingleAdminRow(tr);
    } else if (e.target.classList.contains('a-delete')) {
        const tr = e.target.closest('tr');
        await deleteSingleAdminRow(tr);
    }
});

async function updateSingleAdminRow(tr) {
    const id = tr.dataset.id;
    const role = tr.querySelector('.a-role').value;
    const enabledEl = tr.querySelector('.a-enabled');
    const enabled = enabledEl.checked;
    tr.querySelector('.a-enabled + span').textContent = enabled ? 'Yes':'No';
    const fullName = tr.querySelector('.a-full').value.trim();
    const pass = tr.querySelector('.a-pass').value.trim();

    const payload = {
        role,
        enabled,
        fullName: fullName || null,
        newPassword: pass || null
    };
    Object.keys(payload).forEach(k => payload[k] == null && delete payload[k]);

    tr.classList.add('updating-row');
    try {
        await updateAdmin(id, payload);
        tr.classList.remove('updating-row');
        tr.querySelector('.a-pass').value = '';
        await refreshSystemReport('#report-area');
    } catch (e) {
        tr.classList.remove('updating-row');
        alert('Update failed: ' + e.message);
    }
}

async function deleteSingleAdminRow(tr) {
    const id = tr.dataset.id;
    const username = tr.children[1].textContent.trim();
    if (!confirm(`Delete admin "${username}"? This cannot be undone!`)) return;
    tr.classList.add('updating-row');
    try {
        await deleteAdmin(id);
        tr.remove();
        await refreshSystemReport('#report-area');
    } catch (e) {
        tr.classList.remove('updating-row');
        alert('Delete failed: ' + e.message);
    }
}