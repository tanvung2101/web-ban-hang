class Storage {
    constructor(storage) {
        this._storage = storage;
    }

    get(key, defaultValue = null) {
        let value = this._storage.getItem(key) || defaultValue;

        if (value) {
            try {
                value = JSON.parse(value);
            } catch (error) {
                value = defaultValue;
            }
        }

        return value;
    }

    has(key) {
        return this.get(key) !== null;
    }

    set(key, value) {
        value = JSON.stringify(value);

        this._storage.setItem(key, value);
    }

    remove(key) {
        this._storage.removeItem(key);
    }

    clear() {
        this._storage.clear();
    }

    pull(key, defaultValue) {
        const value = this.get(key, defaultValue);

        this.remove(key);

        return value;
    }
}

function LocalStorage() {
    if (window === undefined) return null
    return LocalStorage = new Storage(window.localStorage);
}

function SessionStorage() {
    if (window === undefined) return null
    return SessionStorage = new Storage(window.sessionStorage)
}

export default LocalStorage;

export { SessionStorage };
