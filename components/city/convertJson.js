function convertCityJson(oldJson){
    var newJson = {"china":[],"foreign":[]};
    var continentArr = oldJson.continent;
    for (var i = 0; i < continentArr.length; i++) {
    	//亚洲
    	if(continentArr[i].id === 1000000002){
    		var countrys = continentArr[i].country;
    		var chinaJson = {"cities":[]};
    		for (var countryIndex in countrys) {
                var country = countrys[countryIndex];
    			var isChina = (country.name_en_us === "China");
    			var foreignJson = {},chinaJson = {"cities":[]};
    			var cityJson = {};
    			if (isChina) {
    				//中国
    				var provinces = country.province;
    				for(var provinceIndex in provinces){
                        var province = provinces[provinceIndex];
    					chinaJson = {"cities":[]};
    					chinaJson.area = province.region_name_en_us;
    					chinaJson.area_cn = province.region_name_zh_cn;
    					chinaJson.region_id = province.region_id;
    					chinaJson.provice_name = province.name_en_us;
    					chinaJson.provice_name_cn = province.name_zh_cn;
    					chinaJson.provice_id = province.id;
    					//处理城市，如果直辖市，数组只有一个城市元素
    					var isZhiXia = (province.city.length === 1);
    					for(var cityIndex in province.city){
                            var city = province.city[cityIndex];
                            cityJson = {};
    						cityJson.city_id = city.id;
    						cityJson.city_name = city.name_en_us;
    						cityJson.city_name_cn = city.name_zh_cn;
    						cityJson.tier_id = city.tier_id;
    						cityJson.city_level = city.tier_level;
    						cityJson.tier_name_en_us = city.tier_name_en_us;
    						cityJson.tier_name_zh_cn = city.tier_name_zh_cn;
    						chinaJson.cities.push(cityJson);
                            if (isZhiXia) {
                                //直辖市的省份id和城市id是不一样的，要区分开。
                                chinaJson.zhixiashi_id = city.id;
                            }
    					}
    					if (isZhiXia) {
    						chinaJson.cities = [];
    					}
    					newJson.china.push(chinaJson);
    				}
    			}else{
    				//外国
    				foreignJson = {};
    				foreignJson.continent_id = continentArr[i].id;
    				foreignJson.continent_name = continentArr[i].name_en_us;
    				foreignJson.continent_name_cn = continentArr[i].name_zh_cn;
    				foreignJson.foreign_id = country.id;
    				foreignJson.foreign_name = country.name_en_us;
    				foreignJson.foreign_name_cn = country.name_zh_cn;
    				newJson.foreign.push(foreignJson);
    			}
    			
    			

    		};
    	}else{
    		//其他州
    		var countrys = continentArr[i].country;
    		var foreignJson = {};
    		for (var countryIndex in countrys) {
                var country = countrys[countryIndex];
    			foreignJson = {};
    			foreignJson.continent_id = continentArr[i].id;
    			foreignJson.continent_name = continentArr[i].name_en_us;
    			foreignJson.continent_name_cn = continentArr[i].name_zh_cn;
    			foreignJson.foreign_id = country.id;
    			foreignJson.foreign_name = country.name_en_us;
    			foreignJson.foreign_name_cn = country.name_zh_cn;
    			newJson.foreign.push(foreignJson);
    		};

    	}
    };
    console.log(newJson)
    return newJson;
}
