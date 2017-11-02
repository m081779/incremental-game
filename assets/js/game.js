$(document).ready(function () {
	let moneyGained = 100000;
	let clicks = 0;
	let clickValue = 1
	
	//constructor function for money generating tiles
	function Generator(obj) {
		this.name = obj.name;
		this.id = obj.id;
		this.timer = obj.timer;
		this.iterator = 1;
		this.cost = obj.cost;
		this.value = obj.value;
		this.valueIncrease = obj.valueIncrease;
		this.level = 1;
		this.timerStart = false;

		//creates a recursive timeout that controls speed of
		//money gained by generators
		this.tick = function() {
			setTimeout( () => {
				moneyGained+=this.value;
				writeMoneyText();
				checkIfShow()					
				this.tick();
			},this.timer/this.iterator);
		}

		//writes stats to all of the generator tiles
		this.writeStats = function() {
			$(this.id).find('.name').text(this.name);
			$(this.id).find('.cost').text('Cost: '+this.cost.toFixed(0));
			$(this.id).find('.value').text('Value: '+this.value.toFixed(0));
			$(this.id).find('.timer').text('Speed: '+this.timer);
		}

		//ties the speed of progress bar animation to the length of the tick timeout
		this.progressAnimation = function () {
			$(this.id).find('.progress').addClass('progressAnim').css("animation-duration", this.timer/this.iterator+'ms');
		}
	}

	//writes the value of moneyGaines and the clicks to screen
	function writeMoneyText() {
		$('.money').text('Money earned: '+ moneyGained.toFixed(0));
		$('.clicks').text('Number of clicks: '+ clicks);
		$('.clickValue').text('Money per click: '+ clickValue.toFixed(0));
	}

	//tests when new generators can be shown
	function checkIfShow() {
		generatorArr.find(gen => {
			if (gen.cost<=moneyGained) {
				$(gen.id).fadeTo(2000, 1)
			}
		});
	}


	//constructing new Generators

	let farm = new Generator({
		name: 'Farm',
		id: '#farm',
		timer: 800,
		cost: 100,
		value: 100,
		valueIncrease: 1.1,
	});

	let factory = new Generator({
		name: 'Factory',
		id: '#factory',
		timer: 3000,
		cost: 1500,
		value: 5000,
		valueIncrease: 1.1,
	});

	let warehouse = new Generator({
		name: 'Warehouse',
		id: '#warehouse',
		timer: 15000,
		cost: 10000,
		value: 7500,
		valueIncrease: 1.1,
	});

	//array of generators to loop through to write stats on startup
	let generatorArr = [farm,factory,warehouse];
	generatorArr.map((gen, i) => generatorArr[i].writeStats());

	//generators object to be able to convert string names to actual objects
	let generators = {
		'farm': farm,
		'factory': factory,
		'warehouse': warehouse
	}
	
	//click event for button increments clicks variable, adds
	//clickValue to moneyGained, increments clickValue, and writes
	//values to the screen
	$('#click').on('click', function (event) {
		clicks++;
		moneyGained+=clickValue;
		clickValue+=0.01;
		writeMoneyText();
	})


	//.generators click event starts tick event for generator tiles
	//starts animations, increments cost, level, and value of generators
	$('.generators').on('click', function () {
		let current = generators[$(this).attr('id')]		
		if (moneyGained>=current.cost  && !current.timerStart) {
			
			moneyGained-=current.cost;
			current.tick();
			current.timerStart = true;
			current.progressAnimation();
		}
		if(moneyGained>=current.cost && current.timerStart) {
			moneyGained-=current.cost;
			current.cost*=1.5;
			current.level++;
			current.value = current.value*current.valueIncrease;
			current.writeStats();
			current.progressAnimation();
		}
		writeMoneyText();
	});
	writeMoneyText();
});