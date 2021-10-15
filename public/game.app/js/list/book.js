class BookList extends List {
    constructor() {
        super({
            Blue: 1,
            Purple: 1,
            Green: 1,
            Brown: 1,
            Teal: 1,
            Multi: 1
        });
    }

    getPath(value) {
        return "Books/48x48/Book_48x48_" + value[0] + ".png";
    }
}

let books = new BookList();
