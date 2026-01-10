export const inputHandler = (setterFunc)=>{
    return (e)=>{
        const {name, value}=e.target;
        setterFunc(prev=>({...prev,
            [name]:value
        }))
    }

}
