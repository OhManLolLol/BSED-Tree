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
        let wgmult = player.w.points.mul(5)
        if (!smult.gte(1)) smult = 1
        if (!wgmult.gte(1)) wgmult = 1

        // upgrades
        if (hasUpgrade('r', 15)) mult = mult.times(1.75)
        if (hasUpgrade('r', 22)) mult = mult.times(upgradeEffect('r', 22))

        // achievements
        if (hasAchievement('se', 13)) mult = mult.times(achievementEffect('se', 13))
        if (hasAchievement('se', 14)) mult = mult.times(achievementEffect('se', 14).rboost)

        // milestones
        if (hasMilestone('s', 0)) mult = mult.times(smult)
        if (hasMilestone('w', 0)) mult = mult.times(wgmult)

        // challenges
        if (hasChallenge('s', 12)) mult = mult.pow(challengeEffect('s', 12).rboost)

        // challenge nerfs
        if (inChallenge('s', 12)) mult = mult.pow(0.25)

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        if (hasMilestone("w", 1)) return 1
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rebirths", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    autoUpgrade(){return hasMilestone('w', 3)},
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
                let pow = 0.5
                if (hasUpgrade("r", 24)) pow = 0.65
                
                let boost = player[this.layer].points.add(1).pow(pow)
                if (hasUpgrade("r", 24)) boost = boost.pow(1.1)

                return boost
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
            description: "Cash gain is boosted ^1.07",
            cost: new Decimal(5000),
            unlocked() {return hasUpgrade("s", 11)},
        },
        24: {
            title: "Long Overdue",
            description: "'Production Stabilizer' uses a better formula.",
            cost: new Decimal(1e12),
            unlocked() {return hasUpgrade("s", 14)},
        },
        25: {
            title: "Life's Method",
            description: "Rebirths boost point base.",
            cost: new Decimal(1e18),
            unlocked() {return hasUpgrade("s", 14)},
            effect() {
                let mult = player[this.layer].points.add(1).pow(0.07)
                return mult
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))}, // Add formatting to the effect
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
    color: "#A9A9A9",
    branches: ["r"],
    canBuyMax() {return hasMilestone("w", 0)},
    requires: new Decimal(75), // Can be a function that takes requirement increases into account
    resource: "Stone", // Name of prestige currency
    baseResource: "Rebirths", // Name of resource prestige is based on
    baseAmount() {return player.r.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    base: 3.5,
    gainMult() { // division on static, not multiply
        mult = new Decimal(1)
        
        // upgrades
        if (hasUpgrade('w', 11)) mult = mult.div(2)

        return mult
    },
    directMult() { // the good boi
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
    resetsNothing(){return hasMilestone('s', 2)},
    doReset(layer){
        if(layers[layer].row <= layers[this.layer].row || layers[layer].row == "side")return;
        let keep = []
            
        if(hasMilestone('w',2)) keep.push("challenges")

        layerDataReset(this.layer, keep)
        /*
          that giant if does 2 things
          first it gets the resetting layer's row and makes sure
          it's higher than the current layer's row
      
          second it gets the resetting layer's row again
          and checks if it's a side layer
          if either of those are true then it returns
          nothing which ends the function
      
          the other line resets the layer
        */
    },
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
        13: {
            title: "Miner's Collection",
            description: "Multiply gem gain by 5, and unlock a new Cave Challenge.",
            cost: new Decimal(6),
        },
        14: {
            title: "Miner's Payment",
            description: "Unlock 2 more rebirth upgrades.",
            cost: new Decimal(7),
        },
        21: {
            title: "Hidden in Plain Sight",
            description: "Unlock a new row 2 layer",
            unlocked() {return hasUpgrade('w', 12)},
            cost: new Decimal(15),
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 Stone",
            effectDescription: "Stone multiplies Rebirths by x1.5",
            done() { return player[this.layer].points.gte(1) }
        },
        1: {
            requirementDescription: "5 Stone",
            effectDescription: "Gems are unlocked",
            done() { return player[this.layer].points.gte(5) }
        },
        2: {
            requirementDescription: "10 Stone",
            effectDescription: "Stone no longer resets anything",
            done() { return player[this.layer].points.gte(10) }
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
        12: {
            name: "Lifeless",
            completionLimit: 1,
            challengeDescription() {return "Rebirth gain is taken to the power of 0.25, Cash is divided by 3<br><br>"+challengeCompletions(this.layer, this.id) + "/" + this.completionLimit + " completions"},
            unlocked() {return hasUpgrade('s', 13)},
            goalDescription: 'Get 50,000 Rebirths<br>',
            canComplete() {
                return player.r.points.gte(50000)
            },
            rewardEffect() {
                let ret = {}

                ret.rboost = new Decimal(1.025)
                ret.cboost = new Decimal(25)
                return ret;
            },
            rewardDescription: "Rebirth gain brought to ^1.025, Cash gain *25",
        },
    }, 
})

