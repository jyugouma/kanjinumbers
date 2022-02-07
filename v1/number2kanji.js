//204を返す方法が確立できなくて未実装
    //ブラウザ上でCode.jsが動かない。ピンチ
    //Code.jsの中でも動くのとそうでないのがあるらしい
    //PHPを用いるもPHPだけが204になる
    //PHPからjsに返すのはサーバを通す必要あり
    //そもそもrequireが使えればPHPは不要では？
    //requireJs導入。
    //動いた。が、なんかhttp周りで不具合
    //httpを宣言すると最初の関数を読み込まないことも発覚
    //一旦204は置いておく
    //両方の不正入力感知は一通りできた
    //browserifyを使えば使えるようになるらしい
    //browserifyでビルドができない
    //PATHが原因か？
    //違ったかもしれない。

    //htmlから値を持ってくる
function num2kanji(ein, eout, opt) {

        eout.value = _num2kanji(ein.value, opt) + (opt['extension'] || '')
  
        return eout.value
    }
    function _num2kanji(num, opt) {
    
        //変換用
        const zero = '零'
        const zero2nine = ['〇', '壱', '弐', '参', '四', '五', '六', '七', '八', '九']
        const ten2thou = ['', '拾', '百', '千']
        const man2tyo = ['', '万', '億', '兆']
        
        var req = new XMLHttpRequest()

        
        num = num.replace(/,/g, '');
        num.match(/([+-])?(\d+)(?:\.(\d+))?/i);
        //半角アラビア数字以外の入力がされたら204をかえす
        if(num.match(/[^0-9]+/)) {
            result = '値が不正です'
            return result
        }
        var sig = RegExp.$1;
        var int = RegExp.$2;
        var fract = RegExp.$3;
        var seisuu = '';
        var taisu  = new Array();
        
    //範囲外の入力にHTTPステータス204を返す 
        if(int.length > 16){
            /*http.createServer((req,res)=>{
                res.statusCode = 204
                res.setHeader('Content-type:','text/plain')
                res.write('値が不正です')
                res.end()
            })*/
            result = '値が不正です'
            return result
        }

        if(sig=='-'){    //負の数の入力で204をかえす
            /*http.createServer((req,res)=>{
                res.statusCode = 204
                res.setHeader('Content-type:','text/plain')
                res.write('値が不正です')
                res.end()
            })*/
            result = '値が不正です'
            return result
        }



    
        //単位の分割
        for (var i = int.length; i > 0; i -= 4) {
            taisu.push(int.substring(i, i - 4));
        }
    
        //該当単位まで'0000'をセット
        var mantani = 0;
        for (var i = 0; i < taisu.length; i++) {
            var tani = taisu[i];
            if (tani == '0000') {
                mantani++;
                continue;
            }
            var sens = '';
            var keta = 0;
            var digits = tani.split('').reverse();
            for (var j = 0; j < digits.length; j++) {
                var digit = digits[j];
    
                if (opt['fixed4'] || opt['with_arabic']) {
                    if (opt['with_arabic']) {
                        var flg = 0;
                        //不要な'0'の削除
                        if (digit == '0') {
                            for (var k = j + 1; k < digits.length; k++) {
                                flg += (digits[k] == '0') ? 0 : 1;
                            }
                            if (flg == 0) digit = '';
                        }
                        sens = digit + sens;
                    } else {
                        sens = zero2nine[digit] + sens;
                    }
                } else {
                    var suuji = (digit == 1 && !opt['p_one'] && keta > 0) ? '' : zero2nine[digit];
                    if (digit != 0) sens = suuji + ten2thou[keta] + sens
                }
                keta++;
            }
            seisuu = sens + man2tyo[mantani++] + seisuu;
            
        }
        var result =  seisuu;
        result = result || zero;
        if (fract) {
            result = result + fract;
        }

        return result;

    }


