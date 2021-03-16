
//Characters list
let warrior = {
	name: "Warrior",
	health: 5000,
	defence: 80,
	attack: 120,
	dodgeChance: 30,
	critChance: 40,
	critDam: 50,
}
let wizard = {
	name: "Wizard",
	health: 3000,
	defence: 35,
	attack: 280,
	dodgeChance: 15,
	critChance: 20,
	critDam: 25,
}
let rogue = {
	name: "Rogue",
	health: 2500,
	defence: 40,
	attack: 90,
	dodgeChance: 45,
	critChance: 70,
	critDam: 110,
}
let hunter = {
	name: "Hunter",
	health: 3500,
	defence: 50,
	attack: 130,
	dodgeChance: 15,
	critChance: 30,
	critDam: 45,
 // ^^
}

// Random # genorator.
const genRand = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min)     
}
// ^^

// Dodge chance
 const dodge = (spec) => {
 	 if (genRand (1, 100) <spec.dodgeChance) {
 	 	return "dodge"
 	 }
 	 else {
 	 	return "hit"
 	 }
 }
// ^^

// Attack 
const attack = (spec) => {
	return spec.attack;
}
// ^^

// Defence
const defence = (spec) => {
	return spec.defence;
}
// ^^

// Crit 
 const critChance = (spec) => {
 	 if (genRand (1, 100) <spec.critChance) {
 	 	return spec.critDam;
 	 }
 	 else {
 	 	return 0;
 	 }
 }
// ^^

//Battle
const battle = (Char1, Char2) => {
	let Char1TotalDamage = (Char1.attack + critChance(Char1) - Char2.defence)
	let Char2TotalDamage = (Char2.attack + critChance(Char2) - Char1.defence)

	while (Char1.health > 0 && Char2.health > 0){
			// Char 1 attacks Char 2
			if (dodge(Char2) === "dodge") {
				console.log(`${Char1.name} attacked ${Char2.name} and missed`)
			}else {
				Char2.health = Char2.health - Char1TotalDamage
				console.log(`${Char1.name} attacked ${Char2.name} and hit for ${Char1TotalDamage}`)
			}
			// Char 2 attacks Char 1
			if (dodge(Char1) === "dodge") {
				console.log(`${Char2.name} attacked ${Char1.name} and missed`)
			}else {
				Char1.health = Char1.health - Char2TotalDamage
				console.log(`${Char1.name} attacked ${Char2.name} and hit for ${Char1TotalDamage}`)
			}

			console.log(`-----`)
			console.log(`Current Health`)
			console.log(`${Char1.name}: ${Char1.health}`)
			console.log(`${Char2.name}: ${Char2.health}`)
			console.log(`-----`)
		
	} console.log(Char1.health > 0 ? `${Char1.name} Wins`: `${Char2.name} Wins`)
	
}
// ^^

//Console logs
battle(hunter, rogue)
// ^^

