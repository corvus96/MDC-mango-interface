function calEnergy(){
    var end = new Date();
    var start =  new Date((new Date).getFullYear(),(new Date).getMonth(),(new Date).getDate(),0,0,0)
    return tPower.getStats(start.getTime(), end.getTime()).integral/1000;
}

return totalEnergy = calEnergy();