const api_request = (async () => {
	// example file created with python
	const response = await fetch("assets/json/data.json");
	const json = await response.json();
	return json;
});

const render = (async () => {
	let data = await api_request();
	let obj = d3.hierarchy(transformToGenericObjectList(data))
				.sum(d => d.value)
				.sort((a, b) => b.value - a.value)
				;
	obj.onclick = (d) => {
		//alert(d.data.name);
		console.log(d);
	};
	
	chart(obj);
});