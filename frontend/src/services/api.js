const BASE_URL = 'http://localhost:8080';

const api = {
    get: async (url, options = {}) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { data };
    },
    post: async (url, body, options = {}) => {
        const { params, headers: extraHeaders, ...restOptions } = options;
        let fullUrl = `${BASE_URL}${url}`;
        if (params) {
            const qs = new URLSearchParams(params).toString();
            fullUrl = `${fullUrl}?${qs}`;
        }
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...extraHeaders,
            },
            body: body !== null && body !== undefined ? JSON.stringify(body) : undefined,
            ...restOptions,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { data };
    },
    put: async (url, body, options = {}) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: JSON.stringify(body),
            ...options,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { data };
    },
    delete: async (url, options = {}) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { data };
    }
};

export default api;
