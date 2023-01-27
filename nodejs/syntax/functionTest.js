var f__f = function(){
    console.log(1+1);
    console.log(1+2);
}
function f1(){
    console.log(1+1);
    console.log(1+2);
}
console.log("1.");
f1;
console.log("2.");
f1();

var a = [f__f]
a[0]();
console.log(a);

var o = {
    funcss:f__f
}
o.funcss();
console.log(o);


console.log('object test')
var q = {
    v1:'v1',
    v2:'v2',
    f1:function(){
        console.log(this.v1);
    },
    f2:function(){
        console.log(this);
        console.log(this['v2']);
    }
}
q.f1();
q.f2();