// Magic spells list.
let spellList = [
	{
		name: "Fire Ball",
		damage: 280,
		dot: 15,
		dotDuration: 4,	
	},
	{
		name: "Holy Reaper",
		damage: 90,
		heal: 150,
	},
	{
		name: "Searing Toxin",
		damage: 0,
		dot: 80,
		dotDuration: 4,      
	},
	{
		name: "Victory Bash",
		damage: 140,
		DefInc: 25,
		DefTime: 4,
	},
	{
		name: "Lighting Storm",
		damage: 120,
		dot: 120,
		dotDuration: 1,
	},
	{
		name: "Heavy Slam",
		damage: 480,
		cTime: 1,
	},
	{
		name: "Side Slash",
		damage: 250,
		dot: 5,
		dotDUration: 10,
	}
]
//^^

// Spell Select
const requestSpells = (SelectedSpells1,SelectedSpells2,SelectedSpells3) => {
	let activeSpells = []
	for (let i = 0; i < spellList.length; i++){
		if (spellList[i].name === SelectedSpells1 || spellList[i].name === SelectedSpells2 || spellList[i].name === SelectedSpells3){
			activeSpells.push(spellList[i])
		}
	} 
	return activeSpells
} 
// ^^

//Characters list
let warrior = {
	name: "Warrior",
	health: 5000,
	defence: 80,
	attack: requestSpells("Side Slash","Heavy Slam","Victory Bash"),
	dodgeChance: 30,
	critChance: 40,
	critDam: 50,
}
let wizard = {
	name: "Wizard",
	health: 3000,
	defence: 35,
	attack: [spellList[0],spellList[1],spellList[2]],
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
//  battle(hunter, rogue)
//requestSpells(spellList,"damage")
console.log(requestSpells("Side Slash","Heavy Slam","Victory Bash"))
// ^^

