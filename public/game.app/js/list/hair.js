class HairList extends List {
    constructor() {
        super({
            "Hair 1": 7,
            "Hair 2": 7,
            "Hair 3": 7,
            "Hair 4": 7,
            "Hair 5": 7,
            "Hair 6": 7,
            "Hair 7": 7,
            "Hair 8": 7,
            "Hair 9": 7,
            "Hair 10": 7,
            "Hair 11": 7,
            "Hair 12": 7,
            "Hair 13": 7,
            "Hair 14": 7,
            "Hair 15": 7,
            "Hair 16": 7,
            "Hair 17": 7,
            "Hair 18": 7,
            "Hair 19": 7,
            "Hair 20": 7,
            "Hair 21": 7,
            "Hair 22": 7,
            "Hair 23": 7,
            "Hair 24": 7,
            "Hair 25": 7,
            "Hair 26": 7,
            "Hair 27": 6,
            "Hair 28": 6,
            "Hair 29": 6
        });
    }

    getPath(value, is_kid) {
        if (is_kid) {
            return "Hairstyles_kids/48x48/Hairstyle_kid_" + value[0] + "_48x48_" + value[1] + ".png";
        }

        return "Hairstyles/48x48/Hairstyle_" + value[0] + "_48x48_" + value[1] + ".png";
    }
}

let hairs = new HairList();