addLayer("f", {
    name: "Fountain", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        ipointgen: new Decimal(0),
        ipoints: new Decimal(0),
    }},
    color: "#778899",
    branches: ["r", "w"],
    requires: new Decimal(1e31), // Can be a function that takes requirement increases into account
    resource: "Fountains", // Name of prestige currency
    baseResource: "Rebirths", // Name of resource prestige is based on
    baseAmount() {return player.r.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2.25, // Prestige currency exponent
    base: 1e25,
    gainMult() { // division on static, not multiply
        mult = new Decimal(1)
        return mult
    },
    directMult() { // the good boi
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update(ticc) {
        let base = new Decimal(1.5)
        let ipointgen = base.pow(player[this.layer].points)

        // buyables
        let pointBoost = buyableEffect("f", 11)
	    if (getBuyableAmount("f", 11).gte(1)) ipointgen = ipointgen.mul(pointBoost.first)

        // upgrades
        if (hasUpgrade('f', 13)) ipointgen = ipointgen.mul(upgradeEffect('f', 13))

        if (player[this.layer].points.gte(1)) {
            player[this.layer].ipointgen = ipointgen
        } else {
            player[this.layer].ipointgen = new Decimal(0)
        }

        if (player[this.layer].points.gte(1)) player[this.layer].ipoints = player[this.layer].ipoints.add(ipointgen)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for fountains", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Fountain of Immortality",
            description: "Unlock the first buyable.",
            cost: new Decimal(1),
        },
        12: {
            title: "The Hidden World",
            description: "Unlock the second buyable.",
            cost: new Decimal(1e5),
            currencyDisplayName: "Immortallity Points",
            currencyInternalName: "ipoints",
            currencyLayer: "f"
            /* canAfford() { return player[this.layer].ipoints.gte(1e5) },
            pay() {
                let cost = tmp[this.layer].upgrades[this.id].cost
                player[this.layer].ipoints = player[this.layer].ipoints.sub(cost)
            },
            
            */
        },
        13: {
            title: "Wealth's Unknown Power",
            description: "Cash boosts Immortallity Point gain",
            cost: new Decimal(2e5),
            effect() {
                let cashBoost = player.points.pow(0.085).sqrt()
                return cashBoost
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            currencyDisplayName: "Immortallity Points",
            currencyInternalName: "ipoints",
            currencyLayer: "f"
            /* canAfford() { return player[this.layer].ipoints.gte(1e5) },
            pay() {
                let cost = tmp[this.layer].upgrades[this.id].cost
                player[this.layer].ipoints = player[this.layer].ipoints.sub(cost)
            },
            
            */
        },
    },
    buyables: {
        showRespec: false,
        11: {
            title: "Immortality's Power", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(500)) x = x.pow(6).div(12)
                let cost = Decimal.pow(1.25, x.pow(1.65).mul(3)).add(1499)
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                eff.first = Decimal.pow(2,x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Immortality Points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Immortality Point gain by " + format(data.effect.first) + "x"
            },
            unlocked() { return hasUpgrade('f', 11) }, 
            canAfford() {
                return player[this.layer].ipoints.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].ipoints = player[this.layer].ipoints.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            buyMax() {}, // You'll have to handle this yourself if you want
            style: {'height':'222px'},
        },
        12: {
            title: "Immortality's Wealth", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(500)) x = x.pow(6).div(12)
                let cost = Decimal.pow(1.35, x.pow(1.7).mul(4)).add(24999)
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                eff.first = player[this.layer].ipoints.sqrt().sqrt().times(x.pow(4))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Immortality Points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Cash base by " + format(data.effect.first) + "x"
            },
            unlocked() { return hasUpgrade('f', 12) }, 
            canAfford() {
                return player[this.layer].ipoints.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].ipoints = player[this.layer].ipoints.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            buyMax() {}, // You'll have to handle this yourself if you want
            style: {'height':'222px'},
        },
    },

    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                ["display-text",
                     function() { 
                     return 'Your fountains are generating ' + format(player[this.layer].ipointgen) + ' Immortallity Points per tick'
                }],
                ["display-text",
                     function() { 
                     return 'You have a total of ' + format(player[this.layer].ipoints) + ' Immortallity Points'
                }],
                ["display-text",
                     function() { 
                     return 'Immortality Points multiply Cash Gain by ' + format(player[this.layer].ipoints.pow(1/4)) + 'x'
                }],
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "upgrades"
            ]
        },
        "Buyables": {
            content: [
                "main-display",
                ["display-text",
                     function() { 
                     return 'Your fountains are generating ' + format(player[this.layer].ipointgen) + ' Immortallity Points per tick'
                }],
                ["display-text",
                     function() { 
                     return 'You have a total of ' + format(player[this.layer].ipoints) + ' Immortallity Points'
                }],
                ["display-text",
                     function() { 
                     return 'Immortality Points multiply Cash Gain by ' + format(player[this.layer].ipoints.pow(1/4)) + 'x'
                }],
                "blank",
                "prestige-button",
                "blank",
                "blank",
                "blank",
                "blank",
                "buyables"
            ]
        },
    },
    layerShown(){return hasUpgrade("s", 21)},
})

