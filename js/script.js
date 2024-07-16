import { removal } from './crops.js';
import { activeSubstance } from './fertilizer.js';
import { fieldStavropol } from './fields.js';

const nitrogenLvl = $('#nitrogenLvl');
const phosphorusLvl = $('#phosphorusLvl');
const potassiumLvl = $('#potassiumLvl');
const harvest = $('#harvest');

const btn = $('#calculate');




btn.on('click', () => {
	console.log($('tr'));

	$('.row').each(function (index) {

		// !Номер поля
		console.log($(this).find('.field-number').text());
		const fieldNumber = $(this).find('.field-number').text();
		// !Площадь поля
		console.log($(this).find('.field-area').text());
		const fieldArea = $(this).find('.field-area').text();
		// !Культура
		console.log($(this).find('.crop-cell select option:selected').text());
		const cropName = $(this).find('.crop-cell select option:selected').text();
		// !Урожай
		console.log($(this).find('.harvest-cell input').val());
		const harvest = $(this).find('.harvest-cell input').val();
		// !Азотное удобрение
		console.log($(this).find('.fertilizer-nitrogen-cell option:selected').text());
		const fertilizerNameN = $(this).find('.fertilizer-nitrogen-cell  option:selected').text();
		// !Фосфорное удобрение
		console.log($(this).find('.fertilizer-phosphorus-cell option:selected').text());
		const fertilizerNameP = $(this).find('.fertilizer-phosphorus-cell  option:selected').text();
		// !Калийное удобрение
		console.log($(this).find('.fertilizer-potassium-cell option:selected').text());
		const fertilizerNameK = $(this).find('.fertilizer-potassium-cell  option:selected').text();

		let inputData = {
			nitrogenLvl: 0,
			phosphorusLvl: 0,
			potassiumLvl: 0,
			fieldNumber: fieldNumber,
			fieldArea: fieldArea,
			cropName: cropName,
			harvest: harvest,
			fertilizerNameN: fertilizerNameN,
			fertilizerNameP: fertilizerNameP,
			fertilizerNameK: fertilizerNameK,
		}
		// console.log(fieldNumber);

		// !Показатели поля
		fieldStavropol.forEach(elem => {
			if (fieldNumber === elem.name) {
				inputData.nitrogenLvl = elem.organic;
				inputData.phosphorusLvl = elem.phosphorus;
				inputData.potassiumLvl = elem.potassium;
			}
		});

		let resultData = {
			doseGaN: 0,
			doseGaP: 0,
			doseGaK: 0,

			doseFieldN: 0,
			doseFieldP: 0,
			doseFieldK: 0,

			priceGaN: 0,
			priceGaP: 0,
			priceGaK: 0,

			priceFieldN: 0,
			priceFieldP: 0,
			priceFieldK: 0,

			priceTotalGa: 0,
			priceTotalField: 0,
		}
		// !Расчеты! \\
		const doses = normCalc(inputData);

		priceCalc2(inputData, resultData, doses[0], doses[1], doses[2]);

		// !Вносим в таблицу
		if (resultData.doseGaN >= 0)
			$(this).find('.active-substance-nitrogen-ga').text(resultData.doseGaN);

		if (resultData.doseGaP >= 0)
			$(this).find('.active-substance-phosphorus-ga').text(resultData.doseGaP);

		if (resultData.doseGaK >= 0)
			$(this).find('.active-substance-potassium-ga').text(resultData.doseGaK);


		if (resultData.doseFieldN >= 0)
			$(this).find('.active-substance-nitrogen-field').text((resultData.doseFieldN).toFixed(1));

		if (resultData.doseFieldP >= 0)
			$(this).find('.active-substance-phosphorus-field').text((resultData.doseFieldP).toFixed(1));

		if (resultData.doseFieldK >= 0)
			$(this).find('.active-substance-potassium-field').text((resultData.doseFieldK).toFixed(1));


		if (resultData.priceGaN >= 0)
			$(this).find('.price-nitrogen-ga').text(`${Math.round(resultData.priceGaN).toLocaleString('ru-RU')} ₽`);

		if (resultData.priceGaP >= 0)
			$(this).find('.price-phosphorus-ga').text(`${Math.round(resultData.priceGaP).toLocaleString('ru-RU')} ₽`);

		if (resultData.priceGaK >= 0)
			$(this).find('.price-potassium-ga').text(`${Math.round(resultData.priceGaK).toLocaleString('ru-RU')} ₽`);


		if (resultData.priceFieldN >= 0)
			$(this).find('.price-nitrogen-field').text(`${Math.round(resultData.priceFieldN).toLocaleString('ru-RU')} ₽`);

		if (resultData.priceFieldP >= 0)
			$(this).find('.price-phosphorus-field').text(`${Math.round(resultData.priceFieldP).toLocaleString('ru-RU')} ₽`);

		if (resultData.priceFieldK >= 0)
			$(this).find('.price-potassium-field').text(`${Math.round(resultData.priceFieldK).toLocaleString('ru-RU')} ₽`);


		if (resultData.priceTotalGa >= 0)
			$(this).find('.price-total-ga').text(`${Math.round(resultData.priceTotalGa).toLocaleString('ru-RU')} ₽`);

		if (resultData.priceTotalField >= 0)
			$(this).find('.price-total-field').text(`${Math.round(resultData.priceTotalField).toLocaleString('ru-RU')} ₽`);



		// return false;
	});
	// let nitrogenFertilizer;
	// let phosphorusFertilizer;
	// let potassiumFertilizer;
	// const doses = normCalc(nitrogenFertilizer, phosphorusFertilizer, potassiumFertilizer);
	// // !Расчет стоимости
	// priceCalc(doses[0], doses[1], doses[2]);
});

