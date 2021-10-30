addLayer("r", {
    name: "Rebirths", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#3498DB",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Rebirths", // Name of prestige currency
    baseResource: "cash", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        let smult = player.s.points.mul(1.5)
        if (!smult.gte(1)) smult = 1

        if (hasUpgrade('r', 15)) mult = mult.times(1.75)
        if (hasUpgrade('r', 22)) mult = mult.times(upgradeEffect('r', 22))
        if (hasAchievement('se', 13)) mult = mult.times(achievementEffect('se', 13))
        if (hasMilestone('s', 0)) mult = mult.times(smult)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rebirths", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Production Starter",
            description: "Increase cash gain by 50%",
            cost: new Decimal(1),
        },
        12: {
            title: "Production Doubler",
            description: "Double your cash gain.",
            cost: new Decimal(1),
            canAfford() {return hasUpgrade("r", 11)}
        },
        13: {
            title: "Production Enhancer",
            description: "Cash is boosted by Rebirths.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
            title: "Production Stabilizer",
            description: "Cash is boosted by Cash.",
            cost: new Decimal(6),
            effect() {
                let mult = player.points.add(1).pow(0.15)
                if (hasUpgrade("r", 21)) mult.pow(2)
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "Birth of Enlightenment",
            description: "Rebirth gain is boosted by 75%",
            cost: new Decimal(10),
        },
        21: {
            title: "Production Synergy",
            description: "Square 'Production Stabilizer' effect.",
            cost: new Decimal(500),
            unlocked() {return hasUpgrade("s", 11)}
        },
        22: {
            title: "The Key & The Answers",
            description: "Rebirths boost rebirth gain",
            cost: new Decimal(1000),
            unlocked() {return hasUpgrade("s", 11)},
            effect() {
                let mult = player[this.layer].points.add(1).pow(0.225)
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        23: {
            title: "Life Force",
            description: "Point gain is boosted ^1.07",
            cost: new Decimal(5000),
            unlocked() {return hasUpgrade("s", 11)},
        },
    },
})
addLayer("s", {
    name: "Stone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#D3D3D3",
    requires: new Decimal(75), // Can be a function that takes requirement increases into account
    resource: "Stone", // Name of prestige currency
    baseResource: "Rebirths", // Name of resource prestige is based on
    baseAmount() {return player.r.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    base: 3.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for stone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Miner's Benefit",
            description: "Unlock 3 new rebirth upgrades.",
            cost: new Decimal(1),
        },
        12: {
            title: "Miner's Journey",
            description: "Unlock Cave Challenges.",
            cost: new Decimal(3),
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 Stone",
            effectDescription: "Stone multiplies Rebirths by x1.5",
            done() { return player[this.layer].points.gte(1) }
        },
    },
    challenges: {
        11: {
            name: "Unproductive",
            completionLimit: 1,
            challengeDescription() {return "Cash gain is taken to the power of 0.5<br><br>"+challengeCompletions(this.layer, this.id) + "/" + this.completionLimit + " completions"},
            unlocked() {return hasUpgrade('s', 12)},
            goalDescription: 'Get 1,250 Cash<br>',
            canComplete() {
                return player.points.gte(1250)
            },
            rewardEffect() {
                let preboost = new Decimal(2)
                preboost = preboost.mul(challengeCompletions('s', 11))
                
                let ret = preboost.pow(player[this.layer].points)
                return ret;
            },
            rewardDisplay() { return format(this.rewardEffect())+"x" },
            rewardDescription: "Boosts Cash by 2^Stone",
        },
    }, 
})

// secrets

addLayer("se", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#C0C0C0",
    resource: "secrets", 
    symbol: "SE",
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Secrets")
    },
    achievementPopups: true,
    achievements: {
        11: {
            image: "discord.png",
            name: "Chocolate",
            done() {return player.points.gte(1000)},
            effect() {return new Decimal(1.2)},
            goalTooltip: "Get 1,000 Cash", // Shows when achievement is not completed
            doneTooltip: "1.2x Cash / 10,000 Cash", // Showed when the achievement is completed
            textStyle: {'color': '#964B00'},
        },
        12: {
            name: "Polybasite",
            done() {return player.s.points.eq(2) && player.r.points.gte(69)},
            effect() {return new Decimal(2.1)},
            goalTooltip: "Get exactly 2 Stone and above 69 Rebirths", // Shows when achievement is not completed
            doneTooltip: "2.1x Cash / 2 Stone & 69+ Rebirths", // Showed when the achievement is completed
            textStyle: {'color': '#FFFFFF'},
        },
        13: {
            name: "Celestial",
            done() {return player.r.points.gte(12500)},
            effect() {return new Decimal(1.5)},
            goalTooltip: "12,500 Rebirths", // Shows when achievement is not completed
            doneTooltip: "1.5x Rebirths / 12,500", // Showed when the achievement is completed
            textStyle: {'color': '#ADD8E6'},
        },
    },
},
)