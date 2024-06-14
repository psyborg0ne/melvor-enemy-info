export function setup({onInterfaceReady, settings})
{
	const statDisplay 	= settings.section('Display Stats (Need reload)');
	const statList 		= {
		timesseen: {
			 type 		: 'switch',
			 label 		: 'Times Encountered',
			 hint 		: 'Displays how many times you have encountered the current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/bank/old_spyglass.png"),
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
			 resource 	: assets.getURI("assets/media/bank/skull.png"),
			 id 		: 3,
			 title 		: "killedby",
			 value 		: '-'
		},
		dmgdealt: {
			 type 		: 'switch',
			 label 		: 'Damage Dealt',
			 hint 		: 'Displays total damage dealt for current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/bank/Unholy_2H_Sword.png"),
			 id 		: 1,
			 title 		: "dmgdealt",
			 value 		: '-'
		},
		hitssuccess: {
			type 		: 'switch',
			label 		: 'Successful Hits',
			hint 		: 'Displays total number of successful hits on current enemy',
			default 	: true,
			resource 	: assets.getURI("assets/media/bank/summoning_shard_green.png"),
			id 			: 5,
			title 		: "hitssuccess",
			value 		: '-'
	   },
	   hitsmissed: {
		type 			: 'switch',
		label 			: 'Hits Missed',
		hint 			: 'Displays total number of missed hits on current enemy',
		default 		: true,
		resource 		: assets.getURI("assets/media/bank/summoning_shard_gold.png"),
		id 				: 7,
		title 			: "hitsmissed",
		value 			: '-'
   		},
		dmgtaken: {
			 type 		: 'switch',
			 label 		: 'Damage Taken',
			 hint 		: 'Displays total damage taken from current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/bank/Consuming_Shield.png"),
			 id 		: 0,
			 title 		: "dmgtaken",
			 value 		: '-'
		},
		hitstaken: {
			 type 		: 'switch',
			 label 		: 'Hits Taken',
			 hint 		: 'Displays total number of hits taken from current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/bank/summoning_shard_red.png"),
			 id 		: 4,
			 title 		:"hitstaken" ,
			 value 		: '-'
		},
		hitsdodged: {
			 type 		: 'switch',
			 label 		: 'Hits Dodged',
			 hint 		: 'Displays total number of hits dodged from current enemy',
			 default 	: true,
			 resource 	: assets.getURI("assets/media/bank/summoning_shard_blue.png"),
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

	// Initialize settings
	for(const [key, stat] of Object.entries(statList)){
		statDisplay.add({
				type	: stat.type,
				name	: stat.title,
				label	: stat.label,
				hint	: stat.hint,
				default	: true
		});
	}

	onInterfaceReady(ctx => {
		const enemyContainer 	= document.getElementById("combat-enemy-levels").parentNode;
		const enemyInfo 		= PsyEnemyInfoStats({stats: statList, settings: statDisplay})

		ui.create(enemyInfo, enemyContainer);
		enemyInfo.addImgTooltip();

		ctx.patch(Enemy, "renderImageAndName").after(function() {
			if(this.state === EnemyState.Alive){
				enemyInfo.refresh(this.monster);
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
			}
		})

		ctx.patch(Enemy, "processDeath").before(function () {
			enemyInfo.setEmpty("-");
		})
	})
}

// Helper functions
function psy_formatLargeNumbers(num){
	let 	value = game.settings.formatNumberSetting == 0 ? formatNumber(num, 3) : formatNumber(num);
	return 	value;
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
				this.addTooltip('#psy-img-' + content.title, content.label);
			}
		},
		addTooltip(target, text){
			tippy(target, {
				placement: 	'bottom',
				content: 	text,
				arrow: 		true,
				duration: 	0
			});
		}
	}
}


// Single Stat Component
// TODO Find a way to nest multiple of this in the enemy info container
// function PsyEnemyInfoStat(props){
// 	return{
// 		$template: 	"#psy-enemystat",
// 		divId: 		"psy-" + props.statId,
// 		statId: 	props.statId,
// 		value: 		props.statValue,
// 		imgAttrs: 	props.imgAttrs,
// 		refreshValue(monster){
// 			this.value = psy_formatLargeNumbers(this.getValueForStat(monster, this.statId));
// 		},
// 		addImgTooltip(text){
// 			this.addTooltip(this.$ref.psyStatImg, text);
// 		},
// 		getValueForStat(monster, statId){
// 			var 	statValue = isNaN(game.stats.Monsters.getTracker(monster).get(statId)) ? 0 : game.stats.Monsters.getTracker(monster).get(statId);
// 			return 	statValue
// 		},
// 		addTooltip(target, text){
// 			tippy(target, {
// 				placement: 	'bottom',
// 				content: 	text,
// 				arrow: 		true,
// 				duration: 	0
// 			});
// 		}
// 	}
// }