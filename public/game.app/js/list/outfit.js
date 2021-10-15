class OutfitList extends List {
    constructor() {
        super({
            "Outfit 1": 3,
            "Outfit 2": 3,
            "Outfit 3": 3,
            "Outfit 4": 3,
            "Outfit 5": 3,
            "Outfit 6": 3,
            "Outfit 7": 3,
            "Outfit 8": 3,
            "Outfit 9": 3,
            "Outfit 10": 3,
            "Outfit 11": 3,
            "Outfit 12": 3,
            "Outfit 13": 3,
            "Outfit 14": 3,
            "Outfit 15": 3,
            "Outfit 16": 3,
            "Outfit 17": 3,
            "Outfit 18": 3,
            "Outfit 19": 3,
            "Outfit 20": 3,
            "Outfit 21": 3,
            "Outfit 22": 3,
            "Outfit 23": 3,
            "Outfit 24": 3,
            "Outfit 25": 3,
            "Outfit 26": 3,
            "Outfit 27": 3,
            "Outfit 28": 3,
            "Outfit 29": 3,
            "Outfit 30": 3,
            "Outfit 31": 3,
            "Outfit 32": 3,
            "Outfit 33": 3
        });
    }

    getPath(value, is_kid) {
        if (is_kid) {
            return "Outfits_kids/48x48/Outfit_kid_" + value[0] + "_48x48.png";
        }

        return "Outfits/48x48/Outfit_" + value[0] + "_48x48_" + value[1] + ".png";
    }
}

let outfits = new OutfitList();
