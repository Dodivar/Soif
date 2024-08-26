const AdditionJoker = require('./additionJoker')
const BlurDescriptionJoker = require('./blurDescriptionJoker')
const MirrorJoker = require('./mirrorJoker')
const FriendCallJoker = require('./friendCallJoker')
const DivisionJoker = require('./divisionJoker')
const CrazyJoker = require('./crazyJoker')
const MultiplyJoker = require('./multiplyJoker')
const SubtractionJoker = require('./subtractionJoker')
const StealerJoker = require('./stealerJoker')

const jockers = [
    new AdditionJoker(),
    new BlurDescriptionJoker(),
    new MirrorJoker(),
    new FriendCallJoker(),
    new DivisionJoker(),
    new CrazyJoker(),
    new MultiplyJoker(),
    new SubtractionJoker(),
    new StealerJoker()
] 

function GetAll() {
    return jockers 
}

function GetRarity(rarity) {
    return GetAll().filter(e => Object.is(e.rarirty, rarity)) 
}

module.exports = { GetRarity }