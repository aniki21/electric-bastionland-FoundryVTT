/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ElectricBastionlandActor extends Actor {
    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData () {
        super.prepareData();

        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;

        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.
        if (actorData.type === 'character') this._prepareCharacterData(actorData);
    }

    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData (actorData) {
        const data = actorData.data;

        data.armour = actorData
            .items
            .map(item => item.data.armour * item.data.equipped)
            .reduce((a, b) => a + b, 0)

        data.tooBulky = actorData
            .items
            .filter((obj) => obj.data.bulky === true).length > 2;

        if (data.tooBulky) {
            data.hp.value = 0;
        }

    }


    /** @override */
    getRollData () {
        const data = super.getRollData();
        // Let us do @str etc, instead of @abilities.str.value
        for (let [k, v] of Object.entries(data.abilities)) {
            if (!(k in data)) data[k] = v.value;
        }
        return data
    }

    /** @override */
    deleteOwnedItem (itemId) {
        const item = this.getOwnedItem(itemId);
        if (item.data.data.quantity > 1) {
            item.data.data.quantity--;
        } else {
            super.deleteOwnedItem(itemId);
        }
    }
}
