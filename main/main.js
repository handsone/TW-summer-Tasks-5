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

	function TotalPrice (arrayA ,arrayB , arrayC){
		var string1 =  '' ;
		for ( var GoodsCartInfo of arrayA ){
			var GoodsCartBarcode  = GoodsCartInfo.barcode ;
			for  ( var GoodsFormInfo of arrayB ){
				var GoodsFormBarcode = GoodsFormInfo.barcode ;
				if ( GoodsFormBarcode === GoodsCartBarcode  ){
					string1 += '名称：' + GoodsFormInfo.name + '，数量：' + GoodsCartInfo.count + GoodsFormInfo.unit + '，单价：' + GoodsFormInfo.price.toFixed(2) + '(元)，' + '小计' + '：';
					if  ( arrayC[0].barcodes.indexOf(GoodsCartInfo.barcode) === -1 ){
						GoodsTotalCount = GoodsCartInfo.count ;
					}
					else{
						GoodsTotalCount = GoodsCartInfo.count -parseInt(GoodsCartInfo.count / 3) ;
					}
						string1 += (GoodsTotalCount * GoodsFormInfo.price).toFixed(2) + '(元)\n';
					sum += GoodsTotalCount * GoodsFormInfo.price ;
				}
			}
		}
		return string1 ;
	}

	function Discount(arrayA , arrayB , arrayC){
		for ( var A of arrayA  ){
			A.count = Math.floor(A.count / 3 );
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
							string2 += '名称：' + GoodsFormInfo.name + '，数量：' + GoodsCartInfo.count + GoodsFormInfo.unit + '\n'; 
							discount += GoodsFormInfo.price * GoodsCartInfo.count ;
						}
					}
				}
			}
		}
		return string2 ;
	}

	var CountedArray = CountGoodsFrequency(inputs);
	answer += TotalPrice(CountedArray , loadAllItems , loadPromotions);
	answer +=  '----------------------\n挥泪赠送商品：\n' + Discount(CountedArray , loadPromotions , loadAllItems);
	answer +=  '----------------------\n' + '总计：' + sum.toFixed(2) + '(元)\n' + '节省：' + discount.toFixed(2) +'(元)' + '\n**********************'
	console.log(answer);
	return 'Hello World!';
};
