class AccessoryList extends List {
    constructor() {
        super({
            Ladybug: 4,
            Bee: 3,
            Backpack: 10,
            Snapback: 6,
            "Dino Snapback": 3,
            "Policeman Hat": 6,
            Bataclava: 3,
            "Detective Hat": 3,
            "Zombie Brain": 3,
            Bolt: 3,
            Beanie: 5,
            Mustache: 5,
            Beard: 5,
            Gloves: 4,
            Glasses: 6,
            Monocle: 3,
            "Medical Mask": 5,
            Chef: 3,
            "Party Cone": 4
        });
    }

    getPath(value) {
        return (
            "Accessories/48x48/Accessory_" +
            value[0] +
            "_" +
            this.getByIndex(parseInt(value[0], 10) - 1) +
            "_48x48_" +
            value[1] +
            ".png"
        );
    }
}

let accessories = new AccessoryList();
