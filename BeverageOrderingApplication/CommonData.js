exports.getValue = (array, key) => {
    return array.filter (o => o.key === key)[0].value; 
}

exports.getKey = (array, value) => {
    return array.filter (o => o.value === value)[0].key;
}
exports.category = [
    {key: '01', value: 'Milk Tea'},
    {key: '02', value: 'Coffee'},
    {key: '03', value: 'Fruit Tea'},
    {key: '04', value: 'Chocolate'},
    {key: '05', value: 'Crafted Tea'},
];