class CommonTaskModel {

    constructor(data) {
        const { id, text, type } = data;
        this.id = id;
        this.text = text;
        this.type = type;
    }
}

export default CommonTaskModel;