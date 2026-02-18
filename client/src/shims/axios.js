const createAxiosInstance = (options = {}) => {
    const baseURL = options.baseURL || '';

    const normalizeUrl = (url) => {
        if (url.startsWith('http')) return url;
        const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
        const path = url.startsWith('/') ? url : `/${url}`;
        return `${base}${path}`;
    };

    const axiosInstance = {
        get: async (url, config) => {
            const res = await fetch(normalizeUrl(url), { method: 'GET', ...config });
            const data = await res.json();
            return { data, status: res.status, statusText: res.statusText };
        },
        post: async (url, data, config) => {
            const res = await fetch(normalizeUrl(url), {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json', ...config?.headers },
                ...config
            });
            const respData = await res.json();
            return { data: respData, status: res.status, statusText: res.statusText };
        },
        put: async (url, data, config) => {
            const res = await fetch(normalizeUrl(url), {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json', ...config?.headers },
                ...config
            });
            const respData = await res.json();
            return { data: respData, status: res.status, statusText: res.statusText };
        },
        delete: async (url, config) => {
            const res = await fetch(normalizeUrl(url), { method: 'DELETE', ...config });
            const data = await res.json();
            return { data, status: res.status, statusText: res.statusText };
        },
        defaults: { headers: { common: {} } },
        interceptors: { 
            request: { use: () => {} }, 
            response: { use: () => {} } 
        },
        create: (newOptions) => createAxiosInstance({ ...options, ...newOptions })
    };

    return axiosInstance;
};

const defaultAxios = createAxiosInstance();

export default defaultAxios;
