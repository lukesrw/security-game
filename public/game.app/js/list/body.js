class BodyList extends List {
    constructor() {
        super({
            "Skin 1": 1,
            "Skin 2": 1,
            "Skin 3": 1,
            "Skin 4": 1,
            "Skin 5": 1,
            "Skin 6": 1,
            "Skin 7": 1,
            "Skin 8": 1,
            "Skin 9": 1
        });
    }

    getPath(value, is_kid) {
        if (is_kid) {
            return "Bodies_kids/48x48/Body_" + value[0] + "_kid_48x48.png";
        }

        return "Bodies/48x48/Body_48x48_" + value[0] + ".png";
    }
}

let bodies = new BodyList();
