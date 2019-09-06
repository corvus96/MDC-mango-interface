function calEnergy(){
    return tPower.past(DAY).integral/1000;
}

return totalEnergy = calEnergy();