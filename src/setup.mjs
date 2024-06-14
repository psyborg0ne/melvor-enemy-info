export function setup({onInterfaceReady, settings})
{
	const statDisplay 	= settings.section("DISPLAY");
	const extraDisplay  = settings.section("EXTRA");

	const statList 		= {
		timesseen: {
			 type 		: 'switch',
			 label 		: 'Times Encountered',
			 hint 		: 'Displays how many times you have encountered the current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/skills/prayer/eagle_eye.svg"),
			 id 		: 8,
			 title 		: "timesseen",
			 value 		: '-'
		},
		killcount: {
			 type 		: 'switch',
			 label 		: 'Kill Count',
			 hint 		: 'Displays kill count for the current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/skills/slayer/slayer.svg"),
			 id 		: 2,
			 title 		: "killcount",
			 value 		: '-'
		},
		killedby: {
			 type 		: 'switch',
			 label 		: 'Killed By',
			 hint 		: 'Displays how many times you have died to the current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/skills/combat/death.svg"),
			 id 		: 3,
			 title 		: "killedby",
			 value 		: '-'
		},
		dmgdealt: {
			 type 		: 'switch',
			 label 		: 'Damage Dealt',
			 hint 		: 'Displays total damage dealt for current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/status/attack_increase.svg"),
			 id 		: 1,
			 title 		: "dmgdealt",
			 value 		: '-'
		},
		hitssuccess: {
			type 		: 'switch',
			label 		: 'Successful Hits',
			hint 		: 'Displays total number of successful hits on current enemy',
			default 	: true,
			resource 	: assets.getURI("assets/media/status/evasion_increase.svg"),
			id 			: 5,
			title 		: "hitssuccess",
			value 		: '-'
	   },
	   hitsmissed: {
		type 			: 'switch',
		label 			: 'Hits Missed',
		hint 			: 'Displays total number of missed hits on current enemy',
		default 		: true,
		resource 		: assets.getURI("assets/media/status/null.svg"),
		id 				: 7,
		title 			: "hitsmissed",
		value 			: '-'
   		},
		dmgtaken: {
			 type 		: 'switch',
			 label 		: 'Damage Taken',
			 hint 		: 'Displays total damage taken from current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/status/attack_decrease.svg"),
			 id 		: 0,
			 title 		: "dmgtaken",
			 value 		: '-'
		},
		hitstaken: {
			 type 		: 'switch',
			 label 		: 'Hits Taken',
			 hint 		: 'Displays total number of hits taken from current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/status/evasion_decrease.svg"),
			 id 		: 4,
			 title 		:"hitstaken" ,
			 value 		: '-'
		},
		hitsdodged: {
			 type 		: 'switch',
			 label 		: 'Hits Dodged',
			 hint 		: 'Displays total number of hits dodged from current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/skills/prayer/grace.svg"),
			 id 		: 6,
			 title 		: "hitsdodged",
			 value 		: '-'
		},
		timesfled:{
			 type 		: 'switch',
			 label 		: 'Times Fled',
			 hint 		: 'Displays total number of times fled from current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/skills/agility/agility.svg"),
			 id 		: 9,
			 title 		: "timesfled",
			 value 		: '-'
		}};

	const extraList		= {
		totalaccuracy: {
			type 		: 'switch',
			label 		: 'Total Accuracy',
			hint 		: 'Calculates and displays your total accuracy against the enemy',
			default 	: true,
			resource 	: assets.getURI("assets/media/skills/prayer/chivalry.svg"),
			title 		: "totalaccuracy",
			value 		: '-'
	   },
	   totalevasion: {
			type 		: 'switch',
			label 		: 'Total Evasion',
			hint 		: 'Calculates and displays your total evasion against the enemy',
			default 	: true,
			resource 	: assets.getURI("assets/media/skills/prayer/elusivity.svg"),
			title 		: "totalevasion",
			value 		: '-'
   		},
		kdratio: {
			type 		: 'switch',
			label 		: 'K/D Ratio',
			hint 		: 'Calculates and displays your total Kills / Deaths ratio against the enemy',
			default 	: true,
			resource 	: assets.getURI("assets/media/skills/prayer/battleborn.svg"),
			title 		: "kdratio",
			value 		: '-'
		}
	}

	psy_generateSettings(statList, statDisplay);
	psy_generateSettings(extraList, extraDisplay);

	onInterfaceReady(ctx => {
		const enemyContainer 	= document.getElementById("combat-enemy-levels").parentNode;
		const enemyInfo 		= PsyEnemyInfoStats({stats: statList, settings: statDisplay})
		const enemyExtra 		= PsyEnemyInfoExtras({extras: extraList, settings: extraDisplay})

		ui.create(enemyInfo, enemyContainer);
		ui.create(enemyExtra, enemyContainer )
		enemyInfo.addImgTooltip();
		enemyExtra.addImgTooltip();

		ctx.patch(Enemy, "renderImageAndName").after(function() {
			if(this.state === EnemyState.Alive){
				enemyInfo.refresh(this.monster);
				enemyExtra.refresh(this.monster);
			}
		})

		ctx.patch(Enemy, "renderDamageSplashes").after(function () {
			if (this.state === EnemyState.Alive){
				enemyInfo.refreshStat(this.monster, "dmgdealt");
				enemyInfo.refreshStat(this.monster, "hitssuccess");
				enemyInfo.refreshStat(this.monster, "hitsmissed");

				enemyInfo.refreshStat(this.monster, "dmgtaken");
				enemyInfo.refreshStat(this.monster, "hitstaken");
				enemyInfo.refreshStat(this.monster, "hitsdodged");

				enemyExtra.refreshExtra(this.monster, "totalaccuracy");
				enemyExtra.refreshExtra(this.monster, "totalevasion");
			}
		})

		ctx.patch(Enemy, "processDeath").before(function () {
			enemyInfo.setEmpty("-");
			enemyExtra.setEmpty("-");
		})
	})
}

