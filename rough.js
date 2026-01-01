function f(){console.log("f1",this)
    super()
    this.a
    constructor()
    
}
// function f(){console.log("f2")}
// f()

const a = ()=>{
    console.log(this)
}
a()