function priceCalc2(inputData, resultData, nitrogenFertilizer, phosphorusFertilizer, potassiumFertilizer) {
	let fertilizerN = {
		name: inputData.fertilizerNameN,
		nitrogen: 0,
		phosphorus: 0,
		potassium: 0,
		sera: 0,
		price: 0,
	};
	let fertilizerP = {
		name: inputData.fertilizerNameP,
		nitrogen: 0,
		phosphorus: 0,
		potassium: 0,
		sera: 0,
		price: 0,
	};
	let fertilizerK = {
		name: inputData.fertilizerNameK,
		nitrogen: 0,
		phosphorus: 0,
		potassium: 0,
		sera: 0,
		price: 0,
	};

	// !Запись данных удобрений в объект
	fertilizerCatch(fertilizerN, fertilizerP, fertilizerK);

	// !Считаем Физический вес
	const physicalWeightP = Math.round(phosphorusFertilizer * 100 / fertilizerP.phosphorus);

	const newNitrogen = Math.round(nitrogenFertilizer - (fertilizerP.nitrogen * physicalWeightP / 100));
	const newPotassium = Math.round(potassiumFertilizer - (fertilizerP.potassium * physicalWeightP / 100));

	const physicalWeightN = Math.round(newNitrogen * 100 / fertilizerN.nitrogen);
	const physicalWeightK = Math.round(newPotassium * 100 / fertilizerK.potassium);

	const vnosN = Math.round(fertilizerP.nitrogen / 100 * physicalWeightP + fertilizerN.nitrogen / 100 * physicalWeightN);
	const vnosP = Math.round(fertilizerP.phosphorus / 100 * physicalWeightP);
	const vnosK = Math.round(fertilizerP.potassium / 100 * physicalWeightP + fertilizerK.potassium / 100 * physicalWeightK);

	// !Считаем цену

	const nitrogenPriceGa = physicalWeightN * fertilizerN.price;
	const phosphorusPriceGa = physicalWeightP * fertilizerP.price;
	const potassiumPriceGa = physicalWeightK * fertilizerK.price;


	const nitrogenPriceField = nitrogenPriceGa * inputData.fieldArea;
	const phosphorusPriceField = phosphorusPriceGa * inputData.fieldArea;
	const potassiumPriceField = potassiumPriceGa * inputData.fieldArea;

	resultData.doseGaN = vnosN;
	resultData.doseGaP = vnosP;
	resultData.doseGaK = vnosK;

	resultData.doseFieldN = vnosN * inputData.fieldArea / 1000;
	resultData.doseFieldP = vnosP * inputData.fieldArea / 1000;
	resultData.doseFieldK = vnosK * inputData.fieldArea / 1000;

	resultData.priceGaN = nitrogenPriceGa;
	resultData.priceGaP = phosphorusPriceGa;
	resultData.priceGaK = potassiumPriceGa;

	resultData.priceFieldN = nitrogenPriceField;
	resultData.priceFieldP = phosphorusPriceField;
	resultData.priceFieldK = potassiumPriceField;

	resultData.priceTotalGa = nitrogenPriceGa + phosphorusPriceGa + potassiumPriceGa;
	resultData.priceTotalField = nitrogenPriceField + phosphorusPriceField + potassiumPriceField;

	// console.log(`
	// 	новая доза N: ${newNitrogen}
	// 	новая доза К: ${newPotassium}

	// 	Физ. вес N: ${resultData.doseGaN}
	// 	Физ. вес P: ${resultData.doseGaP}
	// 	Физ. вес K: ${resultData.doseGaK}

	// 	Кг.дв.га N: ${resultData.doseFieldN}
	// 	Кг.дв.га P: ${resultData.doseFieldP}
	// 	Кг.дв.га K: ${resultData.doseFieldK}

	// 	Цена N га: ${resultData.priceGaN}
	// 	Цена P га: ${resultData.priceGaP}
	// 	Цена К га: ${resultData.priceGaK}

	// 	Цена N поле: ${resultData.priceFieldN}
	// 	Цена P поле: ${resultData.priceFieldP}
	// 	Цена К поле: ${resultData.priceFieldK}

	// 	Общ цена руб / га: ${resultData.priceTotalGa};
	// 	Общ цена руб / поле: ${resultData.priceTotalField};
	// 	`);
}

