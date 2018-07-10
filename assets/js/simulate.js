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
			, clicked: false
		});
	});
	
	return container;
}

function googleColors(n) {
	let colors = [
		"#3366cc"
		, "#dc3912"
		, "#ff9900"
		, "#109618"
		, "#990099"
		, "#0099c6"
		, "#dd4477"
		, "#66aa00"
		, "#b82e2e"
		, "#316395"
		, "#994499"
		, "#22aa99"
		, "#aaaa11"
		, "#6633cc"
		, "#e67300"
		, "#8b0707"
		, "#651067"
		, "#329262"
		, "#5574a6"
		, "#3b3eac"
	];
	
	return colors[n % colors.length];
}

const chart = (root) => {
	const height = 840, width = 840;
	const svg = d3.select("#sketchbook")
		.attr("width", width)
		.attr("height", height);
	
	var format = d3.format(",d");
	var color = d => googleColors(d.data.group);  //d3.scaleOrdinal(d3.schemeCategory20b)

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
	
	var toggleColor = (function() {
		var currentColor = "#ddd";
		return function() {
			let lastcolor = arguments[0].data.color;
			currentColor = (currentColor == "#ddd" ? lastcolor : "#ddd");
			
			root.onclick(arguments[0]);
			arguments[0].data.clicked = !arguments[0].data.clicked;
			
			d3.select(this).style("fill", arguments[0].data.clicked ? "#ddd" : lastcolor);
		}
	})();

	node.append("circle")
		.attr("r", d => d.r)
		.style("fill", d => {
			d.data.color = color(d);
			return d.data.color;
		})
		.on("click", toggleColor)
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