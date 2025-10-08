let ApiConfig = {

    baseURL: (typeof window !== 'undefined' && window.__API_BASE__)
        || (location.origin.endsWith(':8080')
            ? location.origin + '/api'
            : location.origin + '/api'),
    defaultTimeoutMs: 10000,
    enableRetries: true,
    maxRetries: 2,
    retryBackoffBaseMs: 400,
    cache: {
        summaryTTL: 15_000
    }
};

// Simple in‑memory cache
const _cache = {
    summary: { value: null, ts: 0 }
};

function buildQuery(params = {}) {
    const q = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
        .join('&');
    return q ? '?' + q : '';
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function apiRequest(method, path, body, { timeoutMs, retry = false } = {}) {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), timeoutMs || ApiConfig.defaultTimeoutMs);

    const url = ApiConfig.baseURL + path;
    const opts = {
        method,
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
    };
    if (body !== undefined) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(url, opts);
        const text = await res.text();
        let json;
        if (text) {
            try { json = JSON.parse(text); } catch {  }
        }

        if (!res.ok) {
            const err = normalizeError(res, json, path);
            throw err;
        }

        if (res.status === 204 || !text) return null;
        return json ?? text;

    } catch (err) {
        if (err.name === 'AbortError') {
            throw {
                status: 0,
                path,
                message: `Request timeout after ${(timeoutMs || ApiConfig.defaultTimeoutMs)}ms`,
                details: []
            };
        }
        throw err;
    } finally {
        clearTimeout(to);
    }
}

function normalizeError(res, json, path) {

    if (json && (json.details || json.errors)) {
        const details = (json.details || json.errors || []).map(d => {
            if (typeof d === 'string') return { field: null, message: d };
            return {
                field: d.field || d.objectName || null,
                message: d.message || d.defaultMessage || JSON.stringify(d)
            };
        });
        return {
            status: res.status,
            path,
            message: json.message || json.error || res.status + ' ' + res.statusText,
            details
        };
    }
    return {
        status: res.status,
        path,
        message: (json && (json.message || json.error)) || res.status + ' ' + res.statusText,
        details: []
    };
}

async function getWithRetry(path, opts = {}) {
    if (!ApiConfig.enableRetries || !opts.retry) {
        return apiRequest('GET', path, undefined, opts);
    }
    let attempt = 0;
    while (true) {
        try {
            return await apiRequest('GET', path, undefined, opts);
        } catch (e) {
            if (attempt >= ApiConfig.maxRetries ||
                ![0, 502, 503, 504].includes(e.status)) {
                throw e;
            }
            attempt++;
            const delay = ApiConfig.retryBackoffBaseMs * Math.pow(2, attempt - 1);
            await sleep(delay);
        }
    }
}

const api = {
    get: (p, o) => apiRequest('GET', p, undefined, o),
    getQ: (p, params, o) => apiRequest('GET', p + buildQuery(params), undefined, o),
    post: (p, b, o) => apiRequest('POST', p, b, o),
    put: (p, b, o) => apiRequest('PUT', p, b, o),
    patch: (p, b, o) => apiRequest('PATCH', p, b, o),
    del: (p, o) => apiRequest('DELETE', p, undefined, o)
};

async function fetchSummary({ useCache = false } = {}) {
    if (useCache) {
        const now = Date.now();
        if (_cache.summary.value && (now - _cache.summary.ts) < ApiConfig.cache.summaryTTL) {
            return _cache.summary.value;
        }
    }
    const data = await getWithRetry('/admin/dashboard/summary', { retry: true });
    _cache.summary = { value: data, ts: Date.now() };
    return data;
}

async function fetchSummaryCached() {
    return fetchSummary({ useCache: true });
}

async function fetchAdmins() {
    return api.get('/admins');
}

async function createAdmin(payload) {
    return api.post('/admins', payload);
}

async function updateAdmin(id, payload) {
    return api.patch(`/admins/${id}`, payload);
}

async function deleteAdmin(id) {
    return api.del(`/admins/${id}`);
}

async function fetchUsers(params = null) {
    if (!params) return api.get('/users');
    return api.getQ('/users', params);
}

async function fetchUser(id) {
    return api.get(`/users/${id}`);
}

async function updateUserFlags(id, { active, suspicious }) {
    if (active === undefined || suspicious === undefined) {
        throw new Error('updateUserFlags requires both active and suspicious');
    }
    return api.patch(`/admin/users/${id}/flags`, { active, suspicious });
}

async function deleteUser(id) {
    return api.del(`/users/${id}`);
}

async function fetchItems(params = null) {
    if (!params) return api.get('/items');
    return api.getQ('/items', params);
}

async function fetchItem(id) {
    return api.get(`/items/${id}`);
}

async function updateItemFlags(id, { active, fraudulent }) {
    if (active === undefined || fraudulent === undefined) {
        throw new Error('updateItemFlags requires both active and fraudulent');
    }
    return api.patch(`/admin/items/${id}/flags`, { active, fraudulent });
}

async function deleteItem(id) {
    return api.del(`/items/${id}`);
}

async function fetchBids() {
    return api.get('/admin/bids');
}

async function fetchBidsForItem(itemId) {
    return api.get(`/admin/bids/item/${itemId}`);
}
async function fetchBidsForUser(userId) {
    return api.get(`/admin/bids/user/${userId}`);
}

window.ApiConfig = ApiConfig;
window.api = api;

window.fetchSummary = fetchSummary;
window.fetchSummaryCached = fetchSummaryCached;

window.fetchAdmins = fetchAdmins;
window.createAdmin = createAdmin;
window.updateAdmin = updateAdmin;
window.deleteAdmin = deleteAdmin;

window.fetchUsers = fetchUsers;
window.fetchUser = fetchUser;
window.updateUserFlags = updateUserFlags;
window.deleteUser = deleteUser;

window.fetchItems = fetchItems;
window.fetchItem = fetchItem;
window.updateItemFlags = updateItemFlags;
window.deleteItem = deleteItem;

window.fetchBids = fetchBids;
window.fetchBidsForItem = fetchBidsForItem;
window.fetchBidsForUser = fetchBidsForUser;