// !Расчет стоимости
function priceCalc(nitrogenFertilizer, phosphorusFertilizer, potassiumFertilizer) {
	const fertilizerNameN = $('#fertilizerN option:selected').text(); //! Удобрение
	const fertilizerNameP = $('#fertilizerP option:selected').text(); //! Удобрение
	const fertilizerNameK = $('#fertilizerK option:selected').text(); //! Удобрение

	let fertilizerN = {
		name: fertilizerNameN,
		nitrogen: 0,
		phosphorus: 0,
		potassium: 0,
		sera: 0,
		price: 0,
	};
	let fertilizerP = {
		name: fertilizerNameP,
		nitrogen: 0,
		phosphorus: 0,
		potassium: 0,
		sera: 0,
		price: 0,
	};
	let fertilizerK = {
		name: fertilizerNameK,
		nitrogen: 0,
		phosphorus: 0,
		potassium: 0,
		sera: 0,
		price: 0,
	};
	// !Запись данных удобрений в объект
	fertilizerCatch(fertilizerN, fertilizerP, fertilizerK);

	// !Считаем Физический вес
	const physicalWeightP = Math.round(phosphorusFertilizer * 100 / fertilizerP.phosphorus);

	const newNitrogen = Math.round(nitrogenFertilizer - (fertilizerP.nitrogen * physicalWeightP / 100));
	const newPotassium = Math.round(potassiumFertilizer - (fertilizerP.potassium * physicalWeightP / 100));

	const physicalWeightN = Math.round(newNitrogen * 100 / fertilizerN.nitrogen);
	const physicalWeightK = Math.round(newPotassium * 100 / fertilizerK.potassium);

	const vnosN = Math.round(fertilizerP.nitrogen / 100 * physicalWeightP + fertilizerN.nitrogen / 100 * physicalWeightN);
	const vnosP = Math.round(fertilizerP.phosphorus / 100 * physicalWeightP);
	const vnosK = Math.round(fertilizerP.potassium / 100 * physicalWeightP + fertilizerK.potassium / 100 * physicalWeightK);

	// !Считаем цену

	const nitrogenPriceGa = physicalWeightN * fertilizerN.price;
	const phosphorusPriceGa = physicalWeightP * fertilizerP.price;
	const potassiumPriceGa = physicalWeightK * fertilizerK.price;

	const area = $('#area').val();

	const nitrogenPriceField = nitrogenPriceGa * area;
	const phosphorusPriceField = phosphorusPriceGa * area;
	const potassiumPriceField = potassiumPriceGa * area;

	console.log(`
		новая доза N: ${newNitrogen}
		новая доза К: ${newPotassium}

		Физ. вес N: ${physicalWeightN}
		Физ. вес P: ${physicalWeightP}
		Физ. вес K: ${physicalWeightK}

		Кг.дв.га N: ${vnosN}
		Кг.дв.га P: ${vnosP}
		Кг.дв.га K: ${vnosK}

		Цена N га: ${fertilizerN.price} / ${nitrogenPriceGa}
		Цена P га: ${fertilizerP.price} / ${phosphorusPriceGa}
		Цена К га: ${fertilizerK.price} / ${potassiumPriceGa}

		Цена N поле: ${nitrogenPriceField}
		Цена P поле: ${phosphorusPriceField}
		Цена К поле: ${potassiumPriceField}

		Общ цена руб / га: ${nitrogenPriceGa + phosphorusPriceGa + potassiumPriceGa};
		Общ цена руб / поле: ${nitrogenPriceField + phosphorusPriceField + potassiumPriceField};
		`);
}

