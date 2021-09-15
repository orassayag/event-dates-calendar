class ReplaceEventDateModel {

    constructor(data) {
        const { id, include, replace } = data;
        this.id = id;
        this.include = include;
        this.replace = replace;
    }
}

module.exports = ReplaceEventDateModel;