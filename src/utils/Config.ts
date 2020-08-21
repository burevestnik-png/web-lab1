export default class Config {
    state: object

    constructor( state = {} ) {
        this.state = state;
    }

    set( key, value ) {
        this.state[key] = value;
    }

    get( key ) {
        return this.state[key];
    }
}
