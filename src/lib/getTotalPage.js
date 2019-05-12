export default function getTotalPage(totalItems, limit){
    if(totalItems <= 0) return 0;
    return Math.ceil(totalItems / limit);

}