
//si parameter vendosim arrayn me emrat e artisteve dhe parentin e options
const renderOptions = (array, optionsParent) =>{
    array.forEach(el => {
        const option = `<option value="${el}">${el}</option>`
        optionsParent.innerHTML += option
    });
}

//kapim butonin seleect tek artist 
const selectJoinArtist = document.querySelector(".join-artist-select")

const joinAsArtist = () =>{
    if(!selectJoinArtist.value){
        selectJoinArtist.classList.add("alert")
        setTimeout(()=>{
            selectJoinArtist.classList.remove("alert")
        },500)
    }else{
        localStorage.setItem("artist",selectJoinArtist.value)
        location.hash = "artistsHomePage"
        selectJoinArtist.selectedIndex = 0;
    }
}




