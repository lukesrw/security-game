class PhoneList extends List {
    constructor() {
        super({
            Blue: 1,
            Green: 1,
            Yellow: 1,
            White: 1,
            Red: 1
        });
    }

    getPath(value) {
        return "Smartphones/48x48/Smartphone_48x48_" + value[0] + ".png";
    }
}

let phones = new PhoneList();
