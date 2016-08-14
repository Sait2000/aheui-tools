var number2aheui = function() {
	var aheui_command = {
		"+": "다",
		"*": "따",
		"-": "타",
		"/": "나",
		">": "빠",
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

	var expr_cache = {};

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

	function get_basic(num) {
		if(num === 0)
			return [0];

		else if(num === 1)
			return [3, 2, "-"];

		else if(num >= 2 && num <= 9)
			return [num];

		else if(num >= 10 && num <= 18) {
			var n1 = Math.ceil(num / 2);
			var n2 = num - n1;
			return [n1, n2, "+"];
		}
	}

	function generate_expr(num) {
		if(num < 0) return get_expr(0).concat(get_expr(-num), "-");
		if(num <= 18) return get_basic(num);

		for(var i = 9 ; i >= 2 ; i--) {
			var nr = Math.floor(num / i);

			if(nr >= 2 && nr <= 9 && nr * i === num)
				return get_expr(i).concat(get_expr(nr), "*");
		}

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
		var shortest = get_expr(num);

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