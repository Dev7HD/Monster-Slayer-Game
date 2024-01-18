// Document ready function to ensure the DOM is fully loaded before executing the script
$(document).ready(function() {
    let xp = 0;
    let health = 200;
    let gold = 100;
    let currentWeapon = 0;
    let fighting;
    let monsterHealth;
    let inventory = ["stick"];

    // jQuery objects for DOM elements
    const button1 = $("#button1");
    const button2 = $("#button2");
    const button3 = $("#button3");
    const text = $("#text");
    const xpText = $("#xpText");
    const healthText = $("#healthText");
    const goldText = $("#goldText");
    const monsterStats = $("#monsterStats");
    const monsterName = $("#monsterName");
    const monsterHealthText = $("#monsterHealth");

    // Game data
    const weapons = [
        { name: 'stick', power: 5 },
        { name: 'dagger', power: 30 },
        { name: 'claw hammer', power: 50 },
        { name: 'sword', power: 100 }
    ];
    const monsters = [
        {
            name: "slime",
            level: 2,
            health: 15
        },
        {
            name: "fanged beast",
            level: 8,
            health: 60
        },
        {
            name: "dragon",
            level: 20,
            health: 300
        }
    ]

    // Game locations
    const locations = [
        {
            name: "town square",
            "button text": ["Go to store", "Go to cave", "Fight dragon"],
            "button functions": [goStore, goCave, fightDragon],
            text: "You are in the town square. You see a sign that says \"Store\"."
        },
        {
            name: "store",
            "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
            "button functions": [buyHealth, buyWeapon, goTown],
            text: "You enter the store."
        },
        {
            name: "cave",
            "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
            "button functions": [fightSlime, fightBeast, goTown],
            text: "You enter the cave. You see some monsters."
        },
        {
            name: "fight",
            "button text": ["Attack", "Dodge", "Run"],
            "button functions": [attack, dodge, goTown],
            text: "You are fighting a monster."
        },
        {
            name: "kill monster",
            "button text": ["Go to town square", "Go to town square", "Go to town square"],
            "button functions": [goTown, goTown, easterEgg],
            text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
        },
        {
            name: "lose",
            "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
            "button functions": [restart, restart, restart],
            text: "You die. ☠️"
        },
        {
            name: "win",
            "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
            "button functions": [restart, restart, restart],
            text: "You defeat the dragon! YOU WIN THE GAME! 🎉"
        },
        {
            name: "easter egg",
            "button text": ["2", "8", "Go to town square?"],
            "button functions": [pickTwo, pickEight, goTown],
            text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
        }
    ];

    // Event handlers for buttons
    button1.on('click', goStore);
    button2.on('click', goCave);
    button3.on('click', fightDragon);

    /**
     * Update the game interface based on the current location.
     * @param {Object} location - The current location object.
     */
    function update(location) {
        // Hide monster stats initially
        monsterStats.hide();

        // Set button text and click event handlers
        button1.text(location["button text"][0]).off().on('click', location["button functions"][0]);
        button2.text(location["button text"][1]).off().on('click', location["button functions"][1]);
        button3.text(location["button text"][2]).off().on('click', location["button functions"][2]);

        // Update text content
        text.text(location.text);
    }

    /**
     * Function to navigate to the town square.
     */
    function goTown() {
        update(locations[0]);
    }

    /**
     * Function to navigate to the store.
     */
    function goStore() {
        update(locations[1]);
    }

    /**
     * Function to navigate to the cave.
     */
    function goCave() {
        update(locations[2]);
    }

    /**
     * Function to buy health.
     */
    function buyHealth() {
        if (gold >= 10) {
            gold -= 10;
            health += 10;
            goldText.text(gold);
            healthText.text(health);
        } else {
            text.text("You do not have enough gold to buy health.");
        }
    }

    /**
     * Function to buy a weapon.
     */
    function buyWeapon() {
        if (currentWeapon < weapons.length - 1) {
            if (gold >= 30) {
                gold -= 30;
                currentWeapon++;
                goldText.text(gold);
                let newWeapon = weapons[currentWeapon].name;
                text.text("You now have a " + newWeapon + ".");
                inventory.push(newWeapon);
                text.text(text.text() + " In your inventory you have: " + inventory);
            } else {
                text.text("You do not have enough gold to buy a weapon.");
            }
        } else {
            text.text("You already have the most powerful weapon!");
            button2.text("Sell weapon for 15 gold");
            button2.onclick = sellWeapon;
        }
    }

    /**
     * Function to sell a weapon.
     */
    function sellWeapon() {
        if (inventory.length > 1) {
            gold += 15;
            goldText.text(gold);
            let currentWeapon = inventory.shift();
            text.text("You sold a " + currentWeapon + ".");
            text.text(text.text() + " In your inventory you have: " + inventory);
        } else {
            text.text("Don't sell your only weapon!");
        }
    }

    /**
     * Function to initiate fight with a slime.
     */
    function fightSlime() {
        fighting = 0;
        goFight();
    }

    /**
     * Function to initiate fight with a fanged beast.
     */
    function fightBeast() {
        fighting = 1;
        goFight();
    }

    /**
     * Function to initiate fight with a dragon.
     */
    function fightDragon() {
        fighting = 2;
        goFight();
    }

    /**
     * Function to start a fight.
     */
    function goFight() {
        update(locations[3]);
        monsterHealth = monsters[fighting].health;
        monsterStats.show();
        monsterName.text(monsters[fighting].name);
        monsterHealthText.text(monsterHealth);
    }

    /**
     * Function to perform an attack during a fight.
     */
    function attack() {
        text.text("The " + monsters[fighting].name + " attacks.");
        text.text(text.text() + " You attack it with your " + weapons[currentWeapon].name + ".");
        health -= getMonsterAttackValue(monsters[fighting].level);
        if (isMonsterHit()) {
            monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
        } else {
            text.text(text.text() + " You miss.");
        }
        healthText.text(health);
        monsterHealthText.text(monsterHealth);
        if (health <= 0) {
            lose();
        } else if (monsterHealth <= 0) {
            fighting === 2 ? winGame() : defeatMonster();
        }
        if (Math.random() <= .1 && inventory.length !== 1) {
            text.text(text.text() + " Your " + inventory.pop() + " breaks.");
            currentWeapon--;
        }
    }

    /**
     * Function to calculate the attack value of a monster based on its level.
     * @param {number} level - The level of the monster.
     * @returns {number} - The calculated attack value.
     */
    function getMonsterAttackValue(level) {
        const hit = level - (Math.floor(Math.random() * 30));
        return hit > 0 ? hit : 0;
    }

    /**
     * Function to determine if the player's attack hits the monster.
     * @returns {boolean} - True if the attack hits, false otherwise.
     */
    function isMonsterHit() {
        return Math.random() > .2 || health < 20;
    }

    /**
     * Function to dodge the monster's attack.
     */
    function dodge() {
        text.text("You dodge the attack from the " + monsters[fighting].name);
    }

    /**
     * Function to handle the defeat of a monster.
     */
    function defeatMonster() {
        gold += Math.floor(monsters[fighting].level * 6.7);
        xp += monsters[fighting].level;
        goldText.text(gold);
        xpText.text(xp);
        update(locations[4]);
    }

    /**
     * Function to handle the player losing the game.
     */
    function lose() {
        update(locations[5]);
    }

    /**
     * Function to handle the player winning the game.
     */
    function winGame() {
        update(locations[6]);
    }

    /**
     * Function to restart the game.
     */
    function restart() {
        xp = 0;
        health = 200;
        gold = 100;
        currentWeapon = 0;
        inventory = ["stick"];
        goldText.text(gold);
        healthText.text(health);
        xpText.text(xp);
        goTown();
    }

    /**
     * Function to handle the Easter egg event.
     */
    function easterEgg() {
        update(locations[7]);
    }

    /**
     * Function to pick the number 2 in the Easter egg event.
     */
    function pickTwo() {
        pick(2);
    }

    /**
     * Function to pick the number 8 in the Easter egg event.
     */
    function pickEight() {
        pick(8);
    }

    /**
     * Function to handle the player picking a number in the Easter egg event.
     * @param {number} guess - The player's guess.
     */
    function pick(guess) {
        const numbers = [];
        while (numbers.length < 10) {
            numbers.push(Math.floor(Math.random() * 11));
        }
        text.text("You picked " + guess + ". Here are the random numbers:\n");
        for (let i = 0; i < 10; i++) {
            text.text(text.text() + numbers[i] + "\n");
        }
        if (numbers.includes(guess)) {
            text.text(text.text() + "Right! You win 20 gold!");
            gold += 20;
            goldText.text(gold);
        } else {
            text.innerText += "Wrong! You lose 10 health!";
            health -= 10;
            healthText.text(health);
            if (health <= 0) {
                lose();
            }
        }
    }
})





