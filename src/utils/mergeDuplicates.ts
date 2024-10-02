export = (array: any[]): any[] => {
	let newArray: any[] = [];

	for (const obj of array) {
		if (!newArray.includes(obj)) newArray.push(obj);
	}

	return newArray;
};
