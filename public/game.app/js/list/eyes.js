class EyesList extends List {
    constructor() {
        super({
            "Brown 1": "",
            Green: "",
            Yellow: "",
            "Blue 1": "",
            "Brown 2": "",
            "Blue 2": "",
            "Blue 3": ""
        });
    }

    getPath(value, is_kid) {
        if (is_kid) {
            return "Eyes_kids/48x48/Eyes_kids_48x48_" + value[0] + ".png";
        }

        return "Eyes/48x48/Eyes_48x48_" + value[0] + ".png";
    }
}

let eyes = new EyesList();