function normCalc(inputData) {
	// const harvestData = harvest.val(); //! Урожай
	const harvestData = inputData.harvest; //! Урожай
	// const cropData = $('#crop option:selected').text(); //! Культура
	const cropData = inputData.cropName; //! Культура
	// console.log(cropData);
	// console.log(fertilizerData);

	let nitrogenCoefficient;
	let phosphorusCoefficient;
	let potassiumCoefficient;

	// ! Расчет коэффициентов
	// const coefficients = getCoefficient(nitrogenLvl.val(), phosphorusLvl.val(), potassiumLvl.val());
	const coefficients = getCoefficient(inputData.nitrogenLvl, inputData.phosphorusLvl, inputData.potassiumLvl);
	nitrogenCoefficient = coefficients[0];
	phosphorusCoefficient = coefficients[1];
	potassiumCoefficient = coefficients[2];

	// !Получаем данные по выносу культуры
	let removalCrop;
	let nitrogenRemoval;
	let phosphorusRemoval;
	let potassiumRemoval;

	removal.forEach(elem => {
		if (cropData === elem.name) {
			console.log(`
Культура: ${elem.name}
Азот:${elem.nitrogen}
Фосфор:${elem.phosphorus}
Калий:${elem.potassium}`)
			removalCrop = elem.name;
			nitrogenRemoval = elem.nitrogen;
			phosphorusRemoval = elem.phosphorus;
			potassiumRemoval = elem.potassium;
		}
	});

	// !Расчет удобрений
	const nitrogenFertilizer = Math.round(harvestData * nitrogenRemoval * nitrogenCoefficient);
	const phosphorusFertilizer = Math.round(harvestData * phosphorusRemoval * phosphorusCoefficient);
	const potassiumFertilizer = Math.round(harvestData * potassiumRemoval * potassiumCoefficient);
	console.log(`
		Рассчет по нормированному методу:
		Азот: ${nitrogenFertilizer}
		Фосфор: ${phosphorusFertilizer}
		Калий: ${potassiumFertilizer}`);

	return [nitrogenFertilizer, phosphorusFertilizer, potassiumFertilizer];

}


