const AdditionJoker = require('./additionJoker')
const BlurDescriptionJoker = require('./blurDescriptionJoker')
const MirrorJoker = require('./mirrorJoker')
const FriendCallJoker = require('./friendCallJoker')
const DivisionJoker = require('./divisionJoker')
const CrazyJoker = require('./crazyJoker')
const MultiplyJoker = require('./multiplyJoker')
const SubtractionJoker = require('./subtractionJoker')
const StealerJoker = require('./stealerJoker')

const TrapJoker = require('./trapJoker')
const WinnerJoker = require('./winnerJoker')
const InvincibleJoker = require('./invincibleJoker')
const TornadoJoker = require('./tornadoJoker')

const jokers = [
    new AdditionJoker(),
    new BlurDescriptionJoker(),
    new MirrorJoker(),
    new FriendCallJoker(),
    new DivisionJoker(),
    new CrazyJoker(),
    new MultiplyJoker(),
    new SubtractionJoker(),
    new StealerJoker(),
    new TrapJoker(),
    new WinnerJoker(),
    new InvincibleJoker(),
    new TornadoJoker()
] 

function GetAll() {
    return jokers 
}

function GetRarity(rarity) { 
    return GetAll().filter(e => e.rarity.value === rarity) 
}

function GetJokerByName(name) { 
    return GetAll().find(e => e.name === name) 
}

module.exports = { GetRarity, GetAll, GetJokerByName }