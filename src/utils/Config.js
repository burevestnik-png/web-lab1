export default class Config {
    constructor(state = {}) {
        this.state = state;
    }

    set(key, value) {
        this.state[key] = value;
    }

    get( key ) {
        return this.state[key];
    }
}
