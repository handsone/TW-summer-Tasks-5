const datbase = require('./datbase.js');
var loadAllItems = datbase.loadAllItems() ;
var loadPromotions = datbase.loadPromotions() ;
module.exports = function main(inputs) {
	var sum   = 0 ;
	var discount  = 0 ;
	var answer = '***<没钱赚商店>购物清单***\n'
	function CountGoodsFrequency (array ){
		var barcodes = [] ;
		var frenquency = [];
		var position  ;
		for ( var GoodsBarcode of array  ){
			position = barcodes.indexOf(GoodsBarcode);
			var number = 1 ;
			if ( GoodsBarcode.length != 10 ){
				number = Number(GoodsBarcode[11]);
			}
			if ( position === -1 ){
				barcodes.push(GoodsBarcode.slice(0,10));
				frenquency.push(number);
			}
			else {
				frenquency[position] += number ;
			}

		}
		var GoodsBarcodeObject = [];
		for ( var i = 0 ; i < frenquency.length ; i ++ ){
			GoodsBarcodeObject.push({barcode: barcodes[i], count: frenquency[i] });
		}
		return GoodsBarcodeObject ;
	}

	function TotalPrice (arrayA ,arrayB){
		var string1 =  '' ;
		for ( let A of arrayA ){
			A.count -= parseInt(A.count  / 3) ;
		}
		for ( var GoodsCartInfo of arrayA ){
			var GoodsCartBarcode  = GoodsCartInfo.barcode ;
			for  ( var GoodsFormInfo of arrayB ){
				var GoodsFormBarcode = GoodsFormInfo.barcode ;
				if ( GoodsCartInfo.barcode === GoodsFormInfo.barcode  ){
					string1 += '名称：' + GoodsFormInfo.name + ', 数量：' + GoodsCartInfo.count + GoodsFormInfo.unit + ', 单价：' + GoodsFormInfo.price.toFixed(2) + '(元), ' + '小计' + '：' + (GoodsCartInfo.count * GoodsFormInfo.price).toFixed(2) + '(元)\n';
					sum += GoodsCartInfo.count * GoodsFormInfo.price ;
				}
			}
		}
		return string1 ;
	}
	function Discount(arrayA , arrayB , arrayC){
		for ( var A of arrayA  ){
			A.count = Math.round(A.count / 3 );
		}
		var string2 = '' ;
		for ( var GoodsCartInfo of arrayA ){
			var GoodsCartBarcode = GoodsCartInfo.barcode ;
			for ( var GoodsDiscountForm of arrayB[0].barcodes  ){
				var GoodsDiscountBarcode = GoodsDiscountForm;
				if ( GoodsCartBarcode === GoodsDiscountBarcode  ){
					for ( var GoodsFormInfo  of arrayC  ){
						var GoodsFormBarcode = GoodsFormInfo.barcode ;	
						if ( GoodsFormBarcode === GoodsCartBarcode ){
							string2 += '名称：' + GoodsFormInfo.name + ', 数量：' + GoodsCartInfo.count + GoodsFormInfo.unit + '\n'; 
							discount += GoodsFormInfo.price * GoodsCartInfo.count ;
						}
					}
				}
			}
		}

		return string2 ;
	}
	var CountedArray = CountGoodsFrequency(inputs);
	answer += TotalPrice(CountedArray , loadAllItems);
	answer +=  '----------------------\n' + Discount(CountedArray , loadPromotions , loadAllItems);
	answer +=  '----------------------\n' + '总计：' + sum + '(元)\n' + '节省：' + discount +'(元)' + '\n***********************'
	console.log(answer);
	return 'Hello World!';
};
