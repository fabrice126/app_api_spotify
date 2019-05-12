export default function(name){
    return window.localStorage.getItem(`jwt-${name}`)
}