// Helper functions
function psy_formatLargeNumbers(num){
	let 	value = game.settings.formatNumberSetting == 0 ? formatNumber(num, 3) : formatNumber(num);
	return 	value;
}

function psy_addTooltip(target, text){
	tippy(target, {
		placement: 	'bottom',
		content: 	text,
		arrow: 		true,
		duration: 	0
	});
}

function psy_generateSettings(settingsList, section){
	for(const [key, setting] of Object.entries(settingsList)){
		switch(setting.type){
			case 'switch':
				section.add({
					type	: setting.type,
					name	: setting.title,
					label	: setting.label,
					hint	: setting.hint,
					default	: true
				});
				break;
			// TODO - Handle other kind of settings
		}
	}
}

// Components
function PsyEnemyInfoStats(props){
	return{
		$template: "#psy-enemystats",
		stats: 		props.stats,
		settings:   props.settings,
		refresh(monster){
			for(const [stat, content] of Object.entries(this.stats)){
				this.refreshStat(monster, stat);
			}
		},
		updateSettings(settings){
			this.settings = settings;
		},
		setEmpty(placeholder){
			for(const [stat, content] of Object.entries(this.stats)){
				content.value = placeholder;
			}
		},
		refreshStat(monster, stat){
			this.stats[stat].value = psy_formatLargeNumbers(this.getValueForStat(monster, this.stats[stat].id));
		},
		getValueForStat(monster, statId){
			var 	statValue = isNaN(game.stats.Monsters.getTracker(monster).get(statId)) ? 0 : game.stats.Monsters.getTracker(monster).get(statId);
			return 	statValue;
		},
		addImgTooltip(){
			for(const [stat, content] of Object.entries(this.stats)){
				psy_addTooltip('#psy-img-' + content.title, content.label);
			}
		}
	}
}

function PsyEnemyInfoExtras(props){
	return{
		$template	: "#psy-enemyextras",
		extras 		: props.extras,
		settings 	: props.settings,
		refresh(monster){
			for(const [extra, content] of Object.entries(this.extras)){
				this.refreshExtra(monster, extra);
			}
		},
		updateSettings(settings){
			this.settings = settings;
		},
		setEmpty(placeholder){
			for(const [extra, content] of Object.entries(this.extras)){
				content.value = placeholder;
			}
		},
		refreshExtra(monster, extra){
			this.extras[extra].value = psy_formatLargeNumbers(this.getValueForextra(monster, this.extras[extra].title));
		},
		getValueForextra(monster, extraId){
			var extraValue = '-';

			switch (extraId) {
				case "totalaccuracy":
					extraValue = (this.getStatValueOrZero(monster, 5) / (this.getStatValueOrZero(monster, 5) + this.getStatValueOrZero(monster, 7))) * 100;
					break;
				case "totalevasion":
					extraValue = (this.getStatValueOrZero(monster, 6) / (this.getStatValueOrZero(monster, 4) + this.getStatValueOrZero(monster, 6))) * 100;
					break;
				case "kdratio":
					extraValue = (this.getStatValueOrZero(monster, 2) / (this.getStatValueOrZero(monster, 2) + this.getStatValueOrZero(monster, 3))) * 100;
					break;
			}

			extraValue = isNaN(extraValue) ? 0 : formatNumber(extraValue);

			return 	(extraValue + "%");
		},
		getStatValueOrZero(monster, stat){
			return isNaN(game.stats.Monsters.getTracker(monster).get(stat)) ? 0 : game.stats.Monsters.getTracker(monster).get(stat);
		},
		addImgTooltip(){
			for(const [extra, content] of Object.entries(this.extras)){
				psy_addTooltip('#psy-img-' + content.title, content.label);
			}
		}
	}
}