function transformToGenericObjectList(flatData) {
	var container = {
		children: []
	};
	var regionToCountry = {};
	var uid = 1;
	
	flatData.forEach(entry => {
		container.children.push({
			group: ++uid
			, value: parseInt(entry.weight)
			, name: entry.name
		});
	});
	
	return container;
}

const chart = (root) => {
	const height = 840, width = 840;
	const svg = d3.select("#sketchbook")
		.attr("width", width)
		.attr("height", height);
	
	var format = d3.format(",d"),
		color = d3.scaleOrdinal(d3.schemeCategory20)

	var tooltip = d3.select("body").append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.style("color", "white")
		.style("padding", "8px")
		.style("background-color", "rgba(0, 0, 0, 0.75)")
		.style("border-radius", "6px")
		.style("font", "12px sans-serif")
		.text("tooltip");
	
	var bubble = d3.pack()
		.size([width, height])
		.padding(1.5);

	bubble(root);
	var node = svg.selectAll(".node")
		.data(root.children)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", d => "translate(" + d.x + "," + d.y + ")");

	node.append("circle")
		.attr("r", d => d.r)
		.style("fill", d => color(d.data.group))
		.on("click", d => root.onclick(d))
		.on("mouseover", d => {
			tooltip.text(d.data.name + ": " + format(d.value));
			tooltip.style("visibility", "visible");
		})
		.on("mousemove", () => tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"))
		.on("mouseout", () => {
			return tooltip.style("visibility", "hidden");
		});

	node.append("text")
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.style("font", "10px sans-serif")
		.style("pointer-events", "none")
		.text(d => d.data.name.substring(0, d.r / 3));

	 return svg.node();
}