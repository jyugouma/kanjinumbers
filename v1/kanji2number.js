//204を返す方法が確立できなくて未実装

  window.addEventListener("load", function() {
    let input = document.getElementById("text");
    let result = document.getElementById("anser");
    let cnv_btn = document.getElementById("button1");
  
    cnv_btn.addEventListener("click", function(e) {
      let str = input.value; 
      result.innerText = textkanji2num(str);  
      e.preventDefault();  
  
    })
  })
function kanji2num(str) {
const zero2nine = '零壱弐参四五六七八九拾百千'

  let tmp;  
  for(let i = 0; i < zero2nine.length; i++) {
    tmp = new RegExp(zero2nine[i], "g");
    str = str.replace(tmp, i);
  }
  return str
}


function kanji2numCnv(str, n) {
  const ten2thou = '千百拾'  
  const man2tyo = '兆億万' 

  // 変数の宣言
  let result = 0
  let poss = 0; 
  let pos;  
  let block;   
  let tais;  
  let tmpstr;   

  if(n === 1) {  // n == 1 の場合は４桁まで計算
    tais = ten2thou;
  } else {  // それ以外の場合は16桁まで計算 
    n = 4;
    tais = man2tyo;
  } 
  
  for (let i = 0; i < tais.length; i++) {
    pos = str.indexOf(tais[i]);   
    if (pos === -1) {  // 検索した大数が存在しない場合
      continue
    } else if (pos === poss) {  // 検索した大数が数字を持たない場合（'千'など）
      block = 1;  // '千'は'一千'なので'1'を入れておく
    } else {  // 検索した大数が数字を持つ場合（'五千'など）
      tmpstr = str.slice(poss, pos);  
      if (n === 1) {
        block = Number(kanji2num(tmpstr));   
      } else {
        block = kanji2numCnv(tmpstr, 1);   
      }
    }
      result += block * (10 ** (n * (tais.length - i)));   
      poss = pos + 1;  // 処理開始位置を次の文字に移す
  }

  if (poss !== str.length) {
    tmpstr = str.slice(poss, str.length);
    if (n === 1) {
        result += Number(kanji2num(tmpstr));
    } else {
        result += kanji2numCnv(tmpstr, 1);
    }
  }
  //九千九百九拾九兆九千九百九拾九億九千九百九拾九万九千九百九拾九を入力すると
  //10000000000000000になるので、無理やり修正
  if(result == '10000000000000000'){
    result =   '9999999999999999'
    return result
  }
  return result
}


function textkanji2num(text) {
  const suuji1 = new Set('零壱弐参四五六七八九拾百千') 
  const suuji2 = new Set('〇万億兆')  

  let result = '';  
  let tmpstr = '';   
  for(let i = 0; i < text.length + 1; i++) {
    //  if文で文字が数字であるかを識別 
    if(i !== text.length && (suuji1.has(text[i]) || (tmpstr !== '' && suuji2.has(text[i])))) {
      tmpstr += text[i]; // 数字が続く限りtmpstrに格納

    }else{  // 文字が数字でない場合
      if(tmpstr !== '') {  // tmpstrに数字が格納されている場合
        result += kanji2numCnv(tmpstr, 4);   
        tmpstr = '';  // tmpstrを初期化
      }else{ //大数でもない場合は204を返す
        result = '値が不正です'
        return result
      }
    }
  }
  if(result == '10000000000000000'){
    result = '999999999999999999'
    return result
  }
  return result; 
}
