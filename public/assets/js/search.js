const clearInput = () => {
    const input =document.querySelectorAll('input');
    for (const item of input) {
    if(item.name !== "page"){
        item.value = null
        }
    }
}

