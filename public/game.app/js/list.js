class List {
    constructor(list) {
        this.list = list;
    }

    getPath() {
        throw new Error("getPath not implemented.");
    }

    getRandom(index) {
        let list = Object.keys(this.list);

        if (typeof index === "undefined") {
            index = Math.floor(Math.random() * list.length);
        }

        return [index + 1, Math.floor(Math.random() * this.list[list[index]]) + 1];
    }

    getByIndex(index) {
        let keys = Object.keys(this.list);

        return keys[index].split(" ").join("_");
    }
}