function getCoefficient(nitrogen, phosphorus, potassium) {
	let nitrogenCoefficient;
	if (nitrogen < 2.9) {
		nitrogenCoefficient = 1;
	} else if (nitrogen >= 2.9 && nitrogen <= 6.2) {
		nitrogenCoefficient = 0.75;
	} else if (nitrogen > 6.2) {
		nitrogenCoefficient = 0.6;
	}

	let phosphorusCoefficient;
	if (phosphorus < 20) {
		phosphorusCoefficient = 1.3;
	} else if (phosphorus >= 20 && phosphorus < 25) {
		phosphorusCoefficient = 1.2;
	} else if (phosphorus >= 25 && phosphorus < 30) {
		phosphorusCoefficient = 1.1;
	} else if (phosphorus >= 30 && phosphorus < 35) {
		phosphorusCoefficient = 1;
	} else if (phosphorus >= 35 && phosphorus < 40) {
		phosphorusCoefficient = 0.9;
	} else if (phosphorus > 40) {
		phosphorusCoefficient = 0.7;
	}


	let potassiumCoefficient;

	if (potassium < 6) {
		potassiumCoefficient = 1.5;
	} else if (potassium >= 6 && potassium < 7.5) {
		potassiumCoefficient = 1.1;
	} else if (potassium >= 7.5 && potassium < 9) {
		potassiumCoefficient = 1.0;
	} else if (potassium >= 9 && potassium < 10.5) {
		potassiumCoefficient = 0.9;
	} else if (potassium >= 10.5 && potassium < 12) {
		potassiumCoefficient = 0.8;
	} else if (potassium > 12) {
		potassiumCoefficient = 0.7;
	}

	console.log(`
Коэффициенты:
Азот: ${nitrogenCoefficient}
Фосфор: ${phosphorusCoefficient}
Калий: ${potassiumCoefficient}
		`);

	return [nitrogenCoefficient, phosphorusCoefficient, potassiumCoefficient];
}





function fertilizerCatch(fertilizerN, fertilizerP, fertilizerK) {
	// *Азотное удобрение
	activeSubstance.forEach(elem => {
		if (fertilizerN.name === elem.name) {
			fertilizerN.nitrogen = elem.nitrogen;
			fertilizerN.phosphorus = elem.phosphorus;
			fertilizerN.potassium = elem.potassium;
			fertilizerN.sera = elem.sera;
			fertilizerN.price = elem.price;

			console.log(
				`Удобрение: ${fertilizerN.name}
				Азот: ${fertilizerN.nitrogen}
				Фосфор: ${fertilizerN.phosphorus}
				Калий: ${fertilizerN.potassium}`);
		}
	});
	// *Фосфорное удобрение
	activeSubstance.forEach(elem => {
		if (fertilizerP.name === elem.name) {
			fertilizerP.nitrogen = elem.nitrogen;
			fertilizerP.phosphorus = elem.phosphorus;
			fertilizerP.potassium = elem.potassium;
			fertilizerP.sera = elem.sera;
			fertilizerP.price = elem.price;

			console.log(
				`Удобрение: ${fertilizerP.name}
			Азот: ${fertilizerP.nitrogen}
			Фосфор: ${fertilizerP.phosphorus}
			Калий: ${fertilizerP.potassium}`);
		}
	});
	// *Калийное удобрение
	activeSubstance.forEach(elem => {
		if (fertilizerK.name === elem.name) {
			fertilizerK.nitrogen = elem.nitrogen;
			fertilizerK.phosphorus = elem.phosphorus;
			fertilizerK.potassium = elem.potassium;
			fertilizerK.sera = elem.sera;
			fertilizerK.price = elem.price;

			console.log(
				`Удобрение: ${fertilizerK.name}
				Азот: ${fertilizerK.nitrogen}
				Фосфор: ${fertilizerK.phosphorus}
				Калий: ${fertilizerK.potassium}`);
		}
	});
}