addLayer("g", {
    name: "Gems", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFFF00",
    requires: new Decimal(1e5), // Can be a function that takes requirement increases into account
    resource: "Gems", // Name of prestige currency
    baseResource: "Cash", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("s", 13)) mult = mult.times(5)
        if (hasAchievement("se", 14)) mult = mult.times(achievementEffect("se", 14).gemboost)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset for gems", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone("s", 1)},
    buyables: {
        showRespec: false,
        11: {
            title: "Cash Boost", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(25)) x = x.pow(6).div(12)
                let cost = Decimal.pow(4, x.pow(2.4).mul(10))
                return cost.floor()
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff = {}
                if (x.gte(0)) eff.first = Decimal.pow(3, x.pow(1.1))
                else eff.first = Decimal.pow(1/12, x.times(-1).pow(1.1))
            
                if (x.gte(0)) eff.second = x.pow(0.8)
                else eff.second = x.times(-1).pow(0.8).times(-1)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " lollipops\n\
                Amount: " + player[this.layer].buyables[this.id] + "/4\n\
                Adds + " + format(data.effect.first) + " to Cash base and multiplies Cash by " + format(data.effect.second)
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            buyMax() {}, // You'll have to handle this yourself if you want
            style: {'height':'222px'},
            purchaseLimit: new Decimal(5),
        },
    },
})

addLayer("w", {
    name: "White Gems", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "WG", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    branches: ["s"],
    requires: new Decimal(11), // Can be a function that takes requirement increases into account
    resource: "White Gems", // Name of prestige currency
    baseResource: "Stone", // Name of resource prestige is based on
    roundUpCost: true,
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "w", description: "W: Reset for white gems", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Stronger Material",
            description: "Divide stone costs by 2",
            cost: new Decimal(2),
        },
        12: {
            title: "Expanding Discoveries",
            description: "Unlock 4 more stone upgrades",
            cost: new Decimal(3),
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 White Gem",
            effectDescription: "White gems multiply Rebirths by x5, and you can buy max Stone",
            done() { return player[this.layer].points.gte(1) }
        },
        1: {
            requirementDescription: "2 White Gems",
            effectDescription: "Gain 100% of pending Rebirths per second",
            done() { return player[this.layer].points.gte(2) }
        },
        2: {
            requirementDescription: "3 White Gems",
            effectDescription: "Keep Cave Challenge completions on all resets",
            done() { return player[this.layer].points.gte(3) }
        },
        3: {
            requirementDescription: "4 White Gems",
            effectDescription: "Automatically buy Rebirth Upgrades",
            done() { return player[this.layer].points.gte(4) }
        },
    },
    layerShown(){return hasMilestone("s", 2) || player[this.layer].points.gte(1) || player[this.layer].unlocked},
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
            doneTooltip: "1.5x Rebirths / 12,500 Rebirths", // Showed when the achievement is completed
            textStyle: {'color': '#ADD8E6'},
        },
        14: {
            name: "Petrol",
            done() {return player.s.points.gte(69)},
            effect() {
                let effects = {}
                effects.gemboost = new Decimal(420)
                effects.rboost = new Decimal(7)
                return effects
            },
            goalTooltip: "69 Stone", // Shows when achievement is not completed
            doneTooltip: "420x Gems & 7x Rebirths / 60 Stone", // Showed when the achievement is completed
            textStyle: {'color': '#00008b'},
        },
    },
},
)