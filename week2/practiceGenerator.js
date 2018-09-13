const generator = function*(i, j){
    for( let x = 1 ; x <= i ; x ++ )
        for( let y = 1 ; y <= j ; y ++ )
             yield [x, y, x*y];
        
};

for(const [i, j, k] of generator(9,9)){
    console.log(`${i} x ${j} = ${k}`);
}