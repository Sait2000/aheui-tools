var number2aheui = function() {
	var aheui_command = {
		"+": "다",
		"*": "따",
		"-": "타",
		"/": "나",
		">": "빠",
		"\\": "파",
		0: "바",
		2: "박",
		3: "받",
		4: "밤",
		5: "발",
		6: "밦",
		7: "밝",
		8: "밣",
		9: "밞",
	};

	var expr_cache = new_cache(9);

	function han_assemble(cho, jung, jong) {
		return String.fromCharCode(0xac00 + (((cho * 21) + jung) * 28) + jong);
	}

	function try_dis(num) {
		var shortest = null;

		for(var i = 9 ; i >= 2 ; i--) {
			var nr = Math.floor(num / i);
			var diff = nr * i - num;
			var t;

			if(diff === 0) t = get_expr(nr).concat(get_expr(i), "*");
			else t = get_expr(nr).concat(get_expr(i), "*", get_expr(-diff), "+");

			if(!shortest || t.length < shortest.length) shortest = t;
		}

		return shortest;
	}

	function try_sqrt(num) {
		var shortest = null;

		var rt = Math.floor(Math.sqrt(num));
		var remainder = num - rt * rt;
		var t = get_expr(rt).concat(">", "*", get_expr(remainder), "+");
		if(!shortest || t.length < shortest.length) shortest = t;

		rt = Math.ceil(Math.sqrt(num));
		remainder = rt * rt - num;
		t = get_expr(rt).concat(">", "*", get_expr(remainder), "-");
		if(!shortest || t.length < shortest.length) shortest = t;

		return shortest;
	}

	function new_cache(max_length) {
		var cache = {};
		var generations = [[]];
		generations.push([]);
		cache[0] = [0];
		generations[1].push(0);
		var i;
		var j;
		for(i = 2 ; i <= 9 ; i++) {
			cache[i] = [i];
			generations[1].push(i);
		}
		for(var g = 2 ; g <= max_length ; g++) {
			var new_numbers = [];
			for(var g1 = 1 ; g1 < g - 1 ; g1++) {
				var g2 = g - g1 - 1;
				var v;
				var a;
				var b;

				// -
				for(i = 0 ; i < generations[g1].length ; i++) {
					a = generations[g1][i];
					for(j = 0 ; j < generations[g2].length ; j++) {
						b = generations[g2][j];
						v = a - b;
						if(!cache[v]) {
							cache[v] = cache[a].concat(cache[b], "-");
							new_numbers.push(v);
						}
						v = b - a;
						if(!cache[v]) {
							cache[v] = cache[b].concat(cache[a], "-");
							new_numbers.push(v);
						}
					}
				}

				// +
				for(i = 0 ; i < generations[g1].length ; i++) {
					a = generations[g1][i];
					for(j = 0 ; j < generations[g2].length ; j++) {
						b = generations[g2][j];
						v = b + a;
						if(!cache[v]) {
							cache[v] = cache[b].concat(cache[a], "+");
							new_numbers.push(v);
						}
					}
				}

				// *
				for(i = 0 ; i < generations[g1].length ; i++) {
					a = generations[g1][i];
					for(j = 0 ; j < generations[g2].length ; j++) {
						b = generations[g2][j];
						v = b * a;
						if(!cache[v]) {
							cache[v] = cache[b].concat(cache[a], "*");
							new_numbers.push(v);
						}
					}
				}

				// /
				for(i = 0 ; i < generations[g1].length ; i++) {
					a = generations[g1][i];
					for(j = 0 ; j < generations[g2].length ; j++) {
						b = generations[g2][j];
						if(a > 0 && b > 0) {
							v = Math.floor(a / b);
							if(!cache[v]) {
								cache[v] = cache[a].concat(cache[b], "/");
								new_numbers.push(v);
							}
							v = Math.floor(b / a);
							if(!cache[v]) {
								cache[v] = cache[b].concat(cache[a], "/");
								new_numbers.push(v);
							}
						}
					}
				}
			}

			if(g >= 2) {
				for(i = 0 ; i < generations[g - 2].length ; i++) {
					a = generations[g - 2][i];
					v = a * a;
					if(!cache[v]) {
						cache[v] = cache[a].concat(">", "*");
						new_numbers.push(v);
					}
				}
			}

			if(g >= 4) {
				for(i = 0 ; i < generations[g - 4].length ; i++) {
					a = generations[g - 4][i];
					v = a * a * a;
					if(!cache[v]) {
						cache[v] = cache[a].concat(">", ">", "*", "*");
						new_numbers.push(v);
					}

					v = a + a * a;
					if(!cache[v]) {
						cache[v] = cache[a].concat(">", ">", "*", "+");
						new_numbers.push(v);
					}

					v = a - a * a;
					if(!cache[v]) {
						cache[v] = cache[a].concat(">", ">", "*", "-");
						new_numbers.push(v);
					}

					for(j = 0 ; j < generations[1].length ; j++) {
						b = generations[1][j];
						v = a * (a + b);
						if(!cache[v]) {
							cache[v] = cache[a].concat(">", cache[b], "+", "*");
							new_numbers.push(v);
						}

						v = a * (a - b);
						if(!cache[v]) {
							cache[v] = cache[a].concat(">", cache[b], "-", "*");
							new_numbers.push(v);
						}
					}
				}
			}

			if(g >= 5) {
				for(i = 0 ; i < generations[g - 5].length ; i++) {
					a = generations[g - 5][i];

					v = a * a - a;
					if(!cache[v]) {
						cache[v] = cache[a].concat(">", ">", "*", "\\", "-");
						new_numbers.push(v);
					}
				}
			}

			generations.push(new_numbers);
		}
		return cache;
	}

	function generate_expr(num) {
		var rt = Math.sqrt(num);
		if(Math.floor(rt) === rt)
			return get_expr(rt).concat(">", "*");

		var arr_dis = try_dis(num);
		var arr_sqrt = try_sqrt(num);

		return arr_dis.length < arr_sqrt.length ? arr_dis : arr_sqrt;
	}

	function get_expr(num) {
		if(!expr_cache[num])
			expr_cache[num] = generate_expr(num);

		return expr_cache[num];
	}

	function get_expression(num) {
		var shortest = get_expr(num).slice();

		if(num <= 18) return shortest;

		for(var i = 1 ; i <= 9 ; i++) {
			var temp = get_expr(num + i).concat(get_expr(i), "-");
			if(shortest.length > temp.length) shortest = temp;

			temp = get_expr(num - i).concat(get_expr(i), "+");
			if(shortest.length > temp.length) shortest = temp;
		}

		return shortest;
	}

	function get_aheui_expression(num) {
		var expr = get_expression(num);

		var aheui = "";

		for(var i = 0 ; i < expr.length ; i++) {
			aheui += aheui_command[expr[i]];
		}

		return aheui;
	}

	return {
		get: get_expression,
		getAheui: get_aheui_expression
	};
};